# Sigil Supernova Intelligence Dashboard

A thesis-driven investment intelligence dashboard for the **Sigil Supernova** fund thesis. It combines market headlines, watchlist prices, and Claude-generated analysis into one focused demo: what changed, why it matters to the thesis, and what an analyst should check next.

## What It Shows

The app has three main areas:

### Dashboard (`/`)

Four working intelligence sections plus a signal strip:

0. **Today's signals** — cross-company headline clusters from the thesis drift pass (when available).
1. **Analyst Brief** — 3–4 sentences; sentence 3 cites a **specific disconfirming headline** from today (distinct from structural CIO risks below). UI splits into scannable lines with lead sentence highlighted (decimal-safe for `$2.4T`, etc.).
2. **Challenge the Thesis** — adversarial bear cases with **`riskType` badges** (Structural / Timing / Execution / Exogenous), **Thesis gap** (specific blindspot), source badge; headline fallback on Vercel timeout.
3. **Thesis Radar** — all 7 pillars: drift status, headline count, tickers; compact panel above watchlist.
4. **Watchlist** — 21 curated public names with price data, change, and thesis-specific AI note (SPCX spotlight); full-width primary panel.
5. **Research Queue** — 3–7 suggested follow-up checks; card grid is the visual reference for other panels.

**Layout:** Daily briefing → Counter-thesis & scenarios → Pillars & watchlist (stacked radar + watchlist) → Research tasks. Consistent zone spacing in `index.css`.

### Value Chain (`/value-chain`)

Static map of the AI infrastructure physical stack — 7 phases, 22 tiers, watchlist placement, and 3 risk overlays. No API or sync required.

- **Stack map** — phase pipeline with thesis roles; click to filter tiers.
- **Risk overlays** — institutional bear/cyclical/bull signals (3-column grid, above tiers).
- **Holdings on the stack** — 2-column ticker grid; click jumps to tier with highlight pulse.
- **Tier explorer** — searchable tiers with essential/normal hierarchy, phase separators, sticky phase nav, players, moat, bottleneck, metric, Sigil angle.

Shareable URL filters: `?tier=10`, `?phase=3`, `?essential=1`, etc. See `docs/06_value_chain.md`.

Data: `frontend/src/data/aiInfraData.js`.

### Learning Hub (`/mastery-guide`)

Static curriculum and practice for all 7 investment themes. No API calls or sync required.

**Reference mode** — per-theme concepts (with ⚡ Essential badges and filter), books, courses, voices, mental models; standalone **Mental Models** tab (26 frameworks); master reading list (34 books); glossary (56 terms).

**Practice mode** — interactive study tools:

- **Quiz** — 60 questions (quick 10, full 60, or by theme) with difficulty badges and instant feedback.
- **Flashcards** — glossary terms with flip-to-reveal definitions, filterable by theme.
- **Scenarios** — 10 investment case drills with expandable analysis.

Content lives in `frontend/src/data/masteryGuideData.js`, `academyData.js`, and split modules `quizQuestionsExtended.js`, `scenariosExtended.js`. Offline HTML exports in `docs/`; regenerate via `scripts/generate-learning-*.mjs`.

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
│   │   ├── researchQueue.js      # Follow-up research suggestions
│   │   ├── adversarial.js        # Challenge the Thesis (adversarial pass)
│   │   ├── thesisDrift.js        # Signal clusters + drift status (7 pillars)
│   │   ├── stressTest.js         # On-demand scenario stress tests
│   │   └── newsAggregation.js    # Annotated news flow for drift prompt
│   └── data/
│       └── cache.json            # Local cache, generated at runtime
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── utils/thesisRadarUtils.js
    │   ├── data/
    │   │   ├── masteryGuideData.js   # Reference curriculum (themes, books, glossary, mental models)
    │   │   ├── academyData.js        # Quiz, scenarios (merged exports)
    │   │   ├── aiInfraData.js        # Value Chain (phases, tiers, overlays, watchlist map)
    │   │   ├── quizQuestionsExtended.js
    │   │   ├── scenariosExtended.js
    │   ├── pages/
    │   │   ├── MasteryGuide.jsx      # Learning Hub (Reference + Practice)
    │   │   └── ValueChain.jsx        # AI Infrastructure Value Chain
    │   └── components/
    │       ├── Header.jsx
    │       ├── ValueChainSectionNav.jsx
    │       ├── value-chain/          # StackMap, TierExplorer, RiskOverlays, …
    │       ├── WhatIsThis.jsx
    │       ├── SignalStrip.jsx       # Page-level signal clusters
    │       ├── WeeklyBrief.jsx
    │       ├── ChallengeThesis.jsx   # Adversarial counter-thesis panel
    │       ├── ThesisRadar.jsx       # 7-pillar drift + headline table
    │       ├── Watchlist.jsx
    │       ├── ResearchQueue.jsx
    │       └── learning/
    │           ├── QuizSection.jsx
    │           ├── FlashcardSection.jsx
    │           ├── ScenarioSection.jsx
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
- `POST /api/sync` - manual full refresh: news, classifications, prices, AI notes, brief, adversarial pass, thesis drift, research queue, cache write.

There is also a legacy `POST /api/refresh` alias for older clients.

## Data Flow

The dashboard is cache-first. Page loads read from `/api/dashboard`. External API calls only happen when the user clicks **Sync live data**.

```text
NewsAPI headlines + Yahoo prices
        ↓
Claude classification and thesis analysis
        ↓
Theme pulse + drift report + adversarial pass + watchlist notes + brief + research queue
        ↓
Cache
        ↓
Frontend dashboard
```

There are no background cron jobs in the current app. Hosted sync can be constrained by Vercel function timeouts (60s), so the backend uses lighter limits on Vercel and the frontend aborts sync after 55 seconds with a retry-friendly message. On Vercel, per-theme Claude scoring is skipped (programmatic fallback); **Thesis Radar still renders all 7 pillars** from drift status + headline evidence. Signal clusters appear when the thesis drift Claude pass completes; if it times out, the strip hides gracefully.

## Docs

Start at [`docs/README.md`](docs/README.md) for the full index.

- `docs/00_overview.md` — product narrative and current behavior.
- `docs/supernova_dashboard_spec.md` — current architecture spec.
- `docs/06_value_chain.md` — Value Chain explorer reference.
- `docs/01_thesis_config.md` — thesis and watchlist reference.
- `docs/02_prompt_library.md` — full prompt text, stress scenarios, token limits, tuning checklist.
- `docs/03_maintenance_playbook.md` — common maintenance tasks.
- `docs/04_dev_setup.md` — local setup and Vercel deployment.
- `docs/archive/` — implemented feature specs (historical).
