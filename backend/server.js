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
import {
  readCache,
  writeCache,
  getCacheAgeHours,
  isCacheValid,
} from "./services/cache.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const isLiveConfigured = () =>
  !!(process.env.ANTHROPIC_API_KEY && process.env.NEWS_API_KEY);

const runFullSync = async () => {
  const now = new Date();

  if (!isLiveConfigured()) {
    console.log(
      "Running in MOCK MODE (No API keys provided). Loading simulated Supernova data..."
    );
    const mockData = buildMockDashboard();
    writeCache(mockData);
    return mockData;
  }

  console.log("Running in LIVE MODE. Querying external APIs...");

  const { themePulse, classifiedArticles } = await fetchNewsAndProcess();
  const watchlistWithPrices = await fetchPrices();
  await enrichWatchlistWithContext(watchlistWithPrices, classifiedArticles);
  const weeklyBrief = await generateWeeklyBrief(
    classifiedArticles,
    themePulse
  );

  const liveData = {
    isMock: false,
    lastUpdated: now.toISOString(),
    themePulse,
    watchlist: watchlistWithPrices,
    weeklyBrief,
  };

  writeCache(liveData);
  return liveData;
};

const isCacheShapeValid = (cache) =>
  cache?.watchlist?.length === WATCHLIST.length &&
  Object.keys(cache?.themePulse || {}).length === 7;

const getDashboardFromCache = () => {
  const cache = readCache();
  if (cache && isCacheShapeValid(cache)) return cache;
  const mockData = buildMockDashboard();
  writeCache(mockData);
  return mockData;
};

app.get("/api/health", (req, res) => {
  const cache = readCache();
  const live = isLiveConfigured();

  res.json({
    status: "ok",
    mode: live ? "LIVE" : "MOCK",
    lastSync: cache?.lastUpdated || null,
    cacheAge: getCacheAgeHours(cache),
    cacheStale: cache ? getCacheAgeHours(cache) >= SETTINGS.cache_ttl_hours : true,
  });
});

app.get("/api/dashboard", (req, res) => {
  try {
    res.json(getDashboardFromCache());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/sync", async (req, res) => {
  try {
    const data = await runFullSync();
    res.json(data);
  } catch (error) {
    console.error("Sync failed:", error);
    const cache = readCache();
    if (cache) {
      return res.json({ ...cache, isFallback: true, syncError: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/refresh", async (req, res) => {
  try {
    const data = await runFullSync();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  console.log(`Serving compiled frontend assets from: ${distPath}`);
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  const cache = readCache();
  if (!isLiveConfigured() && (!cache || !isCacheShapeValid(cache))) {
    writeCache(buildMockDashboard());
  }

  console.log(`==================================================`);
  console.log(`Supernova Dashboard Backend is running on port ${PORT}`);
  console.log(`Mode: ${isLiveConfigured() ? "LIVE" : "MOCK (No API keys)"}`);
  console.log(`==================================================`);
});
