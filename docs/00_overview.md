# Supernova Dashboard — Overview

## What this dashboard is

The Supernova Dashboard is a thesis-aware investment intelligence tool for the Sigil Supernova framework. It is not a generic news aggregator, stock screener, or lightweight Bloomberg clone. It reads headlines and prices through one specific investment lens, then surfaces what may matter to that thesis.

The demo goal is simple: show that the Sigil memo can be encoded as useful software.

## Current dashboard sections

### 0. Today's signals (signal strip)

When the thesis drift pass finds cross-company patterns, they appear in a strip above the brief. Each cluster names the bottleneck or shift, severity, and impacted themes. Clicking a cluster scrolls to the matching pillar in Thesis Radar.

If Claude times out on deployment, the strip hides; the rest of the dashboard still loads.

### 1. Analyst Brief

A short Claude-generated brief that starts the page. It summarizes the strongest signal, a secondary development, and **today's disconfirming signal** (sentence 3). The intended tone is a CIO morning note, not a chatbot recap.

**Content split vs Challenge the Thesis:**

- **Brief sentence 3** — references a **specific headline** from today's news flow (company, policy, or mechanism). Answers: what in today's feed contradicts or tests the thesis?
- **Challenge the CIO** — **structural** thesis risks with `riskType` badges (invalidation vs timing vs execution vs exogenous). Answers: what if the pillar premise is wrong?

**UI rendering** (`WeeklyBrief.jsx`):

- Backend returns plain text (3–4 sentences, no bullets).
- Frontend splits into visually separate lines for scannability with **semantic labels**: Primary Signal / Secondary / Counter / Watch (first four sentences).
- **Sentence 1** is larger, bold, and green (lead signal); sentences 2–4 are smaller and muted.
- Sentence splitting is **decimal-safe** — periods inside values like `$2.4T`, `15.5x`, or `€1.2B` must not break the text (regex: split only on `.` / `!` / `?` that are not between digits).

### 2. Challenge the Thesis

Structured adversarial pass: 2–3 bear cases with counter-indicators to watch, plus an optional **Thesis gap** callout. Pairs with the brief — bull synthesis vs. stress-tested counter-thesis.

**UI** (`ChallengeThesis.jsx` inside `StressTestZone`):

- Risk cards use the same visual language as **Research Tasks** (theme color bar, theme pill, `border-white/8`, `bg-[#1a1a1a]`).
- **`riskType` badge** on each live risk card: Structural / Timing / Execution / Exogenous — indicates how a CIO should respond (reduce conviction vs resize vs monitor). Hidden on standing risks from thesis config.
- **Source badge** reflects data provenance:
  - `Claude · adversarial pass` — full LLM pass succeeded.
  - `High-sig bearish headline` / `High-sig bearish headlines` — headline fallback (count-aware label).
  - `Standing risks · always on radar` — no live risks; shows curated `bear_signals[0]` per pillar from `config/thesis.js`.
- **Thesis gap** (`blindspotAlert`) must be a **concrete next step** for the CIO — e.g. “Verify whether RHM.DE supply chain exposure is disclosed in latest earnings” — not a restatement of the headline or generic process advice. Shared builder: `config/blindspot.js` (`buildActionBlindspotAlert`). When Claude times out, the headline fallback uses the same builder from displayed risk cards.

**Headline fallback** (when Claude adversarial pass fails on Vercel timeout):

1. Bearish articles assigned to themes, filtered by significance ≥ `adversarial_min_significance` (default 3).
2. If fewer than 2 high-sig hits, merge in bearish articles at `significance_threshold` (default 2) from other themes.
3. Up to 3 deduped risk cards with `riskType: "timing"`; `source: "headlines"`.

### 3. Thesis Radar

All seven Supernova pillars in one scannable view:

- **Drift status**: Accelerating / Mixed / Diverging (from `thesisDriftReport.themeStatusUpdate`, with programmatic fallback).
- **Headline count**: concrete number from classified articles this sync.
- **Watchlist tickers**: up to 3 names per theme (spotlight tickers like SPCX sort first).
- **Expand**: top headline title, narrative shift, evidence list, thesis one-liner.

Replaces the old Theme Pulse sentiment badges (Supportive / Mixed / Challenged).

In the **Pillars & watchlist** zone, Thesis Radar sits **above** the Watchlist (stacked layout, not side-by-side). Radar is compact (`max-h ~480px`); Watchlist is the primary full-width panel below.

### 4. Watchlist

21 curated Sigil thesis names across the 7 themes, plus optional **shared demo additions** via the **+ Add** button (visible to all users on the deployment). Each row shows:

- ticker and company;
- theme and investment angle;
- live or cached price;
- 52-week change;
- a short thesis-specific AI note;
- **Added** badge and remove control on custom entries only (`source: "custom"`).

The stock price is useful context, but the note is the product. It explains why a headline or sector signal matters for that specific thesis angle.

### 5. Research Queue

After a sync, the backend generates 3-7 follow-up checks. These are practical analyst prompts: what to read, compare, verify, or search next. They are suggestions, not conclusions or investment advice.

**UI reference pattern:** 2-column card grid with theme badges, ticker chips, and left color bar — other dashboard panels (Challenge the Thesis risk cards) follow this visual standard.

## Dashboard layout

The main route uses **chapter zones** (`DashboardZone.jsx`, styles in `frontend/src/index.css`):

| Zone | Contents |
|------|----------|
| Daily briefing | Editorial spotlight (SPCX CTA), Analyst Brief, signal strip |
| Counter-thesis & scenarios | `StressTestZone` — live headlines tab + hypothetical stress tester |
| Pillars & watchlist | Thesis Radar (compact) → Watchlist (full width, primary) |
| Research tasks | Research queue grid |

Vertical rhythm: consistent `2.5rem` margin + `2rem` padding between zones (`.dashboard-zone + .dashboard-zone`). Briefing stack uses tighter internal gap (`.dashboard-zone__stack-tight`).

Entry point unchanged: **SPCX spotlight** with “View SPCX in watchlist” CTA at top of daily briefing.

### 6. Value Chain

Route: `/value-chain`. Header nav: **VALUE CHAIN** (mobile: **Stack**).

A static structural map of the AI infrastructure physical stack. No backend or sync dependency.

**Full stack infographic** — wide 7-phase · 22-tier diagram below the hero; mobile swipe + tap-to-enlarge lightbox.

**Stack map** — 7 phases from pre-silicon inputs to compute monetisation; click to filter tiers.

**Holdings on the stack** — watchlist tickers mapped via `WATCHLIST_TIER_MAP` (8 names); 2-column grid with click-to-jump and tier highlight.

**Tier explorer** — 22 tiers with visual hierarchy (essential vs normal), phase separators, sticky phase nav while scrolling, players, moat, bottleneck, key metric, and Sigil angle. Filters: phase, essentials, watchlist exposure, search. **Essentials-only defaults ON** on first visit (~8–10 tiers); use `?essential=0` to show all 22.

URL params are shareable: `?tier=10`, `?phase=3`, `?essential=0` (show all). Full reference: `docs/06_value_chain.md`.

Data source: `frontend/src/data/aiInfraData.js`.

### 7. Learning Hub

Route: `/mastery-guide`. Header nav: **LEARNING HUB**.

A static study companion for the 7 Supernova themes. No backend or sync dependency.

**Reference mode**

- **Tab groups:** Overview / Models / Reading / Glossary (meta) visually separated from the 7 pillar curriculum tabs (AI Infra → Cyber).
- Per-theme tabs: key concepts (⚡ Essential badges + filter), essential books, courses, voices, mental models.
- **Mental Models** tab: all 26 frameworks, filterable by theme.
- Master reading list (34 books, filterable by level and theme).
- Glossary (56 terms, searchable).

**Practice mode**

- Quiz: 60 questions with quick (10), full (60), and per-theme modes; difficulty badges.
- Flashcards: glossary terms with flip-to-reveal definitions.
- Scenarios: 10 investment case drills; high interview-relevance cases marked.

Data sources:

- `frontend/src/data/masteryGuideData.js` — reference content, essential flags, mental models export.
- `frontend/src/data/academyData.js` — quiz and scenario content (merges extended modules).
- `frontend/src/data/quizQuestionsExtended.js`, `scenariosExtended.js`.

Offline review exports: `docs/sigil-supernova-learning-hub-export.html`, `docs/sigil-supernova-learning-academy.html`. Regenerate via `scripts/generate-learning-*.mjs`. Historical upgrade spec: `docs/archive/LEARNING_HUB_UPGRADE_SPEC.md`.

## APIs and data sources

### Anthropic Claude API

Claude is the judgment layer. It classifies articles (including structured `one_line` summaries that seed downstream panels), writes stock notes, scores theme pulses when appropriate, generates the analyst brief, adversarial assessment, thesis drift, and research queue.

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
