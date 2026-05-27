# Supernova Dashboard — Overview

## What this dashboard is

The Supernova Dashboard is a thesis-aware investment intelligence tool for the Sigil Supernova framework. It is not a generic news aggregator, stock screener, or lightweight Bloomberg clone. It reads headlines and prices through one specific investment lens, then surfaces what may matter to that thesis.

The demo goal is simple: show that the Sigil memo can be encoded as useful software.

## Current dashboard sections

### 1. Analyst Brief

A short Claude-generated brief that starts the page. It summarizes the strongest signal, a secondary development, and a counter-thesis risk. The intended tone is a CIO morning note, not a chatbot recap.

### 2. Theme Pulse

Seven Supernova themes are shown with:

- **Activity**: how much relevant headline flow exists, scored 1-10.
- **Thesis fit**: whether recent news supports or challenges the theme, scored -5 to +5.
- **Reason**: a short explanation of the dominant signal.

### 3. Watchlist

20 curated public names across the 7 themes. Each row shows:

- ticker and company;
- theme and investment angle;
- live or cached price;
- 52-week change;
- a short thesis-specific AI note.

The stock price is useful context, but the note is the product. It explains why a headline or sector signal matters for that specific thesis angle.

### 4. Research Queue

After a sync, the backend generates 3-7 follow-up checks. These are practical analyst prompts: what to read, compare, verify, or search next. They are suggestions, not conclusions or investment advice.

## APIs and data sources

### Anthropic Claude API

Claude is the judgment layer. It classifies articles, writes stock notes, scores theme pulses when appropriate, generates the analyst brief, and creates the research queue.

Default model: `claude-sonnet-4-20250514`, configurable with `CLAUDE_MODEL`.

### NewsAPI.org

NewsAPI fetches recent English headlines for each Supernova theme. Search keywords live in `config/thesis.js`.

### Yahoo Finance chart API

The backend fetches quote data directly from Yahoo's public chart endpoint. The app does not currently use the `yahoo-finance2` package.

### Cache

The app is cache-first. `GET /api/dashboard` returns the cached payload immediately. A sync writes a new payload.

Local development uses `backend/data/cache.json`. On Vercel, the app can use Vercel KV or Upstash Redis through `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Without remote KV, Vercel falls back to `/tmp`, which is temporary and best suited for demo usage.

## Backend routes

| Method | Route | What it does |
|---|---|---|
| `GET` | `/api/health` | Returns server status, LIVE/DEMO mode, cache age, key presence, cache backend, and price freshness metadata. |
| `GET` | `/api/dashboard` | Returns the full cached dashboard payload: brief, theme pulse, watchlist, and research queue. |
| `POST` | `/api/sync` | Runs the full manual refresh pipeline and writes the new dashboard payload to cache. |

There is also a legacy `POST /api/refresh` alias for older frontend clients.

## Refresh model

The current dashboard is manual-sync only. There are no cron jobs in `vercel.json`.

This is intentional for the demo:

- API usage stays controlled.
- The user can explain the sync live.
- The frontend never blocks page load on external APIs.
- Vercel timeout risk is easier to manage.

## What this achieves

The dashboard achieves the core v0.1 goal: it turns the Supernova thesis into a working intelligence layer. The useful behavior is not that it shows prices or headlines. The useful behavior is that it filters those signals through a specific thesis and asks: does this matter, why, and what should we check next?

The demo moment is still the same: open a watchlist name, read the AI note, and see whether it explains the event through the actual Supernova logic rather than generic market commentary.
