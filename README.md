# Sigil Supernova Intelligence Dashboard

A thesis-driven investment intelligence dashboard for the **Sigil Supernova** fund thesis. It combines market headlines, watchlist prices, and Claude-generated analysis into one focused demo: what changed, why it matters to the thesis, and what an analyst should check next.

## What It Shows

The app has two main areas:

### Dashboard (`/`)

Four working intelligence sections:

1. **Analyst Brief** - a 3-4 sentence CIO-style summary of the strongest current signals.
2. **Theme Pulse** - activity and thesis-fit scores for the 7 Supernova themes.
3. **Watchlist** - 20 curated public names with price data, 52-week change, and a thesis-specific AI note.
4. **Research Queue** - 3-7 suggested follow-up checks after each sync.

### Learning Hub (`/mastery-guide`)

Static curriculum and practice for all 7 investment themes. No API calls or sync required.

**Reference mode** — per-theme concepts (with ⚡ Essential badges and filter), books, courses, voices, mental models; standalone **Mental Models** tab (26 frameworks); master reading list (34 books); glossary (56 terms).

**Practice mode** — interactive study tools:

- **Quiz** — 60 questions (quick 10, full 60, or by theme) with difficulty badges and instant feedback.
- **Flashcards** — glossary terms with flip-to-reveal definitions, filterable by theme.
- **Scenarios** — 10 investment case drills with expandable analysis; ⭐ Interview priority on high-relevance cases.
- **Interview Prep** — 10 questions with hints and sample answers (motivation, thesis, dashboard, curveball).

Content lives in `frontend/src/data/masteryGuideData.js`, `academyData.js`, and split modules `quizQuestionsExtended.js`, `scenariosExtended.js`, `interviewQuestions.js`. Offline HTML exports in `docs/`; regenerate via `scripts/generate-learning-*.mjs`.

The product goal is not to be a Bloomberg clone. The value is the thesis-specific judgment layer on top of news and prices.

## Getting Started

Install root, backend, and frontend dependencies:

```bash
npm run install-all
```

Start both the Express backend and Vite frontend:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Configuration

Create a root `.env` file. Do not commit it.

```bash
PORT=3001
NODE_ENV=development
CACHE_TTL_HOURS=1

ANTHROPIC_API_KEY=your_anthropic_api_key
NEWS_API_KEY=your_newsapi_key

# Optional
CLAUDE_MODEL=claude-sonnet-4-6
KV_REST_API_URL=your_vercel_kv_or_upstash_url
KV_REST_API_TOKEN=your_vercel_kv_or_upstash_token
```

If `ANTHROPIC_API_KEY` or `NEWS_API_KEY` is missing, the backend uses demo data. That keeps the UI usable without external services, but live sync requires both keys.

## Current Architecture

```text
supernova-dashboard/
├── package.json                  # Root launcher
├── vercel.json                   # Vercel routing/build config
├── config/
│   ├── settings.js               # Token budgets, thresholds, cache TTL
│   └── thesis.js                 # Runtime themes, keywords, tickers, colors
├── backend/
│   ├── server.js                 # Express API and sync pipeline
│   ├── services/
│   │   ├── articleMatch.js       # Maps headlines to watchlist names
│   │   ├── brief.js              # Weekly/analyst brief generation
│   │   ├── cache.js              # Local file cache + optional remote KV
│   │   ├── concurrency.js        # Small async concurrency helper
│   │   ├── llm.js                # Anthropic client wrapper
│   │   ├── mockData.js           # Demo payload fallback
│   │   ├── news.js               # NewsAPI fetch + classification + theme pulse
│   │   ├── prices.js             # Yahoo chart API price fetch + stock notes
│   │   ├── prompts.js            # Claude prompts
│   │   └── researchQueue.js      # Follow-up research suggestions
│   └── data/
│       └── cache.json            # Local cache, generated at runtime
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── data/
    │   │   ├── masteryGuideData.js   # Reference curriculum (themes, books, glossary, mental models)
    │   │   ├── academyData.js        # Quiz, scenarios, interview prep (merged exports)
    │   │   ├── quizQuestionsExtended.js
    │   │   ├── scenariosExtended.js
    │   │   └── interviewQuestions.js
    │   ├── pages/
    │   │   └── MasteryGuide.jsx      # Learning Hub (Reference + Practice)
    │   └── components/
    │       ├── Header.jsx
    │       ├── WhatIsThis.jsx
    │       ├── WeeklyBrief.jsx
    │       ├── ThemePulse.jsx
    │       ├── Watchlist.jsx
    │       ├── ResearchQueue.jsx
    │       └── learning/
    │           ├── QuizSection.jsx
    │           ├── FlashcardSection.jsx
    │           ├── ScenarioSection.jsx
    │           ├── InterviewPrepSection.jsx
    │           └── EssentialBadge.jsx
    └── vite.config.js
```

Regenerate offline Learning Hub HTML after data changes:

```bash
node scripts/generate-learning-hub-export.mjs
node scripts/generate-learning-academy-html.mjs
```

## API Surface

The backend intentionally exposes only a small API:

- `GET /api/health` - status, mode, cache age, key presence, cache backend.
- `GET /api/dashboard` - cached full dashboard payload.
- `POST /api/sync` - manual full refresh: news, classifications, prices, AI notes, brief, research queue, cache write.

There is also a legacy `POST /api/refresh` alias for older clients.

## Data Flow

The dashboard is cache-first. Page loads read from `/api/dashboard`. External API calls only happen when the user clicks **Sync live data**.

```text
NewsAPI headlines + Yahoo prices
        ↓
Claude classification and thesis analysis
        ↓
Theme pulse + watchlist notes + analyst brief + research queue
        ↓
Cache
        ↓
Frontend dashboard
```

There are no background cron jobs in the current app. Hosted sync can be constrained by Vercel function timeouts, so the backend uses lighter limits on Vercel and the frontend aborts sync after 55 seconds with a retry-friendly message.

## Docs

- `docs/00_overview.md` - product narrative and current behavior.
- `docs/supernova_dashboard_spec.md` - current architecture spec.
- `docs/01_thesis_config.md` - thesis and watchlist reference.
- `docs/02_prompt_library.md` - prompt reference and tuning notes.
- `docs/03_maintenance_playbook.md` - common maintenance tasks.
- `docs/04_dev_setup.md` - local setup and Vercel deployment.
