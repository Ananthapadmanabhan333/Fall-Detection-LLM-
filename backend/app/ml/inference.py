import os
import logging
from abc import ABC, abstractmethod
import numpy as np
import torch
from app.ml.model import FallDetectionCNN_LSTM
from app.ml.features import extract_features
from app.ml.preprocessing import normalize_imu_data

logger = logging.getLogger("fallguard")

class FallDetector(ABC):
    @abstractmethod
    def predict_probability(self, sequence: np.ndarray) -> float:
        """
        Compute fall probability from a 6-axis IMU window (time_steps, 6).
        Returns float between 0.0 and 1.0.
        """
        pass

    def predict(self, sequence: np.ndarray, threshold: float = 0.5) -> int:
        """
        Predict binary fall outcome (1 = Fall, 0 = Normal ADL).
        """
        prob = self.predict_probability(sequence)
        return 1 if prob >= threshold else 0

class RuleBasedFallbackDetector(FallDetector):
    """
    Biomechanical deterministic heuristic detector used for development,
    unit testing, and fail-safe operation when deep learning weights are absent.
    Calculates free-fall valley, impact shock wave, and post-fall immobility.
    """
    def predict_probability(self, sequence: np.ndarray) -> float:
        features = extract_features(sequence)
        max_acc = features["max_accel_g"]
        min_acc = features["min_accel_g"]
        max_gyro = features["max_gyro_rad_s"]
        post_motion = features["post_impact_motion"]

        score = 0.0

        # Criterion 1: Free fall weightlessness phase (< 0.65g)
        if min_acc < 0.65:
            score += 0.25
        if min_acc < 0.40:
            score += 0.10

        # Criterion 2: Impact shock peak (> 2.8g)
        if max_acc >= 2.8:
            score += 0.40
        elif max_acc >= 2.2:
            score += 0.20

        # Criterion 3: Significant rotational angular velocity during tumble
        if max_gyro >= 2.0:
            score += 0.15

        # Criterion 4: Post-impact immobility / low motion (< 0.08g)
        if post_motion < 0.08:
            score += 0.20
        elif post_motion > 0.30:
            score = max(0.0, score - 0.20)

        prob = min(1.0, max(0.0, score))
        return float(prob)

class PyTorchFallDetector(FallDetector):
    def __init__(self, model_path: str = "ml/models/fall_cnn_lstm.pt"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = FallDetectionCNN_LSTM().to(self.device)
        self.fallback = RuleBasedFallbackDetector()
        self.is_trained = False

        if os.path.exists(model_path):
            try:
                self.model.load_state_dict(torch.load(model_path, map_location=self.device))
                self.model.eval()
                self.is_trained = True
                logger.info(f"Loaded PyTorch fall detection checkpoint from {model_path}")
            except Exception as e:
                logger.warning(f"Failed to load checkpoint {model_path}: {e}. Defaulting to rule-based fallback.")
        else:
            logger.info(f"Checkpoint {model_path} not found. Running in rule-based baseline mode.")

    def predict_probability(self, sequence: np.ndarray) -> float:
        rule_prob = self.fallback.predict_probability(sequence)
        if not self.is_trained:
            return rule_prob

        normed = normalize_imu_data(sequence)
        tensor = torch.from_numpy(normed).unsqueeze(0).float().to(self.device)
        with torch.no_grad():
            prob = self.model(tensor).item()
        # Ensure that unmistakable physical impacts with immobility are never zeroed out by deep learning
        if rule_prob >= 0.70:
            return float(max(prob, rule_prob))
        return float(prob)

_detector_instance: FallDetector = None

def get_fall_detector() -> FallDetector:
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = PyTorchFallDetector()
    return _detector_instance
