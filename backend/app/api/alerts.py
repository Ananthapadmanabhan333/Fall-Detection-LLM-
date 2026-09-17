import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.repositories import FallGuardRepository
from app.schemas.alert import AlertCreate, AlertResponse
from app.services.notification import get_notification_provider

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.post("/send", response_model=AlertResponse)
async def send_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    """Dispatch emergency or caregiver notification alert."""
    repo = FallGuardRepository(db)
    event = repo.get_fall_event(alert_in.event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event {alert_in.event_id} not found")

    notification_service = get_notification_provider()
    if alert_in.channel == "SMS":
        await notification_service.send_sms(alert_in.recipient, alert_in.message)
    else:
        await notification_service.send_notification(alert_in.recipient, "FallGuard Alert", alert_in.message)

    alert_id = f"alt_{uuid.uuid4().hex[:8]}"
    alert = repo.create_alert(
        alert_id=alert_id,
        event_id=alert_in.event_id,
        channel=alert_in.channel,
        recipient=alert_in.recipient,
        message=alert_in.message
    )
    return alert

@router.get("/{event_id}", response_model=List[AlertResponse])
def get_alerts_for_event(event_id: str, db: Session = Depends(get_db)):
    """Retrieve all alerts dispatched for a specific event."""
    repo = FallGuardRepository(db)
    return repo.get_alerts_for_event(event_id)
