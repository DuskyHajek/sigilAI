# Supernova Dashboard — Dev Setup & Deployment
### From zero to running in 20 minutes

---

## Prerequisites

Install these if you don't have them:
- **Node.js 18+** — nodejs.org
- **Git** — git-scm.com
- **A GitHub account** — github.com
- **A Vercel account** — vercel.com (free, sign in with GitHub)

---

## API keys to get first

Before writing a line of code, get these:

| Key | Where | Cost | Time |
|---|---|---|---|
| Anthropic API key | console.anthropic.com → API Keys | ~$5 credit to start | 5 min |
| NewsAPI key | newsapi.org → Register | Free tier (100 req/day) | 2 min |

---

## Local setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/supernova-dashboard
cd supernova-dashboard

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

Create your `.env` file in the project root:

```bash
# .env — never commit this file
ANTHROPIC_API_KEY=sk-ant-api03-...
NEWS_API_KEY=your_newsapi_key_here
PORT=3001
NODE_ENV=development
CACHE_TTL_HOURS=3
```

Start both servers (use two terminal windows):

```bash
# Terminal 1 — backend
cd backend
npm run dev
# Runs on http://localhost:3001

# Terminal 2 — frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open `http://localhost:5173` — you should see the dashboard in OFFLINE/MOCK MODE.
Click **Sync Engine** — it should switch to LIVE MODE and start fetching.

---

## Project structure

```
supernova-dashboard/
├── .env                          # API keys — NEVER commit
├── .gitignore                    # Must include .env
├── vercel.json                   # Vercel routing + cron config
├── README.md
│
├── config/
│   └── thesis.js                 # Single source of truth for themes + tickers
│
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── services/
│   │   ├── prompts.js            # All Claude prompts (imported, never inline)
│   │   ├── news.js               # NewsAPI fetching + classification
│   │   ├── prices.js             # Yahoo Finance fetching + stock context
│   │   ├── brief.js              # Weekly brief generation
│   │   └── cache.js              # File-based cache manager
│   ├── routes/
│   │   ├── sync.js               # POST /api/sync — manual trigger
│   │   ├── themes.js             # GET /api/themes — theme pulse data
│   │   ├── watchlist.js          # GET /api/watchlist — stock data
│   │   └── brief.js              # GET /api/brief — weekly brief
│   └── data/
│       └── cache.json            # Auto-generated cache file
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx               # Root layout, three panels
│       ├── api.js                # All fetch calls to backend
│       ├── components/
│       │   ├── Header.jsx        # Top bar with sync button + status
│       │   ├── ThemePulse.jsx    # Panel 1 — theme heatmap
│       │   ├── Watchlist.jsx     # Panel 2 — stock list with AI insights
│       │   └── WeeklyBrief.jsx   # Panel 3 — weekly brief
│       └── styles/
│           └── index.css         # Tailwind base + custom overrides
│
└── docs/
    ├── 01_thesis_config.md       # This file — thesis + tickers
    ├── 02_prompt_library.md      # All prompts + tuning notes
    ├── 03_maintenance_playbook.md
    └── 04_dev_setup.md           # This file
```

---

## Backend API routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Health check — returns status + last sync time |
| GET | `/api/themes` | Returns all 7 theme pulse scores |
| GET | `/api/watchlist` | Returns all tickers with prices + AI context |
| GET | `/api/brief` | Returns latest weekly brief |
| POST | `/api/sync` | Triggers full data refresh (news + prices + AI) |
| POST | `/api/sync/brief` | Triggers weekly brief regeneration only |

---

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial Supernova Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/supernova-dashboard.git
git push -u origin main
```

Make sure `.gitignore` has:
```
.env
node_modules/
backend/data/cache.json
```

### Step 2: Connect to Vercel

1. Go to vercel.com → Add New Project
2. Import from GitHub → select `supernova-dashboard`
3. Framework Preset: **Other**
4. Build Command: `npm run build --prefix frontend`
5. Output Directory: `frontend/dist`
6. Install Command: `npm install --prefix backend && npm install --prefix frontend`

### Step 3: Add environment variables

In Vercel project → Settings → Environment Variables, add:
- `ANTHROPIC_API_KEY` = your key
- `NEWS_API_KEY` = your key
- `NODE_ENV` = `production`
- `CACHE_TTL_HOURS` = `3`

### Step 4: Add vercel.json to project root

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 */3 * * *"
    },
    {
      "path": "/api/sync/brief",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

**Cron schedule explained:**
- `0 */3 * * *` = every 3 hours (news + price sync)
- `0 8 * * 1` = every Monday at 08:00 UTC (weekly brief)

### Step 5: Deploy

```bash
git push origin main
```

Vercel auto-deploys on every push to `main`. Watch the build in vercel.com/dashboard.

Your dashboard will be live at: `https://supernova-dashboard-YOUR_USERNAME.vercel.app`

---

## Custom domain (optional)

In Vercel → Project → Settings → Domains → Add domain.
Point your DNS CNAME to `cname.vercel-dns.com`. Takes ~10 minutes to propagate.

---

## After deploying — first live sync

1. Open your deployed URL
2. Confirm you see "OFFLINE // MOCK MODE" (no keys loaded yet — Vercel needs a redeploy after adding env vars)
3. Trigger a redeploy: Vercel → Deployments → three dots → Redeploy
4. After redeploy, click **Sync Engine**
5. Watch it switch to LIVE MODE and start populating

---

## Development workflow going forward

```bash
# Make a change locally
# Test at localhost:5173
git add .
git commit -m "what you changed"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

That's it. No manual deploy steps.
