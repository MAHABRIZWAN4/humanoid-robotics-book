# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `/specs/002-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic backend/database structure.

- [ ] T001 Initialize FastAPI project structure in `my-website/src/api/`.
- [ ] T002 [P] Configure linting and formatting for the new `my-website/src/api/` directory.
- [ ] T003 [P] Define database table schemas (Users, ChatSession, Message, Feedback) in `my-website/src/api/models.py`.
- [ ] T004 [P] Create a utility module to handle the connection to Qdrant cloud in `my-website/src/api/qdrant_utils.py`.
- [ ] T005 [P] Create a utility module to handle the connection to Neon Postgres in `my-website/src/api/db_utils.py`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Processing the book content into a queryable knowledge base.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Create a content processing script in `scripts/prepare_content.js`.
- [ ] T007 Implement logic in `scripts/prepare_content.js` to gather all MD/MDX files from `my-website/docs/`.
- [ ] T008 Implement text chunking logic within `scripts/prepare_content.js`.
- [ ] T009 Implement embedding generation using Cohere API within `scripts/prepare_content.js`.
- [ ] T010 Implement logic to connect to Qdrant and store the generated embeddings and metadata in `scripts/prepare_content.js`.
- [ ] T011 Execute the `scripts/prepare_content.js` script to process and populate the entire book's content into the vector database.

**Checkpoint**: Foundation ready. The vector database is populated with the textbook's content.

---

## Phase 3: User Story 1 - Focused Question Answering (Priority: P1) 🎯 MVP

**Goal**: A user can select text from the book and ask a question about it.

**Independent Test**: Can be tested by selecting any paragraph, asking a question via the UI, and verifying that a relevant answer is returned from the backend.

### Implementation for User Story 1

- [ ] T012 [US1] Create the `/query` endpoint in `my-website/src/api/main.py` to receive a question and optional selected text.
- [ ] T013 [US1] Implement similarity search logic in the `/query` endpoint using `my-website/src/api/qdrant_utils.py` to find relevant chunks.
- [ ] T014 [US1] Create a new service module `my-website/src/api/llm_service.py` to handle interaction with the OpenAI/ChatKit SDK.
- [ ] T015 [US1] Integrate the `llm_service` into the `/query` endpoint to generate an answer from the retrieved chunks.
- [ ] T016 [US1] Implement logic in the `/query` endpoint to save the user's query and the chatbot's response to the Postgres database.
- [ ] T017 [P] [US1] Create the basic Chatbot UI as a new React component in `my-website/src/theme/Chatbot/index.js`.
- [ ] T018 [P] [US1] Style the Chatbot UI using CSS in `my-website/src/theme/Chatbot/styles.module.css`.
- [ ] T019 [US1] Implement frontend logic in the Docusaurus site to capture selected text.
- [ ] T020 [US1] Implement the API call from the `Chatbot/index.js` component to the `/query` endpoint, sending the question and any selected text.
- [ ] T021 [US1] Implement logic to display the streaming response from the API in the Chatbot UI.

**Checkpoint**: User Story 1 is fully functional and testable. A user can get answers to questions about selected text.

---

## Phase 4: User Story 2 - General Knowledge-Base Query (Priority: P2)

**Goal**: A user can ask a general question without selecting text and get a cited answer.

**Independent Test**: Can be tested by opening the chatbot, asking a question on a topic covered in the book, and verifying an accurate, cited answer is returned.

### Implementation for User Story 2

- [ ] T022 [US2] Update the Chatbot UI in `my-website/src/theme/Chatbot/index.js` to ensure the input field is active and can send queries even when no text is selected.
- [ ] T023 [US2] Verify the `/query` endpoint in `my-website/src/api/main.py` correctly handles requests where the selected text context is empty.
- [ ] T024 [US2] Update the `my-website/src/api/llm_service.py` to include source citations (e.g., chapter, section) in the generated answer.
- [ ] T025 [US2] Update the Chatbot UI in `my-website/src/theme/Chatbot/index.js` to parse and display the source citations alongside the answer.

**Checkpoint**: User Stories 1 and 2 are functional. The chatbot can handle both contextual and general queries.

---

## Phase 5: User Story 3 - Review Chat History (Priority: P3)

**Goal**: A user can view their past conversations with the chatbot.

**Independent Test**: Have a conversation, close and reopen the chatbot, navigate to the history section, and verify the previous conversation is listed and viewable.

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create the `/history` endpoint in `my-website/src/api/main.py` that fetches a user's past chat sessions from the Postgres database.
- [ ] T027 [P] [US3] Create a "History" view or component within `my-website/src/theme/Chatbot/index.js`.
- [ ] T028 [US3] Implement frontend logic in the history component to call the `/history` endpoint and display the list of past conversations.
- [ ] T029 [US3] Implement frontend logic to select a conversation from the history and display its messages.

**Checkpoint**: All user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and production readiness.

- [ ] T030 [P] Create the `/feedback` endpoint in `my-website/src/api/main.py` to store user ratings/comments in the Postgres database.
- [ ] T031 [P] Implement a feedback UI (e.g., thumbs up/down buttons) on chat messages in `my-website/src/theme/Chatbot/index.js`.
- [ ] T032 Add end-to-end tests covering the full flow from UI to all backend services.
- [ ] T033 [P] Add API documentation for the `/query`, `/history`, and `/feedback` endpoints.
- [ ] T034 Configure all necessary environment variables and secrets for Vercel deployment.
- [ ] T035 Deploy the feature and monitor system health and response quality.
