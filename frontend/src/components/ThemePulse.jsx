import { useState } from "react";
import { THEMES, THEME_COLORS, THEME_ICONS } from "@config/thesis.js";
import "../styles/theme-cards.css";

const getScoreDisplay = (score) => {
  if (score >= 2) return { arrow: "↑", color: "#2ec98a" }; // bullish
  if (score <= -2) return { arrow: "↓", color: "#f06060" }; // bearish
  return { arrow: "→", color: "#f5b84a" }; // neutral
};

const ThemePulse = ({ themeData }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!themeData) return null;

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sigil-gold inline-block animate-pulse"></span>
            Theme Pulse Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live thesis evaluation of news signals across the 7 Sigil sectors
          </p>
        </div>
      </div>

      <div className="theme-pulse-grid">
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
                      className="theme-card__score"
                      style={{ color: score.color }}
                    >
                      {score.arrow}{" "}
                      {data.thesis_score > 0 ? `+${data.thesis_score}` : data.thesis_score}
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
                <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
                  <span className="text-sigil-gold font-bold">ANALYSIS: </span>
                  {data.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePulse;
