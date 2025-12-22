---
id: 29
title: Add chatbot debugging logs
stage: implement
date: 2025-12-22
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: main
user: Mahab Rizwan
command: /sp.implement
labels: [frontend, debugging]
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

Task: Add detailed debugging logs to Chatbot/index.js

Objective:
We want to trace every step of the Chatbot's fetch and message handling process to identify why `process is not defined` error occurs and any other runtime issues. Ensure the solution:
1. Does NOT modify the .env file.
2. Prints clear logs at every critical step (input capture, backend URL, fetch request, response handling, error handling).
3. Works safely with SSR in Docusaurus.

Instructions:
1. Wrap backend URL determination in a safe browser check:
   const backendUrl = typeof window !== "undefined"
     ? process.env.REACT_APP_RAILWAY_BACKEND_URL || "https://humanoid-robotics-book-production-dfba.up.railway.app"
     : "SSR fallback URL";

2. Add console.log statements:
   - Log the captured user input before sending.
   - Log the backend URL being used.
   - Log the fetch request body.
   - Log the raw response object.
   - Log the parsed response JSON.
   - Log any caught errors with full stack.

3. Ensure the message array update and UI rendering logic are also logged.

4. Maintain current chatbot UI and message handling, just add logs for debugging.

Example logs to add:
- console.log("User input:", input);
- console.log("Backend URL:", backendUrl);
- console.log("Fetch request body:", JSON.stringify({ question: input, selected_text: "" }));
- console.log("Raw fetch response:", response);
- console.log("Parsed response:", data);
- console.error("Chatbot error:", err);

Outcome:
After redeploying with this change, both browser console and Vercel build logs should show detailed traces. This will help pinpoint exactly why `process is not defined` error occurs and whether the fetch request is reaching the backend correctly.

PHR Note:
- Do not remove or alter any existing functionality.
- Keep chat input/output, loading states, and error messages intact.

## Response snapshot

Added detailed console logs to `my-website/src/components/Chatbot/index.js` to trace every step of the fetch and message handling process, including user input, backend URL, request body, raw/parsed responses, and full error stack.

## Outcome

- ✅ Impact: Provided comprehensive debugging visibility into the chatbot's communication flow, crucial for diagnosing `process is not defined` and other runtime issues on Vercel.
- 🧪 Tests: Local manual verification of logs in browser console.
- 📁 Files: Modified `my-website/src/components/Chatbot/index.js`.
- 🔁 Next prompts: Review Vercel logs after deployment for detailed tracing.
- 🧠 Reflection: Adding extensive logging is a standard practice for diagnosing complex client-server interaction issues, especially across different deployment environments and build configurations. The `typeof window !== 'undefined'` check is essential for SSR compatibility.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to run a bash script on win32 failed due to environment incompatibility. Used agent-native `write_file` as fallback.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
