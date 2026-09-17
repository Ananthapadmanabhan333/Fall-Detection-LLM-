import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    age = Column(Integer, nullable=True)
    baseline_mobility = Column(String(64), default="NORMAL")  # NORMAL, IMPAIRED, HIGH_FALL_RISK
    medical_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    # Relationships
    devices = relationship("Device", back_populates="user", cascade="all, delete-orphan")
    emergency_contacts = relationship("EmergencyContact", back_populates="user", cascade="all, delete-orphan")
    fall_events = relationship("FallEvent", back_populates="user", cascade="all, delete-orphan")

class Device(Base):
    __tablename__ = "devices"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(String(64), ForeignKey("users.user_id"), nullable=True)
    model_name = Column(String(64), default="ESP32-IMU-6050")
    firmware_version = Column(String(32), default="1.0.0")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    # Relationships
    user = relationship("User", back_populates="devices")
    status_records = relationship("DeviceStatus", back_populates="device", cascade="all, delete-orphan")
    readings = relationship("SensorReading", back_populates="device", cascade="all, delete-orphan")
    fall_events = relationship("FallEvent", back_populates="device", cascade="all, delete-orphan")

class DeviceStatus(Base):
    __tablename__ = "device_status"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String(64), ForeignKey("devices.device_id"), index=True, nullable=False)
    battery_level = Column(Float, default=100.0)  # percentage 0.0 - 100.0
    connection_status = Column(String(32), default="ONLINE")  # ONLINE, OFFLINE, DEGRADED
    sensor_valid = Column(Boolean, default=True)
    last_heartbeat = Column(DateTime, default=utcnow)
    created_at = Column(DateTime, default=utcnow)

    device = relationship("Device", back_populates="status_records")

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String(64), ForeignKey("devices.device_id"), index=True, nullable=False)
    timestamp = Column(DateTime, default=utcnow, index=True)
    accel_x = Column(Float, nullable=False)
    accel_y = Column(Float, nullable=False)
    accel_z = Column(Float, nullable=False)
    gyro_x = Column(Float, nullable=False)
    gyro_y = Column(Float, nullable=False)
    gyro_z = Column(Float, nullable=False)
    is_synthetic = Column(Boolean, default=False)

    device = relationship("Device", back_populates="readings")

class FallEvent(Base):
    __tablename__ = "fall_events"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(String(64), ForeignKey("users.user_id"), index=True, nullable=False)
    device_id = Column(String(64), ForeignKey("devices.device_id"), index=True, nullable=False)
    timestamp = Column(DateTime, default=utcnow, index=True)
    fall_probability = Column(Float, nullable=False)
    impact_detected = Column(Boolean, default=False)
    post_impact_motion = Column(Float, default=0.0)
    duration = Column(Float, default=0.0)
    status = Column(String(32), default="PENDING")  # PENDING, CONFIRMED, FALSE_ALARM, ESCALATED, RESOLVED
    user_response = Column(String(64), nullable=True)  # OKAY, NEED_HELP, UNRESPONSIVE, TIMEOUT
    location_payload = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="fall_events")
    device = relationship("Device", back_populates="fall_events")
    agent_decisions = relationship("AgentDecision", back_populates="fall_event", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="fall_event", cascade="all, delete-orphan")

class AgentDecision(Base):
    __tablename__ = "agent_decisions"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(64), ForeignKey("fall_events.event_id"), index=True, nullable=False)
    risk_level = Column(String(32), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    selected_action = Column(String(64), nullable=False)  # MONITOR, ASK_CONFIRMATION, ESCALATE_CAREGIVER, EMERGENCY_DISPATCH
    reasoning_summary = Column(Text, nullable=False)  # Concise structured summary, never raw chain-of-thought
    tools_executed = Column(JSON, default=list)
    created_at = Column(DateTime, default=utcnow)

    fall_event = relationship("FallEvent", back_populates="agent_decisions")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(64), ForeignKey("users.user_id"), index=True, nullable=False)
    name = Column(String(128), nullable=False)
    relationship_type = Column(String(64), default="Caregiver")  # Doctor, Caregiver, Family, Neighbor
    phone = Column(String(32), nullable=False)
    email = Column(String(128), nullable=True)
    priority_order = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="emergency_contacts")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_id = Column(String(64), unique=True, index=True, nullable=False)
    event_id = Column(String(64), ForeignKey("fall_events.event_id"), index=True, nullable=False)
    channel = Column(String(32), default="SMS")  # SMS, PUSH, EMAIL, PHONE
    recipient = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    delivery_status = Column(String(32), default="SENT")  # PENDING, SENT, DELIVERED, FAILED
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    fall_event = relationship("FallEvent", back_populates="alerts")
