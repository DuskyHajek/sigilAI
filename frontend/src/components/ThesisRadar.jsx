import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronDown, HelpCircle } from "lucide-react";
import { THEMES, THEME_COLORS, THEME_ICONS } from "@config/thesis.js";
import {
  buildThemeDriftMap,
  DRIFT_DISPLAY,
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

const Badge = ({ label, display, title, dimmed = false }) => (
  <span
    className={`text-[8px] font-mono uppercase tracking-wide px-1 py-px rounded border shrink-0 bg-transparent ${
      dimmed ? "opacity-45" : ""
    }`}
    style={{
      color: display.color,
      borderColor: display.border || `${display.color}55`,
    }}
    title={title}
  >
    {label}
  </span>
);

const sentimentColor = (sentiment) => {
  if (sentiment === "bullish") return "var(--color-bullish)";
  if (sentiment === "bearish") return "var(--color-bearish)";
  return "#94a3b8";
};

const DRIFT_LEGEND = Object.values(DRIFT_DISPLAY);

function ThesisRadarHelp({ stressActive, stressViewMode }) {
  const expandDetail = stressActive
    ? stressViewMode === "stress"
      ? "scenario impact read, transmission chain, and how the shock hits this pillar"
      : "today's headlines and evidence plus the scenario read when a stress test is active"
    : "classified headlines with sentiment, narrative shift notes, and the pillar thesis one-liner";

  return (
    <div className="thesis-radar-help mt-2.5 rounded-xl border border-white/8 bg-[#141414]/90 p-3 space-y-2.5">
      <p className="text-[11px] text-slate-400 leading-relaxed">
        <span className="text-slate-300 font-medium">Point · </span>
        Scan all seven Supernova pillars in one pass — is today&apos;s news
        supporting or challenging each thesis? Use this before diving into
        individual watchlist names below.
      </p>
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">
          On each row
        </p>
        <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
          {DRIFT_LEGEND.map((item) => (
            <li key={item.label} className="flex gap-2">
              <span
                className="shrink-0 text-[8px] font-mono uppercase px-1 py-px rounded border h-fit mt-0.5"
                style={{
                  color: item.color,
                  borderColor: item.border || `${item.color}55`,
                }}
              >
                {item.label}
              </span>
              <span>{item.hint}</span>
            </li>
          ))}
          <li>
            <span className="text-slate-300 font-mono text-[10px]">N hl · </span>
            Headlines tagged to this pillar in the current sync (click More even
            at 0 hl for thesis scope)
          </li>
          <li>
            <span className="text-slate-300 font-mono text-[10px]">Tickers · </span>
            Up to three watchlist names in this pillar — gold border marks a
            spotlight position
          </li>
          <li>
            <span className="text-slate-300 font-mono text-[10px]">Preview · </span>
            Strongest headline or narrative shift without expanding
          </li>
        </ul>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        <span className="text-sigil-gold/90 font-medium">Click More · </span>
        Opens {expandDetail}.
      </p>
    </div>
  );
}

const ThesisRadar = ({
  themeData,
  thesisDriftReport,
  watchlistData,
  isMock,
  highlightThemeId,
  stressResult,
  stressViewMode = "live",
  stackedLayout = false,
}) => {
  const [expandedTheme, setExpandedTheme] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const toggleTheme = (themeId) => {
    setExpandedTheme((current) => (current === themeId ? null : themeId));
  };

  useEffect(() => {
    if (!highlightThemeId) return;
    setExpandedTheme(highlightThemeId);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`thesis-row-${highlightThemeId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
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

  return (
    <div
      className={`glass-panel p-4 sm:p-5 rounded-2xl flex flex-col ${
        stackedLayout
          ? "max-h-[min(480px,55vh)]"
          : "h-full min-h-[320px] sm:min-h-[420px] max-h-[min(720px,70vh)] sm:max-h-[min(720px,75vh)]"
      }`}
    >
      <div className="mb-3 shrink-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-sigil-gold mb-0.5">
          Pillars
        </p>
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Activity size={17} className="text-sigil-gold shrink-0" />
          Thesis Radar
        </h2>
        <p className="text-xs text-[#a0a0a0] mt-1 leading-snug">
          {stressActive
            ? stressViewMode === "stress"
              ? "Each pillar shows a scenario read — click More for the full transmission chain."
              : "Today's drift status and headline preview on every row — click More for evidence."
            : "One row per pillar: drift status, headline count, and a preview — click More for full evidence and thesis scope."}
        </p>
        <button
          type="button"
          onClick={() => setShowHelp((open) => !open)}
          className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sigil-gold/80 hover:text-sigil-gold transition-colors"
          aria-expanded={showHelp}
        >
          <HelpCircle size={13} aria-hidden="true" />
          {showHelp ? "Hide guide" : "How to read this"}
        </button>
        {showHelp && (
          <ThesisRadarHelp
            stressActive={stressActive}
            stressViewMode={stressViewMode}
          />
        )}
      </div>

      <div className="thesis-radar-list">
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
                          className={`px-1 py-px rounded text-[9px] font-mono border shrink-0 bg-transparent ${
                            stock.spotlight
                              ? "border-sigil-gold/35 text-sigil-gold"
                              : "border-slate-700 text-slate-500"
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

              {!isExpanded && (
                <div className="thesis-radar-row__preview-wrap">
                  {previewText ? (
                    <p className="thesis-radar-row__preview">{previewText}</p>
                  ) : (
                    <p className="thesis-radar-row__preview thesis-radar-row__preview--empty">
                      No headlines this sync · expand for thesis scope
                    </p>
                  )}
                </div>
              )}

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
                      <p className="text-[13px] text-slate-100 leading-relaxed">
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
                          <p className="text-[13px] text-slate-100 leading-relaxed">
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
                              <p className="text-[12px] text-slate-200 leading-relaxed">
                                {item.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed">
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
