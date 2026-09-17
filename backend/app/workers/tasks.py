import logging
from app.database.database import SessionLocal
from app.services.device_monitor import DeviceMonitor

logger = logging.getLogger("fallguard")

def run_periodic_device_health_check():
    """
    Background worker task to check for stale device heartbeats
    and flag offline devices deterministically.
    """
    db = SessionLocal()
    try:
        monitor = DeviceMonitor(db)
        offline_devices = monitor.check_offline_devices(timeout_minutes=5)
        if offline_devices:
            logger.warning(f"Periodic health check detected offline devices: {offline_devices}")
    except Exception as e:
        logger.error(f"Error during periodic health check: {e}")
    finally:
        db.close()
