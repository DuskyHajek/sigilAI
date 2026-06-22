import { articleMatchesStock } from "./articleMatch.js";

const bearishRank = (s) => (s === "bearish" ? 1 : s === "neutral" ? 0 : -1);

export const sortArticlesByQuality = (articles) =>
  [...articles].sort((a, b) => {
    const sigDiff = (b.significance || 0) - (a.significance || 0);
    if (sigDiff !== 0) return sigDiff;
    const sentDiff = bearishRank(b.sentiment) - bearishRank(a.sentiment);
    if (sentDiff !== 0) return sentDiff;
    return (b.themes?.length || 0) - (a.themes?.length || 0);
  });

export const buildAnnotatedNewsFlow = (classifiedArticles, watchlist) =>
  sortArticlesByQuality(classifiedArticles)
    .slice(0, 20)
    .map((article) => {
      const matches = watchlist.filter((stock) =>
        articleMatchesStock(article, stock)
      );
      return {
        title: article.title,
        themes: article.themes,
        sentiment: article.sentiment,
        significance: article.significance,
        one_line: article.one_line,
        matchedTickers: matches.map((s) => s.ticker),
        matchedCompanies: matches.map((s) => s.company || s.name),
      };
    });
