from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.repositories import FallGuardRepository
from app.schemas.user import UserCreate, UserResponse, EmergencyContactCreate, EmergencyContactResponse

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Retrieve user details, baseline mobility profile, and emergency contacts."""
    repo = FallGuardRepository(db)
    user = repo.get_or_create_user(user_id)
    contacts = repo.get_emergency_contacts(user_id)
    return UserResponse(
        id=user.id,
        user_id=user.user_id,
        name=user.name,
        age=user.age,
        baseline_mobility=user.baseline_mobility,
        medical_notes=user.medical_notes,
        emergency_contacts=[
            EmergencyContactResponse(
                id=c.id,
                user_id=c.user_id,
                name=c.name,
                relationship_type=c.relationship_type,
                phone=c.phone,
                email=c.email,
                priority_order=c.priority_order,
                is_active=c.is_active
            )
            for c in contacts
        ],
        created_at=user.created_at
    )
