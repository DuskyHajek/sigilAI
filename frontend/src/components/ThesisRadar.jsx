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
import {
  buildThemeImpactMap,
  getImpactDisplay,
  IMPACT_TYPE_LABELS,
} from "../utils/stressDisplay.js";
import "../styles/theme-cards.css";
import "../styles/stress-test.css";

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

const Badge = ({ label, display, title, dimmed = false }) => (
  <span
    className={`text-[8px] font-mono uppercase tracking-wide px-1 py-px rounded border shrink-0 ${
      dimmed ? "opacity-45" : ""
    }`}
    style={{
      color: display.color,
      backgroundColor: display.bg,
      borderColor: display.border,
    }}
    title={title}
  >
    {label}
  </span>
);

const ThesisRadar = ({
  themeData,
  thesisDriftReport,
  watchlistData,
  isMock,
  highlightThemeId,
  stressResult,
  stressViewMode = "live",
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

  const stressByTheme = useMemo(
    () => buildThemeImpactMap(stressResult),
    [stressResult]
  );

  const stressActive = !!stressResult;
  const showLiveRow = true;
  const showLiveDetail = !stressActive || stressViewMode !== "stress";
  const showStress =
    stressActive && (stressViewMode === "stress" || stressViewMode === "split");

  if (!themeData) return null;

  const toggleTheme = (themeId) => {
    setExpandedTheme((current) => {
      const next = current === themeId ? null : themeId;
      if (next) {
        window.requestAnimationFrame(() => {
          document
            .getElementById(`thesis-row-${themeId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
      return next;
    });
  };

  return (
    <div className="glass-panel border-gold-glow p-5 rounded-2xl h-full flex flex-col min-h-0 lg:max-h-[680px]">
      <div className="mb-3 shrink-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Panel 02
        </p>
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Activity size={17} className="text-sigil-gold shrink-0" />
          Thesis Radar
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
          {stressActive
            ? stressViewMode === "stress"
              ? "Each pillar shows a scenario read — click for the full transmission chain."
              : "Today's signal preview on every row — click any pillar for headlines and evidence."
            : "Preview on every row — click More for headlines, evidence, and thesis scope."}
        </p>
      </div>

      <div
        className={`thesis-radar-list${
          expandedTheme ? " thesis-radar-list--detail" : " thesis-radar-list--compact"
        }`}
      >
        {THEMES.map((theme) => {
          const pulse = themeData[theme.id] || {};
          const drift = driftByTheme[theme.id];
          const driftDisplay = getDriftDisplay(drift?.status);
          const stress = stressByTheme[theme.id];
          const stressDisplay = getImpactDisplay(stress?.impact);
          const headlineCount = getHeadlineCount(pulse);
          const topHeadline = getTopHeadline(pulse);
          const tickers = getThemeTickers(watchlistData, theme.id);
          const evidence = pulse.evidence ?? [];
          const isExpanded = expandedTheme === theme.id;
          const isHighlighted = highlightThemeId === theme.id;
          const color = THEME_COLORS[theme.id] ?? "teal";
          const icon = THEME_ICONS[theme.id] ?? "ti-server-2";
          const shortName = SHORT_THEME_NAMES[theme.id] || theme.display_name;

          const previewText =
            showStress && stress?.rationale && stressViewMode === "stress"
              ? stress.rationale
              : topHeadline ||
                drift?.narrativeShiftDetails ||
                (headlineCount === 0
                  ? null
                  : pulse.reason || "Headlines available — click to expand");

          return (
            <div
              key={theme.id}
              id={`thesis-row-${theme.id}`}
              className={`theme-card theme-card--${color} thesis-radar-row border transition-colors ${
                isExpanded ? "thesis-radar-row--expanded" : "thesis-radar-row--collapsed"
              } ${isHighlighted ? "border-sigil-gold/40 ring-1 ring-sigil-gold/20" : ""} ${
                showStress && stress ? "thesis-radar-row--stress-active" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTheme(theme.id)}
                className={`thesis-radar-row__trigger${
                  isExpanded ? " thesis-radar-row__trigger--expanded" : ""
                }`}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${theme.display_name} — headlines and evidence`}
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
                      {showLiveRow && (
                        <Badge
                          label={driftDisplay.label}
                          display={driftDisplay}
                          title={`Today · ${driftDisplay.hint}`}
                          dimmed={showStress && stressViewMode === "split"}
                        />
                      )}
                      {showStress && stress && (
                        <Badge
                          label={stressDisplay.label}
                          display={stressDisplay}
                          title={`Scenario · ${stressDisplay.hint}`}
                        />
                      )}
                      {showLiveRow && headlineCount > 0 && (
                        <span
                          className="text-[8px] font-mono uppercase tracking-wide px-1 py-px rounded border border-slate-700/80 text-slate-400 bg-slate-950/50 shrink-0"
                          title={`${headlineCount} headline${headlineCount === 1 ? "" : "s"} this sync`}
                        >
                          {headlineCount} hl
                        </span>
                      )}
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

                  <div
                    className={`thesis-radar-row__expand-hint shrink-0 flex flex-col items-center gap-0.5 ${
                      isExpanded ? "thesis-radar-row__expand-hint--open" : ""
                    }`}
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        isExpanded
                          ? "rotate-180 text-sigil-gold/80"
                          : "text-slate-500"
                      }`}
                    />
                    <span className="text-[7px] font-mono uppercase tracking-wide text-slate-500">
                      {isExpanded ? "Less" : "More"}
                    </span>
                  </div>
                </div>
              </button>

              <div className="thesis-radar-row__preview-wrap">
                {previewText ? (
                  <p className="thesis-radar-row__preview">{previewText}</p>
                ) : (
                  <p className="thesis-radar-row__preview thesis-radar-row__preview--empty">
                    No headlines this sync · expand for thesis scope
                  </p>
                )}
              </div>

              {isExpanded && (
                <div className="thesis-radar-row__detail">
                  {showStress && stress && (
                    <div className="rounded-lg border border-sigil-gold/20 bg-sigil-gold/[0.04] p-2.5 mb-2">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <p className="text-[9px] font-mono uppercase tracking-wide text-sigil-gold/90">
                          Scenario impact
                        </p>
                        <span
                          className="text-[8px] font-mono uppercase px-1 py-px rounded border"
                          style={{
                            color: stressDisplay.color,
                            borderColor: `${stressDisplay.color}44`,
                            backgroundColor: stressDisplay.bg,
                          }}
                        >
                          {stressDisplay.label}
                        </span>
                        {stress.impactType && (
                          <span className="text-[8px] font-mono text-slate-500 uppercase">
                            {IMPACT_TYPE_LABELS[stress.impactType] || stress.impactType}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-100 leading-snug">
                        {stress.rationale}
                      </p>
                      {stress.transmission && (
                        <p className="mt-1.5 text-[10px] font-mono text-slate-500 leading-relaxed">
                          <span className="text-slate-400">Chain · </span>
                          {stress.transmission}
                        </p>
                      )}
                    </div>
                  )}

                  {showLiveDetail && (
                    <>
                      {topHeadline ? (
                        <div className="rounded-lg border border-slate-900 bg-slate-950/50 p-2 mb-2">
                          <p className="text-[9px] font-mono uppercase tracking-wide text-sigil-gold/80 mb-1">
                            Top headline · today
                          </p>
                          <p className="text-[12px] text-slate-100 leading-snug">
                            {topHeadline}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 font-mono mb-2">
                          No classified headlines tagged to this theme in the
                          current sync window.
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
                            Evidence · today
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
                    </>
                  )}

                  <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
                    <span className="text-sigil-gold/80">Thesis · </span>
                    {theme.short_description}
                  </p>

                  {pulse.source === "estimated" && !isMock && headlineCount > 0 && showLiveDetail && (
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
