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

Sticky sub-nav: **Map · Tiers · Holdings · Overlays**

### 1. Stack map (`#vc-map`)

Seven macro phases (Phase 0 → Phase VI). Desktop: 4-column grid (4 + 3 rows). Mobile: horizontal scroll with snap.

Click a phase → filters Tier Explorer and scrolls to `#vc-tiers`.

### 2. Tier explorer (`#vc-tiers`)

All 22 tiers with filters:

- Phase pills
- ⚡ Essentials only (`tier.essential === true`)
- 🔖 Watchlist only (tiers with `WATCHLIST_TIER_MAP` or `watchlistTickers`)
- Full-text search

Each tier card expands to: players, moat, bottleneck (amber accent), key metric, **Sigil angle** (gold accent).

### 3. Holdings on the stack (`#vc-holdings`)

Maps Sigil watchlist tickers to tiers via `WATCHLIST_TIER_MAP`. Click a row to jump to that tier.

Not every watchlist name appears here — only names mapped to the physical stack (currently 8). Robotics, space, cyber, and biotech names live outside this map.

### 4. Risk overlays (`#vc-overlays`)

Three institutional sizing signals from the hedge-fund overlay section:

| Overlay | Type | Tiers affected |
|---------|------|----------------|
| Hardware Obsolescence Trap | Bear | 19 |
| CapEx-to-Revenue Air Pocket | Cyclical | 7, 8, 13 |
| Power Arbitrage as Macro Moat | Bull | 2, 16, 17 |

Tier chips navigate to the Tier Explorer with `?tier=N`.

## URL parameters (shareable, bidirectional)

Filters sync to the URL with `replace: true`:

| Param | Example | Effect |
|-------|---------|--------|
| `tier` | `?tier=10` | Expand and scroll to tier 10 |
| `phase` | `?phase=3` | Filter to Phase III (`PHASES[].number`) |
| `essential` | `?essential=1` | Essentials-only |
| `watchlist` | `?watchlist=1` | Watchlist-exposed tiers only |
| `q` | `?q=hbm` | Search query |

Example: `/value-chain?phase=3&tier=10&essential=1`

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
├── pages/ValueChain.jsx
├── components/
│   ├── ValueChainSectionNav.jsx
│   └── value-chain/
│       ├── StackMap.jsx
│       ├── TierExplorer.jsx
│       ├── TierCard.jsx
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
