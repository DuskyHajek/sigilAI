# Supernova Dashboard — Maintenance Playbook

## Golden rule

Use the current implementation as the source of truth:

- Thesis, theme, keyword, color, and watchlist runtime config: `config/thesis.js`
- Token budgets, significance threshold, article limits, cache TTL: `config/settings.js`
- Prompts and AI output formats: `backend/services/prompts.js`
- Backend API and sync orchestration: `backend/server.js`
- UI layout: `frontend/src/App.jsx` and `frontend/src/components/`

When thesis logic changes, update both `config/thesis.js` and `backend/services/prompts.js` unless the prompt is later refactored to generate directly from config.

## Add a watchlist stock

1. Open `config/thesis.js`.
2. Add a ticker object to `WATCHLIST`.
3. Include `ticker`, `company`, `aliases`, `theme`, `angle`, and `priority`.
4. Make sure `theme` matches one of the 7 theme IDs.
5. Restart the backend or click **Sync live data**.

Example:

```javascript
{
  ticker: "KTOS",
  company: "Kratos Defense",
  aliases: ["Kratos", "Valkyrie", "attritable"],
  theme: "warfare",
  angle: "Attritable jet drones — pure play on asymmetry",
  priority: "core",
}
```

The current UI shows all configured watchlist names. `priority` is available in the payload but is not currently used as a visible filter.

## Remove a watchlist stock

1. Delete the object from `WATCHLIST` in `config/thesis.js`.
2. Restart the backend or run a sync.
3. The next dashboard payload will reflect the smaller watchlist.

## Change theme thesis or keywords

1. Open `config/thesis.js`.
2. Edit the relevant theme object:
   - `short_description` for UI display;
   - `long_description` for theme pulse context;
   - `news_keywords` for NewsAPI searches;
   - `bull_signals` and `bear_signals` for reference.
3. If the thesis logic changed meaningfully, also update `SYSTEM_PROMPT` in `backend/services/prompts.js`.
4. Run a fresh sync.

## Tune relevance filtering

Open `config/settings.js`.

Current knobs:

```javascript
export const SETTINGS = {
  classification_max_tokens: 300,
  stock_context_max_tokens: 100,
  theme_pulse_max_tokens: 150,
  weekly_brief_max_tokens: 500,
  research_queue_max_tokens: 450,

  significance_threshold: 2,
  max_articles_per_theme: 10,

  cache_ttl_hours: 3,
};
```

Useful changes:

- Increase `significance_threshold` to reduce noisy articles.
- Decrease `max_articles_per_theme` to make sync faster and cheaper.
- Increase token budgets only when outputs are being truncated.

## Update prompts

All prompt builders live in `backend/services/prompts.js`.

Current prompt surfaces:

- `SYSTEM_PROMPT`
- `buildClassifyPrompt`
- `buildStockContextPrompt`
- `buildThemePulsePrompt`
- `buildWeeklyBriefPrompt`
- `buildResearchQueuePrompt`

After changing a prompt:

1. Keep output format requirements explicit.
2. Update `docs/02_prompt_library.md` if the change affects future tuning.
3. Test with one sync before relying on the output.

## Manual sync behavior

The app does not run background cron jobs. Sync happens when the user clicks **Sync live data**, which calls `POST /api/sync`.

Full sync does:

1. Fetch NewsAPI headlines.
2. Classify selected articles with Claude.
3. Build theme pulse scores.
4. Fetch Yahoo chart prices.
5. Generate watchlist context lines.
6. Generate the analyst brief.
7. Generate the research queue.
8. Write cache.

On Vercel, the backend uses lighter sync limits and the frontend aborts after 55 seconds. If hosted sync fails repeatedly, run locally with the same env vars to inspect logs and then redeploy.

## Cache behavior

Local cache:

- Path: `backend/data/cache.json`
- Generated automatically.
- Safe to delete when you want a fresh mock/live payload.

Remote cache:

- Supported through Vercel KV or Upstash Redis REST env vars:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- Optional key override: `DASHBOARD_CACHE_KEY`

On Vercel without remote cache, the app falls back to `/tmp/supernova-cache.json`. That is temporary and can disappear between function instances.

## API key rotation

Local:

1. Update root `.env`.
2. Restart the backend.
3. Check `GET /api/health`.

Vercel:

1. Update environment variables in the Vercel project.
2. Redeploy.
3. Check `/api/health` and run a manual sync.

Never commit `.env`.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Header shows `DEMO DATA` | Missing `ANTHROPIC_API_KEY` or `NEWS_API_KEY` | Add env vars and restart/redeploy. |
| Sync fails quickly | Bad key or external API error | Check backend logs and `/api/health`. |
| Sync times out on Vercel | Function duration limit | Retry once, reduce article limits, or sync locally. |
| Prices show `unavailable` | Yahoo endpoint failed | Retry later; cached Yahoo values are used when available. |
| Watchlist notes are generic | Weak headline match or no direct company news | Improve `aliases` in `WATCHLIST` or theme keywords. |
| Theme pulse feels noisy | Significance threshold too low | Raise `significance_threshold` in `config/settings.js`. |
| Deployed data disappears | No remote KV configured | Add Vercel KV or Upstash REST env vars. |
| Claude returns malformed JSON | Prompt edge case | Inspect backend logs and tighten the JSON-only prompt. |

## Before deploying changes

Run at least:

```bash
npm run build --prefix frontend
npm run lint --prefix frontend
```

For backend syntax checks, use:

```bash
node --check backend/server.js
```

Then deploy through the normal GitHub/Vercel flow.
