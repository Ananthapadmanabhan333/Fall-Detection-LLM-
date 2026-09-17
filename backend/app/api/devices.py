from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.repositories import FallGuardRepository
from app.schemas.device import DeviceResponse, DeviceStatusResponse, DeviceStatusUpdate

router = APIRouter(prefix="/api/devices", tags=["Devices"])

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(device_id: str, db: Session = Depends(get_db)):
    """Retrieve device hardware information and latest telemetry status."""
    repo = FallGuardRepository(db)
    device = repo.get_or_create_device(device_id)
    latest_status = repo.get_latest_device_status(device_id)

    status_resp = None
    if latest_status:
        status_resp = DeviceStatusResponse(
            device_id=latest_status.device_id,
            battery_level=latest_status.battery_level,
            connection_status=latest_status.connection_status,
            sensor_valid=latest_status.sensor_valid,
            last_heartbeat=latest_status.last_heartbeat
        )

    return DeviceResponse(
        id=device.id,
        device_id=device.device_id,
        user_id=device.user_id,
        model_name=device.model_name,
        firmware_version=device.firmware_version,
        is_active=device.is_active,
        latest_status=status_resp,
        created_at=device.created_at
    )

@router.post("/{device_id}/heartbeat", response_model=DeviceStatusResponse)
def record_device_heartbeat(device_id: str, update: DeviceStatusUpdate, db: Session = Depends(get_db)):
    """Submit battery and health telemetry heartbeat."""
    repo = FallGuardRepository(db)
    repo.get_or_create_device(device_id)
    status_rec = repo.update_device_status(
        device_id=device_id,
        battery_level=update.battery_level,
        connection_status=update.connection_status,
        sensor_valid=update.sensor_valid
    )
    return DeviceStatusResponse(
        device_id=status_rec.device_id,
        battery_level=status_rec.battery_level,
        connection_status=status_rec.connection_status,
        sensor_valid=status_rec.sensor_valid,
        last_heartbeat=status_rec.last_heartbeat
    )
