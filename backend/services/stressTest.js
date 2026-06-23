import { SETTINGS } from "../../config/settings.js";
import { WATCHLIST, THEMES } from "../../config/thesis.js";
import { getStressScenarioById, STRESS_SCENARIOS } from "../../config/stressScenarios.js";
import { buildStressTestPrompt, buildThesisConfig } from "./prompts.js";
import { callClaudeJSON, isClaudeConfigured } from "./llm.js";
import { getMockStressResult } from "./mockStressResults.js";

const THEME_IDS = THEMES.map((t) => t.id);
const THEME_ID_SET = new Set(THEME_IDS);
const WATCHLIST_TICKERS = new Set(WATCHLIST.map((w) => w.ticker));

const VALID_IMPACTS = new Set(["bullish", "neutral", "bearish"]);
const VALID_IMPACT_TYPES = new Set(["structural", "timing", "sentiment"]);
const VALID_CONFIDENCE = new Set(["high", "medium", "low"]);
const VALID_EXPOSURE = new Set(["high", "medium", "low"]);

const IMPACT_WEIGHT = { bearish: 3, neutral: 1, bullish: 0 };

const slimWatchlist = () =>
  WATCHLIST.map(({ ticker, theme, angle, priority }) => ({
    ticker,
    theme,
    angle,
    priority,
  }));

const normalizeTickerRow = (row) => {
  if (!row || typeof row !== "object") return null;
  const ticker = String(row.ticker || "").trim();
  if (!WATCHLIST_TICKERS.has(ticker)) return null;
  const exposure = VALID_EXPOSURE.has(row.exposure) ? row.exposure : "medium";
  const rationale = String(row.rationale || "").trim();
  if (!rationale) return null;
  return { ticker, exposure, rationale };
};

const normalizeThemeImpact = (row) => {
  if (!row || typeof row !== "object") return null;
  const themeId = String(row.themeId || "").trim();
  if (!THEME_ID_SET.has(themeId)) return null;
  const impact = VALID_IMPACTS.has(row.impact) ? row.impact : "neutral";
  const impactType = VALID_IMPACT_TYPES.has(row.impactType)
    ? row.impactType
    : "sentiment";
  const confidence = VALID_CONFIDENCE.has(row.confidence)
    ? row.confidence
    : "medium";
  const rationale = String(row.rationale || "").trim();
  const transmission = String(row.transmission || "").trim();
  if (!rationale) return null;
  return {
    themeId,
    impact,
    impactType,
    confidence,
    rationale,
    transmission: transmission || rationale,
  };
};

const baselineTickerScore = (ticker, themeImpactById) => {
  const item = WATCHLIST.find((w) => w.ticker === ticker);
  if (!item) return 0;
  const themeImpact = themeImpactById[item.theme]?.impact || "neutral";
  let score = IMPACT_WEIGHT[themeImpact] ?? 1;
  if (item.priority === "core") score += 1;
  if (item.priority === "speculative") score += 0.5;
  return score;
};

/** Fill missing theme rows; dedupe ticker lists to valid watchlist names. */
const normalizeStressResult = (raw, scenario) => {
  const themeImpactsRaw = Array.isArray(raw?.themeImpacts) ? raw.themeImpacts : [];
  const byTheme = Object.fromEntries(
    themeImpactsRaw
      .map(normalizeThemeImpact)
      .filter(Boolean)
      .map((row) => [row.themeId, row])
  );

  const themeImpacts = THEME_IDS.map(
    (themeId) =>
      byTheme[themeId] || {
        themeId,
        impact: "neutral",
        impactType: "sentiment",
        confidence: "low",
        rationale: "Insufficient model output for this pillar.",
        transmission: "Scenario linkage unclear.",
      }
  );

  const themeImpactById = Object.fromEntries(
    themeImpacts.map((row) => [row.themeId, row])
  );

  const mostExposed = (raw?.tickerExposure?.mostExposed || [])
    .map(normalizeTickerRow)
    .filter(Boolean)
    .slice(0, 3);

  const mostResilient = (raw?.tickerExposure?.mostResilient || [])
    .map(normalizeTickerRow)
    .filter(Boolean)
    .slice(0, 3);

  const fillTickers = (existing, sortFn, limit = 3) => {
    const used = new Set(existing.map((r) => r.ticker));
    const candidates = WATCHLIST.map((w) => w.ticker)
      .filter((t) => !used.has(t))
      .sort((a, b) => sortFn(b) - sortFn(a))
      .slice(0, Math.max(0, limit - existing.length));

    const filled = candidates.map((ticker) => {
      const item = WATCHLIST.find((w) => w.ticker === ticker);
      const themeImpact = themeImpactById[item.theme]?.impact || "neutral";
      const exposure =
        themeImpact === "bearish"
          ? "high"
          : themeImpact === "bullish"
            ? "low"
            : "medium";
      return {
        ticker,
        exposure,
        rationale: `${item.angle} — ${themeImpact} read on ${item.theme} pillar under this scenario.`,
      };
    });

    return [...existing, ...filled].slice(0, limit);
  };

  const finalMostExposed =
    mostExposed.length >= 3
      ? mostExposed
      : fillTickers(
          mostExposed,
          (t) => baselineTickerScore(t, themeImpactById),
          3
        );

  const finalMostResilient =
    mostResilient.length >= 3
      ? mostResilient
      : fillTickers(
          mostResilient,
          (t) => -baselineTickerScore(t, themeImpactById),
          3
        );

  const counterIndicators = (Array.isArray(raw?.counterIndicators)
    ? raw.counterIndicators
    : []
  )
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    scenarioCategory: scenario.category,
    memoRef: scenario.memoRef,
    generatedAt: new Date().toISOString(),
    source: raw?.source || "claude",
    summaryLine:
      String(raw?.summaryLine || "").trim() ||
      `Stress read for: ${scenario.label}`,
    portfolioRead:
      String(raw?.portfolioRead || "").trim() ||
      "Portfolio impact analysis unavailable.",
    themeImpacts,
    tickerExposure: {
      mostExposed: finalMostExposed,
      mostResilient: finalMostResilient,
    },
    counterIndicators,
  };
};

const stressCache = new Map();

export const listStressScenarios = () =>
  STRESS_SCENARIOS.map(
    ({ id, label, shortDescription, category, memoRef }) => ({
      id,
      label,
      shortDescription,
      category,
      memoRef,
    })
  );

export const generateStressTest = async (scenarioId, options = {}) => {
  const scenario = getStressScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  const cacheKey = scenarioId;
  const cached = stressCache.get(cacheKey);
  if (cached && !options.force) {
    return { ...cached, cached: true };
  }

  const useMock = options.mock || !isClaudeConfigured();

  if (useMock) {
    const result = normalizeStressResult(
      { ...getMockStressResult(scenarioId), source: "mock" },
      scenario
    );
    stressCache.set(cacheKey, result);
    return result;
  }

  try {
    const prompt = buildStressTestPrompt(
      buildThesisConfig(),
      slimWatchlist(),
      scenario
    );
    const raw = await callClaudeJSON(
      prompt,
      SETTINGS.stress_test_max_tokens ?? 900
    );
    const result = normalizeStressResult({ ...raw, source: "claude" }, scenario);
    stressCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Stress test Claude failed, falling back to mock:", error.message);
    const result = normalizeStressResult(
      { ...getMockStressResult(scenarioId), source: "mock" },
      scenario
    );
    result.fallbackReason = error.message;
    stressCache.set(cacheKey, result);
    return result;
  }
};
