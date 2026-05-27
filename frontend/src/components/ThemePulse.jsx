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

const ThemePulse = ({ themeData }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!themeData) return null;

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
          A rough read on whether recent headlines support or challenge each
          Supernova sector thesis.
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
            <span className="text-slate-300">ACTIVITY</span> · headline volume (1–10)
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
            <span className="text-emerald-400">THESIS FIT</span> · support/challenge (−5 to +5)
          </span>
        </div>
      </div>

      <div className="theme-pulse-grid flex-1">
        {THEMES.map((theme) => {
          const data = themeData[theme.id] || {
            activity_score: 1,
            thesis_score: 0,
            reason: "No updates detected.",
          };

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
                    ? "max-h-40 pt-2 border-t border-slate-900/60"
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePulse;
