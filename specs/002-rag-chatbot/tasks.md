# Tasks: Integrated RAG Chatbot with Strict Frontend/Backend Separation

**Input**: Design documents from `/specs/002-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Backend Setup (Railway Ready)

**Purpose**: Initialize the new backend project structure and dependencies.

- [X] T001 Create `my_backend_project/` directory.
- [X] T002 Create `my_backend_project/backend/` directory.
- [X] T003 Create `my_backend_project/scripts/` directory.
- [X] T004 Create `my_backend_project/backend/requirements.txt` and add core backend dependencies: `fastapi`, `uvicorn`, `cohere`, `qdrant-client`, `openai`, `psycopg2-binary`.
- [X] T005 Initialize basic FastAPI app in `my_backend_project/backend/main.py` with `/health` endpoint.
- [X] T006 Create `my_backend_project/backend/config.py` to load environment variables.
- [X] T007 Create `my_backend_project/backend/schemas.py` for Pydantic models.

---

## Phase 2: RAG Pipeline (within `my_backend_project/backend/rag/`)

**Purpose**: Implement the core RAG components for content processing, embedding, and retrieval.

- [X] T008 Create `my_backend_project/backend/rag/` directory.
- [X] T009 Create `my_backend_project/backend/rag/loader.py` for MD/MDX file reading and cleaning.
- [X] T010 Create `my_backend_project/backend/rag/chunker.py` for text chunking logic.
- [X] T011 Create `my_backend_project/backend/rag/embeddings.py` for Cohere embedding generation.
- [X] T012 Create `my_backend_project/backend/rag/retriever.py` for Qdrant similarity search.
- [X] T013 Create `my_backend_project/backend/rag/agent.py` for Gemini Agent logic with Guardrails and Multilingual Response.
- [X] T014 Create `my_backend_project/scripts/ingest_book.py` as a one-time script for embedding ingestion.
- [X] T015 Implement content loading, cleaning, and chunking in `my_backend_project/scripts/ingest_book.py` using `my_website/docs/` as the source.
- [X] T016 Implement embedding generation using `my_backend_project/backend/rag/embeddings.py` and Qdrant storage using `my_backend_project/backend/rag/retriever.py` within `my_backend_project/scripts/ingest_book.py`.
- [X] T017 Execute `my_backend_project/scripts/ingest_book.py` to populate the Qdrant database.

---

## Phase 3: Backend FastAPI Endpoints (`my_backend_project/backend/main.py`)

**Purpose**: Integrate RAG components into the main API endpoints.

- [X] T018 [US1] Implement `POST /query` endpoint in `my_backend_project/backend/main.py` to accept `question` and optional `selected_text`.
- [X] T019 [US1] Integrate `my_backend_project/backend/rag/retriever.py` to get relevant chunks based on `selected_text` or `question`.
- [X] T020 [US1] Integrate `my_backend_project/backend/rag/agent.py` to generate answers from retrieved context.
- [X] T021 [US2] Ensure `POST /query` returns answer and metadata (chapter/section reference).

---

## Phase 4: Frontend Chatbot (`my_website/Chatbot/`)

**Purpose**: Create and integrate the Chatbot UI within the existing Docusaurus site.

- [X] T022 Create `my_website/Chatbot/index.js` for the React chatbot component.
- [X] T023 Create `my_website/Chatbot/styles.module.css` for Chatbot UI styling.
- [X] T024 [US1] Implement floating chat UI component.
- [X] T025 [US1] Implement input box and message history view in the Chatbot UI.
- [X] T026 [US1] Implement text selection capture and "Ask about this" feature.
- [X] T027 [US3] Implement local storage to save and restore chat history.
- [X] T028 Connect Chatbot to the Railway backend `/query` endpoint.

---

## Phase 5: Deployment & Finalization

**Purpose**: Prepare and deploy the separated backend and frontend components.

- [X] T029 Ensure `requirements.txt` in `my_backend_project/backend/` is complete for Railway deployment.
- [X] T030 Configure Docusaurus frontend for Vercel deployment, pointing API calls to the Railway backend URL.
- [ ] T031 Perform comprehensive functional and integration testing.
- [ ] T032 Deploy the backend to Railway.
- [ ] T033 Deploy the Docusaurus site (with embedded chatbot) to Vercel.