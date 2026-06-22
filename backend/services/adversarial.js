import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildChallengeTheCioPrompt, buildThesisConfig } from "./prompts.js";
import { callClaudeJSON } from "./llm.js";
import { sortArticlesByQuality } from "./newsAggregation.js";

const ADVERSARIAL_FALLBACK = {
  asymmetricRisks: [],
  blindspotAlert: "Analysis temporarily unavailable.",
  source: "unavailable",
};

const REQUIRED_RISK_KEYS = [
  "targetTheme",
  "headlineRisk",
  "adversarialArgument",
  "counterIndicatorToWatch",
];

const THEME_ID_SET = new Set(THEMES.map((t) => t.id));

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

const slimNewsItem = (article) => ({
  title: article.title,
  themes: article.themes,
  sentiment: article.sentiment,
  significance: article.significance,
  one_line: article.one_line,
});

const normalizeRisk = (risk) => {
  if (!risk || typeof risk !== "object") return null;
  const themeId = resolveThemeId(risk.targetTheme);
  if (!themeId) return null;

  const normalized = {
    targetTheme: themeId,
    headlineRisk: String(risk.headlineRisk || "").trim(),
    adversarialArgument: String(risk.adversarialArgument || "").trim(),
    counterIndicatorToWatch: String(risk.counterIndicatorToWatch || "").trim(),
  };
  if (REQUIRED_RISK_KEYS.some((key) => !normalized[key])) return null;
  return normalized;
};

const addRisk = (asymmetricRisks, seenThemes, risk) => {
  if (asymmetricRisks.length >= 3) return;
  if (!risk?.targetTheme || seenThemes.has(risk.targetTheme)) return;
  seenThemes.add(risk.targetTheme);
  asymmetricRisks.push(risk);
};

const buildProgrammaticFallback = (classifiedArticles, themePulse) => {
  const asymmetricRisks = [];
  const seenThemes = new Set();
  const sorted = sortArticlesByQuality(classifiedArticles);
  const bearishArticles = sorted.filter((a) => a.sentiment === "bearish");

  const weakThemes = THEMES.filter((theme) => {
    const pulse = themePulse[theme.id];
    return pulse && pulse.thesis_score <= -1;
  });

  for (const theme of weakThemes.slice(0, 2)) {
    const pulse = themePulse[theme.id];
    const relatedArticle = bearishArticles.find((a) =>
      a.themes?.includes(theme.id)
    );
    addRisk(asymmetricRisks, seenThemes, {
      targetTheme: theme.id,
      headlineRisk: pulse.reason || `Thesis pressure on ${theme.display_name}`,
      adversarialArgument: relatedArticle
        ? relatedArticle.one_line || relatedArticle.title
        : `News flow scores ${theme.display_name} at thesis ${pulse.thesis_score}/5. Structural bear case: ${(theme.bear_signals || []).slice(0, 2).join("; ")}`,
      counterIndicatorToWatch:
        (theme.bear_signals || [])[0] || "Thesis score recovery above 0",
    });
  }

  for (const article of bearishArticles) {
    const themeId = article.themes?.[0];
    if (!themeId) continue;
    const theme = THEMES.find((t) => t.id === themeId);
    addRisk(asymmetricRisks, seenThemes, {
      targetTheme: themeId,
      headlineRisk: article.one_line || article.title,
      adversarialArgument: `Bearish headline (sig ${article.significance}): ${article.title}`,
      counterIndicatorToWatch:
        (theme?.bear_signals || [])[0] || "Sentiment shift to neutral or bullish",
    });
  }

  const themesByScore = THEMES.map((theme) => ({
    theme,
    pulse: themePulse[theme.id],
  }))
    .filter(({ pulse }) => pulse)
    .sort((a, b) => a.pulse.thesis_score - b.pulse.thesis_score);

  for (const { theme, pulse } of themesByScore) {
    if (asymmetricRisks.length >= 3) break;
    if (seenThemes.has(theme.id)) continue;
    if (pulse.thesis_score > 1) continue;

    const related = sorted.find((a) => a.themes?.includes(theme.id));
    addRisk(asymmetricRisks, seenThemes, {
      targetTheme: theme.id,
      headlineRisk: related?.one_line || `What if ${theme.display_name} is mispriced?`,
      adversarialArgument: related
        ? `Today's top headline may be read bullishly, but watch: ${(theme.bear_signals || []).slice(0, 2).join("; ")}`
        : `Thesis fit is only ${pulse.thesis_score}/5 with limited confirming headlines — ${(theme.bear_signals || [])[0] || "verify the bear case"}.`,
      counterIndicatorToWatch:
        (theme.bear_signals || [])[0] || "Follow-up headlines contradicting today's read",
    });
  }

  for (const article of sorted.filter((a) => a.sentiment === "bullish").slice(0, 2)) {
    const themeId = article.themes?.[0];
    if (!themeId) continue;
    const theme = THEMES.find((t) => t.id === themeId);
    addRisk(asymmetricRisks, seenThemes, {
      targetTheme: themeId,
      headlineRisk: `Bullish headline may be over-read: ${article.one_line || article.title}`,
      adversarialArgument: `Even supportive news can mask risk — ${(theme?.bear_signals || []).slice(0, 2).join("; ") || "check whether the market already prices this in"}.`,
      counterIndicatorToWatch:
        (theme?.bear_signals || [])[0] || "Next datapoint that reverses today's sentiment",
    });
  }

  if (asymmetricRisks.length === 0 && sorted.length > 0) {
    const article = sorted[0];
    const themeId = article.themes?.[0] || THEMES[0].id;
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    addRisk(asymmetricRisks, seenThemes, {
      targetTheme: theme.id,
      headlineRisk: "No clear bear case in headlines — that itself is a risk",
      adversarialArgument: `Today's sync is thin or uniformly constructive. Ask what would falsify ${theme.display_name}: ${(theme.bear_signals || []).slice(0, 2).join("; ")}.`,
      counterIndicatorToWatch:
        (theme.bear_signals || [])[0] || "Any headline that directly challenges the core thesis",
    });
  }

  const blindspotAlert =
    weakThemes.length > 0
      ? `${weakThemes.length} theme(s) show negative thesis scores — confirmation bias risk if you only read bullish headlines.`
      : bearishArticles.length > 0
        ? "Bearish headlines are present but theme scores remain mixed — verify whether risks are already priced in."
        : sorted.length > 0
          ? "No strong bearish headlines today — structurally monitor the bear signals in each active theme before adding conviction."
          : "No classified headlines this sync — run again when news flow is richer, or review theme bear signals manually.";

  return { asymmetricRisks, blindspotAlert, source: "headlines" };
};

export const generateAdversarialAnalysis = async (
  classifiedArticles,
  themePulse
) => {
  const thesisConfig = buildThesisConfig();
  const newsItems = sortArticlesByQuality(classifiedArticles)
    .slice(0, 20)
    .map(slimNewsItem);

  const fallback = buildProgrammaticFallback(classifiedArticles, themePulse);

  if (newsItems.length === 0) {
    return fallback.asymmetricRisks.length > 0
      ? fallback
      : ADVERSARIAL_FALLBACK;
  }

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
      return { asymmetricRisks, blindspotAlert, source: "claude" };
    }
  } catch (err) {
    console.error("Adversarial analysis failed:", err.message);
  }

  if (fallback.asymmetricRisks.length >= 1) {
    return fallback;
  }

  return ADVERSARIAL_FALLBACK;
};
