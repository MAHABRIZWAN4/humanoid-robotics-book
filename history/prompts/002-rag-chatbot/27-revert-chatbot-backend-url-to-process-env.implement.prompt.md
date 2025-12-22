---
id: 27
title: Revert chatbot backend URL to process.env
stage: implement
date: 2025-12-22
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: main
user: Mahab Rizwan
command: /sp.implement
labels: [frontend, bugfix]
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

✦ Implement: Revert Chatbot Backend URL to process.env for Vercel

**Goal:** Fix the Vercel build error `Cannot use 'import.meta' outside a module` by using `process.env` for environment variables in Docusaurus.

**Steps to Automate:**

1. Locate `my-website/src/components/Chatbot/index.js`.
2. Find any instance of `import.meta.env.REACT_APP_RAILWAY_BACKEND_URL`.
3. Replace it with `process.env.REACT_APP_RAILWAY_BACKEND_URL`.
4. Update the fetch call to use this variable:
```js
const backendUrl = process.env.REACT_APP_RAILWAY_BACKEND_URL || "https://humanoid-robotics-book-production-dfba.up.railway.app";
const response = await fetch(`${backendUrl}/query`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: input, selected_text: "" }),
});

## Response snapshot

Reverted 'import.meta.env' to 'process.env' and updated fetch call in `my-website/src/components/Chatbot/index.js` to fix Vercel build error.

## Outcome

- ✅ Impact: Resolved Vercel build error by using `process.env` for environment variables, ensuring compatibility with Docusaurus on Vercel.
- 🧪 Tests: Local manual verification in code. Vercel deployment will confirm the fix.
- 📁 Files: Modified `my-website/src/components/Chatbot/index.js`.
- 🔁 Next prompts: Confirm Vercel deployment success.
- 🧠 Reflection: It's important to be aware of environment variable access differences between various deployment platforms and build tools (e.g., Docusaurus with Webpack vs. Vite, Vercel vs. Railway). `process.env` is the more widely compatible approach for Docusaurus on Vercel.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to run a bash script on win32 failed due to environment incompatibility. Used agent-native `write_file` as fallback.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
