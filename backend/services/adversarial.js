import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildChallengeTheCioPrompt, buildThesisConfig } from "./prompts.js";
import { callClaudeJSON } from "./llm.js";
import { sortArticlesByQuality } from "./newsAggregation.js";

const CLEAN_EMPTY = {
  asymmetricRisks: [],
  blindspotAlert:
    "No meaningful counter-signals detected in today's headline sample.",
  source: "none",
};

const ADVERSARIAL_UNAVAILABLE = {
  asymmetricRisks: [],
  blindspotAlert: "Analysis temporarily unavailable.",
  source: "unavailable",
};

const THEME_ID_SET = new Set(THEMES.map((t) => t.id));

const articleKey = (article) =>
  (article.url || article.title || "").toLowerCase().trim();

const resolveThemeId = (target) => {
  const trimmed = String(target || "").trim();
  if (THEME_ID_SET.has(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();
  const byId = THEMES.find((t) => t.id === lower);
  if (byId) return byId.id;

  const byName = THEMES.find(
    (t) =>
      t.display_name.toLowerCase() === lower ||
      t.display_name.toLowerCase().includes(lower) ||
      lower.includes(t.display_name.toLowerCase())
  );
  return byName?.id || null;
};

const pickBestThemeForArticle = (article, themePulse) => {
  const themes = (article.themes || []).filter((id) => THEME_ID_SET.has(id));
  if (themes.length === 0) return null;
  if (themes.length === 1) return themes[0];

  return [...themes].sort((a, b) => {
    const scoreA = themePulse[a]?.thesis_score ?? 0;
    const scoreB = themePulse[b]?.thesis_score ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.localeCompare(b);
  })[0];
};

const assignArticlesFromPool = (articles, themePulse, seenKeys) => {
  const assigned = [];
  for (const article of sortArticlesByQuality(articles)) {
    const key = articleKey(article);
    if (!key || seenKeys.has(key)) continue;

    const assignedTheme = pickBestThemeForArticle(article, themePulse);
    if (!assignedTheme) continue;

    seenKeys.add(key);
    assigned.push({ ...article, _assignedTheme: assignedTheme });
  }
  return assigned;
};

const slimNewsItem = (article) => ({
  title: article.title,
  themes: article.themes,
  assignedTheme: article._assignedTheme,
  sentiment: article.sentiment,
  significance: article.significance,
  one_line: article.one_line,
});

const assignArticlesForAdversarial = (classifiedArticles, themePulse) => {
  const seenKeys = new Set();
  return assignArticlesFromPool(
    classifiedArticles.filter((a) => a.sentiment !== "bullish"),
    themePulse,
    seenKeys
  );
};

const selectAdversarialNewsItems = (classifiedArticles, themePulse) => {
  const limit = SETTINGS.adversarial_max_articles;
  const seenKeys = new Set();

  const bearishNeutral = assignArticlesFromPool(
    classifiedArticles.filter((a) => a.sentiment !== "bullish"),
    themePulse,
    seenKeys
  );
  const bullish = assignArticlesFromPool(
    classifiedArticles.filter((a) => a.sentiment === "bullish"),
    themePulse,
    seenKeys
  );

  return [...bearishNeutral, ...bullish].slice(0, limit).map(slimNewsItem);
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isCopyOfTitle = (headlineRisk, title) => {
  if (!headlineRisk || !title) return false;
  const risk = normalizeText(headlineRisk);
  const head = normalizeText(title);
  if (!risk || !head) return false;
  return risk === head || risk.includes(head) || head.includes(risk);
};

const normalizeRisk = (risk) => {
  if (!risk || typeof risk !== "object") return null;
  const themeId = resolveThemeId(risk.targetTheme);
  if (!themeId) return null;

  const headlineRisk = String(risk.headlineRisk || "").trim();
  const adversarialArgument = String(risk.adversarialArgument || "").trim();
  const counterIndicatorToWatch = String(
    risk.counterIndicatorToWatch || ""
  ).trim();

  if (!headlineRisk || !adversarialArgument || !counterIndicatorToWatch) {
    return null;
  }

  return {
    targetTheme: themeId,
    headlineRisk,
    adversarialArgument,
    counterIndicatorToWatch,
  };
};

const dedupeRisks = (risks) => {
  const seenHeadlines = new Set();
  const deduped = [];

  for (const risk of risks) {
    const headlineKey = normalizeText(risk.headlineRisk).slice(0, 100);
    if (!headlineKey || seenHeadlines.has(headlineKey)) continue;

    seenHeadlines.add(headlineKey);
    deduped.push(risk);
    if (deduped.length >= 3) break;
  }

  return deduped;
};

const parseAdversarialResult = (result) => {
  const blindspotAlert = String(result?.blindspotAlert || "").trim();
  const asymmetricRisks = dedupeRisks(
    (Array.isArray(result?.asymmetricRisks) ? result.asymmetricRisks : [])
      .map(normalizeRisk)
      .filter(Boolean)
  );

  if (asymmetricRisks.length === 0) {
    if (blindspotAlert) {
      return { asymmetricRisks: [], blindspotAlert };
    }
    return null;
  }

  if (!blindspotAlert) return null;
  return { asymmetricRisks, blindspotAlert };
};

const synthesizeHeadlineRisk = (article, theme) => {
  const hook = article.one_line?.trim();
  if (
    hook &&
    hook.length >= 24 &&
    !isCopyOfTitle(hook, article.title) &&
    /may|risk|wrong|challenge|threat|concern|if|over/i.test(hook)
  ) {
    return hook;
  }

  return `What if the ${theme.display_name} read is wrong — today's development shifts the structural setup`;
};

const filterBySignificance = (articles, minSignificance) =>
  articles.filter(
    (article) => (article.significance || 0) >= minSignificance
  );

const buildStrictHeadlineFallback = (classifiedArticles, themePulse) => {
  const assigned = assignArticlesForAdversarial(classifiedArticles, themePulse);
  let bearish = filterBySignificance(
    assigned.filter((a) => a.sentiment === "bearish"),
    SETTINGS.adversarial_min_significance
  );

  if (bearish.length === 0) {
    bearish = filterBySignificance(
      assigned.filter((a) => a.sentiment === "bearish"),
      SETTINGS.significance_threshold
    );
  }

  if (bearish.length === 0) {
    return CLEAN_EMPTY;
  }

  const asymmetricRisks = dedupeRisks(
    bearish.slice(0, 3).map((article) => {
      const theme =
        THEMES.find((t) => t.id === article._assignedTheme) || THEMES[0];
      return {
        targetTheme: article._assignedTheme,
        headlineRisk: synthesizeHeadlineRisk(article, theme),
        adversarialArgument: `${article.title} — flagged bearish for the ${theme.display_name} thesis (significance ${article.significance}).`,
        counterIndicatorToWatch:
          theme.bear_signals?.[0] || "Follow-up headlines reversing this read",
      };
    })
  );

  if (asymmetricRisks.length === 0) {
    return CLEAN_EMPTY;
  }

  return {
    asymmetricRisks,
    blindspotAlert:
      "High-significance bearish headlines are present — verify whether risks are already priced in before adding conviction.",
    source: "headlines",
  };
};

const isApiUnavailableError = (message) =>
  /credit|balance|billing|insufficient|402|401|payment|api key|authentication/i.test(
    message || ""
  );

export const generateAdversarialAnalysis = async (
  classifiedArticles,
  themePulse
) => {
  if (classifiedArticles.length === 0) {
    return {
      ...CLEAN_EMPTY,
      blindspotAlert:
        "No classified headlines this sync — run Sync again when news flow is richer.",
    };
  }

  const thesisConfig = buildThesisConfig();
  const newsItems = selectAdversarialNewsItems(classifiedArticles, themePulse);
  const prompt = buildChallengeTheCioPrompt(thesisConfig, newsItems);

  try {
    const result = await callClaudeJSON(
      prompt,
      SETTINGS.adversarial_max_tokens
    );
    const parsed = parseAdversarialResult(result);

    if (parsed?.asymmetricRisks?.length >= 1) {
      return { ...parsed, source: "claude" };
    }
    if (parsed?.asymmetricRisks?.length === 0 && parsed.blindspotAlert) {
      return { ...parsed, source: "claude" };
    }
  } catch (err) {
    console.error("Adversarial analysis failed:", err.message);
    if (isApiUnavailableError(err.message)) {
      return {
        ...ADVERSARIAL_UNAVAILABLE,
        blindspotAlert:
          "Claude adversarial pass could not run — check Anthropic API credits and key on this deployment.",
      };
    }
  }

  const fallback = buildStrictHeadlineFallback(classifiedArticles, themePulse);
  if (fallback.asymmetricRisks.length > 0) {
    return fallback;
  }

  return buildCleanEmptyFromFeed(classifiedArticles, themePulse);
};

const buildCleanEmptyFromFeed = (classifiedArticles, themePulse) => {
  const bearishCount = classifiedArticles.filter(
    (a) => a.sentiment === "bearish"
  ).length;
  const weakThemes = THEMES.filter(
    (t) => (themePulse[t.id]?.thesis_score ?? 0) <= -1
  ).length;

  if (bearishCount === 0 && classifiedArticles.length > 0) {
    return {
      ...CLEAN_EMPTY,
      blindspotAlert:
        "Today's headline sample skews constructive — Claude found no material counter-thesis, but uniform bullish flow itself warrants skepticism.",
    };
  }
  if (weakThemes > 0) {
    return {
      ...CLEAN_EMPTY,
      blindspotAlert: `${weakThemes} theme(s) score challenged on thesis fit despite no extracted risk cards — review Theme Pulse evidence manually.`,
    };
  }
  return CLEAN_EMPTY;
};

export { CLEAN_EMPTY, ADVERSARIAL_UNAVAILABLE };
