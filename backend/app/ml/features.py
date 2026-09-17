import numpy as np
from typing import Dict, Any
from app.ml.preprocessing import compute_svm, apply_lowpass_filter, normalize_imu_data

def extract_features(sequence: np.ndarray, sampling_rate_hz: int = 100) -> Dict[str, Any]:
    """
    Extract statistical and biomechanical features from a 6-axis IMU window.
    sequence: (time_steps, 6) containing [ax, ay, az, gx, gy, gz]
    """
    normed = normalize_imu_data(sequence)
    filtered = apply_lowpass_filter(normed, cutoff_hz=5.0, sampling_rate_hz=sampling_rate_hz)

    ax, ay, az = filtered[:, 0], filtered[:, 1], filtered[:, 2]
    gx, gy, gz = filtered[:, 3], filtered[:, 4], filtered[:, 5]

    svm_acc = compute_svm(ax, ay, az)
    svm_gyro = compute_svm(gx, gy, gz)

    # Jerk: discrete time derivative of acceleration SVM
    dt = 1.0 / sampling_rate_hz
    jerk = np.abs(np.diff(svm_acc) / dt)

    # Key biomechanical milestones
    max_acc = float(np.max(svm_acc))
    min_acc = float(np.min(svm_acc))
    max_gyro = float(np.max(svm_gyro))
    peak_idx = int(np.argmax(svm_acc))

    # Post-impact window (samples following the impact peak after shock wave settles)
    post_impact_start = min(peak_idx + 25, len(svm_acc) - 10)
    post_impact_samples = svm_acc[post_impact_start:]
    if len(post_impact_samples) >= 10:
        post_impact_motion = float(np.std(post_impact_samples))
    else:
        post_impact_motion = float(np.std(svm_acc))

    # Signal energy
    energy_acc = float(np.sum(svm_acc ** 2) / len(svm_acc))
    energy_gyro = float(np.sum(svm_gyro ** 2) / len(svm_gyro))

    return {
        "max_accel_g": max_acc,
        "min_accel_g": min_acc,
        "max_gyro_rad_s": max_gyro,
        "max_jerk_g_s": float(np.max(jerk)) if len(jerk) > 0 else 0.0,
        "post_impact_motion": post_impact_motion,
        "energy_acc": energy_acc,
        "energy_gyro": energy_gyro,
        "impact_detected": bool(max_acc >= 2.8 and min_acc <= 0.65),
    }
