import { SETTINGS } from "../../config/settings.js";
import { THEMES } from "../../config/thesis.js";
import { buildWeeklyBriefPrompt } from "./prompts.js";
import { callClaude } from "./llm.js";

export const generateWeeklyBrief = async (classifiedArticles, themePulse) => {
  const themePulses = THEMES.map((theme) => {
    const pulse = themePulse[theme.id] || {
      activity_score: 1,
      thesis_score: 0,
      reason: "No updates",
    };
    return {
      name: theme.display_name,
      ...pulse,
    };
  });

  const prompt = buildWeeklyBriefPrompt(classifiedArticles, themePulses);
  return callClaude(prompt, SETTINGS.weekly_brief_max_tokens);
};
