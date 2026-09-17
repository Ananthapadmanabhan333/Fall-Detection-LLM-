import os
import time
import argparse
import numpy as np
import torch
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support, accuracy_score, roc_auc_score
from app.ml.model import FallDetectionCNN_LSTM

def evaluate_model(
    model_path: str = "ml/models/fall_cnn_lstm.pt",
    test_X_path: str = "ml/models/test_X.npy",
    test_y_path: str = "ml/models/test_y.npy",
    threshold: float = 0.5
):
    print("=" * 60)
    print("FALLGUARD AI - MODEL EVALUATION REPORT")
    print("Notice: Prototype & Research Evaluation - Not clinically certified")
    print("=" * 60)

    if not os.path.exists(model_path):
        print(f"Error: Model checkpoint not found at {model_path}. Run train.py first.")
        return

    if not os.path.exists(test_X_path) or not os.path.exists(test_y_path):
        print(f"Error: Test split arrays not found. Run train.py first.")
        return

    X_test = np.load(test_X_path)
    y_test = np.load(test_y_path)
    print(f"Dataset partition: Test Set ({len(y_test)} samples, sequence length={X_test.shape[1]})")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = FallDetectionCNN_LSTM().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    tensor_X = torch.tensor(X_test, dtype=torch.float32).to(device)

    # Measure inference latency
    start_time = time.perf_counter()
    with torch.no_grad():
        probs = model(tensor_X).cpu().numpy().flatten()
    total_time = time.perf_counter() - start_time
    avg_latency_ms = (total_time / len(X_test)) * 1000.0

    preds = (probs >= threshold).astype(int)
    y_true = y_test.astype(int)

    # Metrics computation
    acc = accuracy_score(y_true, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, preds, average="binary", zero_division=0)
    cm = confusion_matrix(y_true, preds)
    tn, fp, fn, tp = cm.ravel()

    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0.0

    try:
        auc = roc_auc_score(y_true, probs)
    except Exception:
        auc = float("nan")

    print("\n--- PERFORMANCE METRICS ---")
    print(f"Accuracy:                {acc * 100:.2f}%")
    print(f"Precision:               {precision:.4f}")
    print(f"Recall:                  {recall:.4f}")
    print(f"F1 Score:                {f1:.4f}")
    print(f"Sensitivity (Recall):    {sensitivity:.4f}")
    print(f"Specificity:             {specificity:.4f}")
    print(f"False Positive Rate:     {fpr:.4f}")
    print(f"False Negative Rate:     {fnr:.4f}")
    print(f"ROC-AUC:                 {auc:.4f}")
    print(f"Avg Inference Latency:   {avg_latency_ms:.2f} ms per 5s window")

    print("\n--- CONFUSION MATRIX ---")
    print(f"                 Predicted ADL    Predicted Fall")
    print(f"Actual ADL:          TN={tn:<6}        FP={fp:<6}")
    print(f"Actual Fall:         FN={fn:<6}        TP={tp:<6}")

    print("\n--- DEPLOYMENT RECOMMENDATION ---")
    if sensitivity >= 0.90 and specificity >= 0.85:
        print("[STATUS] Model meets experimental acceptance thresholds for prototype deployment.")
    else:
        print("[CAUTION] Model performance below target threshold. Collect additional training data.")

    print("=" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--threshold", type=float, default=0.5)
    args = parser.parse_args()
    evaluate_model(threshold=args.threshold)
