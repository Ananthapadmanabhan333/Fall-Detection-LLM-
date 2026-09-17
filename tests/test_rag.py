import pytest
from app.rag.ingest import ingest_protocols
from app.rag.retriever import get_protocol_retriever

def test_rag_ingest_and_retrieve():
    # Ingest protocols
    res = ingest_protocols("rag/documents")
    assert res["status"] == "success"
    assert res["ingested_chunks"] > 0

    # Retrieve relevant protocol
    retriever = get_protocol_retriever()
    protocols = retriever.retrieve_protocol("critical fall with immobility escalation", n_results=2)

    assert len(protocols) > 0
    top_doc = protocols[0]
    assert "id" in top_doc
    assert "content" in top_doc
    assert "metadata" in top_doc
