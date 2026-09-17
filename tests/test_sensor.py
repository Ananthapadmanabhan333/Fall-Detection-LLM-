import pytest
from datetime import datetime, timezone
from app.schemas.sensor import SensorPacket, AccelerometerData, GyroscopeData

def test_valid_sensor_packet():
    packet = SensorPacket(
        device_id="DEV001",
        user_id="USER001",
        timestamp=datetime.now(timezone.utc),
        accelerometer=AccelerometerData(x=0.12, y=0.42, z=9.71),
        gyroscope=GyroscopeData(x=0.12, y=0.03, z=0.41),
        is_synthetic=False
    )
    assert packet.device_id == "DEV001"
    assert packet.accelerometer.z == 9.71
    assert packet.gyroscope.y == 0.03

def test_sensor_packet_nan_rejection():
    with pytest.raises(ValueError):
        AccelerometerData(x=float("nan"), y=0.0, z=9.8)

def test_sensor_packet_inf_rejection():
    with pytest.raises(ValueError):
        GyroscopeData(x=float("inf"), y=0.0, z=0.0)

def test_sensor_packet_extreme_unrealistic_values():
    with pytest.raises(ValueError):
        AccelerometerData(x=999.0, y=0.0, z=0.0)
