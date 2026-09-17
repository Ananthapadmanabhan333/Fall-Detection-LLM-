import pytest
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.models import Base
from app.database.repositories import FallGuardRepository
from app.schemas.fall import FallEventCreate

@pytest.fixture
def in_memory_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    yield db
    db.close()

def test_duplicate_event_suppression(in_memory_db):
    repo = FallGuardRepository(in_memory_db)
    repo.get_or_create_user("USER_TEST_001")
    repo.get_or_create_device("DEV_TEST_001", "USER_TEST_001")

    # First event
    ev1 = FallEventCreate(
        event_id="evt_001",
        user_id="USER_TEST_001",
        device_id="DEV_TEST_001",
        fall_probability=0.88,
        impact_detected=True,
        post_impact_motion=0.04,
        duration=5.0
    )
    repo.create_fall_event(ev1)

    # Check for duplicate within 15 seconds
    duplicate = repo.check_duplicate_event(user_id="USER_TEST_001", suppression_window_seconds=15)
    assert duplicate is not None
    assert duplicate.event_id == "evt_001"

def test_event_lifecycle_and_status(in_memory_db):
    repo = FallGuardRepository(in_memory_db)
    repo.get_or_create_user("USER_TEST_002")
    repo.get_or_create_device("DEV_TEST_002", "USER_TEST_002")

    ev = FallEventCreate(
        event_id="evt_002",
        user_id="USER_TEST_002",
        device_id="DEV_TEST_002",
        fall_probability=0.75,
        status="PENDING"
    )
    repo.create_fall_event(ev)

    updated = repo.update_fall_event_status("evt_002", "CONFIRMED", user_response="NEED_HELP")
    assert updated.status == "CONFIRMED"
    assert updated.user_response == "NEED_HELP"
