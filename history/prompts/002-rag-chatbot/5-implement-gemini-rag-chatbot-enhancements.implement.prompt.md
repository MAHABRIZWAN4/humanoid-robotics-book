---
id: 5
title: Implement Gemini RAG Chatbot Enhancements
stage: implement
date: 2025-12-14
surface: agent
model: gemini-1.5-pro
feature: rag-chatbot
branch: main
user: 
command: /sp.implement
labels: ["rag", "gemini", "agent", "multilingual", "guardrails"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - my_backend_project/backend/rag/agent.py
  - specs/002-rag-chatbot/tasks.md
tests_yaml: []
prompt_text: |-
  "Update agent.py for RAG Chatbot — GEMINI API + Guardrails + Multilingual Response + dotenv Load

  # Objective
  Modify `agent.py` in backend to:
  1. Use `GEMINI_API_KEY` instead of `OPENAI_API_KEY`.
  2. Switch model from `gpt-3.5-turbo` to `gemini-2.0-flash`.
  3. Add Guardrails to softly refuse irrelevant user questions.
  4. Detect user input language (English / Roman Urdu) and respond in the same language, or in user-preferred language if specified.
  5. Ensure `.env` is properly loaded using `dotenv`.

  # Required Steps

  1. **Load .env**
     ```python
     from dotenv import load_dotenv
     load_dotenv()
  ```
  # Instructions for SpecKit Plus

  1. **API Key Change**
     - Load `GEMINI_API_KEY` from `.env`.
     - Replace any reference of `OPENAI_API_KEY` with `GEMINI_API_KEY`.

  2. **Model Change**
     - Change model parameter from `"gpt-3.5-turbo"` to `"gemini-2.0-flash"` in all API calls.

  3. **Guardrails**
     - Implement a check on user questions:
       - If question is irrelevant to the textbook content, respond softly:
         - English: `"I'm sorry, I can only answer questions related to the textbook content."`
         - Roman Urdu: `"Maaf kijiye, mein sirf textbook ke content se related sawalon ka jawab de sakta hoon."`
       - Ensure chatbot **never provides unrelated answers**.

  4. **Multilingual Response**
     - Detect user input language:
       - If English → respond in English
       - If Roman Urdu → respond in Roman Urdu
       - If user specifies a preferred language → respond in that language
     - Maintain proper sentence structure and clarity.

  5. **Safe Implementation**
     - Do not modify other backend files (`main.py`, `config.py`, `schemas.py`) or frontend files.
     - `.env` file should remain untouched; only read `GEMINI_API_KEY`.
     - Maintain existing RAG pipeline logic (loader → chunker → embeddings → Qdrant → agent).

  # Outcome
  - `agent.py` fully updated:
    - Uses GEMINI API key
    - Uses gemini-2.0-flash model
    - Guardrails block irrelevant questions softly
    - Multilingual input/output supported
  - Ready to test with FastAPI `/query` endpoint
  - No other files modified, TextBook content untouched."
response_text: |-
  Implemented all requested changes in `my_backend_project/backend/rag/agent.py` including:
  - Switching to Gemini API with `GEMINI_API_KEY` and `gemini-2.0-flash` model.
  - Adding `dotenv` loading.
  - Implementing guardrails for irrelevant questions with multilingual (English/Roman Urdu) soft refusal messages.
  - Modifying the system message to instruct the model to respond in the detected language.
  Updated `specs/002-rag-chatbot/tasks.md` to reflect the completion of this task.
outcome: completed
evaluation: The `agent.py` file was successfully updated to incorporate Gemini API usage, guardrails, and multilingual response capabilities. The `tasks.md` file was also updated to mark the relevant task as completed.
---