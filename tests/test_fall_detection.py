import pytest
import numpy as np
import torch
from app.ml.preprocessing import compute_svm, apply_lowpass_filter, normalize_imu_data
from app.ml.features import extract_features
from app.ml.model import FallDetectionCNN_LSTM
from app.ml.inference import RuleBasedFallbackDetector, PyTorchFallDetector
from app.api.simulator import generate_synthetic_imu_sequence

def test_svm_computation():
    x = np.array([3.0])
    y = np.array([4.0])
    z = np.array([0.0])
    svm = compute_svm(x, y, z)
    assert np.isclose(svm[0], 5.0)

def test_lowpass_filtering():
    t = np.linspace(0, 1, 100)
    # High frequency 40Hz noise on 1Hz signal
    signal = np.sin(2 * np.pi * 1 * t) + 0.5 * np.sin(2 * np.pi * 40 * t)
    filtered = apply_lowpass_filter(signal, cutoff_hz=5.0, sampling_rate_hz=100)
    assert len(filtered) == len(signal)
    # Variance of filtered signal should be reduced due to noise attenuation
    assert np.var(filtered) < np.var(signal)

def test_feature_extraction():
    seq = generate_synthetic_imu_sequence("forward_fall", count=500)
    features = extract_features(seq)

    assert "max_accel_g" in features
    assert "min_accel_g" in features
    assert "post_impact_motion" in features
    assert features["max_accel_g"] >= 2.5
    assert features["impact_detected"] is True

def test_pytorch_model_architecture():
    model = FallDetectionCNN_LSTM()
    batch_size = 2
    time_steps = 500
    channels = 6
    x = torch.randn(batch_size, time_steps, channels)
    out = model(x)
    assert out.shape == (batch_size, 1)
    assert 0.0 <= out[0].item() <= 1.0

def test_fall_detector_inference():
    detector = RuleBasedFallbackDetector()
    fall_seq = generate_synthetic_imu_sequence("forward_fall", count=500)
    normal_seq = generate_synthetic_imu_sequence("walking", count=500)

    prob_fall = detector.predict_probability(fall_seq)
    prob_normal = detector.predict_probability(normal_seq)

    assert prob_fall >= 0.70
    assert prob_normal <= 0.35
    assert detector.predict(fall_seq, threshold=0.5) == 1
    assert detector.predict(normal_seq, threshold=0.5) == 0
