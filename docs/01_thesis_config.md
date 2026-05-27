# Supernova Thesis Configuration

## Source of truth

The runtime source of truth is `config/thesis.js`.

This doc explains what is in that file and how to keep it aligned with prompts and UI. Do not edit this markdown file expecting the app to change.

## Runtime exports

`config/thesis.js` exports:

- `THEMES` - 7 thesis themes with display text, colors, keywords, and thesis descriptions.
- `THEME_COLORS` - stable visual identity mapping used by theme cards.
- `THEME_ICONS` - Tabler icon classes used by theme cards.
- `WATCHLIST` - 20 current public names shown in the dashboard.
- `getStockMatchTerms(item)` - company/ticker/alias terms used to match headlines.
- `getThemeById(id)` and `getWatchlistItem(ticker)` - lookup helpers.

## Theme IDs

Use these exact IDs in data, prompts, and UI filters:

| ID | Display name | Dashboard role |
|---|---|---|
| `datacenters` | Physical Datacenters | Compute, HBM, power, cooling, copper, semiconductor bottlenecks. |
| `application` | Application Layer | AI agents, workflow automation, SaaS moats and disruption. |
| `robotics` | Industrial Robotics | Practical industrial automation and component layers. |
| `warfare` | Future of Warfare | Attritable systems, counter-drone, NATO defense ramp. |
| `space` | Space Infrastructure | Launch, satellite constellations, orbital defense, asymmetric bets. |
| `biotech` | Biotech & Discovery | AI diagnostics, precision medicine, longevity, AI drug discovery risk/reward. |
| `adversarial` | Adversarial AI | AI-enabled threats, cybersecurity, identity, agent security. |

## Current watchlist

The current dashboard displays these 20 names:

| Ticker | Company | Theme | Priority |
|---|---|---|---|
| `NVDA` | Nvidia Corp. | `datacenters` | core |
| `000660.KS` | SK Hynix | `datacenters` | core |
| `MU` | Micron Technology | `datacenters` | core |
| `AMAT` | Applied Materials | `datacenters` | core |
| `FCX` | Freeport-McMoRan | `datacenters` | core |
| `CSU.TO` | Constellation Software | `application` | core |
| `PATH` | UiPath | `application` | core |
| `VEEV` | Veeva Systems | `application` | core |
| `ISRG` | Intuitive Surgical | `robotics` | core |
| `CGNX` | Cognex | `robotics` | core |
| `KTOS` | Kratos Defense | `warfare` | core |
| `AVAV` | AeroVironment | `warfare` | core |
| `RHM.DE` | Rheinmetall | `warfare` | core |
| `RKLB` | Rocket Lab | `space` | core |
| `ASTS` | AST SpaceMobile | `space` | speculative |
| `EXAS` | Exact Sciences | `biotech` | core |
| `RXRX` | Recursion Pharma | `biotech` | speculative |
| `CRWD` | CrowdStrike | `adversarial` | core |
| `PANW` | Palo Alto Networks | `adversarial` | core |
| `S` | SentinelOne | `adversarial` | watch |

`priority` is included in the payload for future filtering or weighting, but the current UI shows all 20 names.

## Theme object shape

Each theme in `THEMES` follows this pattern:

```javascript
{
  id: "datacenters",
  display_name: "Physical Datacenters",
  icon: "server",
  color_hex: "#00C896",
  short_description: "AI infrastructure buildout, GPUs, HBM memory, copper, energy",
  long_description: "...",
  news_keywords: ["GPU datacenter", "HBM memory"],
  bull_signals: ["capex increase announcements"],
  bear_signals: ["capex pause or cut"]
}
```

How fields are used:

- `display_name` appears in UI and theme summaries.
- `short_description` appears in expanded theme cards.
- `long_description` is sent to Claude for theme pulse scoring.
- `news_keywords` drives NewsAPI queries.
- `color_hex` is used for watchlist badges.
- `bull_signals` and `bear_signals` are reference material for maintainers.

## Watchlist object shape

```javascript
{
  ticker: "KTOS",
  company: "Kratos Defense",
  aliases: ["Kratos", "Valkyrie", "attritable"],
  theme: "warfare",
  angle: "Attritable jet drones — pure play on asymmetry",
  priority: "core"
}
```

How fields are used:

- `ticker` is the Yahoo quote symbol and UI key.
- `company` is the display fallback.
- `aliases` improve article-to-stock matching in `backend/services/articleMatch.js`.
- `theme` connects the stock to theme-level headlines.
- `angle` is sent to Claude when generating the watchlist note.
- `priority` is available for future filtering and internal weighting.

## Keeping prompts aligned

The prompt system currently contains thesis language in `backend/services/prompts.js`, especially `SYSTEM_PROMPT`.

When thesis logic changes:

1. Update `config/thesis.js`.
2. Update `SYSTEM_PROMPT` in `backend/services/prompts.js` if the analysis lens changed.
3. Update this doc if the theme or watchlist reference changed.
4. Run a sync and check the brief, theme pulse, and watchlist notes.

## Safe changes

Usually safe:

- Add or remove news keywords.
- Add aliases to a stock.
- Edit display copy.
- Adjust a stock angle.
- Add a watchlist stock if the ticker works with Yahoo.

Higher impact:

- Changing theme IDs.
- Removing a theme.
- Changing `SYSTEM_PROMPT`.
- Adding a new theme.
- Changing the meaning of `priority`.

If a new theme is added, update the UI expectations, prompts, docs, and any logic that assumes exactly 7 themes.
