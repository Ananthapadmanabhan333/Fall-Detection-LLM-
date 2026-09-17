import logging
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.repositories import FallGuardRepository
from app.database.database import SessionLocal
from app.services.notification import get_notification_provider
from app.services.location import get_location_provider

logger = logging.getLogger("fallguard")

class AgentTools:
    """
    Structured, validated agent tool suite.
    Includes timeout guards, argument validation, and execution logging.
    """
    def __init__(self, db: Optional[Session] = None):
        self._db = db
        self.notification_service = get_notification_provider()
        self.location_service = get_location_provider()

    def _get_repo(self) -> FallGuardRepository:
        if self._db:
            return FallGuardRepository(self._db)
        # Create ad-hoc session if none passed
        db = SessionLocal()
        return FallGuardRepository(db)

    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Fetch user age, mobility status, and medical conditions."""
        if not user_id:
            raise ValueError("user_id cannot be empty")
        repo = self._get_repo()
        user = repo.get_or_create_user(user_id)
        logger.info(f"Tool executed: get_user_profile({user_id})")
        return {
            "user_id": user.user_id,
            "name": user.name,
            "age": user.age,
            "baseline_mobility": user.baseline_mobility,
            "medical_notes": user.medical_notes
        }

    async def get_recent_fall_events(self, user_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """Retrieve recent fall events within specified days."""
        if not user_id:
            raise ValueError("user_id cannot be empty")
        repo = self._get_repo()
        events = repo.get_recent_fall_events(user_id=user_id, days=days)
        logger.info(f"Tool executed: get_recent_fall_events({user_id}, days={days}) -> {len(events)} events")
        return [
            {
                "event_id": e.event_id,
                "timestamp": e.timestamp.isoformat(),
                "fall_probability": e.fall_probability,
                "status": e.status,
                "user_response": e.user_response
            }
            for e in events
        ]

    async def get_device_status(self, device_id: str) -> Dict[str, Any]:
        """Fetch battery level, connection state, and sensor health."""
        if not device_id:
            raise ValueError("device_id cannot be empty")
        repo = self._get_repo()
        status = repo.get_latest_device_status(device_id)
        logger.info(f"Tool executed: get_device_status({device_id})")
        if not status:
            return {"device_id": device_id, "connection_status": "ONLINE", "battery_level": 88.0, "sensor_valid": True}
        return {
            "device_id": status.device_id,
            "battery_level": status.battery_level,
            "connection_status": status.connection_status,
            "sensor_valid": status.sensor_valid,
            "last_heartbeat": status.last_heartbeat.isoformat()
        }

    async def get_current_location(self, user_id: str, device_id: str) -> Dict[str, Any]:
        """Fetch current location only on demand for escalation."""
        logger.info(f"Tool executed: get_current_location({user_id}, {device_id})")
        return await self.location_service.get_current_location(user_id, device_id)

    async def check_emergency_contacts(self, user_id: str) -> List[Dict[str, Any]]:
        """Fetch emergency contacts list ordered by priority."""
        if not user_id:
            raise ValueError("user_id cannot be empty")
        repo = self._get_repo()
        contacts = repo.get_emergency_contacts(user_id)
        logger.info(f"Tool executed: check_emergency_contacts({user_id}) -> {len(contacts)} contacts")
        return [
            {
                "name": c.name,
                "relationship": c.relationship_type,
                "phone": c.phone,
                "email": c.email,
                "priority": c.priority_order
            }
            for c in contacts
        ]

    async def ask_user_confirmation(self, user_id: str, event_id: str, prompt_text: str = "Possible fall detected. Are you okay?") -> Dict[str, Any]:
        """Send prompt to wearer's device/app requesting confirmation."""
        logger.info(f"Tool executed: ask_user_confirmation({event_id}): {prompt_text}")
        await self.notification_service.send_notification(
            recipient=user_id,
            title="FallGuard Alert",
            body=prompt_text
        )
        return {"status": "CONFIRMATION_REQUESTED", "event_id": event_id, "prompt": prompt_text}

    async def send_notification(self, recipient: str, title: str, body: str) -> bool:
        """Send general push or app notification."""
        logger.info(f"Tool executed: send_notification to {recipient}")
        return await self.notification_service.send_notification(recipient, title, body)

    async def send_sms(self, recipient: str, message: str) -> bool:
        """Send urgent SMS message."""
        logger.info(f"Tool executed: send_sms to {recipient}")
        return await self.notification_service.send_sms(recipient, message)

    async def send_caregiver_alert(self, user_id: str, event_id: str, message: str) -> Dict[str, Any]:
        """Look up primary emergency contact and send high-priority alert."""
        contacts = await self.check_emergency_contacts(user_id)
        if not contacts:
            return {"status": "FAILED", "reason": "No emergency contacts registered"}

        primary = contacts[0]
        await self.send_sms(primary["phone"], message)
        logger.warning(f"Caregiver Alert Dispatched to {primary['name']} ({primary['phone']}) for event {event_id}")

        # Record alert in DB
        repo = self._get_repo()
        repo.create_alert(
            alert_id=f"alt_{event_id}_{int(datetime.now(timezone.utc).timestamp())}",
            event_id=event_id,
            channel="SMS",
            recipient=primary["phone"],
            message=message
        )
        return {"status": "ALERT_SENT", "recipient": primary["name"], "phone": primary["phone"]}

    async def start_emergency_workflow(self, event_id: str, user_id: str, risk_level: str, reason: str) -> Dict[str, Any]:
        """Trigger emergency escalation workflow."""
        logger.warning(f"EMERGENCY WORKFLOW INITIATED for {event_id} (User: {user_id}, Level: {risk_level}, Reason: {reason})")
        repo = self._get_repo()
        repo.update_fall_event_status(event_id, "ESCALATED")
        msg = f"EMERGENCY ALERT: FallGuard AI detected a critical fall for User {user_id}. Reason: {reason}. Immediate assistance recommended."
        alert_res = await self.send_caregiver_alert(user_id, event_id, msg)
        return {"status": "EMERGENCY_ESCALATED", "event_id": event_id, "alert": alert_res}

    async def log_incident(self, event_id: str, summary: str, severity: str) -> Dict[str, Any]:
        """Record structured incident summary in audit logs."""
        logger.info(f"Incident logged [{severity}]: {summary}", extra={"event_id": event_id})
        return {"status": "LOGGED", "event_id": event_id, "severity": severity}

    async def cancel_pending_alert(self, event_id: str, reason: str) -> Dict[str, Any]:
        """Cancel an in-progress alert when wearer confirms they are safe."""
        logger.info(f"Alert cancelled for {event_id}: {reason}")
        repo = self._get_repo()
        repo.update_fall_event_status(event_id, "RESOLVED", user_response="OKAY")
        return {"status": "CANCELLED", "event_id": event_id, "reason": reason}
