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
│   │   ├── brief.js
│   │   ├── cache.js
│   │   ├── concurrency.js
│   │   ├── llm.js
│   │   ├── mockData.js
│   │   ├── news.js
│   │   ├── prices.js
│   │   ├── prompts.js
│   │   └── researchQueue.js
│   └── data/
│       └── cache.json
├── frontend/
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── WhatIsThis.jsx
│       │   ├── WeeklyBrief.jsx
│       │   ├── ThemePulse.jsx
│       │   ├── Watchlist.jsx
│       │   └── ResearchQueue.jsx
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
- routes `/api/*` to the backend and everything else to the built frontend.

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

`POST /api/sync` does real external work and can approach hosted function limits. The code reduces work on Vercel and the frontend aborts after 55 seconds. If sync fails:

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
