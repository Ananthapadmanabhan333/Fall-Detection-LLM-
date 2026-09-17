from datetime import datetime, timezone
from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

class FallEventCreate(BaseModel):
    event_id: str
    user_id: str
    device_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    fall_probability: float = Field(..., ge=0.0, le=1.0)
    impact_detected: bool = False
    post_impact_motion: float = Field(default=0.0, ge=0.0)
    duration: float = Field(default=0.0, ge=0.0)
    status: Literal["PENDING", "CONFIRMED", "FALSE_ALARM", "ESCALATED", "RESOLVED"] = "PENDING"
    location_payload: Optional[Dict[str, Any]] = None

class FallEventResponse(BaseModel):
    id: str
    event_id: str
    user_id: str
    device_id: str
    timestamp: datetime
    fall_probability: float
    impact_detected: bool
    post_impact_motion: float
    duration: float
    status: str
    user_response: Optional[str] = None
    location_payload: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FallConfirmationRequest(BaseModel):
    event_id: str
    user_response: Literal["OKAY", "NEED_HELP", "UNRESPONSIVE", "TIMEOUT"]
