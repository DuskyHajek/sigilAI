# Supernova Intelligence Dashboard
### Current Product & Architecture Spec

## Product philosophy

> Do not build a Bloomberg terminal. Build something a Bloomberg terminal does not do for this specific thesis.

The dashboard is a lightweight investment intelligence demo for the Sigil Supernova thesis. The core value is the judgment layer: news and prices are interpreted against the fund's themes, bottlenecks, and counter-signals.

## Current scope

One page, four user-facing sections:

1. **Analyst Brief** - a concise generated summary of the most important current signals.
2. **Theme Pulse** - 7 theme cards with activity and thesis-fit scoring.
3. **Watchlist** - 20 curated names with price data, 52-week change, and thesis notes.
4. **Research Queue** - follow-up checks for an analyst after sync.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite | Single-page app, no router. |
| Styling | Tailwind CSS v4 + local CSS | Vite plugin setup; custom dashboard styles in `src/index.css` and `src/styles/`. |
| Backend | Node.js + Express | Small API and sync pipeline. |
| Hosting | Vercel | Dual build: Express server + static frontend build. |
| News | NewsAPI.org | Theme keyword searches. |
| Prices | Yahoo chart endpoint | Direct HTTP fetch in `backend/services/prices.js`. |
| AI | Anthropic Claude | Prompted via `backend/services/llm.js` and `backend/services/prompts.js`. |
| Cache | JSON file or remote KV | Local file in development; optional Vercel KV/Upstash for production. |

## Runtime config

The runtime product configuration lives in `config/thesis.js`:

- `THEMES`: display names, descriptions, colors, keywords, bull/bear signals.
- `WATCHLIST`: 20 currently displayed tickers, aliases, theme mapping, investment angles, priorities.
- helper functions for theme and ticker lookup.

Operational settings live in `config/settings.js`:

- Claude token budgets;
- significance threshold;
- max articles per theme;
- cache TTL.

## Data flow

Page load:

```text
Frontend
  ↓
GET /api/dashboard
  ↓
cached dashboard payload
```

Manual sync:

```text
POST /api/sync
  ↓
NewsAPI headlines per theme
  ↓
Claude article classification
  ↓
Theme pulse scoring
  ↓
Yahoo price fetch for 20 watchlist names
  ↓
Claude watchlist context lines
  ↓
Claude analyst brief + research queue
  ↓
cache write
  ↓
updated dashboard payload
```

There is no scheduled refresh in the current implementation. Sync is user-triggered from the header button.

## Backend API

| Method | Route | Response |
|---|---|---|
| `GET` | `/api/health` | Health, mode, API key presence, Vercel flag, cache backend, cache age, price status. |
| `GET` | `/api/dashboard` | Full cached dashboard payload. |
| `POST` | `/api/sync` | Runs full sync and returns the new payload with `syncOk: true`. |
| `POST` | `/api/refresh` | Legacy alias for full sync. |

## Dashboard payload shape

```javascript
{
  isMock: false,
  pricesLive: true,
  livePriceCount: 20,
  lastUpdated: "2026-05-27T...",
  themePulse: {
    datacenters: {
      activity_score: 7,
      thesis_score: 3,
      reason: "HBM supply tightening confirmed"
    }
  },
  watchlist: [
    {
      ticker: "NVDA",
      name: "Nvidia Corp.",
      company: "Nvidia Corp.",
      theme: "datacenters",
      angle: "GPU monopoly — the unavoidable pick-and-shovel",
      priority: "core",
      price: 214,
      currency: "USD",
      change52w: 14.2,
      priceSource: "yahoo",
      context: "..."
    }
  ],
  weeklyBrief: "...",
  researchQueue: {
    items: [
      {
        action: "Compare HBM memory supply headlines with SK Hynix and Micron capacity commentary.",
        keywords: ["HBM supply", "SK Hynix", "Micron"],
        theme: "datacenters",
        tickers: ["000660.KS", "MU"]
      }
    ]
  }
}
```

## Current file map

```text
backend/server.js
backend/services/news.js
backend/services/prices.js
backend/services/brief.js
backend/services/researchQueue.js
backend/services/articleMatch.js
backend/services/cache.js
backend/services/llm.js
backend/services/prompts.js
backend/services/mockData.js
backend/services/concurrency.js

frontend/src/App.jsx
frontend/src/api.js
frontend/src/components/Header.jsx
frontend/src/components/WhatIsThis.jsx
frontend/src/components/WeeklyBrief.jsx
frontend/src/components/ThemePulse.jsx
frontend/src/components/Watchlist.jsx
frontend/src/components/ResearchQueue.jsx
```

## Demo story

The dashboard should be demoed as a workflow:

1. Load instantly from cache.
2. Click **Sync live data**.
3. Start with the analyst brief.
4. Check which themes are active or challenged.
5. Open a watchlist note and explain why that event matters to the thesis.
6. Use the research queue as the next analyst checklist.

## Known constraints

- Hosted sync can be close to Vercel function timeouts. The backend applies lighter limits on Vercel, and the frontend aborts after 55 seconds.
- Remote cache is recommended for deployed live usage. Without it, Vercel uses `/tmp`, which is temporary.
- Price data uses an unofficial Yahoo endpoint and may occasionally return stale, cached, or unavailable values.
- The prompt system currently duplicates thesis language from `config/thesis.js` inside `backend/services/prompts.js`. Keep both aligned when thesis logic changes.
