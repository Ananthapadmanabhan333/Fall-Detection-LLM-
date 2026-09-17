# IMU Sensor Troubleshooting & Fault Diagnosis (SOP-DEV-001)

## Sensor Signal Anomaly Indicators
- **Saturation / Pegged Values**: Accelerometer reading constantly exceeds +/- 16g or outputs NaN/null. Indicates I2C communication failure or hardware fault.
- **Sensor Detachment**: Sudden constant zero or negligible variance across all 6 axes while device is reported as 'worn'.
- **High-Frequency Jitter**: Uncharacteristic noise spikes in gyroscope without corresponding acceleration changes. May indicate mechanical vibration or loose harness.

## Action Steps
1. Flag device state as `DEGRADED` or `INVALID_SENSOR_DATA`.
2. Do not trigger high-confidence fall events solely on corrupted sensor readings.
3. Prompt user via mobile app to readjust or reboot the wearable.
