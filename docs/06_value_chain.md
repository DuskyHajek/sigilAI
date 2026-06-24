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

Sticky sub-nav: **Map · Holdings · Tiers**

Scroll order (top → bottom):

1. **Stack map** — orientation and phase selection
2. **Holdings on the stack** — ticker → tier mapping (unique Sigil insight)
3. **Tier explorer** — full 22-tier reference with filters and phase chrome

### 1. Stack map (`#vc-map`)

Seven macro phases (Phase 0 → Phase VI). Desktop: uniform cards in a 4+3 flex grid (equal width, fixed min-height). Mobile: horizontal scroll with snap.

Each card shows: phase label, tier range badge, name, focus areas, tier count. Click → filter tiers + insight panel below.

### 2. Holdings on the stack (`#vc-holdings`)

Maps Sigil watchlist tickers to tiers via `WATCHLIST_TIER_MAP`.

- **2-column ticker card grid** on `sm+`: ticker, tier badge, tier name, note; wrapped in featured green panel
- Lead copy states how many of 21 watchlist names are mapped (currently 8)
- Click a ticker → jump to its tier in the explorer (scroll, expand, 2s highlight)

Not every watchlist name appears here — only names mapped to the physical stack (currently 8). Robotics, space, cyber, and biotech names live outside this map.

### 3. Tier explorer (`#vc-tiers`)

All 22 tiers with filters:

- Phase pills (filter — shown when a phase filter or search is active; use Stack map to filter from all-phases view)
- ⚡ Essentials only (`tier.essential === true`) — **ON by default** on first visit; toggle “Show all tiers” writes `?essential=0`; count shows “Showing X of 22 tiers” when active
- 🔖 Holdings only (tiers with a ticker in `WATCHLIST_TIER_MAP`)
- Full-text search

**Visual hierarchy**

| Class | When | Effect |
|-------|------|--------|
| Essential | `tier.essential === true` | Green left border (`#1D9E75`), full opacity |
| Normal | `tier.essential === false` | Muted border, ~72% opacity |
| Holdings | Mapped ticker in `WATCHLIST_TIER_MAP` | Green border glow + ticker pills on card header |

**Phase chrome** (when browsing all phases with no search query)

- **Phase separator banners** — full-width coloured band with phase label, name, and `thesisRole`
- **Sticky explorer toolbar** — single bar (no duplicate phase pills): scroll-position chips + essential/holdings filters; phase filter pills appear only when a phase filter or search is active

Phase separators and sticky toolbar are hidden when a single-phase filter or search query is active.

Each tier card expands to: players, moat, bottleneck (amber accent), key metric, **Investment angle** (gold accent; field name in data: `sigil_angle`).

## URL parameters (shareable, bidirectional)

Filters sync to the URL with `replace: true`:

| Param | Example | Effect |
|-------|---------|--------|
| `tier` | `?tier=10` | Expand and scroll to tier 10 (+ highlight pulse) |
| `phase` | `?phase=3` | Filter to Phase III (`PHASES[].number`) |
| `essential` | *(default ON)* | Essentials-only; omit param or use `?essential=0` to show all 22 tiers |
| `watchlist` | `?watchlist=1` | Holdings-exposed tiers only |
| `q` | `?q=hbm` | Search query |

Example: `/value-chain?phase=3&tier=10` (essentials on by default) or `/value-chain?essential=0` (all tiers)

## Data module

**Source of truth:** `frontend/src/data/aiInfraData.js`

| Export | Description |
|--------|-------------|
| `PHASES` | 7 macro phases — color, tier range, thesis role, insight |
| `TIERS` | 22 tiers — role, players, moat, bottleneck, metric, sigil_angle |
| `WATCHLIST_TIER_MAP` | Maps watchlist tickers → tier number |

### ID contract

Use **`tier.tier` (integer 1–22)** for all cross-references:

- `WATCHLIST_TIER_MAP.NVDA.tier === 6`
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
├── styles/value-chain.css         # tier hierarchy, ticker grid, phase chrome
├── pages/ValueChain.jsx
├── components/
│   ├── ValueChainSectionNav.jsx
│   └── value-chain/
│       ├── StackMap.jsx
│       ├── TierExplorer.jsx
│       ├── TierCard.jsx
│       ├── PhaseSeparator.jsx
│       ├── StickyPhaseNav.jsx
│       └── WatchlistStack.jsx
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
2. Edit `PHASES` or `TIERS`.
3. Run `npm run build --prefix frontend`.
4. No backend or cache changes required.

### Map a new watchlist ticker to the stack

1. Add an entry to `WATCHLIST_TIER_MAP` with integer `tier` and a one-line `note`.
2. Rebuild frontend. Ticker pills on tier cards are derived from the map automatically.

### Add a new tier (rare)

1. Add to `TIERS` with unique `tier` integer and `id` slug.
2. Update the parent `PHASES[].tierRange`.

Keep `PHASES.length`, `TIERS.length`, and hero stat pills in sync if counts change.

## Archived sizing lenses (reference only)

These three institutional sizing frameworks were removed from the UI (they read like live signals but were static editorial content). Kept here for internal reference.

| Lens | Type | Tiers affected |
|------|------|----------------|
| Hardware Obsolescence Trap | Bear | 19 |
| CapEx-to-Revenue Air Pocket | Cyclical | 7, 8, 13 |
| Power Arbitrage as Macro Moat | Bull | 2, 16, 17 |

**Hardware Obsolescence Trap (Bear, Tier 19):** GPU generations cycle every 18–24 months while depreciation assumes 4–5 years. Debt-funded neocloud clusters face margin collapse before loans are repaid. Watch: neocloud debt amortisation vs. Nvidia generation cadence; GPU-hour rental trends; roadmap announcements.

**CapEx-to-Revenue Air Pocket (Cyclical, Tiers 7, 8, 13):** When hyperscaler CapEx outpaces cloud revenue capture for 4+ quarters, cyclical overcapacity follows — especially painful for WFE (Tier 8) and rack integrators (Tier 13). Watch: hyperscaler CapEx guidance; ASML/AMAT/LRCX order books; CapEx vs. revenue growth delta.

**Power Arbitrage as Macro Moat (Bull, Tiers 2, 16, 17):** Secure power and grid interconnection (5+ year queues) create durable moats vs. cyclically deflationary compute. Watch: nuclear PPA pricing (Constellation, Vistra); interconnection queue clearance; behind-the-meter capacity at hyperscaler sites.
