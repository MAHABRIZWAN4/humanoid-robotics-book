from typing import List, Dict, Any
from qdrant_client.http.models import Distance, VectorParams
from ..config import qdrant_client, COLLECTION_NAME
from .loader import Document

async def recreate_qdrant_collection(vector_size: int = 1024):
    await qdrant_client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )
    print(f"Collection '{COLLECTION_NAME}' recreated with vector size {vector_size}.")

async def upsert_documents_to_qdrant(documents: List[Document], embeddings: List[List[float]]):
    points = []
    for i, doc in enumerate(documents):
        points.append({
            "id": i,
            "vector": embeddings[i],
            "payload": {"text": doc.text, **doc.metadata},
        })
    await qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        wait=True,
        points=points,
    )
    print(f"Upserted {len(documents)} documents to '{COLLECTION_NAME}'.")

async def search_qdrant(query_vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
    search_result = await qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=limit,
        append_payload=True,
    )
    return [{"text": hit.payload["text"], "source": hit.payload["source"]} for hit in search_result]
