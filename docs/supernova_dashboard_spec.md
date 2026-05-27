# Supernova Intelligence Dashboard
### Product & Architecture Spec — v0.1 Demo

---

## What this is

A lightweight, AI-powered investment intelligence dashboard scoped specifically to the Sigil Supernova thesis. Not a generic news aggregator or stock screener — a tool that reads the world through the lens of one specific investment framework and surfaces what matters, filtered by what *they* care about.

The demo goal: show that you understood the memo well enough to encode it into software.

---

## Core philosophy

> "Don't build a Bloomberg terminal. Build something a Bloomberg terminal can't do."

The value is not in showing stock prices. It's in the layer of judgment on top — does this piece of news matter for Theme 3 (robotics)? Is this earnings result bullish or bearish for the attrition warfare thesis? What happened this week that a Sigil analyst should actually read?

That judgment layer is the product. The UI is just the wrapper.

---

## Demo scope (v0.1)

Three panels. One page. Deployable in a weekend.

### Panel 1 — Theme Pulse
A live heatmap of the 7 Sigil themes. For each theme: how much signal hit today, and is the sentiment thesis-positive or thesis-negative.

### Panel 2 — Watchlist Intelligence
~15 stocks across the Supernova universe. Price + 30-day change (standard). Plus: one AI-generated sentence per stock — "what happened this week that's relevant to the Supernova thesis." That last part is the non-standard bit.

### Panel 3 — Weekly Brief
One auto-generated analyst paragraph: the most important development across all themes this week. Essentially a morning brief written by an AI that has the Sigil memo as its brain.

---

## Tech stack

Chosen for speed of demo, not production robustness. Everything has a free tier sufficient for demo.

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) | Fast to scaffold, easy to deploy |
| Styling | Tailwind CSS | No design system overhead |
| Backend | Node.js + Express | Simple API proxy layer |
| Hosting | Vercel | Free, instant deploy from GitHub |
| News | NewsAPI.org | Free tier: 100 req/day, good enough |
| Prices | Yahoo Finance (unofficial) | Free, no key needed for basic quotes |
| AI layer | Anthropic Claude API | Core intelligence engine |
| Scheduling | Vercel Cron (or simple setInterval) | Refresh data every few hours |

**Total cost for demo: ~$0–5/month** depending on Claude API usage volume.

---

## Data flow

```
NewsAPI (raw headlines)
        ↓
  Filter by theme keywords
        ↓
  Claude API (classify + score per theme)
        ↓
  Store result in memory / simple JSON cache
        ↓
  Frontend renders panels
```

```
Yahoo Finance (price data)
        ↓
  Fetch for watchlist tickers
        ↓
  Claude API (generate one-sentence thesis context per stock)
        ↓
  Render in watchlist panel
```

Both pipelines refresh every ~3 hours via cron. Results cached in a simple flat JSON file — no database needed for demo.

---

## Watchlist — starting tickers

Drawn directly from themes mentioned in the Sigil memo:

| Ticker | Company | Theme |
|---|---|---|
| NVDA | Nvidia | Datacentres — GPU |
| 000660.KS | SK Hynix | Datacentres — HBM memory |
| MU | Micron | Datacentres — memory |
| AMAT | Applied Materials | Datacentres — equipment |
| KTOS | Kratos Defense | Warfare — attritable drones |
| AVAV | AeroVironment | Warfare — loitering munitions |
| CRWD | CrowdStrike | Adversarial AI — cybersecurity |
| PANW | Palo Alto Networks | Adversarial AI — cybersecurity |
| CSU.TO | Constellation Software | Application layer — moat SaaS |
| FCX | Freeport-McMoRan | Datacentres — copper / materials |
| RHM.DE | Rheinmetall | Warfare — European defense |
| RKLB | Rocket Lab | Space |
| ISRG | Intuitive Surgical | Biotech — robotic surgery |
| RXRX | Recursion Pharma | Biotech — AI drug discovery |
| PATH | UiPath | Application layer — agentic workflows |

---

## API setup

### 1. NewsAPI.org

Sign up at newsapi.org — free tier gives 100 requests/day, enough for demo.

```javascript
// Fetch news per theme
const fetchThemeNews = async (theme) => {
  const keywords = THEME_KEYWORDS[theme].join(' OR ');
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);
  return res.json();
};
```

**Theme keyword map** — these are the search terms that define each theme in NewsAPI:

```javascript
const THEME_KEYWORDS = {
  datacenters:  ['GPU', 'HBM memory', 'datacenter construction', 'TSMC', 'semiconductor supply'],
  application:  ['AI agents', 'agentic workflow', 'SaaS disruption', 'LLM enterprise', 'OpenAI revenue'],
  robotics:     ['humanoid robot', 'industrial automation', 'autonomous vehicle', 'agricultural robot'],
  warfare:      ['drone warfare', 'autonomous drone', 'defense procurement', 'NATO spending', 'loitering munition'],
  space:        ['SpaceX launch', 'satellite constellation', 'orbital infrastructure', 'Starlink'],
  biotech:      ['AI drug discovery', 'precision medicine', 'longevity research', 'biotech FDA'],
  adversarial:  ['AI cybersecurity', 'deepfake detection', 'AI fraud', 'identity verification', 'adversarial AI'],
};
```

### 2. Yahoo Finance (price data)

No API key needed for basic quotes. Use the `yahoo-finance2` npm package:

```bash
npm install yahoo-finance2
```

```javascript
import yahooFinance from 'yahoo-finance2';

const getQuote = async (ticker) => {
  const quote = await yahooFinance.quote(ticker);
  return {
    ticker,
    price: quote.regularMarketPrice,
    change30d: quote.fiftyTwoWeekChangePercent, // approximate
    name: quote.shortName,
  };
};
```

### 3. Anthropic Claude API — the intelligence layer

This is the core. Every meaningful output in the dashboard is generated here.

```bash
npm install @anthropic-ai/sdk
```

---

## Claude API — prompts

This is the most important section. The quality of everything depends on these prompts.

### System prompt (shared across all calls)

This is the "brain" — the Sigil memo encoded as context. Include this in every API call.

```
You are an investment intelligence analyst for Sigil Fund's Supernova portfolio.

Sigil Supernova invests across 7 thesis-driven themes:

1. DATACENTERS — AI datacenter buildout, GPU/memory/energy bottlenecks, semiconductor supply chain, photonics, neoclouds, Bitcoin miners repurposing as compute providers. Key insight: AI cannot create atoms. The physical layer is the bottleneck.

2. APPLICATION LAYER — AI agents, agentic workflows, SaaS disruption. Key insight: companies with UI-only moats are vulnerable. Companies with proprietary data, distribution, regulatory lock-in, or deep workflow integration are beneficiaries.

3. ROBOTICS — Practical automation in agriculture, manufacturing, mining. Components (cameras, magnets, inference units) matter as much as finished robots. Humanoids are overhyped; industrial applications are underappreciated.

4. FUTURE OF WARFARE — Attrition warfare economics: cheap autonomous drones vs expensive manned platforms. European defense ramp-up. Dual-use tech. Anti-drone systems. The economic asymmetry: a $13B carrier can be disabled by a $2M drone swarm.

5. SPACE — Cost collapse from reusable rockets. Satellite constellations. Orbital defense as national security priority. Small asymmetric bets, not core positions.

6. BIOTECH — AI compressing drug R&D timelines. Precision medicine at scale. Longevity. AI-driven diagnostics. Avoiding overcrowded drug discovery.

7. ADVERSARIAL AI — Cybersecurity responding to AI-powered threats. Digital identity verification. Agent governance. This is a hedge AND a growth theme simultaneously.

Portfolio philosophy: hard capital assets over pure software. Physical bottlenecks are opportunities. Incumbents with real moats beat startups in most categories. Cybersecurity and agentic infrastructure are the exceptions.

When analyzing news or events, always evaluate through this specific lens. Be direct and opinionated. Avoid generic financial commentary.
```

---

### Prompt 1: Theme classification + sentiment scoring

Used to process each news article and assign it to themes.

```javascript
const classifyArticle = async (article) => {
  const prompt = `
Analyze this news article and classify it against the Sigil Supernova investment themes.

Article title: ${article.title}
Article description: ${article.description}
Source: ${article.source.name}

Return JSON only, no other text:
{
  "relevant": true/false,
  "themes": ["theme_name_1", "theme_name_2"],  // from: datacenters, application, robotics, warfare, space, biotech, adversarial
  "sentiment": "bullish" | "bearish" | "neutral",  // relative to the Supernova thesis
  "significance": 1-5,  // 1 = noise, 5 = major development
  "one_line": "One sentence explaining why this matters for the thesis, or null if not relevant"
}
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
};
```

---

### Prompt 2: Stock thesis context (one-liner per stock)

Used in the watchlist panel — generates the "why does this matter this week" sentence.

```javascript
const getStockContext = async (ticker, companyName, recentNews) => {
  const prompt = `
Company: ${companyName} (${ticker})
Recent headlines (last 7 days):
${recentNews.map(n => `- ${n.title}`).join('\n')}

Write ONE sentence (max 25 words) explaining what happened this week that is relevant to the Sigil Supernova thesis. 
Be specific to the news, not generic. If nothing meaningful happened, write "No significant thesis-relevant developments this week."
Do not start with the company name. Do not use phrases like "this week" or "recently."
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
};
```

---

### Prompt 3: Weekly brief generator

The flagship output. Runs once per week (or on demand). Synthesizes everything into a paragraph a fund manager would actually read.

```javascript
const generateWeeklyBrief = async (allArticlesThisWeek) => {
  const articleSummary = allArticlesThisWeek
    .filter(a => a.significance >= 3)
    .map(a => `[${a.themes.join(', ')}] ${a.title} — ${a.one_line}`)
    .join('\n');

  const prompt = `
Here are the most significant developments from this week across the Supernova themes:

${articleSummary}

Write a weekly investment brief of 3-4 sentences. Structure:
1. The single most important development and why it matters for the portfolio thesis
2. One secondary development worth watching
3. Any emerging risk or counter-signal to the thesis

Tone: direct, analytical, opinionated. Write like a sharp analyst talking to a CIO, not a newsletter. No bullet points.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
};
```

---

### Prompt 4: Theme pulse score (for heatmap)

Aggregates all articles per theme into a single daily score.

```javascript
const getThemePulse = async (theme, articles) => {
  const prompt = `
Theme: ${theme.toUpperCase()}
Today's relevant articles for this theme:
${articles.map(a => `- ${a.title} (significance: ${a.significance}/5, sentiment: ${a.sentiment})`).join('\n')}

Score this theme's activity today on two dimensions:
- activity_score: 1-10 (how much is happening in this theme today)
- thesis_score: -5 to +5 (negative = bad for thesis, positive = good for thesis, 0 = neutral/mixed)

Return JSON only: { "activity_score": X, "thesis_score": X, "reason": "one short phrase" }
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 150,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
};
```

---

## File structure

```
supernova-dashboard/
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main layout
│   │   ├── components/
│   │   │   ├── ThemePulse.jsx    # Panel 1 — heatmap
│   │   │   ├── Watchlist.jsx     # Panel 2 — stocks
│   │   │   └── WeeklyBrief.jsx   # Panel 3 — brief
│   │   └── api.js                # Calls to backend
│   └── package.json
├── backend/
│   ├── server.js                 # Express API
│   ├── services/
│   │   ├── news.js               # NewsAPI fetching
│   │   ├── prices.js             # Yahoo Finance fetching
│   │   └── claude.js             # All Claude API calls + prompts
│   ├── data/
│   │   └── cache.json            # Simple file-based cache
│   └── package.json
├── .env                          # API keys (never commit)
└── README.md
```

---

## Environment variables

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
NEWS_API_KEY=...
PORT=3001
CACHE_TTL_HOURS=3
```

---

## Build sequence (recommended order)

Start here — get something on screen fast, then add intelligence layers.

1. **Scaffold frontend** — static layout with hardcoded dummy data. Just get the three panels visible.
2. **Add price fetching** — wire up Yahoo Finance for the watchlist. Confirm tickers load.
3. **Add news fetching** — wire up NewsAPI per theme. Log raw results to console.
4. **Add Claude classification** — feed news through Prompt 1. Confirm JSON comes back correctly.
5. **Render theme pulse** — use classification results to drive the heatmap colors.
6. **Add stock context lines** — run Prompt 2 per stock using related news. Render in watchlist.
7. **Add weekly brief** — run Prompt 3 on demand via a button. Render in Panel 3.
8. **Add caching** — avoid hammering APIs. Store results in cache.json, refresh every 3h.
9. **Deploy to Vercel** — push to GitHub, connect Vercel, add env vars, done.

---

## What to demo

When showing this to Sigil (or anyone), the moment that lands is:

**Open the watchlist, point to a stock that moved, and read the AI-generated context sentence out loud.** If it correctly explains *why* the move matters for the specific thesis — not generic financial commentary — that's the demo. That's the thing a Bloomberg terminal doesn't do.

The weekly brief is the second demo moment. If it reads like something a smart analyst wrote in 10 minutes rather than AI slop, you've built the right thing.

---

## v0.2 ideas (after demo lands)

- **SEC filing watcher** — flag 8-K/10-Q filings from watchlist companies, auto-summarize for thesis relevance
- **Earnings call highlights** — transcript → extract only the parts relevant to Supernova themes
- **Private market radar** — track funding rounds in relevant sectors via Crunchbase API
- **Thesis drift alert** — flag when a company in the watchlist says something that contradicts the thesis
- **Portfolio correlation map** — visualize which holdings move together, identify concentration risks

---

*Built for Sigil Fund Supernova application — demo version*
