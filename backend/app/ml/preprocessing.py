import numpy as np
from scipy.signal import butter, filtfilt
from typing import Tuple
from app.ml.thresholds import GRAVITY_G, DEFAULT_SAMPLING_RATE_HZ

def compute_svm(x: np.ndarray, y: np.ndarray, z: np.ndarray) -> np.ndarray:
    """
    Compute Signal Vector Magnitude: SVM = sqrt(x^2 + y^2 + z^2)
    """
    return np.sqrt(x**2 + y**2 + z**2)

def apply_lowpass_filter(
    data: np.ndarray,
    cutoff_hz: float = 5.0,
    sampling_rate_hz: int = DEFAULT_SAMPLING_RATE_HZ,
    order: int = 2
) -> np.ndarray:
    """
    Apply zero-phase Butterworth low-pass filter to remove high-frequency sensor noise.
    """
    if len(data) <= 15:  # Minimum samples needed for filtfilt
        return data

    nyquist = 0.5 * sampling_rate_hz
    normal_cutoff = cutoff_hz / nyquist
    b, a = butter(order, normal_cutoff, btype='low', analog=False)

    if data.ndim == 1:
        return filtfilt(b, a, data)
    else:
        filtered = np.zeros_like(data)
        for i in range(data.shape[1]):
            filtered[:, i] = filtfilt(b, a, data[:, i])
        return filtered

def normalize_imu_data(sequence: np.ndarray) -> np.ndarray:
    """
    Standardize 6-axis IMU sequence [batch/time, 6].
    Columns 0:3 are Accel (m/s^2 or g), Columns 3:6 are Gyro (rad/s or deg/s).
    Normalizes accelerometer by standard gravity (9.80665) if in m/s^2.
    """
    normed = sequence.copy().astype(np.float32)
    # Check mean vector magnitude of acceleration: if > 3.0, readings are in m/s^2
    svm_acc = np.sqrt(normed[:, 0]**2 + normed[:, 1]**2 + normed[:, 2]**2)
    if np.mean(svm_acc) > 3.0:
        normed[:, 0:3] = normed[:, 0:3] / GRAVITY_G

    return normed
