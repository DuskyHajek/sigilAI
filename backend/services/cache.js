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

export const readCache = () => {
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

export const writeCache = (data) => {
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
