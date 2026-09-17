import logging
from typing import Dict, Any, Tuple
from app.ml.thresholds import (
    HIGH_CONFIDENCE_THRESHOLD,
    MEDIUM_CONFIDENCE_THRESHOLD,
    IMPACT_PEAK_THRESHOLD_G,
    LOW_MOTION_THRESHOLD_G
)

logger = logging.getLogger("fallguard")

class DeterministicSafetyEngine:
    """
    Non-LLM safety engine providing hard fail-safe guarantees.
    Evaluates biomechanical criteria and deterministic escalation rules.
    Operates independently of LLM, RAG, or remote network availability.
    """
    @staticmethod
    def evaluate_risk(
        fall_probability: float,
        impact_detected: bool,
        post_impact_motion: float,
        max_accel_g: float = 0.0
    ) -> Tuple[str, str]:
        """
        Returns:
            risk_level: "CRITICAL", "HIGH", "MEDIUM", "LOW"
            recommended_action: Action name according to safety protocols
        """
        # CRITICAL Safety Rule:
        # High probability + verified high impact + prolonged immobility
        if (
            fall_probability >= HIGH_CONFIDENCE_THRESHOLD
            and impact_detected
            and post_impact_motion <= LOW_MOTION_THRESHOLD_G
        ):
            logger.warning(
                "CRITICAL DETERMINISTIC TRIGGER: Fall confirmed with severe immobility.",
                extra={"action": "EMERGENCY_ESCALATION", "fall_probability": fall_probability}
            )
            return "CRITICAL", "ESCALATE_IMMEDIATELY"

        # HIGH Risk Rule:
        # High probability or strong impact with some movement
        if fall_probability >= HIGH_CONFIDENCE_THRESHOLD or (max_accel_g >= IMPACT_PEAK_THRESHOLD_G and impact_detected):
            return "HIGH", "REQUEST_CONFIRMATION_THEN_ESCALATE"

        # MEDIUM Risk Rule:
        # Moderate confidence fall or stumble
        if fall_probability >= MEDIUM_CONFIDENCE_THRESHOLD:
            return "MEDIUM", "REQUEST_USER_CONFIRMATION"

        # LOW Risk:
        # Normal ADL or negligible probability
        return "LOW", "MONITOR_ONLY"

    @staticmethod
    def should_escalate_on_timeout(user_response: str) -> bool:
        """
        Deterministic timeout policy:
        If user response is empty, UNRESPONSIVE, or TIMEOUT -> escalate!
        Only 'OKAY' cancels the escalation.
        """
        return user_response not in ["OKAY", "FALSE_ALARM"]
