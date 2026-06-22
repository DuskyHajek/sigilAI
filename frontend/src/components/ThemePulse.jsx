import { useState } from "react";
import { THEMES, THEME_COLORS, THEME_ICONS } from "@config/thesis.js";
import "../styles/theme-cards.css";

const getScoreDisplay = (score) => {
  if (score >= 2) {
    return { arrow: "↑", color: "#2ec98a", label: "supportive" };
  }
  if (score <= -2) {
    return { arrow: "↓", color: "#f06060", label: "challenged" };
  }
  return { arrow: "→", color: "#f5b84a", label: "mixed / neutral" };
};

const DRIFT_STATUS = {
  ACCELERATING: {
    label: "Accelerating",
    color: "var(--color-bullish)",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.35)",
  },
  STAGNANT: {
    label: "Stagnant",
    color: "#f5b84a",
    bg: "rgba(245, 184, 74, 0.12)",
    border: "rgba(245, 184, 74, 0.35)",
  },
  DRIFTING: {
    label: "Drifting",
    color: "var(--color-bearish)",
    bg: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.35)",
  },
};

const ThemePulse = ({ themeData, thesisDriftReport }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!themeData) return null;

  const driftByTheme = Object.fromEntries(
    (thesisDriftReport?.themeStatusUpdate ?? []).map((entry) => [
      entry.themeId,
      entry,
    ])
  );
  const clusters = thesisDriftReport?.detectedClusters ?? [];
  const hasDriftData = Object.keys(driftByTheme).length > 0;

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl h-full flex flex-col">
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Panel 02
        </p>
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sigil-gold inline-block animate-pulse" />
          Thesis vs News
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Compares each sector thesis with recent headlines — plus a daily drift
          read on whether narratives are accelerating, stalling, or breaking
          away from core assumptions.
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
            <span className="text-slate-300">ACTIVITY</span> · headline volume (1–10)
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
            <span className="text-emerald-400">THESIS FIT</span> · support/challenge (−5 to +5)
          </span>
          {hasDriftData && (
            <span className="px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
              <span className="text-sigil-gold">DRIFT</span> · narrative momentum today
            </span>
          )}
        </div>
      </div>

      <div className="theme-pulse-grid flex-1">
        {THEMES.map((theme) => {
          const data = themeData[theme.id] || {
            activity_score: 1,
            thesis_score: 0,
            reason: "No updates detected.",
          };

          const drift = driftByTheme[theme.id];
          const driftStyle = drift ? DRIFT_STATUS[drift.status] : null;

          const color = THEME_COLORS[theme.id] ?? "teal";
          const icon = THEME_ICONS[theme.id] ?? "ti-server-2";

          const score = getScoreDisplay(data.thesis_score);
          const isExpanded = expandedTheme === theme.id;
          const activityPct = Math.max(
            0,
            Math.min(100, (data.activity_score / 10) * 100)
          );

          return (
            <div
              key={theme.id}
              onClick={() => setExpandedTheme(isExpanded ? null : theme.id)}
              className={`theme-card theme-card--${color} cursor-pointer`}
            >
              <div className="theme-card__header">
                <div className="theme-card__icon">
                  <i className={`ti ${icon}`} aria-hidden="true" />
                </div>

                <div className="theme-card__meta">
                  <div className="flex items-center justify-between gap-2">
                    <p className="theme-card__name">{theme.display_name}</p>
                    <div className="flex flex-col items-end gap-1">
                      {driftStyle && (
                        <span
                          className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded border"
                          style={{
                            color: driftStyle.color,
                            backgroundColor: driftStyle.bg,
                            borderColor: driftStyle.border,
                          }}
                          title={`Narrative drift: ${driftStyle.label}`}
                        >
                          {driftStyle.label}
                        </span>
                      )}
                      <div
                        className="theme-card__score flex flex-col items-end"
                        style={{ color: score.color }}
                        title={`News read: ${score.label}`}
                      >
                        <span className="text-[9px] font-mono opacity-70 uppercase tracking-wide">
                          Fit
                        </span>
                        <span>
                          {score.arrow}{" "}
                          {data.thesis_score > 0
                            ? `+${data.thesis_score}`
                            : data.thesis_score}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="theme-card__bar-label">ACTIVITY</span>
                    <div className="theme-card__bar">
                      <div
                        className="theme-card__bar-fill"
                        style={{ width: `${activityPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? "max-h-52 pt-2 border-t border-slate-900/60"
                    : "max-h-0"
                }`}
              >
                <div className="space-y-1.5">
                  <p className="text-slate-500 font-mono text-[10px] leading-relaxed">
                    <span className="text-sigil-gold font-bold">THESIS · </span>
                    {theme.short_description}
                  </p>
                  <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
                    <span className="text-sigil-gold font-bold">NEWS · </span>
                    {data.reason}
                  </p>
                  {drift?.narrativeShiftDetails && (
                    <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
                      <span className="text-sigil-gold font-bold">DRIFT · </span>
                      {drift.narrativeShiftDetails}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {clusters.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <p className="text-[10px] font-mono uppercase tracking-wide text-sigil-gold/80 mb-1">
            Signal clusters
          </p>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Separate headlines hitting the same bottleneck or macro shift today —
            grouped by Claude across the full watchlist.
          </p>
          <div className="space-y-2">
            {clusters.map((cluster, index) => (
              <div
                key={`${cluster.clusterName}-${index}`}
                className="rounded-xl border border-slate-900 bg-slate-950/40 p-3"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-slate-100 leading-snug">
                    {cluster.clusterName}
                  </p>
                  <span
                    className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-400"
                    title="Severity 1–10"
                  >
                    SEV {cluster.severityScore}/10
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cluster.evidenceSummary}
                </p>
                {(cluster.impactedThemes ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {cluster.impactedThemes.map((themeId) => {
                      const theme = THEMES.find((t) => t.id === themeId);
                      return (
                        <span
                          key={themeId}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-800 text-slate-500"
                        >
                          {theme?.display_name || themeId}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePulse;
