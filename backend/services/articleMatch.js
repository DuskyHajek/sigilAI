import { getStockMatchTerms } from "../../config/thesis.js";

const articleText = (article) =>
  `${article.title || ""} ${article.description || ""} ${article.one_line || ""}`.toLowerCase();

export const articleMatchesStock = (article, watchlistItem) => {
  const text = articleText(article);
  return getStockMatchTerms(watchlistItem).some((term) =>
    text.includes(term.toLowerCase())
  );
};

const normalizeRawArticle = (article, themeId) => ({
  title: article.title,
  description: article.description || "",
  url: article.url,
  publishedAt: article.publishedAt,
  source: article.source,
  themes: [themeId],
  one_line: article.description || article.title,
  sentiment: "neutral",
  significance: 2,
  matchType: "raw",
});

/**
 * Match articles to a watchlist position:
 * 1. Direct company/ticker mention in headline text
 * 2. Classified articles tagged with the stock's theme
 * 3. Raw NewsAPI headlines for the stock's theme (unclassified fallback)
 */
export const articlesForStock = (
  watchlistItem,
  classifiedArticles,
  rawThemeArticles = []
) => {
  const direct = classifiedArticles.filter((article) =>
    articleMatchesStock(article, watchlistItem)
  );
  if (direct.length > 0) {
    return { articles: direct, matchType: "direct" };
  }

  const themeClassified = classifiedArticles
    .filter((article) => article.themes?.includes(watchlistItem.theme))
    .sort((a, b) => (b.significance || 0) - (a.significance || 0));

  if (themeClassified.length > 0) {
    return { articles: themeClassified.slice(0, 3), matchType: "theme" };
  }

  if (rawThemeArticles.length > 0) {
    return {
      articles: rawThemeArticles
        .slice(0, 3)
        .map((article) => normalizeRawArticle(article, watchlistItem.theme)),
      matchType: "raw",
    };
  }

  return { articles: [], matchType: "none" };
};
