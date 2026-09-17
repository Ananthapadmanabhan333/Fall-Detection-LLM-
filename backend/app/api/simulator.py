from datetime import datetime, timezone
from typing import Literal, Optional, List, Dict, Any
import numpy as np
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database.database import get_db
from app.schemas.sensor import SensorPacket, AccelerometerData, GyroscopeData
from app.services.event_manager import FallEventManager

router = APIRouter(prefix="/api/simulator", tags=["Simulator"])

class SimulatorFallRequest(BaseModel):
    user_id: str = "USER001"
    device_id: str = "DEV001"
    fall_type: Literal["forward_fall", "backward_fall", "syncope_collapse", "stumble_recovery"] = "forward_fall"
    samples_count: int = 500  # 5 seconds at 100Hz

class SimulatorNormalRequest(BaseModel):
    user_id: str = "USER001"
    device_id: str = "DEV001"
    activity: Literal["walking", "sitting", "standing", "lying", "running", "stumbling"] = "walking"
    samples_count: int = 500

def generate_synthetic_imu_sequence(activity: str, count: int = 500) -> np.ndarray:
    """
    Generate biomechanically grounded synthetic 6-axis IMU sequence [count, 6].
    Columns: [Ax, Ay, Az, Gx, Gy, Gz]
    Values in m/s^2 for accel and rad/s for gyro.
    """
    t = np.linspace(0, count / 100.0, count)
    seq = np.zeros((count, 6))

    # Base gravity (Z = ~9.81 m/s^2) and subtle sensor baseline noise
    seq[:, 0] = np.random.normal(0.0, 0.15, count)
    seq[:, 1] = np.random.normal(0.0, 0.15, count)
    seq[:, 2] = np.random.normal(9.81, 0.15, count)
    seq[:, 3:6] = np.random.normal(0.0, 0.05, (count, 3))

    if activity == "walking":
        freq = 1.8  # ~1.8 Hz cadence
        seq[:, 0] += 1.5 * np.sin(2 * np.pi * freq * t)
        seq[:, 1] += 0.8 * np.sin(4 * np.pi * freq * t)
        seq[:, 2] += 2.5 * np.cos(2 * np.pi * freq * t)
        seq[:, 3] += 0.4 * np.cos(2 * np.pi * freq * t)
    elif activity == "running":
        freq = 2.8
        seq[:, 0] += 3.5 * np.sin(2 * np.pi * freq * t)
        seq[:, 2] += 6.0 * np.cos(2 * np.pi * freq * t)
        seq[:, 3:6] += np.random.normal(0.0, 1.2, (count, 3))
    elif activity == "sitting":
        # Slight shift from vertical to tilted gravity
        seq[:, 1] += 2.0
        seq[:, 2] -= 1.0
    elif activity == "standing":
        # Static standing with postural sway
        seq[:, 0] += 0.2 * np.sin(2 * np.pi * 0.3 * t)
    elif activity == "lying":
        # Wearer horizontal: gravity primarily on X or Y axis
        seq[:, 0] += 8.5
        seq[:, 2] -= 8.5
    elif activity == "stumbling":
        # Stumble with recovery: moderate spike (15-20 m/s^2 = ~1.5-2.0g), then resuming walk
        mid = count // 2
        seq[mid-10:mid+10, 0] += 12.0
        seq[mid-10:mid+10, 2] += 10.0
        seq[mid-10:mid+10, 3] += 2.2
        # Rapid resumption of motion
        seq[mid+10:, 2] += 2.5 * np.cos(2 * np.pi * 1.8 * t[mid+10:])
    elif "fall" in activity or activity == "syncope_collapse":
        # Biomechanical Fall sequence:
        # 1. Pre-fall / initiation (~1.5s)
        # 2. Free fall drop: acceleration drops near zero (gravity weightlessness) (~0.2s)
        # 3. Floor Impact Spike: high peak deceleration (> 28 m/s^2 = > 2.8g)
        # 4. Post-impact rest/immobility: near zero motion variance
        impact_idx = int(count * 0.4)
        freefall_idx = impact_idx - 25

        # Free fall phase: weightlessness
        seq[freefall_idx:impact_idx, 0:3] = np.random.normal(0.0, 0.4, (impact_idx - freefall_idx, 3))

        # Impact phase: sharp spike
        impact_len = 12
        seq[impact_idx:impact_idx+impact_len, 0] += np.random.uniform(15.0, 25.0, impact_len)
        seq[impact_idx:impact_idx+impact_len, 1] += np.random.uniform(10.0, 20.0, impact_len)
        seq[impact_idx:impact_idx+impact_len, 2] += np.random.uniform(28.0, 42.0, impact_len)
        seq[impact_idx:impact_idx+impact_len, 3:6] += np.random.uniform(3.5, 6.0, (impact_len, 3))

        # Post impact rest (immobility)
        post_start = impact_idx + impact_len
        seq[post_start:, 0] = np.random.normal(9.5, 0.04, count - post_start)  # lying flat on back/side
        seq[post_start:, 1] = np.random.normal(0.2, 0.04, count - post_start)
        seq[post_start:, 2] = np.random.normal(0.5, 0.04, count - post_start)
        seq[post_start:, 3:6] = np.random.normal(0.0, 0.01, (count - post_start, 3))

    return seq

@router.post("/fall")
def simulate_fall(req: SimulatorFallRequest, db: Session = Depends(get_db)):
    """
    Generate synthetic fall sequence and stream it through the FallEventManager.
    Returns the detection outcome, probability, and created event ID.
    """
    raw_seq = generate_synthetic_imu_sequence(req.fall_type, req.samples_count)
    manager = FallEventManager(db)

    last_result = None
    # Stream packets into manager
    for i in range(len(raw_seq)):
        sample = raw_seq[i]
        packet = SensorPacket(
            device_id=req.device_id,
            user_id=req.user_id,
            timestamp=datetime.now(timezone.utc),
            accelerometer=AccelerometerData(x=float(sample[0]), y=float(sample[1]), z=float(sample[2])),
            gyroscope=GyroscopeData(x=float(sample[3]), y=float(sample[4]), z=float(sample[5])),
            is_synthetic=True
        )
        res = manager.add_sensor_sample(packet)
        if res.get("fall_detected") or (last_result is None or res.get("fall_evaluated")):
            last_result = res

    return {
        "simulation_type": "SYNTHETIC_FALL",
        "fall_type": req.fall_type,
        "is_synthetic": True,
        "user_id": req.user_id,
        "device_id": req.device_id,
        "total_samples_streamed": req.samples_count,
        "result": last_result
    }

@router.post("/normal")
def simulate_normal(req: SimulatorNormalRequest, db: Session = Depends(get_db)):
    """
    Generate synthetic normal ADL (walking, sitting, running, etc.) and stream it.
    Verifies that normal daily activity does not produce false emergency alerts.
    """
    raw_seq = generate_synthetic_imu_sequence(req.activity, req.samples_count)
    manager = FallEventManager(db)

    last_result = None
    for i in range(len(raw_seq)):
        sample = raw_seq[i]
        packet = SensorPacket(
            device_id=req.device_id,
            user_id=req.user_id,
            timestamp=datetime.now(timezone.utc),
            accelerometer=AccelerometerData(x=float(sample[0]), y=float(sample[1]), z=float(sample[2])),
            gyroscope=GyroscopeData(x=float(sample[3]), y=float(sample[4]), z=float(sample[5])),
            is_synthetic=True
        )
        res = manager.add_sensor_sample(packet)
        if res.get("fall_evaluated"):
            last_result = res

    return {
        "simulation_type": "SYNTHETIC_NORMAL_ADL",
        "activity": req.activity,
        "is_synthetic": True,
        "user_id": req.user_id,
        "device_id": req.device_id,
        "total_samples_streamed": req.samples_count,
        "result": last_result
    }
