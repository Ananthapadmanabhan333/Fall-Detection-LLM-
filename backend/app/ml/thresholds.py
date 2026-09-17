"""
Configurable Biomechanical & Signal Processing Thresholds for Fall Detection
Note: Research & prototype parameters - NOT clinically certified.
"""

from app.core.config import settings

# Sampling & Windowing
DEFAULT_SAMPLING_RATE_HZ: int = settings.SAMPLING_RATE_HZ
DEFAULT_WINDOW_SIZE_SAMPLES: int = settings.WINDOW_SIZE_SAMPLES
DEFAULT_STRIDE_SAMPLES: int = settings.STRIDE_SAMPLES

# Biomechanical Signal Thresholds (in g or m/s^2 normalized)
GRAVITY_G: float = 9.80665

# Free fall valley: Total acceleration drops below this threshold during initial drop phase
FREE_FALL_THRESHOLD_G: float = settings.FREE_FALL_VALLEY_THRESHOLD_G

# Impact peak: Sudden decelerative spike upon floor contact
IMPACT_PEAK_THRESHOLD_G: float = settings.IMPACT_ACCEL_PEAK_THRESHOLD_G

# Gyroscope angular velocity peak during rotational tumble (deg/s or rad/s)
ANGULAR_VELOCITY_PEAK_RAD_S: float = 3.5

# Post-impact motion: Variance or SVM of acceleration after impact indicating immobility
LOW_MOTION_THRESHOLD_G: float = settings.LOW_MOTION_THRESHOLD

# Fall Model Confidence Thresholds
HIGH_CONFIDENCE_THRESHOLD: float = settings.FALL_HIGH_CONFIDENCE_THRESHOLD
MEDIUM_CONFIDENCE_THRESHOLD: float = settings.FALL_MEDIUM_CONFIDENCE_THRESHOLD

# Timeouts & Durations
USER_CONFIRMATION_TIMEOUT_SECONDS: int = settings.USER_CONFIRMATION_TIMEOUT_SECONDS
DUPLICATE_EVENT_SUPPRESSION_SECONDS: int = settings.DUPLICATE_EVENT_SUPPRESSION_SECONDS
IMMOBILITY_WINDOW_SECONDS: int = settings.IMMOBILITY_DURATION_SECONDS
