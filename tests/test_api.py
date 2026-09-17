import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_api_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "ml_detector" in data

def test_api_sensor_ingest(client):
    payload = {
        "device_id": "DEV_TEST",
        "user_id": "USER_TEST",
        "timestamp": "2026-09-17T10:30:25Z",
        "accelerometer": {"x": 0.1, "y": 0.2, "z": 9.8},
        "gyroscope": {"x": 0.01, "y": 0.02, "z": 0.03}
    }
    response = client.post("/api/sensor/data", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["device_id"] == "DEV_TEST"

def test_api_simulator_endpoints(client):
    # Test normal simulation
    norm_res = client.post("/api/simulator/normal", json={"activity": "walking", "samples_count": 200})
    assert norm_res.status_code == 200
    assert norm_res.json()["is_synthetic"] is True

    # Test fall simulation
    fall_res = client.post("/api/simulator/fall", json={"fall_type": "forward_fall", "samples_count": 200})
    assert fall_res.status_code == 200
    assert fall_res.json()["is_synthetic"] is True

def test_api_confirmation_flow(client):
    import uuid
    uid = uuid.uuid4().hex[:8]
    ev_id = f"evt_conf_{uid}"
    user_id = f"USER_CONF_{uid}"
    device_id = f"DEV_CONF_{uid}"

    # Inject a fall event first
    ev_payload = {
        "event_id": ev_id,
        "user_id": user_id,
        "device_id": device_id,
        "fall_probability": 0.89,
        "impact_detected": True,
        "post_impact_motion": 0.02,
        "status": "PENDING"
    }
    create_res = client.post("/api/fall/event", json=ev_payload)
    assert create_res.status_code == 201

    # Confirm OKAY
    conf_res = client.post("/api/agent/confirm", json={"event_id": ev_id, "user_response": "OKAY"})
    assert conf_res.status_code == 200
    assert conf_res.json()["status"] == "RESOLVED"
