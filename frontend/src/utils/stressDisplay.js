export const IMPACT_DISPLAY = {
  bullish: {
    label: "Bullish",
    shortLabel: "↑",
    color: "var(--color-bullish)",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.35)",
    hint: "Scenario supports this pillar",
  },
  neutral: {
    label: "Neutral",
    shortLabel: "→",
    color: "#94a3b8",
    bg: "rgba(148, 163, 184, 0.1)",
    border: "rgba(148, 163, 184, 0.3)",
    hint: "Mixed or limited impact on this pillar",
  },
  bearish: {
    label: "Bearish",
    shortLabel: "↓",
    color: "var(--color-bearish)",
    bg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.35)",
    hint: "Scenario pressures this pillar",
  },
};

export const IMPACT_TYPE_LABELS = {
  structural: "Structural",
  timing: "Timing",
  sentiment: "Sentiment",
};

export const SCENARIO_CATEGORY_STYLES = {
  geopolitical: {
    chip: "border-rose-500/25 text-rose-300/90 hover:bg-rose-500/10",
    chipActive: "bg-rose-500/15 border-rose-400/50 text-rose-200",
  },
  technology: {
    chip: "border-sky-500/25 text-sky-300/90 hover:bg-sky-500/10",
    chipActive: "bg-sky-500/15 border-sky-400/50 text-sky-200",
  },
  regulatory: {
    chip: "border-amber-500/25 text-amber-300/90 hover:bg-amber-500/10",
    chipActive: "bg-amber-500/15 border-amber-400/50 text-amber-200",
  },
  cyclical: {
    chip: "border-orange-500/25 text-orange-300/90 hover:bg-orange-500/10",
    chipActive: "bg-orange-500/15 border-orange-400/50 text-orange-200",
  },
  bull: {
    chip: "border-emerald-500/25 text-emerald-300/90 hover:bg-emerald-500/10",
    chipActive: "bg-emerald-500/15 border-emerald-400/50 text-emerald-200",
  },
  tail: {
    chip: "border-violet-500/25 text-violet-300/90 hover:bg-violet-500/10",
    chipActive: "bg-violet-500/15 border-violet-400/50 text-violet-200",
  },
};

export const getImpactDisplay = (impact) =>
  IMPACT_DISPLAY[impact] || IMPACT_DISPLAY.neutral;

export const buildThemeImpactMap = (stressResult) =>
  Object.fromEntries(
    (stressResult?.themeImpacts ?? []).map((row) => [row.themeId, row])
  );

export const buildExposureMaps = (stressResult) => {
  const exposed = new Set(
    (stressResult?.tickerExposure?.mostExposed ?? []).map((r) => r.ticker)
  );
  const resilient = new Set(
    (stressResult?.tickerExposure?.mostResilient ?? []).map((r) => r.ticker)
  );
  const rationaleByTicker = Object.fromEntries([
    ...(stressResult?.tickerExposure?.mostExposed ?? []).map((r) => [
      r.ticker,
      { type: "exposed", ...r },
    ]),
    ...(stressResult?.tickerExposure?.mostResilient ?? []).map((r) => [
      r.ticker,
      { type: "resilient", ...r },
    ]),
  ]);
  return { exposed, resilient, rationaleByTicker };
};

export const VIEW_MODES = [
  { id: "split", label: "Both", hint: "Today's drift + scenario impact" },
  { id: "stress", label: "Scenario", hint: "Scenario impact only" },
  { id: "live", label: "Today", hint: "Today's live drift only" },
];
