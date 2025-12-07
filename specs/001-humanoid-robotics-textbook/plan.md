# Implementation Plan: Physical AI & Humanoid Robotics Textbook Website

**Branch**: `001-humanoid-robotics-textbook` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-humanoid-robotics-textbook/spec.md`

## 1. Architecture Overview

The system is a Docusaurus-based static site, enhanced with dynamic serverless functions for personalization, authentication, and translation. The content is initially generated via a CLI-driven AI pipeline.

```mermaid
graph TD
    subgraph User Interaction
        A[User]
    end

    subgraph Frontend (Docusaurus / React on GitHub Pages)
        B[Docusaurus Website]
        C[React Components]
        D[Personalize Button]
        E[Translate Button]
        F[Login/Profile Button]
    end

    subgraph Backend (Serverless Functions / Next.js API Routes)
        G[auth/profile API]
        H[personalize API]
        I[translate API]
        J[Content Cache (KV Store/Redis)]
    end

    subgraph External Services
        K[Better-Auth (OAuth 2.0)]
        L[Gemini API]
    end

    subgraph Content Pipeline (Local/CI)
        M[Gemini CLI]
        N[High-Level Prompts]
        O[Spec-Kit+]
        P[Generated Markdown Content]
    end

    A --> B;
    B --> C;
    C --> D & E & F;

    F -->|OAuth Flow| K;
    K -->|User Profile/Tags| G;

    D -->|Request with ChapterID| H;
    H -->|User Profile| G;
    H -->|Base Content| P;
    H -->|Prompt| L;
    L -->|Personalized MD| H;
    H -->|Cache Result| J;
    H -->|Return MD| C;

    E -->|Request with ChapterID| I;
    I -->|Base Content| P;
    I -->|Prompt| L;
    L -->|Urdu MD| I;
    I -->|Cache Result| J;
    I -->|Return MD| C;

    O -->|Orchestrates| M;
    N -->|Input| M;
    M -->|Generates| P;
    P -->|Serves as Base Content| B;
```

## 2. Folder Structure

This structure combines a standard Docusaurus project with backend API routes (as if using Next.js) and dedicated folders for AI, specs, and data.

```text
/
├── .specify/               # Spec-Kit Plus config and templates
├── .github/                # GitHub Actions for CI/CD
├── specs/
│   └── 001-humanoid-robotics-textbook/
│       ├── spec.md
│       ├── plan.md         # This file
│       ├── research.md
│       ├── data-model.md
│       └── contracts/
├── my-website/             # Docusaurus project root
│   ├── blog/
│   ├── docs/               # Base AI-generated textbook content (.md files)
│   ├── src/
│   │   ├── components/     # React components (e.g., PersonalizationButton)
│   │   ├── css/
│   │   ├── pages/          # Next.js API routes for backend logic
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       │   └── profile.js
│   │   │       ├── personalize.js
│   │   │       └── translate.js
│   │   └── theme/
│   ├── static/
│   └── docusaurus.config.js
├── scripts/                # Automation scripts (e.g., content generation)
│   └── generate-content.js
├── data/                   # Data stores
│   └── user_profiles/      # (Example, actual storage will be remote)
└── ai/                     # Prompts and runners for Gemini CLI
    ├── prompts/
    │   └── chapters/
    └── runners/
```

## 3. Implementation Steps (Milestones)

### Phase 1: Core Scaffolding
- [ ] Initialize Docusaurus project (`my-website`).
- [ ] Set up basic site structure and navigation in `docusaurus.config.js`.
- [ ] Create placeholder pages for the four main textbook modules.
- [ ] Configure GitHub Actions to deploy the Docusaurus site to GitHub Pages.

### Phase 2: AI Textbook Generation
- [ ] Develop high-level prompts for each chapter.
- [ ] Create a script in `/scripts` to use Gemini CLI to generate Markdown files from prompts.
- [ ] Place generated `.md` files into the `/my-website/docs` directory.
- [ ] Manually review and format the first batch of generated content.

### Phase 3: Authentication & User Profiles
- [ ] Integrate Better-Auth using OAuth 2.0.
- [ ] Create a "Login" button and a protected `/profile` page.
- [ ] Build the user profile form for submitting background tags (e.g., 'React', 'Python', 'Beginner', 'Gazebo').
- [ ] Implement the `/api/auth/profile` endpoint to save user tags to a database (e.g., Vercel Postgres, Supabase).

### Phase 4: Personalization Logic
- [ ] Create the `PersonalizationButton` React component.
- [ ] Implement the `/api/personalize` serverless function.
- [ ] Inside the API: fetch user profile, read base chapter markdown, construct prompt for Gemini, and call the API.
- [ ] Implement a caching layer (e.g., Vercel KV or Redis) for `(userId, chapterId)` keys to store personalized results.
- [ ] Frontend renders the returned Markdown, handling the loading state.

### Phase 5: Urdu Translation
- [ ] Create the `TranslateButton` React component.
- [ ] Implement the `/api/translate` serverless function.
- [ ] Inside the API: read base chapter markdown, prompt Gemini to translate to Urdu, preserving structure.
- [ ] Add caching for `(chapterId, 'ur')` to avoid redundant API calls.
- [ ] Frontend renders the translated content.

### Phase 6: Deployment & Performance Tuning
- [ ] Deploy backend API functions to a serverless provider (e.g., Vercel, Netlify).
- [ ] Measure latency for personalization and translation.
- [ ] Optimize caching strategy to meet the `≤ 5 seconds` target for subsequent loads.
- [ ] Conduct final review of all functional requirements.

## 4. Data Models

### UserProfile
- **Storage**: Remote DB (Postgres/Supabase)
- **Structure**:
  ```json
  {
    "userId": "auth0|user123", // From Better-Auth
    "email": "user@example.com",
    "tags": ["python", "intermediate", "ros2", "computer_vision"]
  }
  ```

### Chapter (Implicit)
- **Storage**: Filesystem (`.md` files in `/docs`).
- **Structure**: Standard Docusaurus markdown with frontmatter.

### PersonalizedContentCache
- **Storage**: KV Store / Redis
- **Key-Value Structure**:
  - `key`: `cache:personalize:<userId>:<chapterId>`
  - `value`: `{ "content": "Personalized markdown here...", "timestamp": "2025-12-07T12:00:00Z" }`
  - `key`: `cache:translate:<chapterId>:ur`
  - `value`: `{ "content": "Urdu markdown here...", "timestamp": "2025-12-07T12:00:00Z" }`
- **TTL**: 24 hours to balance freshness and cost.

## 5. API Endpoints and Functions

All endpoints are serverless functions (e.g., Next.js API routes).

- `POST /api/auth/profile`
  - **Auth**: Required (Better-Auth token)
  - **Body**: `{ "tags": ["python", "expert"] }`
  - **Action**: Updates the user's profile tags in the database.
  - **Returns**: `{ "success": true }`

- `GET /api/personalize?chapter=<chapter-slug>`
  - **Auth**: Required
  - **Action**: Checks cache first. If miss, generates personalized content via Gemini, caches it, and returns.
  - **Returns**: `{ "content": "<markdown>..." }`

- `GET /api/translate?chapter=<chapter-slug>`
  - **Auth**: Not Required
  - **Action**: Checks cache first. If miss, generates Urdu translation via Gemini, caches it, and returns.
  - **Returns**: `{ "content": "<markdown>..." }`

### Client-Side Functions
- `fetchUserProfile()`: Fetches data from the auth provider and our profile endpoint.
- `personalizeChapter(chapterId)`: Calls our `/api/personalize` endpoint and manages component state (loading, data, error).
- `translateChapterToUrdu(chapterId)`: Calls our `/api/translate` endpoint.

## 6. Personalization Logic Algorithm

1.  User clicks the "Personalize" button on a chapter page.
2.  The client-side `personalizeChapter()` function is invoked. It shows a loading spinner.
3.  A `GET` request is sent to `/api/personalize?chapter=the-chapter-slug`, including the user's auth token.
4.  The backend API authenticates the user and fetches their profile tags (e.g., `['beginner', 'python']`).
5.  The API checks the cache for the key `cache:personalize:<userId>:<chapterId>`. If found and not stale, it returns the cached content immediately (Steps 6-9 are skipped).
6.  If not in cache, the API reads the base Markdown content for `the-chapter-slug` from the filesystem.
7.  It constructs a detailed prompt for the Gemini API:
    > "You are a robotics professor. Rewrite the following chapter for a user with this background: [TAGS]. Adjust technical depth and change tooling examples to match their profile. The user is a [beginner/intermediate/expert]. Preserve all Markdown formatting, especially code blocks.
    >
    > ---
    > [Base Markdown Content]"
8.  The API calls the Gemini service and awaits the response.
9.  The new Markdown is stored in the cache with a 24-hour TTL.
10. The API returns the generated content to the client.
11. The client-side component receives the markdown, hides the spinner, and renders it.

## 7. Performance & Non-Functional Requirements

- **Caching**: This is the primary strategy to meet the `< 5s` latency goal. A fast KV store (Vercel KV, Cloudflare KV, Redis) is critical. The first load will be slower, which is acceptable.
- **CDN**: Docusaurus static assets (`.js`, `.css`, images, and base `.md` files) will be served via the GitHub Pages CDN for fast initial page loads.
- **Server Cost**: Using serverless functions for the backend ensures we only pay for active computation. The main cost driver will be Gemini API calls, which we mitigate with aggressive caching.
- **Latency Target**: The 5-second target applies to *subsequent* views of personalized/translated content. For first-time generation, a loading indicator must be displayed to manage user expectations.

## 8. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| **High Latency from Gemini API** (>10s) | Implement aggressive caching. For uncached requests, use a clear loading state ("Personalizing your content... this may take a moment"). Stream the response if possible. |
| **Inconsistent AI Output Quality** | Develop robust, few-shot prompts. Add a "Was this helpful?" feedback button to collect data for fine-tuning prompts. Manually review and cache high-traffic pages. |
| **Loss of Markdown Formatting** | Explicitly instruct the AI in the prompt to preserve all Markdown syntax, especially ` ``` ` code fences and frontmatter. Consider a post-processing step to sanitize the output if issues persist. |
| **"Better-Auth" Integration Complexity** | Isolate auth logic into a dedicated module. Start with the simplest OAuth 2.0 flow (e.g., social login) documented by the provider. Allocate a dedicated spike/task for this integration. |
| **Vendor Lock-in (Vercel/Netlify)** | Abstract all platform-specific logic (like KV store access) behind a common interface. This allows easier migration if needed. Start with a provider that supports standard Next.js API routes. |

## 9. Checklist of Ready-to-Implement Tasks

- **Setup**:
    - [ ] `npx create-docusaurus@latest my-website classic`
    - [ ] `git init` and push to a new GitHub repository.
    - [ ] Configure GitHub Pages deployment action for the `my-website` directory.
- **Content Generation**:
    - [ ] Write one high-level prompt for a sample chapter.
    - [ ] Write a Node.js script using `@google/generative-ai` to generate a `.md` file from the prompt.
- **Auth**:
    - [ ] Sign up for Better-Auth and get API keys.
    - [ ] Create `[...nextauth].js` or equivalent handler for the OAuth flow.
    - [ ] Build a basic `<LoginButton />` component.
    - [ ] Create a database/table for user profiles.
- **Backend API**:
    - [ ] Create the file `my-website/src/pages/api/personalize.js`.
    - [ ] Implement the cache-check logic.
    - [ ] Implement the Gemini API call with a hardcoded prompt.
    - [ ] Implement the database logic to fetch user tags.
- **Frontend Components**:
    - [ ] Create `PersonalizationButton.js` component.
    - [ ] Implement state management for `(isLoading, content, error)`.
    - [ ] Use a library like `react-markdown` to render the fetched content.
- **Translation**:
    - [ ] Create the `my-website/src/pages/api/translate.js` file.
    - [ ] Implement the translation logic (cache, Gemini call).
    - [ ] Build the `TranslateButton.js` component.