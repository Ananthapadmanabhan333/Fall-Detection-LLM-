import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.database.database import init_db
from app.mqtt.client import mqtt_service
from app.rag.ingest import ingest_protocols

from app.api.health import router as health_router
from app.api.sensor import router as sensor_router
from app.api.falls import router as falls_router
from app.api.agent import router as agent_router
from app.api.users import router as users_router
from app.api.devices import router as devices_router
from app.api.alerts import router as alerts_router
from app.api.simulator import router as simulator_router

# Set up logging
logger = setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    logger.info("Initializing FallGuard AI Database...")
    init_db()

    logger.info("Ingesting RAG Clinical/Device Protocols into Vector Database...")
    try:
        ingest_protocols()
    except Exception as e:
        logger.warning(f"RAG ingestion failed or skipped: {e}")

    logger.info("Starting MQTT client worker...")
    try:
        mqtt_service.start()
    except Exception as e:
        logger.warning(f"MQTT client failed to start: {e}")

    yield

    # Shutdown tasks
    logger.info("Shutting down MQTT client...")
    mqtt_service.stop()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Privacy-Preserving Wearable Fall Detection & Agentic LLM Orchestration Platform (Research Prototype)",
    lifespan=lifespan
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router)
app.include_router(sensor_router)
app.include_router(falls_router)
app.include_router(agent_router)
app.include_router(users_router)
app.include_router(devices_router)
app.include_router(alerts_router)
app.include_router(simulator_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
