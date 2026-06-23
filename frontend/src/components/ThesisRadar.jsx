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

const SHORT_THEME_NAMES = {
  datacenters: "Datacenters",
  application: "App Layer",
  robotics: "Robotics",
  warfare: "Warfare",
  space: "Space",
  biotech: "Biotech",
  adversarial: "Adv. AI",
};

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
    <div className="glass-panel border-gold-glow p-5 rounded-2xl h-full flex flex-col min-h-[520px] lg:min-h-0">
      <div className="mb-3 shrink-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Panel 02
        </p>
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Activity size={17} className="text-sigil-gold shrink-0" />
          Thesis Radar
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
          All seven pillars — expand one row for headlines and evidence.
        </p>
      </div>

      <div
        className={`thesis-radar-list${
          expandedTheme ? " thesis-radar-list--detail" : ""
        }`}
      >
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
          const shortName = SHORT_THEME_NAMES[theme.id] || theme.display_name;

          return (
            <div
              key={theme.id}
              id={`thesis-row-${theme.id}`}
              className={`theme-card theme-card--${color} thesis-radar-row border transition-colors ${
                isExpanded ? "thesis-radar-row--expanded" : ""
              } ${isHighlighted ? "border-sigil-gold/40 ring-1 ring-sigil-gold/20" : ""}`}
            >
              <button
                type="button"
                onClick={() => toggleTheme(theme.id)}
                className="thesis-radar-row__trigger"
                aria-expanded={isExpanded}
                title={theme.display_name}
              >
                <div className="thesis-radar-row__inner">
                  <div className="theme-card__icon thesis-radar-row__icon">
                    <i className={`ti ${icon}`} aria-hidden="true" />
                  </div>

                  <div className="thesis-radar-row__main">
                    <p className="theme-card__name thesis-radar-row__name">
                      {shortName}
                    </p>
                    <div className="thesis-radar-row__meta">
                      <span
                        className="text-[8px] font-mono uppercase tracking-wide px-1 py-px rounded border shrink-0"
                        style={{
                          color: driftDisplay.color,
                          backgroundColor: driftDisplay.bg,
                          borderColor: driftDisplay.border,
                        }}
                        title={driftDisplay.hint}
                      >
                        {driftDisplay.label}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0 whitespace-nowrap">
                        {headlineCount === 0 ? "0" : headlineCount}
                      </span>
                    </div>
                    <div className="thesis-radar-row__tickers">
                      {tickers.map((stock) => (
                        <span
                          key={stock.ticker}
                          className={`px-1 py-px rounded text-[9px] font-mono border shrink-0 ${
                            stock.spotlight
                              ? "border-sigil-gold/35 text-sigil-gold bg-sigil-gold/10"
                              : "border-slate-800 text-slate-500 bg-slate-950/60"
                          }`}
                        >
                          {stock.ticker}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-slate-500 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="thesis-radar-row__detail">
                  {topHeadline ? (
                    <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-2 mb-2">
                      <p className="text-[9px] font-mono uppercase tracking-wide text-sigil-gold/80 mb-1">
                        Top headline
                      </p>
                      <p className="text-[12px] text-slate-100 leading-snug">
                        {topHeadline}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 font-mono mb-2">
                      No classified headlines tagged to this theme in the current
                      sync window.
                    </p>
                  )}

                  {drift?.narrativeShiftDetails && (
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                      {drift.narrativeShiftDetails}
                    </p>
                  )}

                  {evidence.length > 0 && (
                    <div className="space-y-1.5 mb-2">
                      <p className="text-[9px] font-mono uppercase tracking-wide text-sigil-gold/80">
                        Evidence
                      </p>
                      {evidence.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="rounded-lg border border-slate-900 bg-slate-950/40 p-2"
                        >
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className="text-[8px] font-mono uppercase px-1 py-px rounded border"
                              style={{
                                color: sentimentColor(item.sentiment),
                                borderColor: `${sentimentColor(item.sentiment)}44`,
                              }}
                            >
                              {item.sentiment || "neutral"}
                            </span>
                            <span className="text-[8px] font-mono text-slate-600">
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

                  <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
                    <span className="text-sigil-gold/80">Thesis · </span>
                    {theme.short_description}
                  </p>

                  {pulse.source === "estimated" && !isMock && headlineCount > 0 && (
                    <p className="mt-2 text-[9px] font-mono text-slate-600">
                      Drift derived from headline sentiment when Claude theme
                      scoring is skipped.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThesisRadar;
