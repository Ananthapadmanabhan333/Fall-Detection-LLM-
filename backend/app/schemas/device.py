from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DeviceStatusUpdate(BaseModel):
    battery_level: float
    connection_status: str = "ONLINE"
    sensor_valid: bool = True

class DeviceStatusResponse(BaseModel):
    device_id: str
    battery_level: float
    connection_status: str
    sensor_valid: bool
    last_heartbeat: datetime

    class Config:
        from_attributes = True

class DeviceCreate(BaseModel):
    device_id: str
    user_id: Optional[str] = None
    model_name: str = "ESP32-IMU-6050"
    firmware_version: str = "1.0.0"

class DeviceResponse(BaseModel):
    id: str
    device_id: str
    user_id: Optional[str] = None
    model_name: str
    firmware_version: str
    is_active: bool
    latest_status: Optional[DeviceStatusResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True
