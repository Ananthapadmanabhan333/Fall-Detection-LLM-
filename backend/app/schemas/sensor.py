import math
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class AccelerometerData(BaseModel):
    x: float = Field(..., description="Acceleration in X axis (m/s^2 or g)")
    y: float = Field(..., description="Acceleration in Y axis (m/s^2 or g)")
    z: float = Field(..., description="Acceleration in Z axis (m/s^2 or g)")

    @field_validator("x", "y", "z")
    @classmethod
    def validate_finite_and_range(cls, v: float) -> float:
        if math.isnan(v) or math.isinf(v):
            raise ValueError("Sensor reading must be a finite real number.")
        # Practical physiological/wearable bounds (-200 m/s^2 to 200 m/s^2 or ~20g)
        if abs(v) > 200.0:
            raise ValueError(f"Accelerometer value {v} exceeds reasonable physical bounds.")
        return v

class GyroscopeData(BaseModel):
    x: float = Field(..., description="Angular velocity around X axis (rad/s or deg/s)")
    y: float = Field(..., description="Angular velocity around Y axis (rad/s or deg/s)")
    z: float = Field(..., description="Angular velocity around Z axis (rad/s or deg/s)")

    @field_validator("x", "y", "z")
    @classmethod
    def validate_finite_and_range(cls, v: float) -> float:
        if math.isnan(v) or math.isinf(v):
            raise ValueError("Sensor reading must be a finite real number.")
        # Practical bounds for angular velocity
        if abs(v) > 5000.0:
            raise ValueError(f"Gyroscope value {v} exceeds reasonable physical bounds.")
        return v

class SensorPacket(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=64)
    user_id: str = Field(..., min_length=1, max_length=64)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    accelerometer: AccelerometerData
    gyroscope: GyroscopeData
    is_synthetic: bool = False

class SensorIngestResponse(BaseModel):
    status: str
    device_id: str
    samples_in_window: int
    fall_evaluated: bool
    fall_detected: bool = False
    fall_probability: Optional[float] = None
    event_id: Optional[str] = None
