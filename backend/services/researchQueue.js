import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildResearchQueuePrompt } from "./prompts.js";
import { callClaudeJSON } from "./llm.js";

const IS_VERCEL = !!process.env.VERCEL;

const EMPTY_CONTEXT = "No thesis-relevant developments in the last 7 days.";
const MAX_SOURCES = 2;

const normalizeSource = (source) => ({
  title: String(source?.title || "").trim(),
  url: String(source?.url || "").trim(),
  source: source?.source ? String(source.source).trim() : null,
});

const isValidSource = (source) =>
  source.title && source.url && /^https?:\/\//i.test(source.url);

const articleSource = (article) =>
  normalizeSource({
    title: article.title,
    url: article.url,
    source: article.source?.name || article.source || null,
  });

export const findSourcesForItem = (item, classifiedArticles) => {
  const scoreArticleForItem = (article) => {
    if (!article.url) return -1;

    let score = article.significance || 0;
    const action = item.action.toLowerCase();
    const oneLine = (article.one_line || "").toLowerCase();
    const title = (article.title || "").toLowerCase();

    if (oneLine && oneLine.length > 20 && action.includes(oneLine)) score += 20;
    else if (oneLine && action.includes(oneLine.slice(0, 50))) score += 12;
    if (title && action.includes(title.slice(0, 40))) score += 15;
    if (item.theme && article.themes?.includes(item.theme)) score += 4;

    for (const keyword of item.keywords || []) {
      const term = String(keyword).toLowerCase();
      if (term.length >= 3 && (title.includes(term) || oneLine.includes(term))) {
        score += 3;
      }
    }

    for (const ticker of item.tickers || []) {
      const symbol = String(ticker).toLowerCase();
      if (title.includes(symbol) || oneLine.includes(symbol)) score += 2;
    }

    return score;
  };

  const scored = classifiedArticles
    .map((article) => ({ article, score: scoreArticleForItem(article) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.article.significance || 0) - (a.article.significance || 0)
    );

  const seen = new Set();
  const sources = [];

  const pushSource = (article) => {
    const source = articleSource(article);
    if (!isValidSource(source) || seen.has(source.url)) return;
    seen.add(source.url);
    sources.push(source);
  };

  for (const { article } of scored) {
    pushSource(article);
    if (sources.length >= MAX_SOURCES) return sources;
  }

  if (sources.length < MAX_SOURCES && item.theme) {
    const themeArticles = classifiedArticles
      .filter((article) => article.themes?.includes(item.theme) && article.url)
      .sort((a, b) => (b.significance || 0) - (a.significance || 0));

    for (const article of themeArticles) {
      pushSource(article);
      if (sources.length >= MAX_SOURCES) break;
    }
  }

  return sources;
};

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
  sources: (item.sources || [])
    .map(normalizeSource)
    .filter(isValidSource)
    .slice(0, MAX_SOURCES),
});

const enrichItemsWithSources = (items, classifiedArticles) =>
  items.map((item) => {
    const existing = item.sources || [];
    if (existing.length >= MAX_SOURCES) return item;

    const matched = findSourcesForItem(item, classifiedArticles);
    const seen = new Set(existing.map((source) => source.url));
    const merged = [...existing];

    for (const source of matched) {
      if (seen.has(source.url)) continue;
      merged.push(source);
      seen.add(source.url);
      if (merged.length >= MAX_SOURCES) break;
    }

    return { ...item, sources: merged };
  });

const finalizeQueue = (items, classifiedArticles) => ({
  items: enrichItemsWithSources(
    items.map((item) => normalizeItem(item)),
    classifiedArticles
  ),
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
      articles: themeArticles
        .slice(0, 3)
        .map((article) => articleSource(article))
        .filter(isValidSource),
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
      url: article.url,
      sourceName: article.source?.name || null,
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
  const themeCounts = {};

  const add = (item) => {
    const normalized = normalizeItem(item);
    if (!normalized.action) return;
    const key = normalized.action.toLowerCase().slice(0, 60);
    if (seen.has(key) || items.length >= 7) return;
    const themeKey = normalized.theme || "__none__";
    if (themeKey !== "__none__" && (themeCounts[themeKey] || 0) >= 2) return;
    seen.add(key);
    themeCounts[themeKey] = (themeCounts[themeKey] || 0) + 1;
    items.push(normalized);
  };

  // One pass per theme (sorted by signal strength) so we get breadth first
  const themeSignals = signals
    .filter((signal) => signal.type === "theme")
    .sort(
      (a, b) =>
        b.activity - a.activity ||
        Math.abs(b.thesis) - Math.abs(a.thesis)
    );

  for (const signal of themeSignals) {
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
    .slice(0, 5)) {
    add({
      action: `Read and verify: ${signal.one_line || signal.title}`,
      keywords: [
        ...(signal.themes || []),
        signal.title?.split(/\s+/).slice(0, 2).join(" "),
      ],
      theme: signal.themes?.[0] || null,
      tickers: [],
      sources: signal.url
        ? [
            normalizeSource({
              title: signal.title,
              url: signal.url,
              source: signal.sourceName,
            }),
          ].filter(isValidSource)
        : [],
    });
  }

  for (const signal of signals
    .filter((item) => item.type === "watchlist")
    .slice(0, 6)) {
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
    return finalizeQueue(
      [
        {
          action:
            "Run Sync to pull headlines, then use theme filters to find what deserves deeper work.",
          keywords: ["sync", "thesis themes"],
          theme: null,
          tickers: [],
        },
      ],
      classifiedArticles
    );
  }

  if (IS_VERCEL) {
    return finalizeQueue(fallback.items, classifiedArticles);
  }

  try {
    const prompt = buildResearchQueuePrompt(signals);
    const result = await callClaudeJSON(
      prompt,
      SETTINGS.research_queue_max_tokens
    );

    if (Array.isArray(result.items) && result.items.length >= 3) {
      const deduped = [];
      const themeCounts = {};
      const seen = new Set();
      for (const raw of result.items) {
        const item = normalizeItem(raw);
        if (!item.action) continue;
        const key = item.action.toLowerCase().slice(0, 60);
        if (seen.has(key)) continue;
        const themeKey = item.theme || "__none__";
        if (themeKey !== "__none__" && (themeCounts[themeKey] || 0) >= 2) continue;
        seen.add(key);
        themeCounts[themeKey] = (themeCounts[themeKey] || 0) + 1;
        deduped.push(item);
        if (deduped.length >= 7) break;
      }
      if (deduped.length >= 3) {
        return finalizeQueue(deduped, classifiedArticles);
      }
    }
  } catch (err) {
    console.error("Research queue generation failed:", err.message);
  }

  return finalizeQueue(fallback.items, classifiedArticles);
};
