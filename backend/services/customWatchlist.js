import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WATCHLIST, THEMES, getThemeById } from "../../config/thesis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CUSTOM_FILE = process.env.VERCEL
  ? path.join("/tmp", "supernova-custom-watchlist.json")
  : path.join(__dirname, "../data/custom_watchlist.json");

const CUSTOM_KEY = process.env.CUSTOM_WATCHLIST_KEY || "supernova:custom_watchlist";

const TICKER_PATTERN = /^[A-Z0-9][A-Z0-9.\-^]{0,14}$/i;

const getRemoteCacheConfig = () => {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    "";

  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
};

const runRemoteCommand = async (command) => {
  const config = getRemoteCacheConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Remote custom watchlist command failed (${response.status})`);
  }

  const body = await response.json();
  return body.result;
};

const readLocalCustomWatchlist = () => {
  try {
    if (fs.existsSync(CUSTOM_FILE)) {
      const data = fs.readFileSync(CUSTOM_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error reading custom watchlist file:", error);
  }
  return [];
};

const writeLocalCustomWatchlist = (items) => {
  try {
    const dir = path.dirname(CUSTOM_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CUSTOM_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing custom watchlist file:", error);
    throw error;
  }
};

export const readCustomWatchlist = async () => {
  if (getRemoteCacheConfig()) {
    try {
      const stored = await runRemoteCommand(["GET", CUSTOM_KEY]);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Error reading remote custom watchlist:", error);
    }
  }

  return readLocalCustomWatchlist();
};

export const writeCustomWatchlist = async (items) => {
  const payload = Array.isArray(items) ? items : [];

  if (getRemoteCacheConfig()) {
    try {
      await runRemoteCommand(["SET", CUSTOM_KEY, JSON.stringify(payload)]);
    } catch (error) {
      console.error("Error writing remote custom watchlist:", error);
      throw error;
    }
  }

  writeLocalCustomWatchlist(payload);
};

export const isCoreTicker = (ticker) =>
  WATCHLIST.some((item) => item.ticker.toUpperCase() === ticker.toUpperCase());

export const normalizeTicker = (ticker) => String(ticker || "").trim().toUpperCase();

export const validateTicker = (ticker) => {
  const normalized = normalizeTicker(ticker);
  if (!normalized) return { ok: false, error: "Ticker is required." };
  if (!TICKER_PATTERN.test(normalized)) {
    return { ok: false, error: "Ticker format is invalid." };
  }
  return { ok: true, ticker: normalized };
};

export const normalizeCustomEntry = (input) => {
  const tickerResult = validateTicker(input.ticker);
  if (!tickerResult.ok) {
    throw new Error(tickerResult.error);
  }

  const theme = String(input.theme || "").trim();
  if (!getThemeById(theme)) {
    throw new Error("Theme must be one of the 7 thesis pillars.");
  }

  const company = String(input.company || tickerResult.ticker).trim();
  const angle = String(input.angle || "User-added watch").trim();

  return {
    ticker: tickerResult.ticker,
    company,
    aliases: [...new Set([company, tickerResult.ticker].filter(Boolean))],
    theme,
    angle,
    priority: "watch",
    source: "custom",
  };
};

export const getEffectiveWatchlist = async () => {
  const custom = await readCustomWatchlist();
  return [...WATCHLIST, ...custom];
};

export const getExpectedWatchlistLength = async () => {
  const custom = await readCustomWatchlist();
  return WATCHLIST.length + custom.length;
};

export const addCustomWatchlistEntry = async (input) => {
  const entry = normalizeCustomEntry(input);

  if (isCoreTicker(entry.ticker)) {
    throw new Error(`${entry.ticker} is already in the curated Sigil watchlist.`);
  }

  const custom = await readCustomWatchlist();
  if (custom.some((item) => item.ticker.toUpperCase() === entry.ticker)) {
    throw new Error(`${entry.ticker} is already on the shared watchlist.`);
  }

  const next = [...custom, entry];
  await writeCustomWatchlist(next);
  return entry;
};

export const removeCustomWatchlistEntry = async (ticker) => {
  const normalized = normalizeTicker(ticker);
  if (!normalized) {
    throw new Error("Ticker is required.");
  }

  if (isCoreTicker(normalized)) {
    throw new Error("Curated Sigil watchlist names cannot be removed.");
  }

  const custom = await readCustomWatchlist();
  const next = custom.filter(
    (item) => item.ticker.toUpperCase() !== normalized
  );

  if (next.length === custom.length) {
    throw new Error(`${normalized} is not on the custom watchlist.`);
  }

  await writeCustomWatchlist(next);
  return normalized;
};
