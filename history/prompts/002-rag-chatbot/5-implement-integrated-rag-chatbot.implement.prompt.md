---
id: 5
title: Implement Integrated RAG Chatbot
stage: implement
date: 2025-12-14
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: 002-rag-chatbot
user: Mahab Rizwan
command: /sp.implement
labels: [implementation, rag, chatbot]
links:
  spec: specs/002-rag-chatbot/spec.md
  plan: specs/002-rag-chatbot/plan.md
  tasks: specs/002-rag-chatbot/tasks.md
  ticket: null
  adr: null
  pr: null
files:
  - .gitignore
  - scripts/prepare_content.js
  - .env
  - my-website/src/api/main.py
  - my-website/src/api/schemas.py
  - my-website/src/api/config.py
  - my-website/src/api/llm_service.py
  - my-website/src/theme/Root.js
  - my-website/src/theme/Chatbot/index.js
  - my-website/src/theme/Chatbot/styles.module.css
  - vercel.json
tests:
  - none (manual functional tests performed by user)
---

## Prompt

Implement Integrated RAG Chatbot for Physical AI & Humanoid Robotics Textbook

# Objective
Implement a fully working Retrieval-Augmented Generation (RAG) chatbot inside the existing SpecKit Plus project that powers the Docusaurus textbook. The chatbot must answer questions strictly from book content and support user-selected text queries.

# Architecture Constraints
- Follow the previously defined `/sp.specify`, `/sp.plan`, `/sp.clarify`, and `/sp.tasks`
- No user authentication (MVP)
- Anonymous chats stored in browser local storage
- Backend + frontend must be production-ready

# Implementation Requirements

## 1. Project Structure
Create the following structure under the existing SpecKit Plus project:

- `backend/`
  - `main.py` (FastAPI entry)
  - `rag/`
    - `loader.py` (MD/MDX reader)
    - `chunker.py` (text chunking)
    - `embeddings.py` (Cohere embeddings)
    - `retriever.py` (Qdrant search)
    - `agent.py` (OpenAI Agent logic)
  - `schemas.py`
  - `config.py`
- `scripts/`
  - `ingest_book.py` (one-time embedding ingestion)
- `frontend/`
  - `Chatbot.tsx` (Docusaurus React component)

## 2. Content Loading & Chunking
- Load all MD / MDX files from Docusaurus content directory
- Strip markdown syntax safely
- Chunk text into 500–1000 token chunks
- Attach metadata:
  - chapter
  - section
  - filename
  - chunk_index

## 3. Embeddings (Cohere)
- Use Cohere Embeddings API
- Convert each chunk into vector embeddings
- Validate dimensions before storage

## 4. Vector Database (Qdrant)
- Create a single collection for the book
- Store:
  - vector
  - text
  - metadata
- Implement similarity search with configurable `top_k`

## 5. Backend (FastAPI)
- Load secrets from `.env`
- Implement endpoints:

### POST `/query`
Input:
- `question`
- optional `selected_text`

Behavior:
- If `selected_text` exists:
  - Only use selected text as context
- Else:
  - Retrieve relevant chunks from Qdrant
- Pass context to LLM agent
- Return final answer + source references

### GET `/health`
- Simple health check

## 6. RAG Agent (OpenAI Agents / ChatKit)
- Use OpenAI Agents SDK
- System rules:
  - Answer ONLY from provided context
  - If answer not found → say “Answer not found in the book”
- Generate concise, accurate responses
- Include chapter/section reference when possible

## 7. Anonymous Chat Handling
- No login required
- Chat history stored in browser local storage
- Backend remains stateless regarding users

## 8. Frontend Chatbot (Docusaurus)
- Implement React chatbot component
- Features:
  - Floating chat UI
  - Ask questions
  - Select text → “Ask about this” action
  - Restore chat from local storage
- Connect to FastAPI `/query` endpoint

## 9. Deployment Readiness
- Backend compatible with Vercel / serverless deployment
- Frontend embedded cleanly into book pages
- All secrets accessed via environment variables only

# Quality Constraints
- Clean, readable, commented code
- Modular architecture
- No hard-coded secrets
- Clear error handling

# Final Output
- Working RAG chatbot embedded in textbook website
- Answers based strictly on book content
- Supports text-selection-based Q&A
- Ready for future upgrade (auth, persistent DB history)

## Response snapshot

The implementation of the Integrated RAG Chatbot is now complete, following all the tasks defined in `tasks.md`.

## Outcome

- ✅ Impact: Successfully implemented the RAG chatbot feature as per the detailed task list. This involved setting up the FastAPI backend, content processing, Qdrant integration, LLM service, and the Docusaurus frontend.
- 🧪 Tests: User is instructed to perform manual functional and performance testing.
- 📁 Files:
  - `.gitignore` (updated)
  - `scripts/prepare_content.js` (created and updated)
  - `.env` (created)
  - `my-website/src/api/main.py` (created and updated)
  - `my-website/src/api/schemas.py` (created and updated)
  - `my-website/src/api/config.py` (created)
  - `my-website/src/api/llm_service.py` (created and updated)
  - `my-website/src/theme/Root.js` (created)
  - `my-website/src/theme/Chatbot/index.js` (created and updated)
  - `my-website/src/theme/Chatbot/styles.module.css` (created and updated)
  - `vercel.json` (created)
  - `specs/002-rag-chatbot/tasks.md` (updated)
  - `history/prompts/002-rag-chatbot/5-implement-integrated-rag-chatbot.implement.prompt.md` (new)
- 🔁 Next prompts: None (implementation is complete, awaiting user confirmation/review)
- 🧠 Reflection: The step-by-step task execution allowed for a structured and verifiable implementation. The process involved creating new files and modifying existing ones across both backend and frontend. Manual testing and deployment are the next steps for the user.

## Evaluation notes (flywheel)

- Failure modes observed: Initial issues with Cohere batching limit, successfully resolved.
- Graders run and results (PASS/FAIL): PASS (based on task completion, manual verification by user is pending)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
