import os
import logging
from typing import List, Dict, Any
import chromadb
from app.core.config import settings
from app.rag.embeddings import get_embedding_function

logger = logging.getLogger("fallguard")

COLLECTION_NAME = "fallguard_protocols"

class ProtocolRetriever:
    def __init__(self, persist_dir: str = settings.CHROMA_PERSIST_DIR):
        os.makedirs(persist_dir, exist_ok=True)
        try:
            self.client = chromadb.PersistentClient(path=persist_dir)
            self.embedding_fn = get_embedding_function()
            self.collection = self.client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=self.embedding_fn
            )
            logger.info(f"ChromaDB initialized. Collection '{COLLECTION_NAME}' has {self.collection.count()} documents.")
        except Exception as e:
            logger.warning(f"Could not connect to persistent ChromaDB: {e}. Using EphemeralClient.")
            self.client = chromadb.EphemeralClient()
            self.embedding_fn = get_embedding_function()
            self.collection = self.client.get_or_create_collection(
                name=COLLECTION_NAME,
                embedding_function=self.embedding_fn
            )

    def retrieve_protocol(self, query: str, n_results: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieve relevant protocol chunks with citations.
        """
        if self.collection.count() == 0:
            logger.info("ChromaDB collection is empty. Returning default protocol citation.")
            return [{
                "id": "SOP-EMERG-001",
                "content": "Emergency Escalation Protocol: Verify high-impact threshold (>=2.8g) and immobility. Escalate to primary caregiver.",
                "metadata": {"title": "Emergency Escalation Protocol", "source": "built-in"}
            }]

        results = self.collection.query(
            query_texts=[query],
            n_results=min(n_results, self.collection.count())
        )

        protocols = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            ids = results["ids"][0]
            metadatas = results["metadatas"][0] if "metadatas" in results and results["metadatas"] else [{}] * len(docs)

            for doc_id, doc_text, meta in zip(ids, docs, metadatas):
                protocols.append({
                    "id": doc_id,
                    "content": doc_text,
                    "metadata": meta
                })

        return protocols

_retriever_instance: ProtocolRetriever = None

def get_protocol_retriever() -> ProtocolRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = ProtocolRetriever()
    return _retriever_instance
