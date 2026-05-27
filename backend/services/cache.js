import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SETTINGS } from "../../config/settings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = process.env.VERCEL
  ? path.join("/tmp", "supernova-cache.json")
  : path.join(__dirname, "../data/cache.json");
const CACHE_TTL_MS = SETTINGS.cache_ttl_hours * 60 * 60 * 1000;
const CACHE_KEY = process.env.DASHBOARD_CACHE_KEY || "supernova:dashboard";

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
    throw new Error(`Remote cache command failed (${response.status})`);
  }

  const body = await response.json();
  return body.result;
};

const readLocalCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading cache file:", error);
  }
  return null;
};

const writeLocalCache = (data) => {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing cache file:", error);
  }
};

export const readCache = async () => {
  if (getRemoteCacheConfig()) {
    try {
      const cached = await runRemoteCommand(["GET", CACHE_KEY]);
      if (cached) {
        return typeof cached === "string" ? JSON.parse(cached) : cached;
      }
    } catch (error) {
      console.error("Error reading remote cache:", error);
    }
  }

  return readLocalCache();
};

export const writeCache = async (data) => {
  if (!data?.isMock && getRemoteCacheConfig()) {
    try {
      await runRemoteCommand(["SET", CACHE_KEY, JSON.stringify(data)]);
    } catch (error) {
      console.error("Error writing remote cache:", error);
    }
  }

  writeLocalCache(data);
};

export const getCacheBackend = () =>
  getRemoteCacheConfig() ? "remote-kv" : "local-file";

export const getCacheAgeHours = (cache) => {
  if (!cache?.lastUpdated) return null;
  const ageMs = Date.now() - new Date(cache.lastUpdated).getTime();
  return Math.round((ageMs / (60 * 60 * 1000)) * 10) / 10;
};

export const isCacheStale = (cache) => {
  if (!cache?.lastUpdated) return true;
  const ageMs = Date.now() - new Date(cache.lastUpdated).getTime();
  return ageMs >= CACHE_TTL_MS;
};

export const isCacheValid = (cache) => cache && !isCacheStale(cache);
