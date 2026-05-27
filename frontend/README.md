# Supernova Dashboard Frontend

React + Vite frontend for the Sigil Supernova dashboard.

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

- `src/App.jsx` - dashboard composition and sync state.
- `src/api.js` - API helpers.
- `src/components/Header.jsx` - mode badge, sync button, last sync.
- `src/components/WhatIsThis.jsx` - product explainer.
- `src/components/WeeklyBrief.jsx` - analyst brief.
- `src/components/ThemePulse.jsx` - 7 theme pulse cards.
- `src/components/Watchlist.jsx` - ticker list, filters, price/context rows.
- `src/components/ResearchQueue.jsx` - follow-up analyst checklist.
