# FallGuard AI ESP32 Wearable Firmware

## Hardware Components
1. **Microcontroller**: ESP32 DevKit V1 (30-pin or 36-pin)
2. **IMU Sensor**: MPU6050 or ICM-42688 6-Axis Motion Sensor
3. **Power Supply**: 3.7V LiPo Battery + TP4056 charging circuit / 5V USB
4. **Status LED**: GPIO 2 (Built-in Blue LED)
5. **Battery Monitor Divider**: 100kΩ / 100kΩ voltage divider connected to GPIO 34 (ADC1)

---

## Wiring Diagram

| ESP32 Pin | MPU6050 Pin | Description |
|-----------|-------------|-------------|
| 3.3V      | VCC         | 3.3V Power Supply |
| GND       | GND         | Ground |
| GPIO 21   | SDA         | I2C Data Line |
| GPIO 22   | SCL         | I2C Clock Line |
| GPIO 34   | BAT_DIV     | Analog Battery Voltage Sensing |

> [!NOTE]
> Ensure 4.7kΩ pull-up resistors are installed on SDA and SCL lines if your breakout board does not have onboard pull-ups.

---

## Flashing Instructions (PlatformIO)

1. Open VS Code with PlatformIO extension installed.
2. Open directory `firmware/esp32`.
3. Update `WIFI_SSID`, `WIFI_PASS`, and `MQTT_SERVER` in `src/main.cpp`.
4. Connect ESP32 via Micro-USB cable.
5. Build and upload:
```bash
pio run --target upload
```
6. Open serial monitor at 115200 baud:
```bash
pio device monitor -b 115200
```
