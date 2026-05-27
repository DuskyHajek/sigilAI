import yahooFinance from "yahoo-finance2";
import { WATCHLIST } from "../../config/thesis.js";
import { SETTINGS } from "../../config/settings.js";
import { buildStockContextPrompt } from "./prompts.js";
import { callClaude } from "./llm.js";
import { getMockWatchlist } from "./mockData.js";
import { articlesForStock } from "./articleMatch.js";

export const fetchPrices = async () => {
  const mockWatchlist = getMockWatchlist();

  const fetchStock = async (item) => {
    try {
      const quote = await yahooFinance.quote(item.ticker);

      let change = 0;
      if (
        quote.fiftyTwoWeekChangePercent !== undefined &&
        quote.fiftyTwoWeekChangePercent !== null
      ) {
        change = parseFloat((quote.fiftyTwoWeekChangePercent * 100).toFixed(1));
      } else if (quote.regularMarketChangePercent !== undefined) {
        change = parseFloat(quote.regularMarketChangePercent.toFixed(1));
      }

      return {
        ticker: item.ticker,
        name: quote.shortName || item.company,
        company: item.company,
        aliases: item.aliases,
        theme: item.theme,
        angle: item.angle,
        priority: item.priority,
        price: quote.regularMarketPrice || quote.regularMarketPreviousClose || 0,
        change52w: change,
        context: "",
      };
    } catch (error) {
      console.warn(
        `Failed to fetch Yahoo price for ${item.ticker}:`,
        error.message
      );
      const matchedMock = mockWatchlist.find((m) => m.ticker === item.ticker);
      return (
        matchedMock || {
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
        }
      );
    }
  };

  return Promise.all(WATCHLIST.map(fetchStock));
};

export const enrichWatchlistWithContext = async (
  watchlist,
  classifiedArticles
) => {
  for (const stock of watchlist) {
    const configItem =
      WATCHLIST.find((w) => w.ticker === stock.ticker) || stock;
    const stockNews = articlesForStock(configItem, classifiedArticles);
    const headlines = stockNews.map((a) => a.title);

    try {
      if (headlines.length > 0) {
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
      } else {
        stock.context =
          "No thesis-relevant developments in the last 7 days.";
      }
    } catch (err) {
      console.error(
        `Failed to generate stock context for ${stock.ticker}:`,
        err.message
      );
      stock.context = "Unable to retrieve thesis context.";
    }
  }

  return watchlist;
};
