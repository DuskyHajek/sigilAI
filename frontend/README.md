# Supernova Dashboard Frontend

React + Vite frontend for the Sigil Supernova dashboard.

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Dashboard | Live/cached intelligence: brief, theme pulse, watchlist, research queue |
| `/mastery-guide` | Learning Hub | Static curriculum; Reference and Practice modes (quiz, flashcards, scenarios, interview prep) |

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

## Main files

- `src/App.jsx` - routing, dashboard composition, and sync state.
- `src/api.js` - API helpers.
- `src/pages/MasteryGuide.jsx` - Learning Hub shell (Reference | Practice toggle, Mental Models tab).
- `src/data/masteryGuideData.js` - themes, books, reading list, glossary, essential flags, `MENTAL_MODELS` export.
- `src/data/academyData.js` - quiz, scenarios, interview prep (merges extended modules).
- `src/data/quizQuestionsExtended.js`, `scenariosExtended.js`, `interviewQuestions.js` - practice content modules.
- `src/components/Header.jsx` - nav, mode badge, sync button, last sync.
- `src/components/WhatIsThis.jsx` - product explainer.
- `src/components/WeeklyBrief.jsx` - analyst brief.
- `src/components/ThemePulse.jsx` - 7 theme pulse cards.
- `src/components/Watchlist.jsx` - ticker list, filters, price/context rows.
- `src/components/ResearchQueue.jsx` - follow-up analyst checklist.
- `src/components/learning/` - Quiz, flashcards, scenarios, interview prep, essential badges.
