import pytest
from app.services.emergency import DeterministicSafetyEngine
from app.agent.policies import SafetyPolicyGuard

def test_deterministic_safety_engine_critical_trigger():
    risk, action = DeterministicSafetyEngine.evaluate_risk(
        fall_probability=0.92,
        impact_detected=True,
        post_impact_motion=0.04,
        max_accel_g=3.8
    )
    assert risk == "CRITICAL"
    assert action == "ESCALATE_IMMEDIATELY"

def test_deterministic_safety_engine_low_risk():
    risk, action = DeterministicSafetyEngine.evaluate_risk(
        fall_probability=0.15,
        impact_detected=False,
        post_impact_motion=0.25,
        max_accel_g=1.2
    )
    assert risk == "LOW"
    assert action == "MONITOR_ONLY"

def test_timeout_escalation_rule():
    assert DeterministicSafetyEngine.should_escalate_on_timeout("TIMEOUT") is True
    assert DeterministicSafetyEngine.should_escalate_on_timeout("UNRESPONSIVE") is True
    assert DeterministicSafetyEngine.should_escalate_on_timeout("OKAY") is False

def test_safety_policy_guard_prevents_llm_downgrade():
    state = {
        "risk_level": "CRITICAL",
        "fall_probability": 0.95,
        "selected_action": "MONITOR",  # LLM erroneously attempted to monitor
        "reasoning_summary": "No problem here."
    }
    guarded = SafetyPolicyGuard.enforce_policy(state)
    assert guarded["selected_action"] == "EMERGENCY_DISPATCH"
    assert "Deterministic safety override" in guarded["reasoning_summary"]
