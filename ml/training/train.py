import os
import argparse
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from app.ml.model import FallDetectionCNN_LSTM

class IMUDataset(Dataset):
    def __init__(self, sequences: np.ndarray, labels: np.ndarray):
        self.sequences = torch.tensor(sequences, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.float32).unsqueeze(1)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return self.sequences[idx], self.labels[idx]

def generate_synthetic_training_data(n_samples: int = 500, seq_len: int = 500):
    """
    Generate synthetic dataset mimicking normal ADL (walking, sitting, running)
    and falls (free-fall, high-impact spike, immobility) for training demonstration.
    """
    print(f"Generating {n_samples} synthetic IMU training samples (sequence length={seq_len})...")
    X = []
    y = []

    for _ in range(n_samples):
        is_fall = np.random.rand() > 0.5
        t = np.linspace(0, 5, seq_len)
        data = np.zeros((seq_len, 6))

        # Baseline noise + gravity on Z
        data[:, 0] = np.random.normal(0, 0.1, seq_len)
        data[:, 1] = np.random.normal(0, 0.1, seq_len)
        data[:, 2] = np.random.normal(1.0, 0.1, seq_len)  # 1g gravity

        if is_fall:
            impact_idx = np.random.randint(150, 350)
            # Free fall (0.2s before impact)
            data[impact_idx-20:impact_idx, 0:3] *= 0.2
            # Impact spike
            data[impact_idx:impact_idx+10, 0:3] += np.random.uniform(2.5, 5.0, (10, 3))
            # Gyro tumble
            data[impact_idx-10:impact_idx+15, 3:6] += np.random.uniform(3.0, 6.0, (25, 3))
            # Post impact low motion
            data[impact_idx+15:, 0:3] = np.random.normal(0.05, 0.02, (seq_len - (impact_idx + 15), 3))
            y.append(1.0)
        else:
            # ADL - walking / movement sine waves
            freq = np.random.uniform(1.5, 3.0)
            data[:, 0] += 0.4 * np.sin(2 * np.pi * freq * t)
            data[:, 2] += 0.3 * np.cos(2 * np.pi * freq * t)
            data[:, 3:6] += np.random.normal(0, 0.5, (seq_len, 6 - 3))
            y.append(0.0)

        X.append(data)

    return np.array(X), np.array(y)

def train_model(
    epochs: int = 15,
    batch_size: int = 32,
    lr: float = 0.001,
    output_dir: str = "ml/models"
):
    os.makedirs(output_dir, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training using device: {device}")

    X, y = generate_synthetic_training_data(n_samples=600, seq_len=500)

    # Train/Val/Test Split (70% / 15% / 15%)
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.30, random_state=42, stratify=y)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp)

    # Save test partition for evaluation script
    np.save(os.path.join(output_dir, "test_X.npy"), X_test)
    np.save(os.path.join(output_dir, "test_y.npy"), y_test)

    train_dataset = IMUDataset(X_train, y_train)
    val_dataset = IMUDataset(X_val, y_val)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    model = FallDetectionCNN_LSTM().to(device)

    # Calculate class balancing weight
    n_pos = np.sum(y_train == 1.0)
    n_neg = len(y_train) - n_pos
    pos_weight = torch.tensor([n_neg / max(n_pos, 1)], dtype=torch.float32).to(device)

    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    best_val_loss = float("inf")
    model_path = os.path.join(output_dir, "fall_cnn_lstm.pt")

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        for seqs, labels in train_loader:
            seqs, labels = seqs.to(device), labels.to(device)
            optimizer.zero_grad()
            preds = model(seqs)
            loss = criterion(preds, labels)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * len(labels)

        train_loss /= len(train_dataset)

        # Validation
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for seqs, labels in val_loader:
                seqs, labels = seqs.to(device), labels.to(device)
                preds = model(seqs)
                loss = criterion(preds, labels)
                val_loss += loss.item() * len(labels)

        val_loss /= len(val_dataset)

        print(f"Epoch {epoch:02d}/{epochs:02d} - Train Loss: {train_loss:.4f} - Val Loss: {val_loss:.4f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), model_path)
            print(f"  --> Saved new best checkpoint to {model_path}")

    print("Model training complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train FallGuard 1D-CNN+LSTM Model")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=0.001)
    args = parser.parse_args()

    train_model(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
