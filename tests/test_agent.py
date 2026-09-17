import pytest
import asyncio
from app.agent.state import AgentState
from app.agent.tools import AgentTools
from app.agent.graph import fall_agent_graph

@pytest.mark.asyncio
async def test_agent_tools_execution():
    tools = AgentTools()
    profile = await tools.get_user_profile("USER001")
    assert profile["user_id"] == "USER001"

    contacts = await tools.check_emergency_contacts("USER001")
    assert len(contacts) >= 1
    assert "phone" in contacts[0]

    device = await tools.get_device_status("DEV001")
    assert device["device_id"] == "DEV001"

@pytest.mark.asyncio
async def test_agent_graph_execution_high_risk():
    initial_state: AgentState = {
        "user_id": "USER001",
        "event_id": "evt_test_agent_01",
        "fall_probability": 0.92,
        "impact_detected": True,
        "post_impact_motion": 0.03,
        "event_duration": 5.0,
        "current_location": None,
        "device_status": None,
        "recent_events": [],
        "user_response": None,
        "risk_level": "LOW",
        "retrieved_context": [],
        "selected_action": "MONITOR",
        "reasoning_summary": "",
        "tools_executed": []
    }

    final_state = await fall_agent_graph.ainvoke(initial_state)

    assert final_state["risk_level"] in ["CRITICAL", "HIGH"]
    assert final_state["selected_action"] in ["EMERGENCY_DISPATCH", "ESCALATE_CAREGIVER"]
    # Verify concise structured reasoning without internal chain-of-thought tokens
    assert len(final_state["reasoning_summary"]) > 10
    assert "chain_of_thought" not in final_state["reasoning_summary"]
    assert len(final_state["tools_executed"]) > 0
