# Supernova Dashboard Frontend

React + Vite frontend for the Sigil Supernova dashboard.

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Dashboard | Live/cached intelligence: signal strip, brief, challenge the thesis, thesis radar, watchlist, research queue |
| `/value-chain` | Value Chain | Static AI infra stack: 7 phases, 22 tiers, watchlist map, risk overlays; shareable URL filters |
| `/mastery-guide` | Learning Hub | Static curriculum; Reference and Practice modes (quiz, flashcards, scenarios) |

## Scripts

Run from the repo root with `--prefix frontend`, or from this directory directly.

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Runtime API

The frontend calls the backend through relative routes:

- `GET /api/health`
- `GET /api/dashboard`
- `POST /api/sync`

In local development, Vite proxies API requests to the Express backend. In production, Vercel routes `/api/*` to `backend/server.js`.

Value Chain and Learning Hub are fully static — no API calls.

## Main files

- `src/App.jsx` - routing, dashboard composition, sync state, signal strip placement.
- `src/api.js` - API helpers.
- `src/utils/thesisRadarUtils.js` - drift status merge and display labels for Thesis Radar.
- `src/utils/valueChainUtils.js` - tier filters, URL param parse/build, watchlist stack entries.
- `src/pages/ValueChain.jsx` - Value Chain shell (hero, zones, URL-synced filters).
- `src/pages/MasteryGuide.jsx` - Learning Hub shell (Reference | Practice toggle, Mental Models tab).
- `src/data/aiInfraData.js` - phases, tiers, risk overlays, watchlist tier map.
- `src/data/masteryGuideData.js` - themes, books, reading list, glossary, essential flags, `MENTAL_MODELS` export.
- `src/data/academyData.js` - quiz, scenarios (merges extended modules).
- `src/data/quizQuestionsExtended.js`, `scenariosExtended.js` - practice content modules.
- `src/components/Header.jsx` - nav (Dashboard · Value Chain · Learning Hub), mode badge, sync button.
- `src/components/ValueChainSectionNav.jsx` - sticky sub-nav on Value Chain page.
- `src/components/value-chain/` - StackMap, TierExplorer, TierCard, WatchlistStack, RiskOverlays.
- `src/components/WhatIsThis.jsx` - product explainer.
- `src/components/SignalStrip.jsx` - page-level signal clusters from thesis drift.
- `src/components/WeeklyBrief.jsx` - analyst brief.
- `src/components/ChallengeThesis.jsx` - adversarial counter-thesis panel.
- `src/components/ThesisRadar.jsx` - 7-pillar drift table with expandable evidence.
- `src/components/Watchlist.jsx` - ticker list, filters, price/context rows, IPO spotlight.
- `src/components/ResearchQueue.jsx` - follow-up analyst checklist.
- `src/components/learning/` - Quiz, flashcards, scenarios, essential badges.

See `docs/06_value_chain.md` for Value Chain maintenance.
