from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.database import get_db
from app.ml.inference import get_fall_detector

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint returning system status, database connectivity,
    and ML detector operational state.
    """
    db_healthy = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_healthy = False

    detector = get_fall_detector()
    detector_mode = "PyTorch-DeepLearning" if getattr(detector, "is_trained", False) else "RuleBased-Biomechanical"

    return {
        "status": "healthy" if db_healthy else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "connected" if db_healthy else "disconnected",
        "ml_detector": detector_mode,
        "mode": "Research & Prototype System (Non-Certified Medical Device)",
        "version": "0.1.0"
    }
