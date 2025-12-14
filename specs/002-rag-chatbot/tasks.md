# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `/specs/002-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the backend API project.

- [X] T001 Initialize FastAPI project structure in `my-website/src/api/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Process the book content into a queryable knowledge base. This entire phase must be complete before any user story work can begin.

- [X] T002 [P] Create a content processing script in `scripts/prepare_content.js`.
- [X] T003 Implement logic in `scripts/prepare_content.js` to extract and clean content from all MD/MDX files in `my-website/docs/`.
- [X] T004 Implement text chunking logic (500-1000 tokens) in `scripts/prepare_content.js`.
- [X] T005 [P] Implement Cohere embedding generation for text chunks in `scripts/prepare_content.js`.
- [X] T006 [P] Implement Qdrant connection and setup logic in `scripts/prepare_content.js` to create the collection.
- [X] T007 Implement logic in `scripts/prepare_content.js` to insert the generated vectors and metadata into Qdrant.
- [X] T008 Execute the `scripts/prepare_content.js` script to fully populate the vector database.

**Checkpoint**: Foundation ready. The vector database is populated with the textbook's content.

---

## Phase 3: User Story 1 - Focused Question Answering (Priority: P1) 🎯 MVP

**Goal**: A user can select text and ask a question about it to get a concise, context-aware answer.
**Independent Test**: Can be tested by selecting a paragraph, asking a question, and verifying a relevant summary answer is returned.

- [X] T009 [P] [US1] Create the `/query` endpoint in `my-website/src/api/main.py` to accept a question and optional selected text.
- [X] T010 [US1] Implement Qdrant similarity search in the `/query` endpoint to retrieve relevant document chunks.
- [X] T011 [US1] Create an LLM service module in `my-website/src/api/llm_service.py` for RAG orchestration.
- [X] T012 [US1] Implement logic in `llm_service.py` to combine the user query with retrieved chunks and generate a concise summary answer.
- [X] T013 [US1] Integrate the `llm_service.py` into the `/query` endpoint.
- [X] T014 [P] [US1] Create the floating chat button and panel UI component in `my-website/src/theme/Chatbot/index.js`.
- [X] T015 [P] [US1] Style the Chatbot UI using CSS in `my-website/src/theme/Chatbot/styles.module.css`.
- [X] T016 [US1] Implement frontend logic to capture selected text from the document and pass it to the Chatbot component.
- [X] T017 [US1] Implement the API call from the Chatbot component to the `/query` endpoint.
- [X] T018 [US1] Implement logic in the Chatbot component to display the summary answer and a "Show more" button.

**Checkpoint**: User Story 1 is fully functional. A user can get summary answers to questions about selected text.

---

## Phase 4: User Story 2 - General Knowledge-Base Query (Priority: P2)

**Goal**: A user can ask a general question and get a cited, detailed answer.
**Independent Test**: Ask a general question and click "Show more" to verify a correct, cited answer is returned.

- [X] T019 [US2] Ensure the Chatbot UI in `my-website/src/theme/Chatbot/index.js` allows submitting questions when no text is selected.
- [X] T020 [US2] Update the `llm_service.py` to include source citations (chapter/section) in the full, detailed response.
- [X] T021 [US2] Update the Chatbot component to display the detailed answer and citations when "Show more" is clicked.

**Checkpoint**: User Stories 1 & 2 are functional. The chatbot handles both contextual and general queries with detailed answers.

---

## Phase 5: User Story 3 - Review Chat History (Priority: P3)

**Goal**: A user can view their past conversations, which are persisted in the browser's local storage.
**Independent Test**: Have a conversation, reload the page, and verify the conversation is still present in the chat history view.

- [X] T022 [P] [US3] Implement logic in `my-website/src/theme/Chatbot/index.js` to save the message history to local storage after each interaction.
- [X] T023 [US3] Implement logic in the Chatbot component to load and restore chat history from local storage when it mounts.
- [X] T024 [P] [US3] Create a "History" view or tab within the Chatbot component to display past conversations.

**Checkpoint**: All user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and production readiness.

- [X] T025 [P] Add a user feedback mechanism (e.g., thumbs up/down) to the Chatbot UI in `my-website/src/theme/Chatbot/index.js`.
- [X] T026 [P] Add a "Clear History" button to the UI in `my-website/src/theme/Chatbot/index.js`.
- [X] T027 Perform functional testing for both general and selected-text queries.
- [X] T028 [P] Measure response latency and perform basic performance testing.
- [X] T029 Prepare all environment variables and secrets for Vercel deployment.
- [X] T030 Deploy the updated Docusaurus site with the embedded chatbot and backend API to Vercel.