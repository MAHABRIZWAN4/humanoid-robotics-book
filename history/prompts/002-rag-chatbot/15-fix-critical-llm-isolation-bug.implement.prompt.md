---
id: 15
title: Fix Critical LLM Isolation Bug
stage: implement
date: 2025-12-17
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: 002-rag-chatbot
user:
command: /sp.implement
labels: [bugfix, rag, llm, isolation, critical]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - my_backend_project/backend/rag/agent.py
tests:

---

## Prompt

/sp.implement 

Context:
This is a FastAPI RAG backend using Qdrant.
The backend must work even if NO external LLM (Gemini) is available.
Project path: my_backend_project/backend

Critical production bug:
POST /query returns HTTP 500 with:
[Errno 11002] getaddrinfo failed

Root cause:
The agent is still attempting to call Gemini (gemini-pro) on every query.
This causes network/DNS failures and crashes the API.

Mandatory architectural fix:
1. RAG-FIRST architecture must be enforced.
2. Qdrant vector search must be the PRIMARY response mechanism.
3. LLM must be OPTIONAL and NEVER REQUIRED for a successful response.
4. If Gemini fails (quota, DNS, model, network), the system MUST:
   - Log the error
   - Continue execution
   - Return a RAG-only answer or a clean "Not found in textbook" message
5. The API must NEVER return HTTP 500 due to LLM errors.

Implementation requirements:
- Fully isolate LLM calls behind a try/except boundary.
- Disable LLM invocation when:
  - No relevant Qdrant results exist
  - OR when Gemini raises any exception
- Do NOT allow LLM failures to bubble up to FastAPI.
- Qdrant search must work independently of Gemini availability.
- If Gemini is unreachable, return:
  "Answer based on textbook content only."

Explicit instructions:
- Do NOT change user environment settings.
- Do NOT require internet connectivity for core RAG behavior.
- Do NOT force Gemini calls in agent logic.

Success criteria:
- POST /query always returns HTTP 200
- No getaddrinfo / DNS / quota errors reach the client
- System works offline (RAG-only mode)
- Clean production-safe behavior

After implementation:
- Create a Prompt History Record (PHR)
- Summarize changes clearly

## Response snapshot

I have fixed the critical production bug by refactoring `my_backend_project/backend/rag/agent.py`.

The `generate_rag_response` function was modified to ensure all LLM-related calls (including language detection and relevance checking) are now fully contained within a single `try...except` block.

This change guarantees that any exception during LLM communication (such as network errors, DNS failures, or API issues) will be caught. When an error is caught, the system will log it and gracefully fall back to returning a RAG-only response, preventing the server from crashing and ensuring the API never returns a 500 error due to LLM unavailability.

This enforces the RAG-first architecture and makes the LLM integration truly optional and resilient to failure.

## Outcome

- ✅ Impact: Critical bug fixed. The API is now resilient to LLM failures and will no longer crash on network errors.
- 🧪 Tests: No new tests were added.
- 📁 Files: 1 file was modified.
- 🔁 Next prompts: None.
- 🧠 Reflection: The previous fix was insufficient because it did not isolate all LLM calls. This highlights the importance of identifying every external call and ensuring it is properly sandboxed within error handling blocks to build a resilient system.

## Evaluation notes (flywheel)

- Failure modes observed: Unhandled exceptions from network calls causing application crashes.
- Graders run and results (PASS/FAIL):
- Prompt variant (if applicable):
- Next experiment (smallest change to try):
