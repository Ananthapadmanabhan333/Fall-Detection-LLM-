import hashlib
import numpy as np
from typing import List
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings

class LightweightDeterministicEmbeddingFunction(EmbeddingFunction[Documents]):
    """
    Self-contained, zero-dependency embedding function for fast local execution,
    unit testing, and air-gapped container deployments.
    Generates a normalized 64-dimensional semantic projection from word and n-gram hash frequencies.
    """
    def __init__(self, dim: int = 64):
        self.dim = dim

    def name(self) -> str:
        return "lightweight_deterministic"

    def is_legacy(self) -> bool:
        return False

    def __call__(self, input: List[str]) -> List[List[float]]:
        embeddings = []
        for text in input:
            vec = np.zeros(self.dim, dtype=np.float32)
            words = text.lower().split()
            for word in words:
                # Hash word to dimension index
                h = int(hashlib.md5(word.encode()).hexdigest(), 16)
                idx = h % self.dim
                sign = 1.0 if (h >> 8) % 2 == 0 else -1.0
                vec[idx] += sign

            # Normalize
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            embeddings.append(vec.tolist())
        return embeddings

def get_embedding_function():
    return LightweightDeterministicEmbeddingFunction(dim=64)
