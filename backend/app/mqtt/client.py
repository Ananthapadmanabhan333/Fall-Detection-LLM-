import logging
import threading
import paho.mqtt.client as mqtt
from app.core.config import settings
from app.mqtt.handlers import handle_imu_message

logger = logging.getLogger("fallguard")

class MQTTService:
    def __init__(self):
        # Support both paho-mqtt v1 and v2 API
        try:
            self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="fallguard_backend")
        except AttributeError:
            self.client = mqtt.Client(client_id="fallguard_backend")

        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect
        self._thread = None
        self._is_running = False

    def _on_connect(self, client, userdata, flags, reason_code, properties=None):
        logger.info(f"Connected to MQTT broker at {settings.MQTT_BROKER_HOST}:{settings.MQTT_BROKER_PORT} with code {reason_code}")
        topic = f"{settings.MQTT_TOPIC_PREFIX}/+/imu"
        client.subscribe(topic)
        logger.info(f"Subscribed to MQTT topic pattern: {topic}")

    def _on_message(self, client, userdata, msg):
        try:
            payload = msg.payload.decode("utf-8")
            handle_imu_message(msg.topic, payload)
        except Exception as e:
            logger.error(f"Error handling MQTT message on {msg.topic}: {e}")

    def _on_disconnect(self, client, userdata, disconnect_flags, reason_code, properties=None):
        logger.warning(f"Disconnected from MQTT broker: {reason_code}")

    def start(self):
        if self._is_running:
            return
        try:
            logger.info(f"Connecting to MQTT broker at {settings.MQTT_BROKER_HOST}:{settings.MQTT_BROKER_PORT}...")
            self.client.connect(settings.MQTT_BROKER_HOST, settings.MQTT_BROKER_PORT, keepalive=settings.MQTT_KEEP_ALIVE)
            self.client.loop_start()
            self._is_running = True
        except Exception as e:
            logger.warning(f"Could not connect to MQTT broker ({settings.MQTT_BROKER_HOST}:{settings.MQTT_BROKER_PORT}): {e}. Ingestion will proceed via REST API.")

    def stop(self):
        if self._is_running:
            self.client.loop_stop()
            self.client.disconnect()
            self._is_running = False
            logger.info("MQTT client stopped.")

mqtt_service = MQTTService()
