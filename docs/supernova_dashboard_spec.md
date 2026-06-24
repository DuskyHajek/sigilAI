# Supernova Intelligence Dashboard
### Current Product & Architecture Spec

## Product philosophy

> Do not build a Bloomberg terminal. Build something a Bloomberg terminal does not do for this specific thesis.

The dashboard is a lightweight investment intelligence demo for the Sigil Supernova thesis. The core value is the judgment layer: news and prices are interpreted against the fund's themes, bottlenecks, and counter-signals.

## Current scope

Three frontend routes:

### Dashboard (`/`)

0. **Today's signals** — cross-company clusters from thesis drift (when available).
1. **Analyst Brief** — 3–4 sentence CIO note; UI splits into scannable lines with the lead sentence emphasized (decimal-safe — `$2.4T` stays intact).
2. **Challenge the Thesis** — adversarial bear cases, **Thesis gap** (specific blindspot, not meta-advice), source badge; headline fallback when Claude times out.
3. **Thesis Radar** — 7-pillar table: drift status, headline count, tickers; expand for evidence. Compact panel in stacked layout.
4. **Watchlist** — 21 curated names with price data, change, thesis notes, and IPO spotlight (SPCX). Full-width primary panel below Thesis Radar.
5. **Research Queue** — follow-up checks for an analyst after sync (visual reference for card styling across the dashboard).

### Value Chain (`/value-chain`)

Static AI infrastructure stack reference. No API dependency.

- **Stack map** — 7 phases; click to filter tiers.
- **Risk overlays** — 3 institutional alpha signals (compact grid, above tiers).
- **Holdings** — watchlist tickers mapped to tiers (`WATCHLIST_TIER_MAP`); click-to-jump grid.
- **Tier explorer** — 22 tiers with essential hierarchy, phase separators, sticky phase nav.

Shareable filters via URL params (`?tier=10`, `?phase=3`). See `docs/06_value_chain.md`.

Data: `frontend/src/data/aiInfraData.js`.

### Learning Hub (`/mastery-guide`)

Static curriculum and practice. No API dependency.

- **Reference** — themes (⚡ essential concepts), books, courses, voices, mental models; dedicated Mental Models tab; reading list; glossary.
- **Practice** — quiz (60 Q, difficulty badges), flashcards (from glossary), scenarios (10 cases, interview priority badges).

Regenerate offline HTML after data edits: `node scripts/generate-learning-hub-export.mjs`, `node scripts/generate-learning-academy-html.mjs`.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite + React Router | Dashboard `/`, Value Chain `/value-chain`, Learning Hub `/mastery-guide`. |
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
- `WATCHLIST`: 21 currently displayed tickers, aliases, theme mapping, investment angles, priorities, optional `spotlight` (e.g. SPCX IPO).
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

## Dashboard layout & visual hierarchy

```text
Daily briefing zone
  EditorialSpotlight (SPCX CTA)
  WeeklyBrief (lead sentence highlighted)
  SignalStrip (when drift clusters exist)

Counter-thesis & scenarios zone
  StressTestZone → ChallengeThesis (embedded) | StressTestPanel

Pillars & watchlist zone  (stacked, not 50/50 grid)
  ThesisRadar  (compact, scrollable, stackedLayout)
  Watchlist    (full width, primary, stackedLayout)

Research tasks zone
  ResearchQueue (2-col card grid — styling reference)
```

Zone spacing: `.dashboard-zone + .dashboard-zone` → `margin-top: 2.5rem`, `padding-top: 2rem`, subtle top border.

Color hierarchy (unchanged): neon green `ACCELERATING`, rose `DRIFTING`, dark `#121212` panels, sigil-gold accents.

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
  },
  adversarialAssessment: {
    asymmetricRisks: [
      {
        targetTheme: "datacenters",
        headlineRisk: "HBM exclusivity may be a mirage",
        riskType: "timing",
        adversarialArgument: "...",
        counterIndicatorToWatch: "SK Hynix capacity utilization vs Samsung HBM3e yield rates"
      }
    ],
    blindspotAlert: "Three themes still score bullish on activity while thesis fit is mixed — portfolio may overweight physical bottlenecks.",
    source: "claude"
  },
  thesisDriftReport: {
    detectedClusters: [
      {
        clusterName: "Advanced Packaging Supply Bottlenecks",
        impactedThemes: ["datacenters"],
        evidenceSummary: "...",
        severityScore: 7
      }
    ],
    themeStatusUpdate: [
      {
        themeId: "datacenters",
        status: "ACCELERATING",
        narrativeShiftDetails: "..."
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
backend/services/adversarial.js
backend/services/thesisDrift.js
backend/services/newsAggregation.js
backend/services/articleMatch.js
backend/services/cache.js
backend/services/llm.js
backend/services/prompts.js
backend/services/mockData.js
backend/services/concurrency.js

frontend/src/App.jsx
frontend/src/api.js
frontend/src/pages/ValueChain.jsx
frontend/src/pages/MasteryGuide.jsx
frontend/src/data/aiInfraData.js
frontend/src/data/masteryGuideData.js
frontend/src/data/academyData.js
frontend/src/data/quizQuestionsExtended.js
frontend/src/data/scenariosExtended.js
frontend/src/utils/valueChainUtils.js
frontend/src/components/ValueChainSectionNav.jsx
frontend/src/components/value-chain/StackMap.jsx
frontend/src/components/value-chain/TierExplorer.jsx
frontend/src/components/value-chain/TierCard.jsx
frontend/src/components/value-chain/PhaseSeparator.jsx
frontend/src/components/value-chain/StickyPhaseNav.jsx
frontend/src/components/value-chain/WatchlistStack.jsx
frontend/src/components/value-chain/RiskOverlays.jsx
frontend/src/components/Header.jsx
frontend/src/components/WhatIsThis.jsx
frontend/src/components/SignalStrip.jsx
frontend/src/components/EditorialSpotlight.jsx
frontend/src/components/DashboardZone.jsx
frontend/src/components/StressTestZone.jsx
frontend/src/components/WeeklyBrief.jsx
frontend/src/components/ChallengeThesis.jsx
frontend/src/components/ThesisRadar.jsx
frontend/src/utils/thesisRadarUtils.js
frontend/src/components/Watchlist.jsx
frontend/src/components/ResearchQueue.jsx
frontend/src/components/learning/QuizSection.jsx
frontend/src/components/learning/FlashcardSection.jsx
frontend/src/components/learning/ScenarioSection.jsx
frontend/src/components/learning/EssentialBadge.jsx
frontend/src/components/learning/ThemeBadge.jsx
```

## Demo story

The dashboard should be demoed as a workflow:

1. Load instantly from cache.
2. Click **Sync live data** (requires `ANTHROPIC_API_KEY` + `NEWS_API_KEY` on deployment).
3. Read **Today's signals** for cross-company clusters (when drift pass completes).
4. Start with the analyst brief (scannable 3–4 lines), then read **Challenge the Thesis** for adversarial risks and the **Thesis gap** callout.
5. Scan all seven pillars in **Thesis Radar**, then scroll to the full-width **Watchlist** — open a note (e.g. SPCX) and explain why the event matters to the thesis.
6. Use the research queue as the next analyst checklist.

## Known constraints

- Hosted sync can be close to Vercel function timeouts. The backend applies lighter limits on Vercel, and the frontend aborts after 55 seconds.
- Remote cache is recommended for deployed live usage. Without it, Vercel uses `/tmp`, which is temporary.
- Price data uses an unofficial Yahoo endpoint and may occasionally return stale, cached, or unavailable values.
- The prompt system currently duplicates thesis language from `config/thesis.js` inside `backend/services/prompts.js`. Keep both aligned when thesis logic changes.
