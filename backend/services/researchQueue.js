import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildResearchQueuePrompt } from "./prompts.js";
import { callClaudeJSON } from "./llm.js";

const EMPTY_CONTEXT = "No thesis-relevant developments in the last 7 days.";

const normalizeItem = (item) => ({
  action: String(item.action || "").trim(),
  keywords: (item.keywords || [])
    .map((k) => String(k).trim())
    .filter(Boolean)
    .slice(0, 5),
  theme: item.theme || null,
  tickers: (item.tickers || [])
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 4),
});

export const buildResearchSignals = (
  classifiedArticles,
  themePulse,
  watchlist
) => {
  const signals = [];

  for (const theme of THEMES) {
    const pulse = themePulse[theme.id];
    if (!pulse) continue;

    const themeArticles = classifiedArticles.filter((article) =>
      article.themes?.includes(theme.id)
    );
    const themeStocks = watchlist.filter(
      (stock) =>
        stock.theme === theme.id &&
        stock.context &&
        stock.context !== EMPTY_CONTEXT
    );

    if (pulse.activity_score <= 1 && themeArticles.length === 0) continue;

    signals.push({
      type: "theme",
      theme: theme.id,
      themeName: theme.display_name,
      activity: pulse.activity_score,
      thesis: pulse.thesis_score,
      reason: pulse.reason,
      headlines: themeArticles.slice(0, 3).map((a) => a.title),
      tickers: themeStocks.slice(0, 4).map((s) => s.ticker),
    });
  }

  for (const article of [...classifiedArticles]
    .sort((a, b) => (b.significance || 0) - (a.significance || 0))
    .slice(0, 10)) {
    signals.push({
      type: "article",
      themes: article.themes || [],
      significance: article.significance,
      sentiment: article.sentiment,
      title: article.title,
      one_line: article.one_line,
    });
  }

  for (const stock of watchlist.filter(
    (item) => item.context && item.context !== EMPTY_CONTEXT
  )) {
    signals.push({
      type: "watchlist",
      ticker: stock.ticker,
      theme: stock.theme,
      angle: stock.angle,
      note: stock.context,
    });
  }

  return signals;
};

export const buildResearchQueueProgrammatic = (signals) => {
  const items = [];
  const seen = new Set();

  const add = (item) => {
    const normalized = normalizeItem(item);
    if (!normalized.action) return;
    const key = normalized.action.toLowerCase();
    if (seen.has(key) || items.length >= 7) return;
    seen.add(key);
    items.push(normalized);
  };

  const themeSignals = signals
    .filter((signal) => signal.type === "theme")
    .sort(
      (a, b) =>
        b.activity - a.activity ||
        Math.abs(b.thesis) - Math.abs(a.thesis)
    );

  for (const signal of themeSignals.slice(0, 4)) {
    const tickerHint = signal.tickers?.length
      ? ` Watchlist: ${signal.tickers.join(", ")}.`
      : "";
    add({
      action: `Review ${signal.themeName} news against the thesis — ${signal.reason}.${tickerHint}`,
      keywords: [
        signal.themeName.split(" ")[0],
        ...(signal.headlines?.[0]?.split(/\s+/).slice(0, 2) || []),
      ],
      theme: signal.theme,
      tickers: signal.tickers,
    });
  }

  for (const signal of signals
    .filter((item) => item.type === "article")
    .slice(0, 3)) {
    add({
      action: `Read and verify: ${signal.one_line || signal.title}`,
      keywords: [
        ...(signal.themes || []),
        signal.title?.split(/\s+/).slice(0, 2).join(" "),
      ],
      theme: signal.themes?.[0] || null,
      tickers: [],
    });
  }

  for (const signal of signals
    .filter((item) => item.type === "watchlist")
    .slice(0, 4)) {
    add({
      action: `Check ${signal.ticker} — ${signal.angle}`,
      keywords: [signal.ticker, signal.theme],
      theme: signal.theme,
      tickers: [signal.ticker],
    });
  }

  if (items.length < 3) {
    add({
      action: "Sync again when you need a fresh pass on thesis-relevant headlines.",
      keywords: ["NewsAPI", "thesis sync"],
      theme: null,
      tickers: [],
    });
  }

  return { items: items.slice(0, 7) };
};

export const generateResearchQueue = async (
  classifiedArticles,
  themePulse,
  watchlist
) => {
  const signals = buildResearchSignals(
    classifiedArticles,
    themePulse,
    watchlist
  );
  const fallback = buildResearchQueueProgrammatic(signals);

  if (signals.length === 0) {
    return {
      items: [
        {
          action:
            "Run Sync to pull headlines, then use theme filters to find what deserves deeper work.",
          keywords: ["sync", "thesis themes"],
          theme: null,
          tickers: [],
        },
      ],
    };
  }

  try {
    const prompt = buildResearchQueuePrompt(signals);
    const result = await callClaudeJSON(
      prompt,
      SETTINGS.research_queue_max_tokens
    );

    if (Array.isArray(result.items) && result.items.length >= 3) {
      return {
        items: result.items.slice(0, 7).map(normalizeItem).filter((i) => i.action),
      };
    }
  } catch (err) {
    console.error("Research queue generation failed:", err.message);
  }

  return fallback;
};
