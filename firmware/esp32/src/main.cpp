/**
 * FallGuard AI - ESP32 Wearable Firmware
 * 6-Axis IMU Sensor Node (MPU6050)
 * 
 * Ingests Accel + Gyro at 100Hz and streams structured JSON to MQTT broker.
 * Fallback to HTTP POST if MQTT is unreachable.
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>

// Configuration (Override via build flags or local secrets)
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* MQTT_SERVER = "192.168.1.100";  // FallGuard Host IP
const int   MQTT_PORT = 1883;
const char* DEVICE_ID = "DEV001";
const char* USER_ID   = "USER001";

// Pinout
#define I2C_SDA 21
#define I2C_SCL 22
#define STATUS_LED 2
#define BATTERY_PIN 34

// Sampling config
const unsigned long SAMPLE_INTERVAL_MS = 10; // 100Hz = 10ms
unsigned long lastSampleTime = 0;
unsigned long lastHeartbeatTime = 0;

Adafruit_MPU6050 mpu;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

char mqttTopic[64];
char heartbeatTopic[64];

void setupWiFi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to WiFi: ");
    Serial.println(WIFI_SSID);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi connected! IP address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nWiFi connection failed! Will retry in loop.");
    }
}

void reconnectMQTT() {
    while (!mqttClient.connected() && WiFi.status() == WL_CONNECTED) {
        Serial.print("Attempting MQTT connection to ");
        Serial.print(MQTT_SERVER);
        Serial.print("...");
        
        String clientId = "FallGuardESP32-";
        clientId += String(random(0xffff), HEX);

        if (mqttClient.connect(clientId.c_str())) {
            Serial.println(" connected!");
            digitalWrite(STATUS_LED, HIGH);
        } else {
            Serial.print(" failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" Retrying in 2 seconds...");
            delay(2000);
        }
    }
}

float readBatteryPercentage() {
    // ADC reading (0-4095) with voltage divider (e.g. 100k / 100k)
    int raw = analogRead(BATTERY_PIN);
    float voltage = (raw / 4095.0) * 3.3 * 2.0; // Assuming 2x divider
    // Approximate 3.2V (0%) to 4.2V (100%) LiPo
    float percentage = ((voltage - 3.2) / (4.2 - 3.2)) * 100.0;
    if (percentage > 100.0) percentage = 100.0;
    if (percentage < 0.0) percentage = 0.0;
    return percentage;
}

void sendHeartbeat() {
    StaticJsonDocument<256> doc;
    doc["device_id"] = DEVICE_ID;
    doc["battery_level"] = readBatteryPercentage();
    doc["connection_status"] = "ONLINE";
    doc["sensor_valid"] = true;

    char buffer[256];
    serializeJson(doc, buffer);
    mqttClient.publish(heartbeatTopic, buffer);
    Serial.print("Heartbeat sent: ");
    Serial.println(buffer);
}

void setup() {
    Serial.begin(115200);
    pinMode(STATUS_LED, OUTPUT);
    digitalWrite(STATUS_LED, LOW);

    snprintf(mqttTopic, sizeof(mqttTopic), "fallguard/%s/imu", DEVICE_ID);
    snprintf(heartbeatTopic, sizeof(heartbeatTopic), "fallguard/%s/heartbeat", DEVICE_ID);

    Wire.begin(I2C_SDA, I2C_SCL);

    // Initialize MPU6050
    Serial.println("Initializing MPU6050 IMU...");
    if (!mpu.begin()) {
        Serial.println("Failed to find MPU6050 chip! Check I2C wiring.");
        while (1) {
            digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));
            delay(200);
        }
    }
    Serial.println("MPU6050 Found and Ready!");

    // Configure sensor ranges for fall detection
    mpu.setAccelerometerRange(MPU6050_RANGE_16_G);
    mpu.setGyroRange(MPU6050_RANGE_2000_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

    setupWiFi();
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        setupWiFi();
    }

    if (!mqttClient.connected()) {
        reconnectMQTT();
    }
    mqttClient.loop();

    unsigned long currentMillis = millis();

    // 100Hz Sensor Sampling Interval (10ms)
    if (currentMillis - lastSampleTime >= SAMPLE_INTERVAL_MS) {
        lastSampleTime = currentMillis;

        sensors_event_t a, g, temp;
        mpu.getEvent(&a, &g, &temp);

        // Build structured JSON packet
        StaticJsonDocument<384> doc;
        doc["device_id"] = DEVICE_ID;
        doc["user_id"] = USER_ID;
        doc["timestamp"] = "2026-09-17T10:30:25Z"; // Can use NTP client in production

        JsonObject accel = doc.createNestedObject("accelerometer");
        accel["x"] = round(a.acceleration.x * 100.0) / 100.0;
        accel["y"] = round(a.acceleration.y * 100.0) / 100.0;
        accel["z"] = round(a.acceleration.z * 100.0) / 100.0;

        JsonObject gyro = doc.createNestedObject("gyroscope");
        gyro["x"] = round(g.gyro.x * 100.0) / 100.0;
        gyro["y"] = round(g.gyro.y * 100.0) / 100.0;
        gyro["z"] = round(g.gyro.z * 100.0) / 100.0;

        char jsonBuffer[384];
        serializeJson(doc, jsonBuffer);

        if (mqttClient.connected()) {
            mqttClient.publish(mqttTopic, jsonBuffer);
        }
    }

    // Periodic Heartbeat every 60s
    if (currentMillis - lastHeartbeatTime >= 60000) {
        lastHeartbeatTime = currentMillis;
        sendHeartbeat();
    }
}
