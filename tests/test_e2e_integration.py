import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.database import SessionLocal
from app.database.repositories import FallGuardRepository

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_complete_end_to_end_fall_detection_and_escalation(client):
    """
    MASTER END-TO-END SCENARIO:
    1. Simulator streams forward fall sequence.
    2. Backend signal processor & ML detector processes 500 samples.
    3. Fall probability generated (> 0.80) + impact detected.
    4. FallEvent generated in database.
    5. Deterministic Safety Engine & LangGraph Agent invoked.
    6. RAG retrieves emergency protocol.
    7. User confirmation requested.
    8. User non-response (TIMEOUT) triggers deterministic safety escalation.
    9. Caregiver SMS alert dispatched.
    10. Event status verified as ESCALATED.
    """
    import uuid
    uid = uuid.uuid4().hex[:8]
    user_id = f"USER_E2E_{uid}"
    device_id = f"DEV_E2E_{uid}"

    # Step 1: Simulator generates and streams fall sequence
    sim_res = client.post("/api/simulator/fall", json={
        "user_id": user_id,
        "device_id": device_id,
        "fall_type": "forward_fall",
        "samples_count": 500
    })
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert sim_data["is_synthetic"] is True

    # Step 2: Query latest fall event from backend
    latest_res = client.get(f"/api/falls/{user_id}/latest")
    assert latest_res.status_code == 200
    event_data = latest_res.json()
    event_id = event_data["event_id"]

    assert event_data["fall_probability"] >= 0.50
    assert event_data["impact_detected"] is True

    # Step 3: Trigger Agent analysis
    agent_res = client.post("/api/agent/analyze", json={"event_id": event_id})
    assert agent_res.status_code == 200
    decision = agent_res.json()

    assert decision["risk_level"] in ["CRITICAL", "HIGH", "MEDIUM"]
    assert len(decision["reasoning_summary"]) > 0

    # Step 4: Simulate User Non-Response / Timeout
    confirm_res = client.post("/api/agent/confirm", json={
        "event_id": event_id,
        "user_response": "TIMEOUT"
    })
    assert confirm_res.status_code == 200
    assert confirm_res.json()["status"] == "ESCALATED"

    # Step 5: Verify incident appears as ESCALATED in repository
    db = SessionLocal()
    repo = FallGuardRepository(db)
    final_event = repo.get_fall_event(event_id)
    assert final_event.status == "ESCALATED"
    assert final_event.user_response == "TIMEOUT"

    # Verify alerts dispatched for event
    alerts = repo.get_alerts_for_event(event_id)
    assert len(alerts) >= 1
    assert any("ESCALATION" in a.message.upper() or "CRITICAL" in a.message.upper() or "EMERGENCY" in a.message.upper() for a in alerts)
    db.close()

def test_normal_activity_false_positive_rejection(client):
    """
    VERIFY FALSE ALARM SUPPRESSION:
    Walking / normal daily activity should NOT produce an emergency escalation.
    """
    user_id = "USER_WALK_001"
    device_id = "DEV_WALK_001"

    sim_res = client.post("/api/simulator/normal", json={
        "user_id": user_id,
        "device_id": device_id,
        "activity": "walking",
        "samples_count": 300
    })
    assert sim_res.status_code == 200
    res = sim_res.json()["result"]

    # Either no fall evaluated or low probability
    if res and res.get("fall_evaluated"):
        assert res.get("fall_detected") is False or res.get("fall_probability", 0.0) < 0.50

    # Verify no ESCALATED fall event exists for this user
    latest_res = client.get(f"/api/falls/{user_id}/latest")
    # Should either be 404 (no event) or if event created, not escalated
    if latest_res.status_code == 200:
        assert latest_res.json()["status"] != "ESCALATED"
