import torch
import torch.nn as nn

class FallDetectionCNN_LSTM(nn.Module):
    """
    Hybrid 1D-CNN + LSTM architecture for time-series 6-axis IMU fall detection.
    
    Sequence input: (batch_size, time_steps, 6)
    Conv1D expects: (batch_size, channels=6, time_steps)
    """
    def __init__(
        self,
        input_channels: int = 6,
        conv_filters: int = 32,
        lstm_hidden: int = 64,
        lstm_layers: int = 1,
        dropout: float = 0.3
    ):
        super(FallDetectionCNN_LSTM, self).__init__()

        # First 1D Conv Block
        self.conv1 = nn.Conv1d(
            in_channels=input_channels,
            out_channels=conv_filters,
            kernel_size=5,
            padding=2
        )
        self.bn1 = nn.BatchNorm1d(conv_filters)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool1d(kernel_size=2)

        # Second 1D Conv Block
        self.conv2 = nn.Conv1d(
            in_channels=conv_filters,
            out_channels=conv_filters * 2,
            kernel_size=5,
            padding=2
        )
        self.bn2 = nn.BatchNorm1d(conv_filters * 2)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool1d(kernel_size=2)

        # Temporal Recurrent Block
        # Input to LSTM: (batch_size, time_steps / 4, conv_filters * 2)
        self.lstm = nn.LSTM(
            input_size=conv_filters * 2,
            hidden_size=lstm_hidden,
            num_layers=lstm_layers,
            batch_first=True,
            bidirectional=False
        )

        # Classification Head
        self.dropout = nn.Dropout(dropout)
        self.fc1 = nn.Linear(lstm_hidden, 32)
        self.relu3 = nn.ReLU()
        self.classifier = nn.Linear(32, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Input shape: [B, T, C] -> Permute to [B, C, T] for Conv1d
        x = x.permute(0, 2, 1)

        # Conv1
        x = self.pool1(self.relu1(self.bn1(self.conv1(x))))
        # Conv2
        x = self.pool2(self.relu2(self.bn2(self.conv2(x))))

        # Permute back for LSTM: [B, C, T_down] -> [B, T_down, C]
        x = x.permute(0, 2, 1)

        # LSTM
        lstm_out, (h_n, _) = self.lstm(x)
        # Take the last hidden state: [B, lstm_hidden]
        last_step = h_n[-1]

        # Fully connected
        out = self.dropout(last_step)
        out = self.relu3(self.fc1(out))
        logits = self.classifier(out)
        prob = self.sigmoid(logits)

        return prob
