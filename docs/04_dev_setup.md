# Supernova Dashboard — Dev Setup & Deployment

## Prerequisites

- Node.js 18+
- npm
- Git
- Optional for live mode: Anthropic API key and NewsAPI key
- Optional for deployed persistent cache: Vercel KV or Upstash Redis REST credentials

## Install

From the repo root:

```bash
npm run install-all
```

This installs root, backend, and frontend dependencies.

## Environment

Create a root `.env` file:

```bash
PORT=3001
NODE_ENV=development
CACHE_TTL_HOURS=1

ANTHROPIC_API_KEY=your_anthropic_api_key
NEWS_API_KEY=your_newsapi_key

# Optional model override
CLAUDE_MODEL=claude-sonnet-4-6

# Optional deployed cache
KV_REST_API_URL=your_remote_cache_url
KV_REST_API_TOKEN=your_remote_cache_token
```

If Anthropic or NewsAPI is missing, the backend runs in demo-data mode.

## Run locally

From the repo root:

```bash
npm run dev
```

This starts:

- backend at `http://localhost:3001`;
- frontend at `http://localhost:5173`.

Open `http://localhost:5173`. The dashboard should load from cache or demo data. Click **Sync live data** to run the live pipeline when keys are configured.

Static routes (no API):

- Value Chain: `http://localhost:5173/value-chain`
- Learning Hub: `http://localhost:5173/mastery-guide` (Reference: concepts, mental models, reading list, glossary · Practice: quiz, flashcards, scenarios)

## Current project structure

```text
supernova-dashboard/
├── config/
│   ├── settings.js
│   └── thesis.js
├── backend/
│   ├── server.js
│   ├── services/
│   │   ├── articleMatch.js
│   │   ├── adversarial.js
│   │   ├── brief.js
│   │   ├── cache.js
│   │   ├── concurrency.js
│   │   ├── llm.js
│   │   ├── mockData.js
│   │   ├── news.js
│   │   ├── newsAggregation.js
│   │   ├── prices.js
│   │   ├── prompts.js
│   │   ├── researchQueue.js
│   │   └── thesisDrift.js
│   └── data/
│       └── cache.json
├── frontend/
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── data/
│       │   ├── masteryGuideData.js
│       │   ├── academyData.js
│       │   ├── aiInfraData.js
│       │   ├── quizQuestionsExtended.js
│       │   └── scenariosExtended.js
│       ├── pages/
│       │   ├── MasteryGuide.jsx
│       │   └── ValueChain.jsx
│       ├── utils/
│       │   ├── thesisRadarUtils.js
│       │   └── valueChainUtils.js
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── ValueChainSectionNav.jsx
│       │   ├── value-chain/
│       │   ├── WhatIsThis.jsx
│       │   ├── SignalStrip.jsx
│       │   ├── WeeklyBrief.jsx
│       │   ├── ChallengeThesis.jsx
│       │   ├── ThesisRadar.jsx
│       │   ├── Watchlist.jsx
│       │   ├── ResearchQueue.jsx
│       │   └── learning/
│       │       ├── QuizSection.jsx
│       │       ├── FlashcardSection.jsx
│       │       ├── ScenarioSection.jsx
│       │       └── EssentialBadge.jsx
│       └── styles/
│           └── theme-cards.css
├── docs/
├── package.json
└── vercel.json
```

## Backend routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Health, mode, key presence, cache status. |
| `GET` | `/api/dashboard` | Full cached dashboard payload. |
| `POST` | `/api/sync` | Manual full data refresh. |
| `POST` | `/api/refresh` | Legacy alias for full refresh. |

There are no separate `/api/themes`, `/api/watchlist`, `/api/brief`, or `/api/sync/brief` routes in the current implementation.

## Validation

Before pushing changes:

```bash
npm run build --prefix frontend
npm run lint --prefix frontend
node --check backend/server.js
```

You can also syntax-check touched backend service files with `node --check`.

## Deploying to Vercel

The current `vercel.json` builds:

- `backend/server.js` with `@vercel/node`;
- `frontend/package.json` with `@vercel/static-build`;
- routes `/api/*` to the backend;
- SPA fallbacks for `/mastery-guide` and `/value-chain` → `frontend/index.html`;
- all other static assets → `frontend/$1`.

Current `vercel.json` does not define cron jobs.

### Required Vercel env vars for live mode

- `ANTHROPIC_API_KEY`
- `NEWS_API_KEY`
- `NODE_ENV=production`
- `CACHE_TTL_HOURS=1`

### Recommended Vercel env vars for persistent cache

Use either Vercel KV or Upstash-compatible names:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

or:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Without remote cache, Vercel writes to `/tmp`, which is temporary.

## Hosted sync expectations

`POST /api/sync` does real external work and can approach hosted function limits. The code reduces work on Vercel and the frontend aborts after 55 seconds.

After a successful sync on deployment you should see:

- **Thesis Radar** — all 7 pillars with drift status, headline counts, and tickers (drift falls back to programmatic mapping if Claude thesis drift times out).
- **Today's signals** strip — only when the thesis drift Claude pass completes; hidden otherwise (not an error).
- **Challenge the Thesis** — adversarial risks when Claude completes; headline fallback (`source: "headlines"`) with count-aware badge and theme-specific **Thesis gap** otherwise.
- **Analyst Brief** — 3–4 sentences rendered as separate lines; first sentence emphasized; no break at decimal valuations (e.g. `$2.4T`).
- **Watchlist** — 21 names with Yahoo prices where available; full-width panel below compact Thesis Radar.

If sync fails:

1. Retry once.
2. Check Vercel function logs.
3. Confirm API keys are present in `/api/health`.
4. If needed, lower `max_articles_per_theme` in `config/settings.js`.
5. Run locally with the same keys for deeper debugging.

## Production checklist

- Confirm `npm run build --prefix frontend` passes.
- Confirm required env vars are set in Vercel.
- Configure remote KV if you need persistent live cache.
- Redeploy after env var changes.
- Visit `/api/health`.
- Open the dashboard and run **Sync live data**.
