# AI Infrastructure Value Chain

Route: **`/value-chain`** · Header nav: **Value Chain** (mobile: **Stack**)

Static reference layer between the live Dashboard and the Learning Hub. Maps the physical AI infrastructure stack from raw materials to token monetisation — no API or sync dependency.

## Product role

| Area | Question it answers |
|------|---------------------|
| Dashboard (`/`) | What is happening *now*? |
| **Value Chain** (`/value-chain`) | *Where* in the physical stack do bottlenecks and holdings sit? |
| Learning Hub (`/mastery-guide`) | *How* should I think about the 7 themes? |

Cross-links:

- Value Chain hero → Learning Hub
- Learning Hub → AI Infrastructure theme tab → Value Chain

## Page zones

Sticky sub-nav: **Map · Overlays · Holdings · Tiers**

Scroll order (top → bottom):

1. **Stack map** — orientation and phase selection
2. **Risk overlays** — institutional lens before browsing tiers
3. **Holdings on the stack** — ticker → tier mapping (unique Sigil insight)
4. **Tier explorer** — full 22-tier reference with filters and phase chrome

### 1. Stack map (`#vc-map`)

Seven macro phases (Phase 0 → Phase VI). Desktop: uniform cards in a 4+3 flex grid (equal width, fixed min-height). Mobile: horizontal scroll with snap.

Each card shows: phase label, tier range badge, name, focus areas, tier count. Click → filter tiers + insight panel below.

### 2. Risk overlays (`#vc-overlays`)

Three institutional sizing signals — placed **above** the tier list so they are read before browsing.

| Overlay | Type | Tiers affected |
|---------|------|----------------|
| Hardware Obsolescence Trap | Bear | 19 |
| CapEx-to-Revenue Air Pocket | Cyclical | 7, 8, 13 |
| Power Arbitrage as Macro Moat | Bull | 2, 16, 17 |

Desktop: compact 3-column grid with type-coloured surfaces. Summary visible by default; click to expand detail, affected tiers, and watch signals.

Tier chips navigate to the Tier Explorer with `?tier=N` (scroll + expand + brief highlight pulse).

### 3. Holdings on the stack (`#vc-holdings`)

Maps Sigil watchlist tickers to tiers via `WATCHLIST_TIER_MAP`.

- **2-column ticker card grid** on `sm+`: ticker, tier badge, tier name, note; wrapped in featured green panel
- Click a ticker → jump to its tier in the explorer (scroll, expand, 2s highlight)

Not every watchlist name appears here — only names mapped to the physical stack (currently 8). Robotics, space, cyber, and biotech names live outside this map.

### 4. Tier explorer (`#vc-tiers`)

All 22 tiers with filters:

- Phase pills (filter — shown when a phase filter or search is active; use Stack map to filter from all-phases view)
- ⚡ Essentials only (`tier.essential === true`) — **ON by default** on first visit; toggle “Show all tiers” writes `?essential=0`
- 🔖 Watchlist only (tiers with `WATCHLIST_TIER_MAP` or `watchlistTickers`)
- Full-text search

**Visual hierarchy**

| Class | When | Effect |
|-------|------|--------|
| Essential | `tier.essential === true` | Green left border (`#1D9E75`), full opacity |
| Normal | `tier.essential === false` | Muted border, ~72% opacity |
| Watchlist | Mapped ticker or `watchlistTickers` | Stronger green border glow on essential tiers |

**Phase chrome** (when browsing all phases with no search query)

- **Phase separator banners** — full-width coloured band with phase label, name, and `thesisRole`
- **Sticky explorer toolbar** — single bar (no duplicate phase pills): scroll-position chips + essential/watchlist filters; phase filter pills appear only when a phase filter or search is active

Phase separators and sticky toolbar are hidden when a single-phase filter or search query is active.

Each tier card expands to: players, moat, bottleneck (amber accent), key metric, **Sigil angle** (gold accent).

## URL parameters (shareable, bidirectional)

Filters sync to the URL with `replace: true`:

| Param | Example | Effect |
|-------|---------|--------|
| `tier` | `?tier=10` | Expand and scroll to tier 10 (+ highlight pulse) |
| `phase` | `?phase=3` | Filter to Phase III (`PHASES[].number`) |
| `essential` | *(default ON)* | Essentials-only; omit param or use `?essential=0` to show all 22 tiers |
| `watchlist` | `?watchlist=1` | Watchlist-exposed tiers only |
| `q` | `?q=hbm` | Search query |

Example: `/value-chain?phase=3&tier=10` (essentials on by default) or `/value-chain?essential=0` (all tiers)

## Data module

**Source of truth:** `frontend/src/data/aiInfraData.js`

| Export | Description |
|--------|-------------|
| `PHASES` | 7 macro phases — color, tier range, thesis role, insight |
| `TIERS` | 22 tiers — role, players, moat, bottleneck, metric, sigil_angle |
| `RISK_OVERLAYS` | 3 institutional alpha signals |
| `WATCHLIST_TIER_MAP` | Maps watchlist tickers → tier number |

### ID contract

Use **`tier.tier` (integer 1–22)** for all cross-references:

- `WATCHLIST_TIER_MAP.NVDA.tier === 6`
- `RISK_OVERLAYS[].tiersAffected`
- URL param `?tier=10`

`tier.id` (e.g. `"t10"`) is a stable React key / slug only — not used in maps or URLs.

When adding a watchlist mapping, use the integer tier number:

```javascript
export const WATCHLIST_TIER_MAP = {
  NVDA: { tier: 6, note: "Fabless chip designer — …" },
};
```

## Frontend file map

```text
frontend/src/
├── data/aiInfraData.js
├── utils/valueChainUtils.js       # filter, parse/build URL params, watchlist stack
├── styles/value-chain.css         # tier hierarchy, ticker grid, risk grid, phase chrome
├── pages/ValueChain.jsx
├── components/
│   ├── ValueChainSectionNav.jsx
│   └── value-chain/
│       ├── StackMap.jsx
│       ├── TierExplorer.jsx
│       ├── TierCard.jsx
│       ├── PhaseSeparator.jsx
│       ├── StickyPhaseNav.jsx
│       ├── WatchlistStack.jsx
│       └── RiskOverlays.jsx
```

## Vercel routing

SPA fallback (same pattern as Learning Hub):

```json
{ "src": "/value-chain", "dest": "frontend/index.html" }
```

Local dev: `http://localhost:5173/value-chain`

## Maintenance

### Edit tier or phase content

1. Open `frontend/src/data/aiInfraData.js`.
2. Edit `PHASES`, `TIERS`, or `RISK_OVERLAYS`.
3. Run `npm run build --prefix frontend`.
4. No backend or cache changes required.

### Map a new watchlist ticker to the stack

1. Add an entry to `WATCHLIST_TIER_MAP` with integer `tier` and a one-line `note`.
2. Optionally add the ticker to `TIERS[n].watchlistTickers` for badge display on the tier card.
3. Rebuild frontend.

### Add a new tier (rare)

1. Add to `TIERS` with unique `tier` integer and `id` slug.
2. Update the parent `PHASES[].tierRange`.
3. Update any affected `RISK_OVERLAYS[].tiersAffected`.

Keep `PHASES.length`, `TIERS.length`, and hero stat pills in sync if counts change.
