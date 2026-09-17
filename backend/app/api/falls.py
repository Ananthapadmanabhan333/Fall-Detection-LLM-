from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.repositories import FallGuardRepository
from app.schemas.fall import FallEventCreate, FallEventResponse

router = APIRouter(tags=["Falls"])

@router.post("/api/fall/event", response_model=FallEventResponse, status_code=status.HTTP_201_CREATED)
def create_fall_event(event_data: FallEventCreate, db: Session = Depends(get_db)):
    """Manually register or inject a fall event."""
    repo = FallGuardRepository(db)
    # Ensure user and device exist
    repo.get_or_create_user(event_data.user_id)
    repo.get_or_create_device(event_data.device_id, event_data.user_id)
    event = repo.create_fall_event(event_data)
    return event

@router.get("/api/falls/{user_id}", response_model=List[FallEventResponse])
def get_user_falls(user_id: str, days: int = 30, limit: int = 20, db: Session = Depends(get_db)):
    """Retrieve historical fall events for a user."""
    repo = FallGuardRepository(db)
    return repo.get_recent_fall_events(user_id=user_id, days=days, limit=limit)

@router.get("/api/falls/{user_id}/latest", response_model=FallEventResponse)
def get_latest_user_fall(user_id: str, db: Session = Depends(get_db)):
    """Retrieve the most recent fall event for a user."""
    repo = FallGuardRepository(db)
    event = repo.get_latest_fall_event(user_id=user_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No fall events found for user {user_id}")
    return event

@router.get("/api/events/{event_id}", response_model=FallEventResponse)
def get_event_by_id(event_id: str, db: Session = Depends(get_db)):
    """Retrieve full details of an event by event_id."""
    repo = FallGuardRepository(db)
    event = repo.get_fall_event(event_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event {event_id} not found")
    return event
