# Supernova Dashboard — Maintenance Playbook
### How to change anything without breaking everything

> This document answers: "I want to change X — what do I touch and in what order?"

---

## The golden rule

**One change, one file.** The dashboard is designed so that:
- Thesis content lives in `01_thesis_config.md` (and mirrored in `config/thesis.js`)
- All prompts live in `services/prompts.js`
- All API keys live in `.env`
- UI layout lives in `frontend/src/components/`

If you find yourself changing the same information in two places, the architecture has drifted and needs refactoring.

---

## Common tasks

### Add a new stock to the watchlist

**Time: 5 minutes**

1. Open `config/thesis.js`
2. Find the right theme section (e.g., `themes.warfare.tickers`)
3. Add the new ticker object:
```javascript
{
  ticker: "KTOS",
  company: "Kratos Defense & Security",
  angle: "Attritable jet drones — pure play",
  priority: "core",  // "core" | "watch" | "speculative"
  theme: "warfare"
}
```
4. Save the file
5. Restart backend (`npm run dev` in `/backend`) or click **Sync Engine** in the UI
6. The stock will appear in the watchlist on next price fetch cycle

**Priority levels explained:**
- `core` — always shown, never filtered out
- `watch` — shown by default, can be filtered
- `speculative` — hidden by default, toggle "Show Speculative" to see

---

### Remove a stock from the watchlist

1. Open `config/thesis.js`
2. Delete the ticker object from the relevant theme section
3. Restart backend

The stock will disappear from UI and will no longer be fetched.

---

### Change the thesis description for a theme

This affects: the AI system prompt, the theme hover tooltip in the heatmap, and the theme description in Panel 1.

1. Open `config/thesis.js`
2. Find the theme by its ID
3. Edit `short_description` (shown in UI) and/or `long_description` (used in AI prompt)
4. **Also update** `services/prompts.js` → `SYSTEM_PROMPT` if the thesis logic has meaningfully changed
5. Restart backend
6. New system prompt takes effect on next Claude API call

---

### Add a new news keyword to a theme

If you notice a theme is missing relevant news (e.g., "warfare" isn't catching articles about autonomous submarines):

1. Open `config/thesis.js`
2. Find the theme, edit `news_keywords` array:
```javascript
news_keywords: [
  "drone warfare",
  "autonomous drone military",
  "autonomous submarine",  // ← add here
  ...
]
```
3. Restart backend
4. Next sync will use the new keywords

**Note:** NewsAPI free tier allows complex queries. Keywords are joined with `OR` in the query string.

---

### Change how often data refreshes

In `backend/config/settings.js`:

```javascript
export const SETTINGS = {
  news_refresh_hours: 3,        // How often to fetch new articles
  price_refresh_minutes: 30,    // How often to update stock prices
  weekly_brief_day: 'monday',   // What day to auto-generate the brief
  weekly_brief_hour: 8,         // What hour (UTC) to generate it
  significance_threshold: 3,    // Min significance score to show in UI (1-5)
  max_articles_per_theme: 10,   // Max articles to classify per theme per cycle
};
```

---

### Update the AI system prompt

Do this when the fund thesis evolves, you add a new theme, or you want the AI to analyze differently.

1. Open `services/prompts.js`
2. Edit the `SYSTEM_PROMPT` constant
3. Add a row to the "Prompt versioning" table in `02_prompt_library.md`:
```
| 2026-06-01 | SYSTEM_PROMPT | Added robotics sub-theme for underwater drones | Thesis expansion |
```
4. Restart backend

**Warning:** Changing the system prompt changes how ALL articles, ALL stock context lines, and the weekly brief are generated. Test on a small batch first before full sync.

---

### Add a completely new theme (e.g., "Energy Infrastructure")

**Time: 30 minutes**

1. Open `config/thesis.js`, add new theme object following the existing pattern
2. Add theme to `services/prompts.js` → `SYSTEM_PROMPT` themes list
3. Add theme ID to the `news_keywords` map
4. Add tickers for the new theme
5. In `frontend/src/components/ThemePulse.jsx`, the theme should appear automatically if the component reads from config (check that it does)
6. Optionally add a new filter pill in `frontend/src/components/Watchlist.jsx`

---

### Change the weekly brief schedule

In `backend/services/brief.js` or in `vercel.json` (for Vercel cron):

```json
{
  "crons": [
    {
      "path": "/api/generate-brief",
      "schedule": "0 8 * * 1"
    }
  ]
}
```
This runs every Monday at 08:00 UTC. Standard cron syntax.

---

## API key rotation

When you need to rotate API keys (security practice, or key gets compromised):

**Local development:**
1. Update `.env` file
2. Restart backend

**Vercel production:**
1. Go to Vercel dashboard → your project → Settings → Environment Variables
2. Update the key
3. Redeploy (Vercel → Deployments → Redeploy latest)

**Never commit `.env` to Git.** The `.gitignore` should exclude it. Double-check before pushing.

---

## Deploying changes to production

After making any code change:

```bash
# 1. Test locally first
npm run dev  # in /backend
npm run dev  # in /frontend (separate terminal)

# 2. If tests pass, commit
git add .
git commit -m "describe what you changed"

# 3. Push to GitHub
git push origin main

# 4. Vercel auto-deploys on push to main
# Watch the build log at vercel.com/dashboard
```

If Vercel build fails, check:
- Missing environment variables (most common)
- npm package not installed (`package.json` missing a dependency)
- Build command incorrect in `vercel.json`

---

## Monitoring the live dashboard

**Check if data is fresh:**
- Look at "Last Sync" timestamp in top right of dashboard UI
- If more than `news_refresh_hours` old → backend cron may have failed

**Check API usage:**
- NewsAPI: newsapi.org dashboard → API usage (free tier = 100 req/day)
- Anthropic: console.anthropic.com → Usage → watch for unexpected spikes
- Yahoo Finance: unofficial API, no dashboard, but monitor for 429 errors in backend logs

**If the dashboard goes offline:**
1. Check Vercel deployment logs
2. Check if API keys have expired or been rate-limited
3. The dashboard should fall back to cached data and show "OFFLINE // MOCK MODE" banner automatically

---

## Cost management

Expected monthly costs for normal usage:

| Service | Free tier | Expected usage | Monthly cost |
|---|---|---|---|
| NewsAPI | 100 req/day | ~30 req/day (3h refresh × 10 themes) | $0 |
| Anthropic Claude | Pay per token | ~50K tokens/day (classifications + contexts + brief) | ~$2-5 |
| Vercel | Free hobby tier | Within free limits | $0 |
| Yahoo Finance | Unofficial, free | Free | $0 |

**To reduce Claude API costs:**
- Increase `news_refresh_hours` from 3 to 6 or 12
- Reduce `max_articles_per_theme` from 10 to 5
- Only generate stock context lines for `priority: "core"` tickers

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| All themes show 0 activity | NewsAPI key invalid or rate limited | Check `.env` key, check newsapi.org dashboard |
| Stock prices show — | Yahoo Finance rate limit | Wait 30 min, or switch to Alpha Vantage API |
| AI insights show "Error generating insight" | Anthropic API key invalid or zero balance | Check console.anthropic.com, add balance |
| Weekly brief not generating | Cron job not running on Vercel | Check vercel.json cron config, check Vercel logs |
| Dashboard shows stale data | Cache not refreshing | Click "Sync Engine" manually, check cron schedule |
| Claude returning malformed JSON | Prompt edge case | Check backend logs for raw response, adjust prompt |
| Build fails on Vercel | Missing env var or package | Check build log, verify all vars set in Vercel dashboard |
