import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "FallGuard AI"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "sqlite:///./fallguard.db"

    # MQTT
    MQTT_BROKER_HOST: str = "localhost"
    MQTT_BROKER_PORT: int = 1883
    MQTT_KEEP_ALIVE: int = 60
    MQTT_TOPIC_PREFIX: str = "fallguard"

    # LLM Provider
    LLM_PROVIDER: Literal["mock", "openai", "gemini", "anthropic"] = "mock"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_TEMPERATURE: float = 0.0

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    CHROMA_PERSIST_DIR: str = "./chroma_data"

    # Notifications & Location
    NOTIFICATION_PROVIDER: Literal["mock", "twilio", "fcm", "email"] = "mock"
    LOCATION_PROVIDER: Literal["mock", "gps", "ip"] = "mock"

    # Security
    JWT_SECRET: str = "super-secret-fallguard-key-change-in-production-2026"
    API_KEY_HEADER: str = "X-FallGuard-Key"
    ALLOW_ANONYMOUS_DEV: bool = True

    # Signal Processing & ML Thresholds
    SAMPLING_RATE_HZ: int = 100
    WINDOW_SIZE_SAMPLES: int = 500  # 5 seconds at 100Hz
    STRIDE_SAMPLES: int = 50        # 0.5s stride
    LOW_PASS_CUTOFF_HZ: float = 5.0
    FALL_HIGH_CONFIDENCE_THRESHOLD: float = 0.85
    FALL_MEDIUM_CONFIDENCE_THRESHOLD: float = 0.50
    IMPACT_ACCEL_PEAK_THRESHOLD_G: float = 2.8
    FREE_FALL_VALLEY_THRESHOLD_G: float = 0.5
    LOW_MOTION_THRESHOLD: float = 0.08
    IMMOBILITY_DURATION_SECONDS: int = 10
    USER_CONFIRMATION_TIMEOUT_SECONDS: int = 30
    DUPLICATE_EVENT_SUPPRESSION_SECONDS: int = 15

settings = Settings()
