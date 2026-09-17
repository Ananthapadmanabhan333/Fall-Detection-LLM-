from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AlertCreate(BaseModel):
    event_id: str
    channel: str = "SMS"
    recipient: str
    message: str

class AlertResponse(BaseModel):
    id: str
    alert_id: str
    event_id: str
    channel: str
    recipient: str
    message: str
    delivery_status: str
    acknowledged: bool
    created_at: datetime

    class Config:
        from_attributes = True
