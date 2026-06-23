# Supernova Dashboard — Overview

## What this dashboard is

The Supernova Dashboard is a thesis-aware investment intelligence tool for the Sigil Supernova framework. It is not a generic news aggregator, stock screener, or lightweight Bloomberg clone. It reads headlines and prices through one specific investment lens, then surfaces what may matter to that thesis.

The demo goal is simple: show that the Sigil memo can be encoded as useful software.

## Current dashboard sections

### 0. Today's signals (signal strip)

When the thesis drift pass finds cross-company patterns, they appear in a strip above the brief. Each cluster names the bottleneck or shift, severity, and impacted themes. Clicking a cluster scrolls to the matching pillar in Thesis Radar.

If Claude times out on deployment, the strip hides; the rest of the dashboard still loads.

### 1. Analyst Brief

A short Claude-generated brief that starts the page. It summarizes the strongest signal, a secondary development, and a counter-thesis risk. The intended tone is a CIO morning note, not a chatbot recap.

### 2. Challenge the Thesis

Structured adversarial pass: 2–3 bear cases per pillar with counter-indicators to watch, plus an optional blindspot alert. Pairs with the brief — bull synthesis vs. stress-tested counter-thesis.

### 3. Thesis Radar

All seven Supernova pillars in one scannable view:

- **Drift status**: Accelerating / Mixed / Diverging (from `thesisDriftReport.themeStatusUpdate`, with programmatic fallback).
- **Headline count**: concrete number from classified articles this sync.
- **Watchlist tickers**: up to 3 names per theme (spotlight tickers like SPCX sort first).
- **Expand**: top headline title, narrative shift, evidence list, thesis one-liner.

Replaces the old Theme Pulse sentiment badges (Supportive / Mixed / Challenged).

### 4. Watchlist

21 curated public names across the 7 themes. Each row shows:

- ticker and company;
- theme and investment angle;
- live or cached price;
- 52-week change;
- a short thesis-specific AI note.

The stock price is useful context, but the note is the product. It explains why a headline or sector signal matters for that specific thesis angle.

### 5. Research Queue

After a sync, the backend generates 3-7 follow-up checks. These are practical analyst prompts: what to read, compare, verify, or search next. They are suggestions, not conclusions or investment advice.

### 6. Learning Hub

Route: `/mastery-guide`. Header nav: **LEARNING HUB**.

A static study companion for the 7 Supernova themes. No backend or sync dependency.

**Reference mode**

- Per-theme tabs: key concepts (⚡ Essential badges + filter), essential books, courses, voices, mental models.
- **Mental Models** tab: all 26 frameworks, filterable by theme.
- Master reading list (34 books, filterable by level and theme).
- Glossary (56 terms, searchable).

**Practice mode**

- Quiz: 60 questions with quick (10), full (60), and per-theme modes; difficulty badges.
- Flashcards: glossary terms with flip-to-reveal definitions.
- Scenarios: 10 investment case drills; high interview-relevance cases marked.
- Interview Prep: 10 questions with hints and sample answers.

Data sources:

- `frontend/src/data/masteryGuideData.js` — reference content, essential flags, mental models export.
- `frontend/src/data/academyData.js` — quiz and scenario content (merges extended modules).
- `frontend/src/data/interviewQuestions.js`, `quizQuestionsExtended.js`, `scenariosExtended.js`.

Offline review exports: `docs/sigil-supernova-learning-hub-export.html`, `docs/sigil-supernova-learning-academy.html`. See `docs/LEARNING_HUB_UPGRADE_SPEC.md` for the upgrade changelog.

## APIs and data sources

### Anthropic Claude API

Claude is the judgment layer. It classifies articles, writes stock notes, scores theme pulses when appropriate, generates the analyst brief, and creates the research queue.

Default model: `claude-sonnet-4-6`, configurable with `CLAUDE_MODEL`.

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
| `GET` | `/api/dashboard` | Returns the full cached dashboard payload: brief, theme pulse, drift report, adversarial assessment, watchlist, and research queue. |
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
