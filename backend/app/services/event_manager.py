import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
import numpy as np
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.repositories import FallGuardRepository
from app.schemas.fall import FallEventCreate
from app.schemas.sensor import SensorPacket
from app.ml.inference import get_fall_detector
from app.ml.features import extract_features
from app.services.emergency import DeterministicSafetyEngine

logger = logging.getLogger("fallguard")

class FallEventManager:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FallGuardRepository(db)
        self.detector = get_fall_detector()
        # In-memory window buffers keyed by device_id: list of [ax, ay, az, gx, gy, gz]
        # In a multi-worker production deployment, this would live in Redis.
        self._buffers: Dict[str, List[List[float]]] = {}

    def get_buffer(self, device_id: str) -> List[List[float]]:
        if device_id not in self._buffers:
            self._buffers[device_id] = []
        return self._buffers[device_id]

    def add_sensor_sample(self, packet: SensorPacket) -> Dict[str, Any]:
        """
        Ingest a single sensor packet into the rolling window and evaluate when window is full.
        """
        device_id = packet.device_id
        user_id = packet.user_id

        # Ensure user and device exist
        self.repo.get_or_create_user(user_id)
        self.repo.get_or_create_device(device_id, user_id)

        sample = [
            packet.accelerometer.x,
            packet.accelerometer.y,
            packet.accelerometer.z,
            packet.gyroscope.x,
            packet.gyroscope.y,
            packet.gyroscope.z
        ]

        buf = self.get_buffer(device_id)
        buf.append(sample)

        # Cap window at WINDOW_SIZE_SAMPLES
        max_samples = settings.WINDOW_SIZE_SAMPLES
        if len(buf) > max_samples:
            self._buffers[device_id] = buf[-max_samples:]
            buf = self._buffers[device_id]

        fall_evaluated = False
        fall_detected = False
        fall_probability = 0.0
        event_id = None

        # When we have a sufficient window (at least 100 samples or full window)
        # and on stride intervals
        if len(buf) >= 100 and (len(buf) % settings.STRIDE_SAMPLES == 0):
            seq = np.array(buf)
            fall_probability = self.detector.predict_probability(seq)
            features = extract_features(seq)
            fall_evaluated = True

            # If fall probability meets threshold or impact detected
            if fall_probability >= settings.FALL_MEDIUM_CONFIDENCE_THRESHOLD or features["impact_detected"]:
                # Check duplicate suppression
                existing_dup = self.repo.check_duplicate_event(
                    user_id=user_id,
                    suppression_window_seconds=settings.DUPLICATE_EVENT_SUPPRESSION_SECONDS
                )

                if existing_dup:
                    logger.info(f"Suppressed duplicate fall event for user {user_id} within {settings.DUPLICATE_EVENT_SUPPRESSION_SECONDS}s window.")
                    if features["impact_detected"] and not existing_dup.impact_detected:
                        existing_dup.impact_detected = True
                        existing_dup.fall_probability = max(existing_dup.fall_probability, round(float(fall_probability), 4))
                        existing_dup.post_impact_motion = round(float(features["post_impact_motion"]), 4)
                        self.db.commit()
                        logger.info(f"Updated active event {existing_dup.event_id} with peak impact shock.")
                    event_id = existing_dup.event_id
                else:
                    event_id = f"evt_{uuid.uuid4().hex[:12]}"
                    fall_detected = True

                    eff_prob = float(fall_probability)
                    if features["impact_detected"] and features["post_impact_motion"] <= 0.08:
                        eff_prob = max(eff_prob, 0.88)

                    event_data = FallEventCreate(
                        event_id=event_id,
                        user_id=user_id,
                        device_id=device_id,
                        timestamp=packet.timestamp,
                        fall_probability=round(eff_prob, 4),
                        impact_detected=features["impact_detected"],
                        post_impact_motion=round(float(features["post_impact_motion"]), 4),
                        duration=5.0,
                        status="PENDING"
                    )

                    created_event = self.repo.create_fall_event(event_data)
                    logger.warning(
                        f"FALL EVENT GENERATED: {event_id} for user {user_id} (prob={fall_probability:.2f})",
                        extra={
                            "event_id": event_id,
                            "user_id": user_id,
                            "device_id": device_id,
                            "fall_probability": fall_probability
                        }
                    )

                    # Trigger deterministic safety evaluation
                    risk_level, rec_action = DeterministicSafetyEngine.evaluate_risk(
                        fall_probability=fall_probability,
                        impact_detected=features["impact_detected"],
                        post_impact_motion=features["post_impact_motion"],
                        max_accel_g=features["max_accel_g"]
                    )

                    if risk_level == "CRITICAL":
                        # Immediate deterministic escalation
                        self.repo.update_fall_event_status(event_id, "ESCALATED")
                        contacts = self.repo.get_emergency_contacts(user_id)
                        if contacts:
                            primary = contacts[0]
                            self.repo.create_alert(
                                alert_id=f"alt_{uuid.uuid4().hex[:8]}",
                                event_id=event_id,
                                channel="SMS",
                                recipient=primary.phone,
                                message=f"CRITICAL SAFETY ALERT: Potential high-impact fall detected for {user_id}. Emergency escalation initiated."
                            )

        return {
            "device_id": device_id,
            "samples_in_window": len(buf),
            "fall_evaluated": fall_evaluated,
            "fall_detected": fall_detected,
            "fall_probability": round(fall_probability, 4) if fall_evaluated else None,
            "event_id": event_id
        }
