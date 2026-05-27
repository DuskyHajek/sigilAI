# Sigil Supernova Intelligence Dashboard (v0.1)

A thesis-driven investment intelligence dashboard scoped specifically to the **Sigil Supernova** fund thesis. It reads, classifies, and overlays global market signals through a proprietary investment lens.

---

## 🚀 Getting Started

### 1. Installation
Install root, backend, and frontend dependencies simultaneously from the root directory:
```bash
npm run install-all
```

### 2. Run the Application
Start both the Express backend and the Vite client concurrently:
```bash
npm run dev
```
* The frontend will be available at `http://localhost:5173`.
* The backend API server will run at `http://localhost:3001`.

---

## ⚙️ Configuration & API Setup

Configure your API keys in the `.env` file located in the root directory.

```bash
# .env
PORT=3001
CACHE_TTL_HOURS=3

# Live API Integration (Optional)
ANTHROPIC_API_KEY=your-claud-api-key
NEWS_API_KEY=your-newsapi-org-key
```

### Mock Mode Fallback
If API keys are left blank or omitted, the application automatically enters **Mock Mode**. It will generate and cache highly realistic, thesis-aligned market signals and stock analysis. This allows you to explore the dashboard layout and animations immediately without configuring API accounts.

---

## 📂 Project Architecture

```
supernova-dashboard/
├── package.json               # Root launcher (concurrently)
├── .env                       # API configurations
├── backend/
│   ├── server.js              # Express API & cache router
│   ├── services/
│   │   ├── news.js            # NewsAPI theme queries
│   │   ├── prices.js          # Yahoo Finance stock price fetching
│   │   ├── claude.js          # Claude 3.5 Sonnet prompt handlers
│   │   └── mockData.js        # Hardcoded simulated dashboard payloads
│   └── data/
│       └── cache.json         # Flat JSON file cache
└── frontend/
    ├── vite.config.js         # Client builder & backend API proxy
    ├── index.html
    └── src/
        ├── index.css          # Glassmorphism & pulsing theme declarations
        ├── App.jsx            # Main workspace structure
        ├── api.js             # Client network helpers
        └── components/
            ├── ThemePulse.jsx # Heatmap grid card components
            ├── Watchlist.jsx  # Watchlist tickers and context overlays
            └── WeeklyBrief.jsx# Simulator terminal analytics
```

---

## 🧠 Prompts & Intelligence Layer

The intelligence layer utilizes the **Anthropic Claude API** with four specific prompt pipelines configured inside `backend/services/claude.js`:

1. **Theme Classification & Sentiment:** Maps raw headlines to the 7 core thesis themes, outputting significance ratings and sentiment flags.
2. **Watchlist One-Liners:** Translates complex weekly company press releases/news into concise sentences directly linked to the thesis bottleneck rules.
3. **Weekly Executive Brief:** Condenses significant signals into an authoritative paragraph written for the CIO.
4. **Theme Pulse Heatmap:** Aggregates multi-article indices to output a 1-10 activity level and -5 to +5 thesis sentiment rating.
