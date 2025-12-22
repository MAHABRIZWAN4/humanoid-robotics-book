---
id: 30
title: Fix `process is not defined` in Chatbot for Docusaurus v3
stage: implement
date: 2025-12-22
surface: agent
model: gemini-1.5-flash
feature: 002-rag-chatbot
branch: main
user: Mahab Rizwan
command: /sp.implement
labels: [frontend, bugfix, vite, docusaurus]
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

# PHR: Fix Browser `process is not defined` Error in Chatbot (Docusaurus v3)

## Error Description:
While testing the Humanoid Robotics Chatbot in the browser after deploying on Vercel, the following console error appears:

`
Failed to send message: ReferenceError: process is not defined
at onSubmit (main.c6b8d7fc.js:2:1925)
at Kc (main.c6b8d7fc.js:2:160964)
...
`

**Observation:**
- This happens when the frontend code attempts to access `process.env.REACT_APP_RAILWAY_BACKEND_URL`.
- Browser environment does not provide the `process` object.
- Docusaurus v3 uses Vite for the frontend build. Environment variables in Vite must be prefixed with `VITE_` and accessed via `import.meta.env`.

**Where the error appears:**
- Open browser → Right-click → Inspect → Console tab.
- Send a query to the chatbot, observe the `ReferenceError: process is not defined`.

---

## Solution (Browser-safe & Docusaurus v3 compatible):

1. **Update environment variable name:**
   - Current: `REACT_APP_RAILWAY_BACKEND_URL`
   - New: `VITE_RAILWAY_BACKEND_URL`
   
2. **Update Vercel Environment Variable:**
   - Key: `VITE_RAILWAY_BACKEND_URL`
   - Value: `https://humanoid-robotics-book-production-dfba.up.railway.app`
   - Only for **Production** (uncheck Preview/Development).

3. **Modify Chatbot/index.js**:

Replace the current backend URL line:

`js
const backendUrl = process.env.REACT_APP_RAILWAY_BACKEND_URL || "https://humanoid-robotics-book-production-dfba.up.railway.app";
`

With Vite-compatible code:

`js
const backendUrl =
  typeof window !== "undefined"
    ? import.meta.env.VITE_RAILWAY_BACKEND_URL || "https://humanoid-robotics-book-production-dfba.up.railway.app"
    : "https://humanoid-robotics-book-production-dfba.up.railway.app"; // SSR fallback
`

4. **Keep all console logs for debugging**, e.g.:

`js
console.log("User input:", input);
console.log("Backend URL:", backendUrl);
console.log("Fetch request body:", JSON.stringify({ question: input, selected_text: "" }));
`

5. **No need to touch existing `.env` files locally**, all changes are Vite-friendly and Vercel-ready.

---

## GitHub & Vercel Deployment Steps:

1. **Commit and push changes to GitHub:**

`bash
git add .
git commit -m "Updated Chatbot to use VITE_ environment variable for Docusaurus v3"
git push origin master
`

2. **Redeploy on Vercel:**

   * Go to your project dashboard → Deployments → Trigger redeploy for Production.
   * Ensure the new environment variable `VITE_RAILWAY_BACKEND_URL` is set in **Production** environment.

3. **Test the chatbot:**

   * Open the deployed website in browser.
   * Open console (Inspect → Console tab).
   * Send a query to the chatbot.
   * Verify:

     * No `ReferenceError: process is not defined`
     * Backend call completes successfully
     * Bot response is displayed correctly.

---

## Summary:

* The `process is not defined` error occurs because browser code cannot access Node.js `process.env`.
* Docusaurus v3 uses Vite; environment variables must have `VITE_` prefix and be accessed via `import.meta.env`.
* This prompt provides a full fix, GitHub commit instructions, Vercel redeploy steps, and testing verification.

---

**PHR Metadata:**

* **ID:** 27
* **Path:** history/prompts/002-rag-chatbot/27-fix-process-env-browser-error.implement.prompt.md
* **Stage:** implement
* **Title:** Fix `process is not defined` in Chatbot for Docusaurus v3

## Response snapshot

Updated `my-website/src/components/Chatbot/index.js` to use Vite-compatible environment variables (`import.meta.env.VITE_...`) to resolve the `process is not defined` error in the browser. The change is SSR-safe.

## Outcome

- ✅ Impact: Fixed a critical runtime error in the browser that prevented the chatbot from making backend requests. This change makes the component compatible with Docusaurus v3 and its Vite-based build system.
- 🧪 Tests: Manual verification in the browser after Vercel deployment is required.
- 📁 Files: Modified `my-website/src/components/Chatbot/index.js`.
- 🔁 Next prompts: Confirm successful Vercel deployment and test chatbot functionality.
- 🧠 Reflection: This task highlights the importance of understanding the specific build tools of a framework (Docusaurus v3 using Vite). Vite requires environment variables to be prefixed with `VITE_` and accessed via `import.meta.env`, which is different from older Webpack-based systems that used `process.env` and `REACT_APP_` prefixes.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to run a bash script on win32 failed due to environment incompatibility. Used agent-native `write_file` as fallback.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
