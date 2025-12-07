---
description: "Task list for feature implementation"
---

# Tasks: Physical AI & Humanoid Robotics Textbook Website

**Input**: Design documents from `/specs/001-humanoid-robotics-textbook/`
**Prerequisites**: plan.md, spec.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [X] T001 Initialize Docusaurus project by running `npx create-docusaurus@latest my-website classic` in the repository root.
- [X] T002 [P] Create the initial folder structure as defined in the plan, including `scripts/`, `ai/prompts/`, and `my-website/src/pages/api/`.
- [X] T003 [P] Configure basic site metadata (title, favicon) in `my-website/docusaurus.config.js`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [X] T004 [P] Setup a remote PostgreSQL database (e.g., on Supabase or Vercel) and create the `user_profiles` table with `userId` and `tags` columns.
- [X] T005 [P] Setup a remote KV store for caching (e.g., Vercel KV or Redis).
- [X] T006 [P] Create the GitHub Actions workflow file `.github/workflows/deploy.yml` for deploying the `my-website` directory to GitHub Pages.

---

## Phase 3: User Story 1 - Core Textbook Reading Experience (Priority: P1) 🎯 MVP

**Goal**: A user can navigate the website and read the core, AI-generated textbook content.

**Independent Test**: The Docusaurus site is deployed and accessible on a GitHub Pages URL, showing formatted content under the "Docs" section.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create high-level prompts for two sample chapters and save them in `ai/prompts/chapters/`.
- [X] T008 [US1] Create the content generation script `scripts/generate-content.js` to read prompts, call the Gemini API, and save the output as markdown files.
- [X] T009 [US1] Run the `generate-content.js` script to produce initial chapter files in `my-website/docs/`.
- [X] T010 [US1] Configure the documentation sidebar in `my-website/sidebars.js` to correctly display the generated chapters.

**Checkpoint**: User Story 1 is functional. The website shows AI-generated content.

---

## Phase 4: User Story 2 - User Registration and Personalization Profile (Priority: P2)

**Goal**: A new user can sign up, log in, and provide their software/hardware background as tags.

**Independent Test**: A user can click a "Login" button, complete the Better-Auth OAuth flow, be redirected to a profile page, and successfully save their background tags.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Integrate the Better-Auth provider and create a login/logout button component in `my-website/src/theme/Navbar/index.js`.
- [ ] T012 [P] [US2] Create the profile page `my-website/src/pages/profile.js` with a form for inputting and saving background tags.
- [ ] T013 [US2] Implement the API endpoint `my-website/src/pages/api/auth/profile.js` to handle `GET` (retrieve tags) and `POST` (update tags) for the logged-in user.

**Checkpoint**: User Story 2 is functional. Users can sign up and manage their profile.

---

## Phase 5: User Story 3 - Dynamic Content Personalization (Priority: P3)

**Goal**: A logged-in user can press a "Personalize" button on a chapter page to dynamically rewrite the content based on their profile.

**Independent Test**: A logged-in user with a defined profile can go to a chapter, click "Personalize Content", and see the content change within 5 seconds (for a cached response).

### Implementation for User Story 3

- [ ] T014 [P] [US3] Create the `<PersonalizationButton />` React component in `my-website/src/components/PersonalizationButton/`.
- [ ] T015 [US3] Swizzle the Docusaurus `DocItem` component to include the `<PersonalizationButton />` and a stateful content display area.
- [ ] T016 [US3] Implement the API endpoint `my-website/src/pages/api/personalize.js`, including logic to fetch user tags, check the cache, call the Gemini API on a cache miss, and save the result to the cache.

**Checkpoint**: User Story 3 is functional. Personalized content is served dynamically.

---

## Phase 6: User Story 4 - Urdu Language Translation (Priority: P3)

**Goal**: A user can toggle a switch that translates the current chapter's content into Urdu.

**Independent Test**: A user can click a "Translate to Urdu" button, which then displays the chapter content in Urdu.

### Implementation for User Story 4

- [ ] T017 [P] [US4] Create the `<TranslateButton />` React component in `my-website/src/components/TranslateButton/`.
- [ ] T018 [US4] Swizzle the Docusaurus `DocItem` component to add the `<TranslateButton />`.
- [ ] T019 [US4] Implement the API endpoint `my-website/src/pages/api/translate.js`, including caching and the call to the Gemini API for translation.

**Checkpoint**: All user stories are now independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final deployment.

- [ ] T020 [P] Implement clear loading states (spinners, skeletons) for personalization and translation events.
- [ ] T021 [P] Implement robust error handling for API and service failures (e.g., show a toast notification).
- [ ] T022 Write automated latency tests for the `/api/personalize` and `/api/translate` endpoints to ensure they meet the <5s goal for cached responses.
- [ ] T023 Finalize and merge the GitHub Actions workflow in `.github/workflows/deploy.yml` to automate deployment on pushes to `main`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phase 3-6)**: Depend on Foundational.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (Core Content)**: Depends on Foundational. Is the MVP.
- **US2 (Auth)**: Depends on Foundational.
- **US3 (Personalization)**: Depends on US2 (needs a logged-in user with a profile).
- **US4 (Translation)**: Depends on Foundational. It is independent of US2 and US3.

### Parallel Opportunities

- Once Phase 2 is complete, work on **US1, US2, and US4 can begin in parallel**.
- Work on **US3 must wait for US2** to be completed.
- Within each story, API endpoint creation ([P]) and frontend component creation ([P]) can occur in parallel.

---

## Parallel Example: After Foundational Phase

```bash
# Developer A can start on User Story 1
Task: "T007 [P] [US1] Create high-level prompts..."
Task: "T008 [US1] Create the content generation script..."

# Developer B can start on User Story 2
Task: "T011 [P] [US2] Integrate the Better-Auth provider..."
Task: "T012 [P] [US2] Create the profile page..."

# Developer C can start on User Story 4
Task: "T017 [P] [US4] Create the <TranslateButton />..."
Task: "T019 [US4] Implement the API endpoint my-website/src/pages/api/translate.js..."
```

---

## Implementation Strategy

### MVP First (User Story 1)

1.  Complete **Phase 1: Setup**.
2.  Complete **Phase 2: Foundational**.
3.  Complete **Phase 3: User Story 1**.
4.  **STOP & VALIDATE**: Deploy the site to GitHub Pages. Verify that the core, non-interactive textbook is live and readable. This is the baseline MVP.

### Incremental Delivery

1.  After MVP, complete **Phase 4: User Story 2**. Deploy and verify that user accounts and profiles are working.
2.  Next, complete **Phase 5: User Story 3**. Deploy and verify personalization works for logged-in users.
3.  In parallel or after, complete **Phase 6: User Story 4**. Deploy and verify translation works for all users.
4.  Finally, complete **Phase 7: Polish** to optimize performance and UX.
