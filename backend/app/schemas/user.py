from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

class EmergencyContactCreate(BaseModel):
    name: str
    relationship_type: str = "Caregiver"
    phone: str
    email: Optional[str] = None
    priority_order: int = 1

class EmergencyContactResponse(BaseModel):
    id: str
    user_id: str
    name: str
    relationship_type: str
    phone: str
    email: Optional[str] = None
    priority_order: int
    is_active: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    user_id: str
    name: str
    age: Optional[int] = None
    baseline_mobility: str = "NORMAL"
    medical_notes: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    user_id: str
    name: str
    age: Optional[int] = None
    baseline_mobility: str
    medical_notes: Optional[str] = None
    emergency_contacts: List[EmergencyContactResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True
