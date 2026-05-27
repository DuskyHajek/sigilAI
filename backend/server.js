import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SETTINGS } from "../config/settings.js";
import { WATCHLIST } from "../config/thesis.js";
import { buildMockDashboard } from "./services/mockData.js";
import { fetchPrices, enrichWatchlistWithContext } from "./services/prices.js";
import { fetchNewsAndProcess } from "./services/news.js";
import { generateWeeklyBrief } from "./services/brief.js";
import { generateResearchQueue } from "./services/researchQueue.js";
import {
  readCache,
  writeCache,
  getCacheAgeHours,
  getCacheBackend,
  isCacheStale,
} from "./services/cache.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const getApiKeys = () => ({
  anthropic: process.env.ANTHROPIC_API_KEY?.trim() || "",
  news: process.env.NEWS_API_KEY?.trim() || "",
});

const isLiveConfigured = () => {
  const { anthropic, news } = getApiKeys();
  return !!(anthropic && news);
};

const IS_VERCEL = !!process.env.VERCEL;

const runFullSync = async () => {
  const now = new Date();

  if (!isLiveConfigured()) {
    console.log(
      "Running in MOCK MODE (No API keys provided). Loading simulated Supernova data..."
    );
    const mockData = buildMockDashboard();
    await writeCache(mockData);
    return mockData;
  }

  console.log(
    `Running in LIVE MODE. Querying external APIs...${IS_VERCEL ? " (Vercel lite sync)" : ""}`
  );

  const previousCache = await readCache();

  const [{ themePulse, classifiedArticles, rawArticlesByTheme }, priceResult] =
    await Promise.all([
      fetchNewsAndProcess(),
      fetchPrices({ previousWatchlist: previousCache?.watchlist }),
    ]);
  const { watchlist: watchlistWithPrices, livePriceCount, total } = priceResult;

  await enrichWatchlistWithContext(watchlistWithPrices, classifiedArticles, {
    maxStocks: IS_VERCEL ? 20 : undefined,
    aiConcurrency: IS_VERCEL ? 4 : 5,
    rawArticlesByTheme,
  });
  const [weeklyBrief, researchQueue] = await Promise.all([
    generateWeeklyBrief(classifiedArticles, themePulse),
    generateResearchQueue(
      classifiedArticles,
      themePulse,
      watchlistWithPrices
    ),
  ]);

  const liveData = {
    isMock: false,
    pricesLive: livePriceCount === total,
    livePriceCount,
    lastUpdated: now.toISOString(),
    themePulse,
    watchlist: watchlistWithPrices,
    weeklyBrief,
    researchQueue,
  };

  await writeCache(liveData);
  return liveData;
};

const isCacheShapeValid = (cache) =>
  cache?.watchlist?.length === WATCHLIST.length &&
  Object.keys(cache?.themePulse || {}).length === 7;

const isUsableLiveCache = (cache) =>
  cache && isCacheShapeValid(cache) && cache.isMock === false;

const getDashboardFromCache = async () => {
  const cache = await readCache();
  if (cache && isCacheShapeValid(cache)) return cache;
  const mockData = buildMockDashboard();
  await writeCache(mockData);
  return mockData;
};

// Vercel Services may strip routePrefix before forwarding.
// We register routes on a router and mount it at both "/" and "/api".
const api = express.Router();

api.get("/health", async (req, res) => {
  const cache = await readCache();
  const live = isLiveConfigured();
  const keys = getApiKeys();

  res.json({
    status: "ok",
    mode: live ? "LIVE" : "MOCK",
    keysPresent: {
      anthropic: !!keys.anthropic,
      news: !!keys.news,
    },
    vercel: IS_VERCEL,
    cacheBackend: getCacheBackend(),
    lastSync: cache?.lastUpdated || null,
    cacheAge: getCacheAgeHours(cache),
    cacheStale: cache
      ? getCacheAgeHours(cache) >= SETTINGS.cache_ttl_hours
      : true,
    pricesLive: cache?.pricesLive ?? null,
    livePriceCount: cache?.livePriceCount ?? null,
  });
});

api.get("/dashboard", async (req, res) => {
  try {
    res.json(await getDashboardFromCache());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

api.post("/sync", async (req, res) => {
  try {
    const cached = await readCache();
    const force = req.query.force === "true";

    if (!force && isUsableLiveCache(cached) && !isCacheStale(cached)) {
      return res.json({
        ...cached,
        syncOk: true,
        syncSkipped: true,
        cacheOnly: true,
        message: `Using cached dashboard data because it is still within the ${SETTINGS.cache_ttl_hours}h cache window.`,
      });
    }

    const data = await runFullSync();
    res.json({ ...data, syncOk: true });
  } catch (error) {
    console.error("Sync failed:", error);

    const cached = await readCache();
    if (isUsableLiveCache(cached)) {
      return res.json({
        ...cached,
        syncOk: false,
        cacheOnly: true,
        syncError: error.message,
        hint:
          "Live sync failed, so the latest cached live dashboard data is being shown. This often happens when NewsAPI daily quota is exhausted.",
      });
    }

    res.status(500).json({
      error: error.message,
      syncOk: false,
      hint: IS_VERCEL
        ? "Vercel has a short function timeout. Retry once; if it still fails, run sync locally."
        : "Check API keys and external API availability.",
    });
  }
});

// Back-compat alias (older frontend)
api.post("/refresh", async (req, res) => {
  try {
    const data = await runFullSync();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api", api);
app.use("/", api);

const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  console.log(`Serving compiled frontend assets from: ${distPath}`);
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, async () => {
  const cache = await readCache();
  if (!isLiveConfigured() && (!cache || !isCacheShapeValid(cache))) {
    await writeCache(buildMockDashboard());
  }

  console.log(`==================================================`);
  console.log(`Supernova Dashboard Backend is running on port ${PORT}`);
  console.log(`Mode: ${isLiveConfigured() ? "LIVE" : "MOCK (No API keys)"}`);
  console.log(`==================================================`);
});
