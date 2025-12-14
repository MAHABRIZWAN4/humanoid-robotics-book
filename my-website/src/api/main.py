from fastapi import FastAPI, HTTPException
from my_website.src.api.schemas import QueryRequest, QueryResponse
from my_website.src.api.config import cohere_client, qdrant_client, COLLECTION_NAME
from my_website.src.api.llm_service import generate_response

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def read_health():
    return {"status": "ok"}

@app.post("/query", response_model=QueryResponse)
async def query_chatbot(request: QueryRequest):
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # Generate embedding for the query
    query_text = request.question
    if request.selected_text:
        query_text = f"{request.selected_text}\n\nQuestion: {request.question}"

    query_embedding_response = await cohere_client.embed(
        texts=[query_text],
        model="embed-english-v3.0",
        inputType="search_query"
    )
    query_embedding = query_embedding_response.embeddings[0]

    # Perform similarity search in Qdrant
    search_result = await qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=5, # Retrieve top 5 relevant chunks
        append_payload=True,
    )

    # Extract relevant text and sources from chunks
    context_chunks = [hit.payload["text"] for hit in search_result if hit.payload]
    source_references = [hit.payload["source"] for hit in search_result if hit.payload and "source" in hit.payload]
    
    # Generate answer using LLM service
    llm_response = await generate_response(request.question, context_chunks, source_references)

    return QueryResponse(answer=llm_response["answer"], detailed_answer=llm_response["detailed_answer"], source_references=llm_response["sources"])
