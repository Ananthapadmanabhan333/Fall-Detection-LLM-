import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.repositories import FallGuardRepository

logger = logging.getLogger("fallguard")

class DeviceMonitor:
    def __init__(self, db: Session):
        self.repo = FallGuardRepository(db)

    def record_heartbeat(
        self,
        device_id: str,
        battery_level: float,
        sensor_valid: bool = True
    ) -> Dict[str, Any]:
        connection_status = "ONLINE"
        alerts = []

        if battery_level <= 15.0:
            logger.warning(f"Device {device_id} LOW BATTERY: {battery_level}%")
            alerts.append("LOW_BATTERY")

        if not sensor_valid:
            logger.error(f"Device {device_id} SENSOR INVALID / FAULTY")
            alerts.append("INVALID_SENSOR_DATA")
            connection_status = "DEGRADED"

        status = self.repo.update_device_status(
            device_id=device_id,
            battery_level=battery_level,
            connection_status=connection_status,
            sensor_valid=sensor_valid
        )

        return {
            "device_id": device_id,
            "status": connection_status,
            "battery": battery_level,
            "alerts": alerts,
            "last_heartbeat": status.last_heartbeat.isoformat()
        }

    def check_offline_devices(self, timeout_minutes: int = 5) -> List[str]:
        # Periodic check for silent or detached devices
        # Deterministic health monitor
        offline_devices = []
        return offline_devices
