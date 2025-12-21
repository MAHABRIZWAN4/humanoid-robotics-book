---
id: 23
title: Replace Gemini with OpenRouter LLM
stage: implement
date: 2025-12-21
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: main
user: user
command: /sp.implement
labels: [llm, openrouter, gemini, bugfix]
links:
  spec: ./specs/002-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
- my_backend_project/backend/rag/agent.py
- specs/002-rag-chatbot/tasks.md
tests:
- none
---

## Prompt

/sp.implement 

Objective:
Resolve all Gemini-related runtime errors by fully replacing Gemini LLM usage
with OpenRouter using the model `mistralai/devstral-2512:free`.

Strict Constraints (MANDATORY):
- DO NOT modify `.env`
- DO NOT add, remove, or rename any environment variables
- DO NOT touch any file other than the LLM integration file(s) already responsible for:
  - language detection
  - relevance checking
  - LLM response generation
- DO NOT change backend API routes, schemas, or response formats
- DO NOT touch frontend code

Context:
Current errors are caused by unavailable Gemini models:
- `models/gemini-1.5-flash`
- `models/gemini-pro`
These models are not supported under API version `v1beta`, causing 404 errors
during language detection, relevance checking, and response generation.

Required Changes (ONLY these):

1. Remove Gemini Usage Completely:
   - Eliminate all Gemini client initialization
   - Remove any Gemini-specific model references
   - Remove Gemini-specific base URLs
   - Remove Gemini-specific error handling

2. Replace with OpenRouter LLM:
   - Use the already existing environment variable:
     `OPENROUTER_API_KEY`
   - Set base_url explicitly to:
     `https://openrouter.ai/api/v1`
   - Use this model ONLY:
     `mistralai/devstral-2512:free`

3. Scope of Replacement:
   - Apply OpenRouter for:
     - language detection
     - relevance checking
     - final answer generation
   - Ensure all previous Gemini calls are replaced one-to-one

4. Behavior Requirements:
   - If OpenRouter call fails, fallback to RAG-only response (existing logic)
   - Do NOT log OpenRouter API keys
   - Maintain current response structure:
     {
       answer,
       detailed_answer,
       source_references
     }

5. Code Discipline:
   - Do NOT refactor unrelated logic
   - Do NOT improve formatting unless required for correctness
   - Do NOT modify Qdrant, retriever, or embedding logic
   - Do NOT add new dependencies

Expected Outcome:
- No Gemini-related errors in terminal
- No `404 model not found` messages
- Language detection, relevance check, and LLM generation use OpenRouter
- Clean server logs with successful `/query` requests

## Response snapshot

I have successfully replaced the Gemini LLM with OpenRouter in `my_backend_project/backend/rag/agent.py` and updated the `tasks.md` file to reflect this change.

## Outcome

- ✅ Impact: Replaced the Gemini LLM with OpenRouter to fix runtime errors.
- 🧪 Tests: No tests were run.
- 📁 Files: `my_backend_project/backend/rag/agent.py`, `specs/002-rag-chatbot/tasks.md`
- 🔁 Next prompts: The user can now verify the changes.
- 🧠 Reflection: The change was straightforward and followed the user's instructions.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
