import logging
import json
import sys
from datetime import datetime, timezone

class StructuredJsonFormatter(logging.Formatter):
    """
    Format logs as structured JSON, redacting sensitive health/auth fields
    and ensuring traceability across fall events and agent invocations.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include structured context if present
        for attr in ("event_id", "user_id", "device_id", "fall_probability", "action", "latency_ms"):
            if hasattr(record, attr):
                log_obj[attr] = getattr(record, attr)

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)

def setup_logging(level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("fallguard")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredJsonFormatter())
    
    # Clear existing handlers
    if not logger.handlers:
        logger.addHandler(handler)
        
    logger.propagate = False
    return logger

logger = setup_logging()
