---
id: 7
title: Integrate RAG Chatbot Globally
stage: implement
date: 2025-12-15
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: main
user: Mahab Rizwan
command: /sp.implement
labels: ["rag-chatbot", "docusaurus", "frontend", "integration"]
links:
  spec: specs/002-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - my-website/src/theme/Layout/index.js
  - my-website/.env
tests:
  - none
---

## Prompt

/sp.implement 

 Prompt for Global Chatbot Integration

## Objective
Integrate the existing **RAG Chatbot frontend** (`components/Chatbot/index.js`) **globally** across the entire textbook project so that it is visible and functional on **all pages**, not just the homepage.

## Project Details
- **Frontend:** Docusaurus-based textbook project  
- **Chatbot Component:** `components/Chatbot/index.js`  
- **Backend:** `my_backend_project`  
  - Provides `/query` endpoint  
  - Already handles RAG responses, detailed answers, and source references  
- **Goal:** Floating chatbot button and overlay should appear on **every page** of the Docusaurus textbook.

## Requirements
1. Automatically import and render the Chatbot component in a **global layout** or top-level wrapper, not per-page.  
2. Ensure **floating button** is always visible, regardless of which page is open.  
3. Connect Chatbot to the existing backend endpoints (`/query`).  
4. Preserve existing **local storage chat history** and selected-text feature.  
5. Maintain responsive design for mobile and desktop.  
6. Ensure **Railway deploy** works without breaking Docusaurus structure.  

## Steps for the Agent
1. Detect top-level layout file in Docusaurus (usually `src/theme/Layout.js` or `RootLayout` in `app/`).  
2. Import Chatbot component globally:  
   ```javascript
   import Chatbot from '../components/Chatbot';

## Response snapshot

The RAG chatbot has been successfully integrated globally across the Docusaurus website. The following actions were taken:
- The Docusaurus `Layout` component was "swizzled" to allow for customization.
- The `Chatbot` component was imported and rendered within the global layout.
- An environment variable (`DOCUSAURUS_BACKEND_API_URL`) was configured to connect the chatbot to the backend.

## Outcome

- ✅ Impact: The RAG chatbot is now globally available across the Docusaurus website, appearing on every page.
- 🧪 Tests: No new tests were added as the changes were primarily focused on UI integration and configuration.
- 📁 Files: Modified `my-website/src/theme/Layout/index.js` to include the chatbot, and created `my-website/.env` for backend URL configuration.
- 🔁 Next prompts: null
- 🧠 Reflection: Swizzling the Docusaurus layout and using environment variables for the backend URL proved to be an effective approach. Initial issues with incorrect relative paths and missing environment variable prefixes were successfully identified and resolved.

## Evaluation notes (flywheel)

- Failure modes observed: "Module not found" errors due to incorrect import paths, and failed backend connection due to missing environment variable prefixes.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
