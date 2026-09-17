# Battery & Wearable Connectivity Protocols (SOP-DEV-002)

## Power Thresholds
- **Normal Operating State**: Battery > 30%. Routine 100Hz IMU sampling and normal MQTT heartbeat (every 60s).
- **Low Power State**: Battery <= 20%. Trigger non-urgent notification to caregiver to recharge wearable.
- **Critical Battery**: Battery <= 5%. Prepare safe shutdown, transmit final status packet, alert dashboard.

## Heartbeat & Offline Detection
- If no MQTT heartbeat is received for 180 seconds, mark device as `DEVICE_OFFLINE`.
- Distinguish offline device from physical fall: Do NOT initiate 911 emergency workflow for simple connectivity drop unless preceded by high-impact telemetry.
