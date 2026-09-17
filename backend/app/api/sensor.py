from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.sensor import SensorPacket, SensorIngestResponse
from app.services.event_manager import FallEventManager

router = APIRouter(prefix="/api/sensor", tags=["Sensor"])

@router.post("/data", response_model=SensorIngestResponse)
def ingest_sensor_data(packet: SensorPacket, db: Session = Depends(get_db)):
    """
    Ingest 6-axis IMU packet from wearable device.
    Strictly validates ranges and timestamps.
    Buffers in rolling window and triggers ML inference when window conditions are met.
    """
    try:
        manager = FallEventManager(db)
        result = manager.add_sensor_sample(packet)
        return SensorIngestResponse(
            status="success",
            device_id=result["device_id"],
            samples_in_window=result["samples_in_window"],
            fall_evaluated=result["fall_evaluated"],
            fall_detected=result["fall_detected"],
            fall_probability=result["fall_probability"],
            event_id=result["event_id"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sensor ingestion error: {str(e)}"
        )
