import logging
from typing import Dict, Any

logger = logging.getLogger("fallguard")

class SafetyPolicyGuard:
    """
    Deterministic safety policy validator ensuring LLM decisions
    never violate baseline clinical/physical safety limits.
    """
    @staticmethod
    def enforce_policy(state: Dict[str, Any]) -> Dict[str, Any]:
        risk_level = state.get("risk_level", "LOW")
        fall_prob = state.get("fall_probability", 0.0)
        user_resp = state.get("user_response")
        selected_action = state.get("selected_action", "MONITOR")
        reasoning = state.get("reasoning_summary", "")

        # Rule 1: CRITICAL deterministic events CANNOT be downgraded to MONITOR or ASK
        if risk_level == "CRITICAL" and selected_action in ["MONITOR", "ASK_CONFIRMATION"]:
            logger.warning("SAFETY GUARD OVERRIDE: Agent attempted to downgrade CRITICAL event to non-urgent action.")
            selected_action = "EMERGENCY_DISPATCH"
            reasoning = "Deterministic safety override: High impact and severe immobility mandate immediate emergency escalation."

        # Rule 2: User explicitly responded OKAY
        if user_resp in ["OKAY", "FALSE_ALARM"]:
            selected_action = "MONITOR"
            reasoning = f"Wearer explicitly confirmed safety ('{user_resp}'). Alert dismissed."

        # Rule 3: Timeout / Unresponsive with high probability
        if user_resp in ["TIMEOUT", "UNRESPONSIVE"] and (risk_level in ["HIGH", "CRITICAL"] or fall_prob >= 0.80):
            selected_action = "ESCALATE_CAREGIVER"
            reasoning = f"Wearer remained unresponsive after fall alert timeout ({user_resp}). Initiating caregiver escalation."

        state["selected_action"] = selected_action
        state["reasoning_summary"] = reasoning
        return state
