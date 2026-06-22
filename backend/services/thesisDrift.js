import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildThesisDriftPrompt, buildThesisConfig } from "./prompts.js";
import { buildAnnotatedNewsFlow } from "./newsAggregation.js";
import { callClaudeJSON } from "./llm.js";

const VALID_STATUSES = new Set(["ACCELERATING", "STAGNANT", "DRIFTING"]);
const THEME_IDS = new Set(THEMES.map((t) => t.id));

const clampSeverity = (score) => {
  const n = Number(score);
  if (!Number.isFinite(n)) return 5;
  return Math.max(1, Math.min(10, Math.round(n)));
};

const buildProgrammaticThemeStatus = (themePulse) =>
  THEMES.map(({ id }) => {
    const pulse = themePulse[id] || {
      thesis_score: 0,
      reason: "No updates detected.",
    };
    let status = "STAGNANT";
    if (pulse.thesis_score >= 2) status = "ACCELERATING";
    else if (pulse.thesis_score <= -1) status = "DRIFTING";
    return {
      themeId: id,
      status,
      narrativeShiftDetails: pulse.reason || "No narrative shift detected.",
    };
  });

const buildProgrammaticFallback = (themePulse) => ({
  detectedClusters: [],
  themeStatusUpdate: buildProgrammaticThemeStatus(themePulse),
});

export const generateThesisDriftReport = async (
  classifiedArticles,
  watchlist,
  themePulse
) => {
  const annotatedNewsFlow = buildAnnotatedNewsFlow(
    classifiedArticles,
    watchlist
  );
  const thesisConfig = buildThesisConfig();

  try {
    const prompt = buildThesisDriftPrompt(thesisConfig, annotatedNewsFlow);
    const result = await callClaudeJSON(
      prompt,
      SETTINGS.thesis_drift_max_tokens
    );

    if (
      !Array.isArray(result.detectedClusters) ||
      !Array.isArray(result.themeStatusUpdate)
    ) {
      throw new Error("Invalid thesis drift response shape");
    }

    const detectedClusters = result.detectedClusters
      .filter((c) => c && typeof c === "object")
      .map((c) => ({
        clusterName: String(c.clusterName || "").trim(),
        impactedThemes: (Array.isArray(c.impactedThemes) ? c.impactedThemes : [])
          .map((t) => String(t).trim())
          .filter((t) => THEME_IDS.has(t)),
        evidenceSummary: String(c.evidenceSummary || "").trim(),
        severityScore: clampSeverity(c.severityScore),
      }))
      .filter((c) => c.clusterName && c.evidenceSummary);

    const themeStatusUpdate = result.themeStatusUpdate
      .filter((u) => u && typeof u === "object")
      .map((u) => ({
        themeId: String(u.themeId || "").trim(),
        status: VALID_STATUSES.has(u.status) ? u.status : null,
        narrativeShiftDetails: String(u.narrativeShiftDetails || "").trim(),
      }))
      .filter(
        (u) =>
          THEME_IDS.has(u.themeId) && u.status && u.narrativeShiftDetails
      );

    return { detectedClusters, themeStatusUpdate };
  } catch (err) {
    console.error("Thesis drift report failed:", err.message);
  }

  return buildProgrammaticFallback(themePulse);
};
