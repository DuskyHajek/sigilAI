import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronDown } from "lucide-react";
import { THEMES, THEME_COLORS, THEME_ICONS } from "@config/thesis.js";
import {
  buildThemeDriftMap,
  getDriftDisplay,
  getHeadlineCount,
  getThemeTickers,
  getTopHeadline,
} from "../utils/thesisRadarUtils.js";
import "../styles/theme-cards.css";

const sentimentColor = (sentiment) => {
  if (sentiment === "bullish") return "var(--color-bullish)";
  if (sentiment === "bearish") return "var(--color-bearish)";
  return "#94a3b8";
};

const ThesisRadar = ({
  themeData,
  thesisDriftReport,
  watchlistData,
  isMock,
  highlightThemeId,
}) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  useEffect(() => {
    if (highlightThemeId) {
      setExpandedTheme(highlightThemeId);
    }
  }, [highlightThemeId]);

  const driftByTheme = useMemo(
    () => buildThemeDriftMap(themeData, thesisDriftReport),
    [themeData, thesisDriftReport]
  );

  if (!themeData) return null;

  const toggleTheme = (themeId) =>
    setExpandedTheme((current) => (current === themeId ? null : themeId));

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl h-full flex flex-col">
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Panel 02
        </p>
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <Activity size={18} className="text-sigil-gold shrink-0" />
          Thesis Radar
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          All seven pillars at a glance — drift status, headline count, and
          watchlist tickers. Expand a row for the top headline and evidence.
        </p>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[70vh] lg:max-h-[620px] pr-1">
        {THEMES.map((theme) => {
          const pulse = themeData[theme.id] || {};
          const drift = driftByTheme[theme.id];
          const driftDisplay = getDriftDisplay(drift?.status);
          const headlineCount = getHeadlineCount(pulse);
          const topHeadline = getTopHeadline(pulse);
          const tickers = getThemeTickers(watchlistData, theme.id);
          const evidence = pulse.evidence ?? [];
          const isExpanded = expandedTheme === theme.id;
          const isHighlighted = highlightThemeId === theme.id;
          const color = THEME_COLORS[theme.id] ?? "teal";
          const icon = THEME_ICONS[theme.id] ?? "ti-server-2";

          return (
            <div
              key={theme.id}
              id={`thesis-row-${theme.id}`}
              className={`theme-card theme-card--${color} rounded-xl border transition-colors ${
                isHighlighted
                  ? "border-sigil-gold/40 ring-1 ring-sigil-gold/20"
                  : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTheme(theme.id)}
                className="w-full text-left p-3"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3">
                  <div className="theme-card__icon shrink-0">
                    <i className={`ti ${icon}`} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <p className="theme-card__name text-sm font-semibold leading-snug">
                        {theme.display_name}
                      </p>
                      <span
                        className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded border shrink-0"
                        style={{
                          color: driftDisplay.color,
                          backgroundColor: driftDisplay.bg,
                          borderColor: driftDisplay.border,
                        }}
                        title={driftDisplay.hint}
                      >
                        {driftDisplay.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {headlineCount === 0
                          ? "No headlines"
                          : `${headlineCount} headline${headlineCount === 1 ? "" : "s"}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {tickers.length > 0 ? (
                        tickers.map((stock) => (
                          <span
                            key={stock.ticker}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${
                              stock.spotlight
                                ? "border-sigil-gold/35 text-sigil-gold bg-sigil-gold/10"
                                : "border-slate-800 text-slate-500 bg-slate-950/60"
                            }`}
                          >
                            {stock.ticker}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-mono text-slate-600">
                          No watchlist names
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-500 mt-1 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? "max-h-[420px]" : "max-h-0"
                }`}
              >
                <div className="px-3 pb-3 pt-0 border-t border-slate-900/60 mx-3">
                  {topHeadline ? (
                    <div className="mt-3 rounded-lg border border-slate-900 bg-slate-950/50 p-2.5">
                      <p className="text-[10px] font-mono uppercase tracking-wide text-sigil-gold/80 mb-1">
                        Top headline
                      </p>
                      <p className="text-[13px] text-slate-100 leading-snug">
                        {topHeadline}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-[11px] text-slate-500 font-mono">
                      No classified headlines tagged to this theme in the current
                      sync window.
                    </p>
                  )}

                  {drift?.narrativeShiftDetails && (
                    <p className="mt-3 text-[12px] text-slate-400 leading-relaxed">
                      {drift.narrativeShiftDetails}
                    </p>
                  )}

                  {evidence.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      <p className="text-[10px] font-mono uppercase tracking-wide text-sigil-gold/80">
                        Evidence
                      </p>
                      {evidence.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="rounded-lg border border-slate-900 bg-slate-950/40 p-2"
                        >
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border"
                              style={{
                                color: sentimentColor(item.sentiment),
                                borderColor: `${sentimentColor(item.sentiment)}44`,
                              }}
                            >
                              {item.sentiment || "neutral"}
                            </span>
                            <span className="text-[9px] font-mono text-slate-600">
                              sig {item.significance}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-200 leading-snug">
                            {item.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-3 text-[10px] font-mono text-slate-600 leading-relaxed">
                    <span className="text-sigil-gold/80">Thesis · </span>
                    {theme.short_description}
                  </p>

                  {pulse.source === "estimated" && !isMock && headlineCount > 0 && (
                    <p className="mt-2 text-[10px] font-mono text-slate-600">
                      Drift derived from headline sentiment when Claude theme
                      scoring is skipped.
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

export default ThesisRadar;
