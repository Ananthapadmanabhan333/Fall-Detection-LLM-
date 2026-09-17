import os
import glob
import logging
from typing import List, Dict, Any
from app.rag.retriever import get_protocol_retriever

logger = logging.getLogger("fallguard")

def ingest_protocols(docs_dir: str = "rag/documents") -> Dict[str, Any]:
    """
    Ingest all markdown protocol documents into ChromaDB.
    """
    retriever = get_protocol_retriever()
    md_files = glob.glob(os.path.join(docs_dir, "**", "*.md"), recursive=True)

    if not md_files:
        logger.warning(f"No markdown documents found in {docs_dir}")
        return {"status": "warning", "ingested_count": 0, "files": []}

    ids = []
    documents = []
    metadatas = []

    for file_path in md_files:
        filename = os.path.basename(file_path)
        protocol_category = os.path.basename(os.path.dirname(file_path))
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Split into sections based on headers
        sections = content.split("## ")
        title = sections[0].strip().replace("# ", "")

        for i, sec in enumerate(sections[1:], start=1):
            sec_lines = sec.strip().split("\n")
            sec_heading = sec_lines[0].strip()
            sec_body = "\n".join(sec_lines[1:]).strip()

            chunk_id = f"{filename}_{i}"
            chunk_text = f"Protocol: {title}\nSection: {sec_heading}\n{sec_body}"

            ids.append(chunk_id)
            documents.append(chunk_text)
            metadatas.append({
                "source_file": filename,
                "category": protocol_category,
                "title": title,
                "section": sec_heading
            })

    # Upsert into ChromaDB
    retriever.collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

    logger.info(f"Successfully ingested {len(ids)} protocol chunks from {len(md_files)} documents.")
    return {
        "status": "success",
        "ingested_chunks": len(ids),
        "files_processed": len(md_files),
        "filenames": [os.path.basename(f) for f in md_files]
    }

if __name__ == "__main__":
    result = ingest_protocols()
    print("Ingestion Result:", result)
