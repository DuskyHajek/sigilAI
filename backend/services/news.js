import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { THEMES } from "../../config/thesis.js";
import { SETTINGS } from "../../config/settings.js";
import {
  buildClassifyPrompt,
  buildThemePulsePrompt,
} from "./prompts.js";
import { callClaudeJSON } from "./llm.js";
import { mapWithConcurrency } from "./concurrency.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const NEWS_API_KEY = process.env.NEWS_API_KEY?.trim();
const IS_VERCEL = !!process.env.VERCEL;
const MAX_PER_THEME = IS_VERCEL ? 3 : SETTINGS.max_articles_per_theme;
const MAX_TO_CLASSIFY = IS_VERCEL ? 21 : 40;
const MIN_PER_THEME = 1;
const CLASSIFY_CONCURRENCY = IS_VERCEL ? 4 : 5;

export const fetchThemeNews = async (themeId) => {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not configured.");
  }

  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`);
  }

  const keywords = theme.news_keywords.join(" OR ");
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&sortBy=publishedAt&pageSize=${SETTINGS.max_articles_per_theme}&apiKey=${NEWS_API_KEY}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "SupernovaDashboard/1.0" },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NewsAPI error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.articles || [];
};

const classifyArticle = async (article) => {
  const prompt = buildClassifyPrompt(article);
  return callClaudeJSON(prompt, SETTINGS.classification_max_tokens);
};

const getThemePulseScore = async (theme, articles) => {
  const prompt = buildThemePulsePrompt(
    theme.display_name,
    theme.long_description,
    articles
  );
  return callClaudeJSON(prompt, SETTINGS.theme_pulse_max_tokens);
};

const programmaticPulseFallback = (articles, reasonPrefix = "Calculated from") => {
  const count = articles.length;
  const activity_score = Math.min(10, Math.max(2, count * 2));

  let sentimentSum = 0;
  articles.forEach((a) => {
    if (a.sentiment === "bullish") sentimentSum += a.significance || 2;
    if (a.sentiment === "bearish") sentimentSum -= a.significance || 2;
  });

  const averageSentiment = count > 0 ? sentimentSum / count : 0;
  const thesis_score = Math.min(5, Math.max(-5, Math.round(averageSentiment)));

  return {
    activity_score,
    thesis_score,
    reason:
      count > 0
        ? `${reasonPrefix} ${count} news item${count === 1 ? "" : "s"}.`
        : "No significant news updates monitored today.",
  };
};

const selectArticlesForClassification = (articles, maxTotal) => {
  const selected = [];
  const selectedUrls = new Set();
  const themeCounts = Object.fromEntries(THEMES.map((theme) => [theme.id, 0]));

  const tryAdd = (article) => {
    if (selected.length >= maxTotal || selectedUrls.has(article.url)) {
      return false;
    }
    selected.push(article);
    selectedUrls.add(article.url);
    return true;
  };

  // Pass 1: guarantee at least MIN_PER_THEME per theme
  for (const theme of THEMES) {
    for (const article of articles) {
      if (themeCounts[theme.id] >= MIN_PER_THEME) break;
      if (!article.searchedThemes.includes(theme.id)) continue;
      if (tryAdd(article)) {
        themeCounts[theme.id]++;
      }
    }
  }

  // Pass 2: fill remaining slots fairly across themes
  for (const article of articles) {
    if (selected.length >= maxTotal) break;
    if (selectedUrls.has(article.url)) continue;

    let shouldInclude = false;
    for (const themeId of article.searchedThemes) {
      if (themeCounts[themeId] < MAX_PER_THEME) {
        themeCounts[themeId]++;
        shouldInclude = true;
      }
    }
    if (shouldInclude) {
      tryAdd(article);
    }
  }

  return selected;
};

const rawPulseFromHeadlines = (articles) => {
  const count = articles.length;
  return {
    activity_score: Math.min(10, Math.max(2, count * 2)),
    thesis_score: 0,
    reason: `${count} headline${count === 1 ? "" : "s"} tracked this week`,
  };
};

export const fetchNewsAndProcess = async () => {
  console.log("Starting NewsAPI fetching for all 7 themes...");
  const allArticlesMap = {};
  const rawArticlesByTheme = Object.fromEntries(
    THEMES.map((theme) => [theme.id, []])
  );

  for (const theme of THEMES) {
    try {
      console.log(`Fetching news for theme: ${theme.id}`);
      const articles = await fetchThemeNews(theme.id);
      rawArticlesByTheme[theme.id] = articles.slice(0, MAX_PER_THEME);

      articles.forEach((article) => {
        if (!allArticlesMap[article.url]) {
          allArticlesMap[article.url] = {
            title: article.title,
            description: article.description || "",
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source,
            searchedThemes: [theme.id],
          };
        } else {
          allArticlesMap[article.url].searchedThemes.push(theme.id);
        }
      });
    } catch (err) {
      console.error(`Error fetching news for theme ${theme.id}:`, err.message);
    }
  }

  const deDuplicatedArticles = Object.values(allArticlesMap);
  console.log(
    `Fetched ${deDuplicatedArticles.length} unique raw articles from NewsAPI.`
  );

  if (deDuplicatedArticles.length === 0) {
    throw new Error("No articles retrieved from NewsAPI.");
  }

  deDuplicatedArticles.sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  const selectedArticles = selectArticlesForClassification(
    deDuplicatedArticles,
    MAX_TO_CLASSIFY
  );

  console.log(
    `Selected ${selectedArticles.length} articles for Claude intelligence analysis...`
  );

  const classifiedArticles = (
    await mapWithConcurrency(
      selectedArticles,
      CLASSIFY_CONCURRENCY,
      async (article) => {
        try {
          console.log(`Classifying: "${article.title.substring(0, 50)}..."`);
          const classification = await classifyArticle(article);

          if (
            classification.relevant &&
            classification.significance >= SETTINGS.significance_threshold
          ) {
            return {
              ...article,
              themes: classification.themes,
              sentiment: classification.sentiment,
              significance: classification.significance,
              one_line: classification.one_line,
            };
          }
        } catch (err) {
          console.error(
            `Failed to classify article "${article.title}":`,
            err.message
          );
        }
        return null;
      }
    )
  ).filter(Boolean);

  console.log(
    `Successfully classified ${classifiedArticles.length} thesis-relevant articles (sig >= ${SETTINGS.significance_threshold}).`
  );

  const themePulse = {};
  for (const theme of THEMES) {
    const themeArticles = classifiedArticles.filter(
      (a) => a.themes && a.themes.includes(theme.id)
    );

    if (themeArticles.length > 0) {
      if (IS_VERCEL) {
        themePulse[theme.id] = programmaticPulseFallback(themeArticles);
      } else {
        try {
          console.log(`Generating Theme Pulse score for: ${theme.id}`);
          themePulse[theme.id] = await getThemePulseScore(theme, themeArticles);
        } catch (err) {
          console.error(
            `Failed to get pulse score for ${theme.id}:`,
            err.message
          );
          themePulse[theme.id] = programmaticPulseFallback(themeArticles);
        }
      }
    } else if ((rawArticlesByTheme[theme.id] || []).length > 0) {
      themePulse[theme.id] = rawPulseFromHeadlines(
        rawArticlesByTheme[theme.id]
      );
    } else {
      themePulse[theme.id] = {
        activity_score: 1,
        thesis_score: 0,
        reason: "No significant news updates monitored today.",
      };
    }
  }

  return { themePulse, classifiedArticles, rawArticlesByTheme };
};
