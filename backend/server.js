import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SETTINGS } from "../config/settings.js";
import { buildMockDashboard } from "./services/mockData.js";
import { fetchPrices, enrichWatchlistWithContext } from "./services/prices.js";
import {
  addCustomWatchlistEntry,
  getExpectedWatchlistLength,
  removeCustomWatchlistEntry,
} from "./services/customWatchlist.js";
import { fetchNewsAndProcess } from "./services/news.js";
import { generateWeeklyBrief } from "./services/brief.js";
import { generateResearchQueue } from "./services/researchQueue.js";
import { generateAdversarialAnalysis } from "./services/adversarial.js";
import { generateThesisDriftReport } from "./services/thesisDrift.js";
import {
  generateStressTest,
  listStressScenarios,
} from "./services/stressTest.js";
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
    const mockData = await buildMockDashboard();
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

  const weeklyBriefPromise = generateWeeklyBrief(
    classifiedArticles,
    themePulse
  );
  const adversarialPromise = generateAdversarialAnalysis(
    classifiedArticles,
    themePulse
  );
  const thesisDriftPromise = generateThesisDriftReport(
    classifiedArticles,
    watchlistWithPrices,
    themePulse
  );

  const enrichPromise = enrichWatchlistWithContext(
    watchlistWithPrices,
    classifiedArticles,
    {
      maxStocks: IS_VERCEL ? 10 : undefined,
      aiConcurrency: 5,
      rawArticlesByTheme,
    }
  );

  const [weeklyBrief, adversarialAssessment, thesisDriftReport] =
    await Promise.all([
      weeklyBriefPromise,
      adversarialPromise,
      thesisDriftPromise,
      enrichPromise,
    ]);

  const researchQueue = await generateResearchQueue(
    classifiedArticles,
    themePulse,
    watchlistWithPrices
  );

  const liveData = {
    isMock: false,
    pricesLive: livePriceCount === total,
    livePriceCount,
    lastUpdated: now.toISOString(),
    themePulse,
    watchlist: watchlistWithPrices,
    weeklyBrief,
    researchQueue,
    adversarialAssessment,
    thesisDriftReport,
  };

  await writeCache(liveData);
  return liveData;
};

const isCacheShapeValid = async (cache) => {
  if (!cache?.watchlist || Object.keys(cache?.themePulse || {}).length !== 7) {
    return false;
  }
  const expected = await getExpectedWatchlistLength();
  return cache.watchlist.length === expected;
};

const isUsableLiveCache = async (cache) =>
  cache && (await isCacheShapeValid(cache)) && cache.isMock === false;

const refreshWatchlistInCache = async () => {
  const previousCache = await readCache();
  const { watchlist, livePriceCount, total } = await fetchPrices({
    previousWatchlist: previousCache?.watchlist,
  });

  const watchlistWithContext = watchlist.map((stock) => {
    const prev = previousCache?.watchlist?.find(
      (item) => item.ticker === stock.ticker
    );
    if (prev?.context) {
      return { ...stock, context: prev.context };
    }
    return {
      ...stock,
      context:
        stock.angle ||
        (stock.source === "custom"
          ? "Added to shared demo watchlist."
          : "No thesis-relevant developments in the last 7 days."),
    };
  });

  const base =
    previousCache?.themePulse &&
    Object.keys(previousCache.themePulse).length === 7
      ? previousCache
      : await buildMockDashboard();

  const updated = {
    ...base,
    watchlist: watchlistWithContext,
    livePriceCount,
    pricesLive: livePriceCount === total,
    lastUpdated: new Date().toISOString(),
  };

  await writeCache(updated);
  return updated;
};

const getDashboardFromCache = async () => {
  const cache = await readCache();
  if (cache && (await isCacheShapeValid(cache))) return cache;
  const mockData = await buildMockDashboard();
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

api.get("/stress-scenarios", async (req, res) => {
  try {
    res.json({ scenarios: listStressScenarios() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

api.post("/stress-test", async (req, res) => {
  try {
    const scenarioId = String(req.body?.scenarioId || "").trim();
    if (!scenarioId) {
      return res.status(400).json({ error: "scenarioId is required" });
    }

    const forceMock = !isLiveConfigured();
    const result = await generateStressTest(scenarioId, { mock: forceMock });
    res.json(result);
  } catch (error) {
    console.error("Stress test failed:", error);
    res.status(error.message?.startsWith("Unknown scenario") ? 404 : 500).json({
      error: error.message,
    });
  }
});

api.post("/sync", async (req, res) => {
  try {
    const cached = await readCache();
    const force = req.query.force === "true";

    if (!force && (await isUsableLiveCache(cached)) && !isCacheStale(cached)) {
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
    if (await isUsableLiveCache(cached)) {
      return res.json({
        ...cached,
        syncOk: false,
        cacheOnly: true,
        syncError: error.message,
        hint: IS_VERCEL
          ? "Live sync failed on Vercel (often a 60s function timeout). Showing cached data — retry once, or run sync locally and redeploy."
          : "Live sync failed, so the latest cached live dashboard data is being shown. Check server logs for syncError details.",
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

api.post("/watchlist/custom", async (req, res) => {
  try {
    await addCustomWatchlistEntry(req.body);
    const dashboard = await refreshWatchlistInCache();
    res.json({ ok: true, watchlist: dashboard.watchlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

api.delete("/watchlist/custom/:ticker", async (req, res) => {
  try {
    await removeCustomWatchlistEntry(req.params.ticker);
    const dashboard = await refreshWatchlistInCache();
    res.json({ ok: true, watchlist: dashboard.watchlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  if (!isLiveConfigured() && (!cache || !(await isCacheShapeValid(cache)))) {
    await writeCache(await buildMockDashboard());
  }

  console.log(`==================================================`);
  console.log(`Supernova Dashboard Backend is running on port ${PORT}`);
  console.log(`Mode: ${isLiveConfigured() ? "LIVE" : "MOCK (No API keys)"}`);
  console.log(`==================================================`);
});
