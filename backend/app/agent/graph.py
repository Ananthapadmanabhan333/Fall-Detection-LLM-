import logging
import asyncio
from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, END

from app.core.config import settings
from app.agent.state import AgentState
from app.agent.tools import AgentTools
from app.agent.policies import SafetyPolicyGuard
from app.agent.prompts import SYSTEM_SAFETY_PROMPT
from app.services.emergency import DeterministicSafetyEngine
from app.rag.retriever import get_protocol_retriever

logger = logging.getLogger("fallguard")

# ==========================================
# LLM Provider Abstraction
# ==========================================
class BaseLLMProvider:
    async def generate_decision(self, prompt: str, state: AgentState) -> Dict[str, str]:
        raise NotImplementedError

class MockLLMProvider(BaseLLMProvider):
    async def generate_decision(self, prompt: str, state: AgentState) -> Dict[str, str]:
        # High-fidelity deterministic reasoning simulation
        prob = state.get("fall_probability", 0.0)
        risk = state.get("risk_level", "LOW")
        resp = state.get("user_response")

        if risk == "CRITICAL" or (prob >= 0.85 and resp in ["TIMEOUT", "UNRESPONSIVE", None] and state.get("post_impact_motion", 1.0) < 0.08):
            return {
                "action": "EMERGENCY_DISPATCH",
                "summary": "High fall probability with impact and complete post-impact immobility. Non-responsive wearer requires immediate emergency dispatch."
            }
        elif resp == "OKAY":
            return {
                "action": "MONITOR",
                "summary": "Wearer explicitly reported safety ('I am okay'). Monitoring resumed with no escalation."
            }
        elif resp in ["TIMEOUT", "UNRESPONSIVE"]:
            return {
                "action": "ESCALATE_CAREGIVER",
                "summary": "Suspected fall with no response to confirmation query within timeout window. Escalating to caregiver."
            }
        elif prob >= 0.50:
            return {
                "action": "ASK_CONFIRMATION",
                "summary": "Moderate-to-high fall likelihood detected. Requesting immediate confirmation from wearer."
            }
        else:
            return {
                "action": "MONITOR",
                "summary": "Low probability fall signature consistent with normal ADL (activities of daily living). Incident logged for passive monitoring."
            }

def get_llm_provider() -> BaseLLMProvider:
    # Future integration hooks for openai, gemini, anthropic
    return MockLLMProvider()

# ==========================================
# Graph Nodes
# ==========================================
def receive_fall_event(state: AgentState) -> AgentState:
    logger.info(f"Node [receive_fall_event]: Event {state['event_id']}")
    return state

def validate_event(state: AgentState) -> AgentState:
    # Validate plausibility
    prob = state.get("fall_probability", 0.0)
    state["fall_probability"] = max(0.0, min(1.0, prob))
    return state

def safety_risk_assessment(state: AgentState) -> AgentState:
    risk_level, rec_action = DeterministicSafetyEngine.evaluate_risk(
        fall_probability=state.get("fall_probability", 0.0),
        impact_detected=state.get("impact_detected", False),
        post_impact_motion=state.get("post_impact_motion", 0.0)
    )
    state["risk_level"] = risk_level
    return state

async def retrieve_user_history(state: AgentState) -> AgentState:
    tools = AgentTools()
    events = await tools.get_recent_fall_events(user_id=state["user_id"], days=30)
    state["recent_events"] = events
    return state

def retrieve_relevant_protocol(state: AgentState) -> AgentState:
    retriever = get_protocol_retriever()
    query = f"Fall event risk level {state.get('risk_level', 'LOW')} impact detected"
    protocols = retriever.retrieve_protocol(query, n_results=2)
    state["retrieved_context"] = protocols
    return state

async def check_device_status(state: AgentState) -> AgentState:
    tools = AgentTools()
    device_id = state.get("device_status", {}).get("device_id") if state.get("device_status") else "DEV001"
    status = await tools.get_device_status(device_id)
    state["device_status"] = status
    return state

async def determine_required_action(state: AgentState) -> AgentState:
    llm = get_llm_provider()
    decision = await llm.generate_decision(prompt="", state=state)
    state["selected_action"] = decision["action"]
    state["reasoning_summary"] = decision["summary"]

    # Enforce deterministic safety policy override
    state = SafetyPolicyGuard.enforce_policy(state)
    return state

async def user_confirmation_flow(state: AgentState) -> AgentState:
    tools = AgentTools()
    if state.get("selected_action") == "ASK_CONFIRMATION":
        await tools.ask_user_confirmation(
            user_id=state["user_id"],
            event_id=state["event_id"],
            prompt_text="FallGuard Alert: Possible fall detected. Are you okay? Please confirm."
        )
        if "tools_executed" not in state:
            state["tools_executed"] = []
        state["tools_executed"].append({"tool": "ask_user_confirmation", "timestamp": "now"})
    return state

async def execute_escalation_if_necessary(state: AgentState) -> AgentState:
    tools = AgentTools()
    action = state.get("selected_action")
    if "tools_executed" not in state:
        state["tools_executed"] = []

    if action == "EMERGENCY_DISPATCH":
        loc = await tools.get_current_location(state["user_id"], "DEV001")
        state["current_location"] = loc
        res = await tools.start_emergency_workflow(
            event_id=state["event_id"],
            user_id=state["user_id"],
            risk_level=state["risk_level"],
            reason=state["reasoning_summary"]
        )
        state["tools_executed"].append({"tool": "start_emergency_workflow", "result": res})
    elif action == "ESCALATE_CAREGIVER":
        res = await tools.send_caregiver_alert(
            user_id=state["user_id"],
            event_id=state["event_id"],
            message=f"FallGuard Alert: Fall detected for User {state['user_id']}. No response to check-in. Reason: {state['reasoning_summary']}"
        )
        state["tools_executed"].append({"tool": "send_caregiver_alert", "result": res})

    return state

async def log_event_node(state: AgentState) -> AgentState:
    tools = AgentTools()
    await tools.log_incident(
        event_id=state["event_id"],
        summary=state["reasoning_summary"],
        severity=state["risk_level"]
    )
    return state

# ==========================================
# Conditional Edge Router
# ==========================================
def route_after_action(state: AgentState) -> Literal["user_confirmation", "escalation", "log_event"]:
    action = state.get("selected_action")
    if action == "ASK_CONFIRMATION":
        return "user_confirmation"
    elif action in ["EMERGENCY_DISPATCH", "ESCALATE_CAREGIVER"]:
        return "escalation"
    else:
        return "log_event"

# ==========================================
# Build LangGraph StateGraph
# ==========================================
def build_fall_agent_graph():
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("receive_fall_event", receive_fall_event)
    workflow.add_node("validate_event", validate_event)
    workflow.add_node("safety_risk_assessment", safety_risk_assessment)
    workflow.add_node("retrieve_user_history", retrieve_user_history)
    workflow.add_node("retrieve_relevant_protocol", retrieve_relevant_protocol)
    workflow.add_node("check_device_status", check_device_status)
    workflow.add_node("determine_required_action", determine_required_action)
    workflow.add_node("user_confirmation", user_confirmation_flow)
    workflow.add_node("escalation", execute_escalation_if_necessary)
    workflow.add_node("log_event", log_event_node)

    # Set Entry Point
    workflow.set_entry_point("receive_fall_event")

    # Connect Edges
    workflow.add_edge("receive_fall_event", "validate_event")
    workflow.add_edge("validate_event", "safety_risk_assessment")
    workflow.add_edge("safety_risk_assessment", "retrieve_user_history")
    workflow.add_edge("retrieve_user_history", "retrieve_relevant_protocol")
    workflow.add_edge("retrieve_relevant_protocol", "check_device_status")
    workflow.add_edge("check_device_status", "determine_required_action")

    # Conditional Branching
    workflow.add_conditional_edges(
        "determine_required_action",
        route_after_action,
        {
            "user_confirmation": "user_confirmation",
            "escalation": "escalation",
            "log_event": "log_event"
        }
    )

    workflow.add_edge("user_confirmation", "log_event")
    workflow.add_edge("escalation", "log_event")
    workflow.add_edge("log_event", END)

    return workflow.compile()

fall_agent_graph = build_fall_agent_graph()
