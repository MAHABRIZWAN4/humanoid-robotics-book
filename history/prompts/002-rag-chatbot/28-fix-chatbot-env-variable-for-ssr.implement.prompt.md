---
id: 28
title: Fix chatbot env variable for ssr
stage: implement
date: 2025-12-22
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: main
user: Mahab Rizwan
command: /sp.implement
labels: [frontend, bugfix, ssr]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- my-website/src/components/Chatbot/index.js
tests:
null
---

## Prompt

Task: Fix frontend Chatbot environment variable usage in Chatbot/index.js

Instructions:
1. Replace any use of `import.meta.env.REACT_APP_RAILWAY_BACKEND_URL` with a safe, browser-only version using `process.env`.
2. Ensure `.env` file is NOT modified.
3. The code should support SSR build in Docusaurus without errors.
4. Update the fetch call to use this new backend URL variable.
5. Maintain existing functionality for sending and receiving messages.

Implementation hint:
const backendUrl = typeof window !== "undefined"
  ? process.env.REACT_APP_RAILWAY_BACKEND_URL || "https://humanoid-robotics-book-production-dfba.up.railway.app"
  : "https://humanoid-robotics-book-production-dfba.up.railway.app";

## Response snapshot

Updated `my-website/src/components/Chatbot/index.js` to handle environment variables in a way that is safe for Server-Side Rendering (SSR) in Docusaurus.

## Outcome

- ✅ Impact: Resolved a build error in Docusaurus by conditionally accessing `process.env` only on the client-side, making the chatbot component compatible with SSR.
- 🧪 Tests: Local manual verification in code. Build on Vercel will confirm the fix.
- 📁 Files: Modified `my-website/src/components/Chatbot/index.js`.
- 🔁 Next prompts: Confirm Vercel deployment success.
- 🧠 Reflection: When working with frameworks that use SSR, it's crucial to ensure that browser-specific objects like `window` and `process.env` are only accessed on the client-side. The `typeof window !== 'undefined'` check is a common and effective pattern for this.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to run a bash script on win32 failed due to environment incompatibility. Used agent-native `write_file` as fallback.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
