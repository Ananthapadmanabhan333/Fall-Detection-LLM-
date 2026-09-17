import json
import logging
from typing import Dict, Any
from app.schemas.sensor import SensorPacket
from app.services.event_manager import FallEventManager
from app.database.database import SessionLocal

logger = logging.getLogger("fallguard")

def handle_imu_message(topic: str, payload_str: str):
    """
    Process incoming MQTT message from topic 'fallguard/{device_id}/imu'.
    Validates packet, feeds sliding window, and evaluates fall detection.
    """
    db = SessionLocal()
    try:
        data = json.loads(payload_str)
        # Parse and validate with Pydantic
        packet = SensorPacket(**data)

        manager = FallEventManager(db)
        result = manager.add_sensor_sample(packet)

        if result.get("fall_detected"):
            logger.warning(
                f"[MQTT] Fall detected on device {packet.device_id}: Event ID {result.get('event_id')} "
                f"(Probability: {result.get('fall_probability')})"
            )
    except json.JSONDecodeError:
        logger.error(f"[MQTT] Malformed JSON payload received on topic {topic}: {payload_str}")
    except ValueError as val_err:
        logger.warning(f"[MQTT] Sensor validation error on topic {topic}: {val_err}")
    except Exception as e:
        logger.error(f"[MQTT] Unexpected error processing message on topic {topic}: {e}", exc_info=True)
    finally:
        db.close()
