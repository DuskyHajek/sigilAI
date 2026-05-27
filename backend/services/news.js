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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const NEWS_API_KEY = process.env.NEWS_API_KEY;

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

const programmaticPulseFallback = (articles) => {
  const count = articles.length;
  const activity_score = Math.min(10, Math.max(1, count * 2));

  let sentimentSum = 0;
  articles.forEach((a) => {
    if (a.sentiment === "bullish") sentimentSum += a.significance;
    if (a.sentiment === "bearish") sentimentSum -= a.significance;
  });

  const averageSentiment = count > 0 ? sentimentSum / count : 0;
  const thesis_score = Math.min(5, Math.max(-5, Math.round(averageSentiment)));

  return {
    activity_score,
    thesis_score,
    reason: `Calculated from ${count} news items.`,
  };
};

export const fetchNewsAndProcess = async () => {
  console.log("Starting NewsAPI fetching for all 7 themes...");
  const allArticlesMap = {};

  for (const theme of THEMES) {
    try {
      console.log(`Fetching news for theme: ${theme.id}`);
      const articles = await fetchThemeNews(theme.id);

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

  const selectedArticles = [];
  const themeCounts = {};

  for (const article of deDuplicatedArticles) {
    let shouldInclude = false;
    for (const t of article.searchedThemes) {
      themeCounts[t] = themeCounts[t] || 0;
      if (themeCounts[t] < SETTINGS.max_articles_per_theme) {
        themeCounts[t]++;
        shouldInclude = true;
      }
    }
    if (shouldInclude) {
      selectedArticles.push(article);
    }
  }

  console.log(
    `Selected ${selectedArticles.length} articles for Claude intelligence analysis...`
  );

  const classifiedArticles = [];
  for (const article of selectedArticles) {
    try {
      console.log(`Classifying: "${article.title.substring(0, 50)}..."`);
      const classification = await classifyArticle(article);

      if (
        classification.relevant &&
        classification.significance >= SETTINGS.significance_threshold
      ) {
        classifiedArticles.push({
          ...article,
          themes: classification.themes,
          sentiment: classification.sentiment,
          significance: classification.significance,
          one_line: classification.one_line,
        });
      }
    } catch (err) {
      console.error(
        `Failed to classify article "${article.title}":`,
        err.message
      );
    }
  }

  console.log(
    `Successfully classified ${classifiedArticles.length} thesis-relevant articles (sig >= ${SETTINGS.significance_threshold}).`
  );

  const themePulse = {};
  for (const theme of THEMES) {
    const themeArticles = classifiedArticles.filter(
      (a) => a.themes && a.themes.includes(theme.id)
    );

    if (themeArticles.length > 0) {
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
    } else {
      themePulse[theme.id] = {
        activity_score: 1,
        thesis_score: 0,
        reason: "No significant news updates monitored today.",
      };
    }
  }

  return { themePulse, classifiedArticles };
};
