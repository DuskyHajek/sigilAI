import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildChallengeTheCioPrompt, buildThesisConfig } from "./prompts.js";
import { callClaudeJSON } from "./llm.js";
import { sortArticlesByQuality } from "./newsAggregation.js";

const ADVERSARIAL_FALLBACK = {
  asymmetricRisks: [],
  blindspotAlert: "Analysis temporarily unavailable.",
};

const REQUIRED_RISK_KEYS = [
  "targetTheme",
  "headlineRisk",
  "adversarialArgument",
  "counterIndicatorToWatch",
];

const slimNewsItem = (article) => ({
  title: article.title,
  themes: article.themes,
  sentiment: article.sentiment,
  significance: article.significance,
  one_line: article.one_line,
});

const normalizeRisk = (risk) => {
  if (!risk || typeof risk !== "object") return null;
  const normalized = {
    targetTheme: String(risk.targetTheme || "").trim(),
    headlineRisk: String(risk.headlineRisk || "").trim(),
    adversarialArgument: String(risk.adversarialArgument || "").trim(),
    counterIndicatorToWatch: String(risk.counterIndicatorToWatch || "").trim(),
  };
  if (REQUIRED_RISK_KEYS.some((key) => !normalized[key])) return null;
  return normalized;
};

const buildProgrammaticFallback = (classifiedArticles, themePulse) => {
  const bearishArticles = sortArticlesByQuality(
    classifiedArticles.filter((a) => a.sentiment === "bearish")
  ).slice(0, 3);

  const weakThemes = THEMES.filter((theme) => {
    const pulse = themePulse[theme.id];
    return pulse && pulse.thesis_score <= -1;
  });

  const asymmetricRisks = [];

  for (const theme of weakThemes.slice(0, 2)) {
    const pulse = themePulse[theme.id];
    const relatedArticle = bearishArticles.find((a) =>
      a.themes?.includes(theme.id)
    );
    asymmetricRisks.push({
      targetTheme: theme.id,
      headlineRisk: pulse.reason || `Thesis pressure on ${theme.display_name}`,
      adversarialArgument: relatedArticle
        ? relatedArticle.one_line || relatedArticle.title
        : `Today's news scores ${theme.display_name} at thesis ${pulse.thesis_score}/5. Bear signals to watch: ${(theme.bear_signals || []).slice(0, 2).join("; ")}`,
      counterIndicatorToWatch:
        (theme.bear_signals || [])[0] || "Thesis score recovery above 0",
    });
  }

  for (const article of bearishArticles) {
    if (asymmetricRisks.length >= 3) break;
    const themeId = article.themes?.[0];
    if (!themeId) continue;
    if (asymmetricRisks.some((r) => r.targetTheme === themeId)) continue;
    const theme = THEMES.find((t) => t.id === themeId);
    asymmetricRisks.push({
      targetTheme: themeId,
      headlineRisk: article.one_line || article.title,
      adversarialArgument: `Bearish signal (sig ${article.significance}): ${article.title}`,
      counterIndicatorToWatch:
        (theme?.bear_signals || [])[0] || "Sentiment shift to neutral or bullish",
    });
  }

  const blindspotAlert =
    weakThemes.length > 0
      ? `${weakThemes.length} theme(s) show negative thesis scores today — confirmation bias risk if you only read bullish headlines.`
      : bearishArticles.length > 0
        ? "Bearish headlines are present but theme scores remain mixed — verify whether risks are already priced in."
        : ADVERSARIAL_FALLBACK.blindspotAlert;

  return { asymmetricRisks, blindspotAlert };
};

export const generateAdversarialAnalysis = async (
  classifiedArticles,
  themePulse
) => {
  const thesisConfig = buildThesisConfig();
  const newsItems = sortArticlesByQuality(classifiedArticles)
    .slice(0, 20)
    .map(slimNewsItem);

  try {
    const prompt = buildChallengeTheCioPrompt(thesisConfig, newsItems);
    const result = await callClaudeJSON(
      prompt,
      SETTINGS.adversarial_max_tokens
    );

    const asymmetricRisks = (
      Array.isArray(result.asymmetricRisks) ? result.asymmetricRisks : []
    )
      .map(normalizeRisk)
      .filter(Boolean);

    const blindspotAlert = String(result.blindspotAlert || "").trim();

    if (asymmetricRisks.length >= 1 && blindspotAlert) {
      return { asymmetricRisks, blindspotAlert };
    }
  } catch (err) {
    console.error("Adversarial analysis failed:", err.message);
  }

  const fallback = buildProgrammaticFallback(classifiedArticles, themePulse);
  if (fallback.asymmetricRisks.length >= 1 && fallback.blindspotAlert) {
    return fallback;
  }

  return ADVERSARIAL_FALLBACK;
};
