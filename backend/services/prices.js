import { WATCHLIST } from "../../config/thesis.js";
import { SETTINGS } from "../../config/settings.js";
import { buildStockContextPrompt } from "./prompts.js";
import { callClaude } from "./llm.js";
import { getMockWatchlist } from "./mockData.js";
import { articlesForStock } from "./articleMatch.js";
import { mapWithConcurrency } from "./concurrency.js";

const YAHOO_CHART_URL = (ticker) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`;

const fetchYahooChartQuote = async (ticker) => {
  const response = await fetch(YAHOO_CHART_URL(ticker), {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SupernovaDashboard/1.0)",
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
  }

  return {
    price: meta.regularMarketPrice ?? meta.chartPreviousClose ?? 0,
    name: meta.shortName || meta.longName || meta.symbol || ticker,
    change52w,
  };
};

const headlineFallbackContext = (stockNews) => {
  const best = stockNews[0];
  if (best?.one_line) return best.one_line;
  if (best?.title) return best.title;
  return "No thesis-relevant developments in the last 7 days.";
};

export const fetchPrices = async () => {
  const mockWatchlist = getMockWatchlist();

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
        price: quote.price,
        change52w: quote.change52w,
        priceSource: "yahoo",
        context: "",
      };
    } catch (error) {
      console.warn(
        `Failed to fetch Yahoo price for ${item.ticker}:`,
        error.message
      );
      const matchedMock = mockWatchlist.find((m) => m.ticker === item.ticker);
      return {
        ...(matchedMock || {
          ticker: item.ticker,
          name: item.company,
          company: item.company,
          aliases: item.aliases,
          theme: item.theme,
          angle: item.angle,
          priority: item.priority,
          price: 0,
          change52w: 0,
          context: "Unable to retrieve price or thesis updates.",
        }),
        priceSource: "mock",
      };
    }
  };

  const watchlist = await mapWithConcurrency(WATCHLIST, 5, fetchStock);
  const livePriceCount = watchlist.filter(
    (stock) => stock.priceSource === "yahoo"
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

  const ranked = watchlist
    .map((stock) => {
      const configItem =
        WATCHLIST.find((w) => w.ticker === stock.ticker) || stock;
      const stockNews = articlesForStock(configItem, classifiedArticles);
      return { stock, stockNews };
    })
    .sort((a, b) => b.stockNews.length - a.stockNews.length);

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
      entry.stock.context = headlineFallbackContext(entry.stockNews);
    }
  }

  await mapWithConcurrency(aiTargets, aiConcurrency, async ({ stock, stockNews }) => {
    const headlines = stockNews.map((article) => article.title);

    try {
      console.log(
        `Generating AI context for ${stock.ticker} (${headlines.length} matched articles)`
      );
      const prompt = buildStockContextPrompt(
        stock.ticker,
        stock.name || stock.company,
        stock.theme,
        headlines
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
      stock.context = headlineFallbackContext(stockNews);
    }
  });

  return watchlist;
};
