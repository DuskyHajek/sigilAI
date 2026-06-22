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
const MAX_TO_CLASSIFY = IS_VERCEL ? 14 : 40;
const THEME_FETCH_CONCURRENCY = IS_VERCEL ? 3 : 5;
const MIN_PER_THEME = 1;
const CLASSIFY_CONCURRENCY = IS_VERCEL ? 4 : 5;
const LOOKBACK_DAYS = 7;
const FALLBACK_QUERIES_PER_THEME = IS_VERCEL ? 1 : 3;

const quoteKeyword = (keyword) =>
  keyword.includes(" ") ? `"${keyword}"` : keyword;

const getFromDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - LOOKBACK_DAYS);
  return date.toISOString().slice(0, 10);
};

const fetchNewsQuery = async (query, pageSize) => {
  const params = new URLSearchParams({
    q: query,
    searchIn: "title,description",
    language: "en",
    sortBy: "publishedAt",
    pageSize: String(pageSize),
    from: getFromDate(),
    apiKey: NEWS_API_KEY,
  });

  const response = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`,
    {
      headers: { "User-Agent": "SupernovaDashboard/1.0" },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NewsAPI error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return (data.articles || []).filter(
    (article) =>
      article.title &&
      article.url &&
      article.title !== "[Removed]" &&
      article.description !== "[Removed]"
  );
};

const dedupeArticles = (articles) => {
  const seen = new Set();
  return articles.filter((article) => {
    const key = article.url || article.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const fallbackQueriesByTheme = {
  datacenters: [
    '"AI datacenter" OR "hyperscaler capex" OR "Nvidia Blackwell"',
    '"HBM" OR "high bandwidth memory" OR "advanced packaging"',
    '"AI power" OR "data center power" OR "copper" OR "grid capacity"',
  ],
  application: [
    '"AI agents" OR "AI agent" OR "agentic AI"',
    '"AI coding" OR "GitHub Copilot" OR "Cursor AI" OR "Claude Code" OR "OpenAI Codex"',
    '"enterprise AI" OR "AI automation" OR "vertical SaaS" OR "SaaS AI"',
  ],
  robotics: [
    '"industrial automation" OR "warehouse robotics" OR "factory automation"',
    '"agricultural robot" OR "mining automation" OR "autonomous mobile robot"',
    '"robotics" OR "machine vision" OR "humanoid robot"',
  ],
  warfare: [
    '"Ukraine drone" OR "drone warfare" OR "loitering munition"',
    '"NATO defense spending" OR "European defense" OR "defense procurement"',
    '"counter-drone" OR "electronic warfare" OR "autonomous drone"',
  ],
  space: [
    '"SpaceX launch" OR "Rocket Lab" OR "reusable rocket"',
    '"satellite constellation" OR "Starlink" OR "LEO satellite"',
    '"space defense" OR "orbital infrastructure" OR "launch contract"',
  ],
  biotech: [
    '"AI drug discovery" OR "AI diagnostics" OR "precision medicine"',
    '"clinical trial AI" OR "protein folding" OR "AI genomics"',
    '"longevity research" OR "GLP-1" OR "biotech FDA"',
  ],
  adversarial: [
    '"AI cybersecurity" OR "AI phishing" OR "LLM security"',
    '"deepfake fraud" OR "synthetic identity" OR "AI fraud"',
    '"autonomous hacking" OR "zero day AI" OR "agent security"',
  ],
};

export const fetchThemeNews = async (themeId) => {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not configured.");
  }

  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) {
    throw new Error(`Unknown theme: ${themeId}`);
  }

  const primaryQuery = theme.news_keywords.map(quoteKeyword).join(" OR ");
  let articles = [];
  let primaryError = null;

  try {
    articles = await fetchNewsQuery(
      primaryQuery,
      SETTINGS.max_articles_per_theme
    );
  } catch (error) {
    primaryError = error;
    console.warn(
      `Primary NewsAPI query failed for ${themeId}; trying fallback queries:`,
      error.message
    );
  }

  if (articles.length >= MAX_PER_THEME || !fallbackQueriesByTheme[themeId]) {
    if (primaryError && articles.length === 0) throw primaryError;
    return articles;
  }

  const fallbackQueries = fallbackQueriesByTheme[themeId].slice(
    0,
    FALLBACK_QUERIES_PER_THEME
  );

  const fallbackResults = await mapWithConcurrency(
    fallbackQueries,
    2,
    async (query) => {
      try {
        return await fetchNewsQuery(query, 5);
      } catch (error) {
        console.warn(
          `Fallback NewsAPI query failed for ${themeId}:`,
          error.message
        );
        return [];
      }
    }
  );

  const combined = dedupeArticles([...articles, ...fallbackResults.flat()]).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  if (combined.length === 0 && primaryError) {
    throw primaryError;
  }

  return combined;
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
  const topArticle = [...articles].sort(
    (a, b) => (b.significance || 0) - (a.significance || 0)
  )[0];

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
        ? topArticle?.one_line ||
          topArticle?.title ||
          `${reasonPrefix} ${count} news item${count === 1 ? "" : "s"}.`
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
  const topArticle = articles[0];
  return {
    activity_score: Math.min(10, Math.max(2, count * 2)),
    thesis_score: 0,
    reason:
      topArticle?.title ||
      `${count} headline${count === 1 ? "" : "s"} tracked this week`,
  };
};

export const fetchNewsAndProcess = async () => {
  console.log("Starting NewsAPI fetching for all 7 themes...");
  const allArticlesMap = {};
  const themeFetchErrors = [];
  const rawArticlesByTheme = Object.fromEntries(
    THEMES.map((theme) => [theme.id, []])
  );

  const themeResults = await mapWithConcurrency(
    THEMES,
    THEME_FETCH_CONCURRENCY,
    async (theme) => {
      try {
        console.log(`Fetching news for theme: ${theme.id}`);
        const articles = await fetchThemeNews(theme.id);
        return { themeId: theme.id, articles, error: null };
      } catch (err) {
        console.error(`Error fetching news for theme ${theme.id}:`, err.message);
        return { themeId: theme.id, articles: [], error: err.message };
      }
    }
  );

  for (const { themeId, articles, error } of themeResults) {
    if (error) themeFetchErrors.push(`${themeId}: ${error}`);
    rawArticlesByTheme[themeId] = articles.slice(0, MAX_PER_THEME);

    articles.forEach((article) => {
      if (!allArticlesMap[article.url]) {
        allArticlesMap[article.url] = {
          title: article.title,
          description: article.description || "",
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source,
          searchedThemes: [themeId],
        };
      } else {
        allArticlesMap[article.url].searchedThemes.push(themeId);
      }
    });
  }

  const deDuplicatedArticles = Object.values(allArticlesMap);
  console.log(
    `Fetched ${deDuplicatedArticles.length} unique raw articles from NewsAPI.`
  );

  if (deDuplicatedArticles.length === 0) {
    const detail =
      themeFetchErrors.length > 0
        ? ` Theme fetch errors: ${themeFetchErrors.slice(0, 3).join(" | ")}`
        : "";
    throw new Error(`No articles retrieved from NewsAPI.${detail}`);
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
