import { useState } from "react";
import { THEMES, THEME_COLORS, THEME_ICONS } from "@config/thesis.js";
import "../styles/theme-cards.css";

const getThemeRead = (data) => {
  const count = data.headline_count ?? 0;
  if (count === 0) {
    return {
      label: "Quiet",
      color: "#64748b",
      bg: "rgba(100, 116, 139, 0.12)",
      border: "rgba(100, 116, 139, 0.35)",
    };
  }
  const score = data.thesis_score ?? 0;
  if (score >= 2) {
    return {
      label: "Supportive",
      color: "var(--color-bullish)",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.35)",
    };
  }
  if (score <= -1) {
    return {
      label: "Challenged",
      color: "var(--color-bearish)",
      bg: "rgba(244, 63, 94, 0.12)",
      border: "rgba(244, 63, 94, 0.35)",
    };
  }
  return {
    label: "Mixed",
    color: "#f5b84a",
    bg: "rgba(245, 184, 74, 0.12)",
    border: "rgba(245, 184, 74, 0.35)",
  };
};

const sentimentLabel = (sentiment) => {
  if (sentiment === "bullish") return "bullish";
  if (sentiment === "bearish") return "bearish";
  return "neutral";
};

const sentimentColor = (sentiment) => {
  if (sentiment === "bullish") return "var(--color-bullish)";
  if (sentiment === "bearish") return "var(--color-bearish)";
  return "#94a3b8";
};

const ThemePulse = ({ themeData, thesisDriftReport, isMock }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!themeData) return null;

  const clusters = thesisDriftReport?.detectedClusters ?? [];

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl h-full flex flex-col">
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Panel 02
        </p>
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sigil-gold inline-block animate-pulse" />
          Theme Pulse
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Where headlines landed today — one plain read per theme, with the
          actual articles behind it. Click a theme to see evidence.
        </p>
      </div>

      {clusters.length > 0 && (
        <div className="mb-5 pb-4 border-b border-slate-800/80">
          <p className="text-[10px] font-mono uppercase tracking-wide text-sigil-gold/80 mb-1">
            Signal clusters · start here
          </p>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Separate stories hitting the same bottleneck or macro shift — the
            highest-signal part of this panel.
          </p>
          <div className="space-y-2">
            {clusters.map((cluster, index) => (
              <div
                key={`${cluster.clusterName}-${index}`}
                className="rounded-xl border border-sigil-gold/15 bg-sigil-gold/5 p-3"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-medium text-slate-100 leading-snug">
                    {cluster.clusterName}
                  </p>
                  <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                    SEV {cluster.severityScore}/10
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
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

      <div className="theme-pulse-grid flex-1">
        {THEMES.map((theme) => {
          const data = themeData[theme.id] || {
            thesis_score: 0,
            reason: "No updates detected.",
            headline_count: 0,
            evidence: [],
          };

          const read = getThemeRead(data);
          const color = THEME_COLORS[theme.id] ?? "teal";
          const icon = THEME_ICONS[theme.id] ?? "ti-server-2";
          const isExpanded = expandedTheme === theme.id;
          const headlineCount = data.headline_count ?? data.evidence?.length ?? 0;
          const evidence = data.evidence ?? [];

          return (
            <div
              key={theme.id}
              onClick={() => setExpandedTheme(isExpanded ? null : theme.id)}
              className={`theme-card theme-card--${color} cursor-pointer${
                isExpanded ? " theme-card--expanded" : ""
              }`}
            >
              <div className="theme-card__header">
                <div className="theme-card__icon">
                  <i className={`ti ${icon}`} aria-hidden="true" />
                </div>

                <div className="theme-card__meta min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="theme-card__name">{theme.display_name}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {headlineCount === 0
                          ? "No tagged headlines"
                          : `${headlineCount} headline${headlineCount === 1 ? "" : "s"} this sync`}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded border"
                      style={{
                        color: read.color,
                        backgroundColor: read.bg,
                        borderColor: read.border,
                      }}
                    >
                      {read.label}
                    </span>
                  </div>

                  {data.reason && headlineCount > 0 && (
                    <p className="text-[11px] text-slate-400 leading-snug mt-2 line-clamp-2">
                      {data.reason}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`theme-card__expand transition-all duration-300 ${
                  isExpanded
                    ? "theme-card__expand--open max-h-72 overflow-y-auto overscroll-contain pt-2 mt-2 border-t border-slate-900/60"
                    : "max-h-0 overflow-hidden"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2 pr-1">
                  <p className="text-slate-500 font-mono text-[10px] leading-relaxed">
                    <span className="text-sigil-gold font-bold">THESIS · </span>
                    {theme.short_description}
                  </p>

                  {evidence.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-wide text-sigil-gold/80">
                        Evidence · top headlines
                        {headlineCount > evidence.length && (
                          <span className="text-slate-600 normal-case tracking-normal">
                            {" "}
                            (showing {evidence.length} of {headlineCount})
                          </span>
                        )}
                      </p>
                      {evidence.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="rounded-lg border border-slate-900 bg-slate-950/50 p-2.5"
                        >
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border"
                              style={{
                                color: sentimentColor(item.sentiment),
                                borderColor: `${sentimentColor(item.sentiment)}44`,
                              }}
                            >
                              {sentimentLabel(item.sentiment)}
                            </span>
                            <span className="text-[9px] font-mono text-slate-600">
                              sig {item.significance}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-200 leading-snug">
                            {item.title}
                          </p>
                          {item.one_line && (
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                              {item.one_line}
                            </p>
                          )}
                        </div>
                      ))}
                      {evidence.length > 2 && (
                        <p className="text-[9px] font-mono text-slate-600 text-center pt-0.5">
                          Scroll for more ↓
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 font-mono">
                      No classified headlines tagged to this theme in the
                      current sync window.
                    </p>
                  )}

                  {data.source === "estimated" && !isMock && (
                    <p className="text-[10px] font-mono text-slate-600">
                      Read derived from headline sentiment — not a separate
                      Claude theme assessment.
                    </p>
                  )}
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
