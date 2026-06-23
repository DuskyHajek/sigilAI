import { THEMES } from "@config/thesis.js";

export const DRIFT_DISPLAY = {
  ACCELERATING: {
    label: "Accelerating",
    color: "var(--color-bullish)",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.35)",
    hint: "News flow supports the thesis",
  },
  STAGNANT: {
    label: "Mixed",
    color: "#f5b84a",
    bg: "rgba(245, 184, 74, 0.12)",
    border: "rgba(245, 184, 74, 0.35)",
    hint: "Mixed signals — check headline count separately",
  },
  DRIFTING: {
    label: "Diverging",
    color: "var(--color-bearish)",
    bg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.35)",
    hint: "News pulling against the thesis",
  },
};

export const driftStatusFromPulse = (pulse) => {
  const score = pulse?.thesis_score ?? 0;
  if (score >= 2) return "ACCELERATING";
  if (score <= -1) return "DRIFTING";
  return "STAGNANT";
};

/** Merge Claude drift rows with programmatic fallback so all 7 themes always resolve. */
export const buildThemeDriftMap = (themePulse, thesisDriftReport) => {
  const programmatic = Object.fromEntries(
    THEMES.map(({ id }) => [
      id,
      {
        themeId: id,
        status: driftStatusFromPulse(themePulse?.[id]),
        narrativeShiftDetails:
          themePulse?.[id]?.reason || "No narrative shift detected.",
      },
    ])
  );

  const fromReport = Object.fromEntries(
    (thesisDriftReport?.themeStatusUpdate ?? []).map((row) => [
      row.themeId,
      row,
    ])
  );

  return Object.fromEntries(
    THEMES.map(({ id }) => [id, fromReport[id] || programmatic[id]])
  );
};

export const getDriftDisplay = (status) =>
  DRIFT_DISPLAY[status] || DRIFT_DISPLAY.STAGNANT;

export const getThemeTickers = (watchlist, themeId, max = 3) =>
  [...(watchlist || []).filter((stock) => stock.theme === themeId)]
    .sort((a, b) => {
      if (a.spotlight && !b.spotlight) return -1;
      if (!a.spotlight && b.spotlight) return 1;
      return a.ticker.localeCompare(b.ticker);
    })
    .slice(0, max);

export const getHeadlineCount = (pulse) =>
  pulse?.headline_count ?? pulse?.evidence?.length ?? 0;

export const getTopHeadline = (pulse) => pulse?.evidence?.[0]?.title || null;
