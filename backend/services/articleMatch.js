import { getStockMatchTerms } from "../../config/thesis.js";

const articleText = (article) =>
  `${article.title || ""} ${article.description || ""} ${article.one_line || ""}`.toLowerCase();

export const articleMatchesStock = (article, watchlistItem) => {
  const text = articleText(article);
  return getStockMatchTerms(watchlistItem).some((term) =>
    text.includes(term.toLowerCase())
  );
};

export const articlesForStock = (watchlistItem, classifiedArticles) =>
  classifiedArticles.filter((article) =>
    articleMatchesStock(article, watchlistItem)
  );
