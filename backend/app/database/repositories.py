from datetime import datetime, timezone, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.models import (
    User, Device, DeviceStatus, SensorReading, FallEvent,
    AgentDecision, EmergencyContact, Alert
)
from app.schemas.fall import FallEventCreate
from app.schemas.user import UserCreate, EmergencyContactCreate

class FallGuardRepository:
    def __init__(self, db: Session):
        self.db = db

    # User operations
    def get_or_create_user(self, user_id: str, name: str = "Demo User", age: int = 72) -> User:
        user = self.db.query(User).filter(User.user_id == user_id).first()
        if not user:
            user = User(
                user_id=user_id,
                name=name,
                age=age,
                baseline_mobility="NORMAL",
                medical_notes="Mild hypertension, previous slip 6 months ago."
            )
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
        return user

    def get_user(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.user_id == user_id).first()

    # Emergency Contacts
    def get_emergency_contacts(self, user_id: str) -> List[EmergencyContact]:
        contacts = self.db.query(EmergencyContact).filter(
            EmergencyContact.user_id == user_id,
            EmergencyContact.is_active == True
        ).order_by(EmergencyContact.priority_order).all()

        # Seed default demo contacts if none exist
        if not contacts:
            c1 = EmergencyContact(
                user_id=user_id,
                name="Sarah Jenkins (Daughter / Primary Caregiver)",
                relationship_type="Family",
                phone="+1-555-0199",
                email="sarah.jenkins@example.com",
                priority_order=1
            )
            c2 = EmergencyContact(
                user_id=user_id,
                name="Dr. Robert Hayes (Family Physician)",
                relationship_type="Doctor",
                phone="+1-555-0144",
                email="dr.hayes@clinic.example.com",
                priority_order=2
            )
            self.db.add_all([c1, c2])
            self.db.commit()
            contacts = [c1, c2]
        return contacts

    # Device & Device Status
    def get_or_create_device(self, device_id: str, user_id: Optional[str] = None) -> Device:
        device = self.db.query(Device).filter(Device.device_id == device_id).first()
        if not device:
            device = Device(device_id=device_id, user_id=user_id)
            self.db.add(device)
            self.db.commit()
            self.db.refresh(device)
        return device

    def update_device_status(self, device_id: str, battery_level: float, connection_status: str = "ONLINE", sensor_valid: bool = True) -> DeviceStatus:
        status = DeviceStatus(
            device_id=device_id,
            battery_level=battery_level,
            connection_status=connection_status,
            sensor_valid=sensor_valid,
            last_heartbeat=datetime.now(timezone.utc)
        )
        self.db.add(status)
        self.db.commit()
        self.db.refresh(status)
        return status

    def get_latest_device_status(self, device_id: str) -> Optional[DeviceStatus]:
        return self.db.query(DeviceStatus).filter(
            DeviceStatus.device_id == device_id
        ).order_by(desc(DeviceStatus.last_heartbeat)).first()

    # Sensor Readings
    def save_sensor_reading(self, device_id: str, ax: float, ay: float, az: float, gx: float, gy: float, gz: float, is_synthetic: bool = False):
        reading = SensorReading(
            device_id=device_id,
            accel_x=ax,
            accel_y=ay,
            accel_z=az,
            gyro_x=gx,
            gyro_y=gy,
            gyro_z=gz,
            is_synthetic=is_synthetic
        )
        self.db.add(reading)
        self.db.commit()

    # Fall Events
    def create_fall_event(self, event_data: FallEventCreate) -> FallEvent:
        event = FallEvent(
            event_id=event_data.event_id,
            user_id=event_data.user_id,
            device_id=event_data.device_id,
            timestamp=event_data.timestamp,
            fall_probability=event_data.fall_probability,
            impact_detected=event_data.impact_detected,
            post_impact_motion=event_data.post_impact_motion,
            duration=event_data.duration,
            status=event_data.status,
            location_payload=event_data.location_payload
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_fall_event(self, event_id: str) -> Optional[FallEvent]:
        return self.db.query(FallEvent).filter(FallEvent.event_id == event_id).first()

    def update_fall_event_status(self, event_id: str, status: str, user_response: Optional[str] = None) -> Optional[FallEvent]:
        event = self.get_fall_event(event_id)
        if event:
            event.status = status
            if user_response:
                event.user_response = user_response
            event.updated_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(event)
        return event

    def get_recent_fall_events(self, user_id: str, days: int = 30, limit: int = 10) -> List[FallEvent]:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        return self.db.query(FallEvent).filter(
            FallEvent.user_id == user_id,
            FallEvent.timestamp >= since
        ).order_by(desc(FallEvent.timestamp)).limit(limit).all()

    def get_latest_fall_event(self, user_id: str) -> Optional[FallEvent]:
        return self.db.query(FallEvent).filter(
            FallEvent.user_id == user_id
        ).order_by(desc(FallEvent.timestamp)).first()

    def check_duplicate_event(self, user_id: str, suppression_window_seconds: int = 15) -> Optional[FallEvent]:
        """Check if an event was created within suppression_window_seconds"""
        window_start = datetime.now(timezone.utc) - timedelta(seconds=suppression_window_seconds)
        return self.db.query(FallEvent).filter(
            FallEvent.user_id == user_id,
            FallEvent.timestamp >= window_start
        ).order_by(desc(FallEvent.timestamp)).first()

    # Agent Decisions
    def save_agent_decision(self, event_id: str, risk_level: str, selected_action: str, reasoning_summary: str, tools_executed: list) -> AgentDecision:
        decision = AgentDecision(
            event_id=event_id,
            risk_level=risk_level,
            selected_action=selected_action,
            reasoning_summary=reasoning_summary,
            tools_executed=tools_executed
        )
        self.db.add(decision)
        self.db.commit()
        self.db.refresh(decision)
        return decision

    # Alerts
    def create_alert(self, alert_id: str, event_id: str, channel: str, recipient: str, message: str) -> Alert:
        alert = Alert(
            alert_id=alert_id,
            event_id=event_id,
            channel=channel,
            recipient=recipient,
            message=message,
            delivery_status="SENT"
        )
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def get_alerts_for_event(self, event_id: str) -> List[Alert]:
        return self.db.query(Alert).filter(Alert.event_id == event_id).all()
