# Integrated RAG Chatbot Implementation Plan

**Feature**: Integrated RAG Chatbot
**Branch**: `002-rag-chatbot`

This document outlines the step-by-step technical plan to implement the RAG chatbot.

## Step-by-Step Implementation Workflow

### Step 1: Book Content Preparation
- Gather all MD / MDX files from the existing Docusaurus book (`my-website/docs/`).
- Ensure content is clean and properly formatted.
- Tag chapters/sections for reference metadata.

### Step 2: Text Chunking
- Divide book content into smaller chunks (500-1000 tokens each).
- Add metadata: chapter, section, filename, position in text.
- Store chunks temporarily for embeddings.

### Step 3: Embeddings Generation
- Use Cohere Embeddings API with `COHERE_API_KEY`.
- Convert each text chunk into a numerical vector.
- Validate embeddings for consistency.

### Step 4: Vector Database Setup
- Connect to Qdrant Cloud Free Tier using `QDRANT_API_KEY` and `QDRANT_URL`.
- Create a collection for book embeddings.
- Store vectors along with metadata.
- Test similarity search queries.

### Step 5: Metadata & Chat History Storage
- Setup Neon Serverless Postgres using `DATABASE_URL`.
- Create tables for:
  - Users
  - Chat history
  - Retrieved chunk metadata
- Ensure secure connection and SSL enabled.

### Step 6: FastAPI Backend Development
- Initialize FastAPI project in a new `my-website/src/api` directory.
- Create API endpoints:
  - `/query` → Accept user question + optional selected text.
  - `/history` → Retrieve previous chats.
  - `/feedback` → Store user feedback.
- Integrate Qdrant search and Postgres storage.
- Handle errors and logging.

### Step 7: OpenAI Agents / ChatKit Integration
- Use `OPENAI_API_KEY` to call OpenAI Agents/ChatKit SDK.
- Input: retrieved text chunks + user query.
- Generate answers dynamically.
- Include citations or references to the source text if needed.
- Test response accuracy and relevance.

### Step 8: Frontend Chatbot Embedding
- Embed chatbot UI into the Docusaurus website deployed on Vercel.
- The UI will be a new React component in `my-website/src/theme/`.
- Enable user to:
  - Select text from the book.
  - Ask questions based on selection or general queries.
  - Display chat history in the UI.
- Test UI responsiveness and user experience.

### Step 9: Testing & Validation
- Test chatbot with multiple queries and selected text scenarios.
- Validate answer relevance, chat history storage, and embeddings search.
- Perform end-to-end testing: Frontend ↔ FastAPI ↔ Qdrant ↔ OpenAI Agent ↔ Postgres.

### Step 10: Deployment & Monitoring
- Deploy updated book with embedded chatbot on Vercel.
- Monitor API endpoints, database, and chatbot responses.
- Optimize for latency and performance.

## Outcome
- Fully functional RAG Chatbot embedded in the textbook website.
- Handles real-time queries, text selection, chat history, and accurate retrieval-based responses.
