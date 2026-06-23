import { WATCHLIST } from "../../config/thesis.js";
import { SETTINGS } from "../../config/settings.js";
import { buildStockContextPrompt } from "./prompts.js";
import { callClaude } from "./llm.js";
import { articlesForStock } from "./articleMatch.js";
import { mapWithConcurrency } from "./concurrency.js";

const YAHOO_HOSTS = [
  "query1.finance.yahoo.com",
  "query2.finance.yahoo.com",
];

const yahooChartUrl = (host, ticker) =>
  `https://${host}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`;

const fetchYahooChartQuote = async (ticker) => {
  let lastError;

  for (const host of YAHOO_HOSTS) {
    try {
      const response = await fetch(yahooChartUrl(host, ticker), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Yahoo chart HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = data?.chart?.result?.[0];
      if (!result?.meta) {
        throw new Error("Yahoo chart returned no data");
      }

      const { meta } = result;
      const closes =
        result.indicators?.quote?.[0]?.close?.filter((value) => value != null) ??
        [];

      let change52w = 0;
      if (closes.length >= 2) {
        const first = closes[0];
        const last = closes[closes.length - 1];
        change52w = parseFloat((((last - first) / first) * 100).toFixed(1));
      } else if (meta.fiftyTwoWeekLow && meta.regularMarketPrice) {
        change52w = parseFloat(
          (
            ((meta.regularMarketPrice - meta.fiftyTwoWeekLow) /
              meta.fiftyTwoWeekLow) *
            100
          ).toFixed(1)
        );
      }

      return {
        price: meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0,
        name: meta.shortName || meta.longName || meta.symbol || ticker,
        currency: meta.currency || null,
        change52w,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Yahoo chart fetch failed");
};

const headlineFallbackContext = (stockNews, matchType) => {
  const best = stockNews[0];
  if (best?.one_line) return best.one_line;
  if (best?.title) return best.title;
  if (matchType === "theme") {
    return "Theme-level news flow this week; no company-specific headline matched.";
  }
  return "No thesis-relevant developments in the last 7 days.";
};

export const fetchPrices = async (options = {}) => {
  const previousWatchlist = options.previousWatchlist || [];

  const fetchStock = async (item) => {
    try {
      const quote = await fetchYahooChartQuote(item.ticker);

      return {
        ticker: item.ticker,
        name: quote.name || item.company,
        company: item.company,
        aliases: item.aliases,
        theme: item.theme,
        angle: item.angle,
        priority: item.priority,
        spotlight: item.spotlight || null,
        price: quote.price,
        currency: quote.currency,
        change52w: quote.change52w,
        priceSource: "yahoo",
        context: "",
      };
    } catch (error) {
      console.warn(
        `Failed to fetch Yahoo price for ${item.ticker}:`,
        error.message
      );

      const cached = previousWatchlist.find(
        (stock) =>
          stock.ticker === item.ticker &&
          stock.price > 0 &&
          (stock.priceSource === "yahoo" || stock.priceSource === "yahoo_cached")
      );

      if (cached) {
        return {
          ...cached,
          company: item.company,
          aliases: item.aliases,
          theme: item.theme,
          angle: item.angle,
          priority: item.priority,
          spotlight: item.spotlight || cached.spotlight || null,
          priceSource: "yahoo_cached",
          context: "",
        };
      }

      return {
        ticker: item.ticker,
        name: item.company,
        company: item.company,
        aliases: item.aliases,
        theme: item.theme,
        angle: item.angle,
        priority: item.priority,
        spotlight: item.spotlight || null,
        price: 0,
        change52w: 0,
        priceSource: "unavailable",
        context: "",
      };
    }
  };

  const watchlist = await mapWithConcurrency(WATCHLIST, 5, fetchStock);
  const livePriceCount = watchlist.filter((stock) =>
    ["yahoo", "yahoo_cached"].includes(stock.priceSource)
  ).length;

  return { watchlist, livePriceCount, total: watchlist.length };
};

export const enrichWatchlistWithContext = async (
  watchlist,
  classifiedArticles,
  options = {}
) => {
  const maxStocks = options.maxStocks ?? watchlist.length;
  const aiConcurrency = options.aiConcurrency ?? 3;
  const rawArticlesByTheme = options.rawArticlesByTheme || {};

  const ranked = watchlist
    .map((stock) => {
      const configItem =
        WATCHLIST.find((w) => w.ticker === stock.ticker) || stock;
      const { articles, matchType } = articlesForStock(
        configItem,
        classifiedArticles,
        rawArticlesByTheme[configItem.theme] || []
      );
      const matchScore =
        matchType === "direct" ? 3 : matchType === "theme" ? 2 : matchType === "raw" ? 1 : 0;
      return { stock, stockNews: articles, matchType, matchScore };
    })
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore || b.stockNews.length - a.stockNews.length
    );

  let aiGenerated = 0;
  const aiTargets = [];

  for (const entry of ranked) {
    if (entry.stockNews.length === 0) {
      entry.stock.context =
        "No thesis-relevant developments in the last 7 days.";
      continue;
    }

    if (aiGenerated < maxStocks) {
      aiGenerated++;
      aiTargets.push(entry);
    } else {
      entry.stock.context = headlineFallbackContext(
        entry.stockNews,
        entry.matchType
      );
    }
  }

  await mapWithConcurrency(aiTargets, aiConcurrency, async (entry) => {
    const { stock, stockNews, matchType } = entry;
    const headlines = stockNews.map((article) => article.title);
    const configItem = WATCHLIST.find((w) => w.ticker === stock.ticker) || stock;

    try {
      console.log(
        `Generating AI context for ${stock.ticker} (${matchType}, ${headlines.length} articles)`
      );
      const prompt = buildStockContextPrompt(
        stock.ticker,
        stock.name || stock.company,
        stock.theme,
        configItem.angle,
        headlines,
        matchType
      );
      stock.context = await callClaude(
        prompt,
        SETTINGS.stock_context_max_tokens
      );
    } catch (err) {
      console.error(
        `Failed to generate stock context for ${stock.ticker}:`,
        err.message
      );
      stock.context = headlineFallbackContext(stockNews, matchType);
    }
  });

  return watchlist;
};
