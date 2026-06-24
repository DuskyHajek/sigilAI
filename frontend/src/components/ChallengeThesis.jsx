import { useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import { THEMES } from "@config/thesis.js";
import { RISK_TYPE_LABELS, RISK_TYPE_HINTS } from "../utils/stressDisplay.js";

const getTheme = (themeId) => THEMES.find((theme) => theme.id === themeId);

const GENERIC_EMPTY_BLINDSPOT =
  "No meaningful counter-signals detected in today's headline sample.";

const GENERIC_HEADLINE_BLINDSPOT =
  "High-significance bearish headlines are present — verify whether risks are already priced in before adding conviction.";

const getThemeDisplayName = (themeId) =>
  getTheme(themeId)?.display_name || themeId;

const synthesizeBlindspotFromRisks = (risks) => {
  if (risks.length === 0) return "";

  const themeNames = [
    ...new Set(risks.map((risk) => getThemeDisplayName(risk.targetTheme))),
  ];

  if (risks.length === 1) {
    const hook = risks[0].headlineRisk.replace(/\.$/, "");
    return `Today's headline flow challenges the ${themeNames[0]} pillar — ${hook}.`;
  }

  const themeList =
    themeNames.length === 2
      ? `${themeNames[0]} and ${themeNames[1]}`
      : `${themeNames.slice(0, -1).join(", ")}, and ${themeNames.at(-1)}`;

  return `${risks.length} high-sig bearish headlines cluster across ${themeList} — the brief's constructive read may underweight ${themeNames[0]} if these events persist.`;
};

/** Curated structural bear watches — first bear_signal per pillar from thesis config. */
const STANDING_RISKS = THEMES.map((theme) => ({
  targetTheme: theme.id,
  riskType: "structural",
  headlineRisk: theme.bear_signals?.[0] ?? "Structural downside scenario",
  adversarialArgument: theme.short_description,
  counterIndicatorToWatch:
    "Always on radar — watch headlines and thesis drift for this trigger",
}));

const SOURCE_LABELS = {
  claude: "Claude · adversarial pass",
  none: "Standing risks · always on radar",
  unavailable: "Unavailable this sync",
};

const headlineSourceLabel = (count) =>
  count === 1
    ? "High-sig bearish headline"
    : "High-sig bearish headlines";

const RiskCard = ({ risk, index, embedded, standing = false }) => {
  const theme = getTheme(risk.targetTheme);
  const themeColor = theme?.color_hex || "#f43f5e";
  const riskType = risk.riskType || (standing ? "structural" : null);
  const riskTypeLabel = riskType ? RISK_TYPE_LABELS[riskType] || riskType : null;

  return (
    <li
      className={`relative overflow-hidden rounded-xl border p-3.5 transition-colors ${
        embedded
          ? "border-white/8 bg-[#1a1a1a] hover:border-white/15"
          : standing
            ? "border-white/8 bg-[#1a1a1a]"
            : "border-white/8 bg-[#1a1a1a] hover:border-white/15"
      }`}
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: themeColor }}
      />
      <div className="pl-2 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-rose-400/80">
            {standing ? "Standing" : `Risk ${String(index + 1).padStart(2, "0")}`}
          </span>
          {theme && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
              style={{
                color: themeColor,
                borderColor: `${themeColor}55`,
                backgroundColor: `${themeColor}12`,
              }}
            >
              {theme.display_name}
            </span>
          )}
          {riskTypeLabel && !standing && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-700/60 text-slate-400 bg-slate-900/50"
              title={RISK_TYPE_HINTS[riskType] || riskTypeLabel}
            >
              {riskTypeLabel}
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-slate-100 leading-snug">
          {risk.headlineRisk}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          {risk.adversarialArgument}
        </p>
        <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
          <span className="text-rose-400/90 uppercase tracking-wide">
            Watch ·{" "}
          </span>
          {risk.counterIndicatorToWatch}
        </p>
      </div>
    </li>
  );
};

const ChallengeThesis = ({
  adversarialAssessment,
  isMock,
  suppressBlindspotAlert = false,
  embedded = false,
}) => {
  const risks = adversarialAssessment?.asymmetricRisks ?? [];
  const blindspotAlert = adversarialAssessment?.blindspotAlert ?? "";
  const source = adversarialAssessment?.source;
  const hasRisks = risks.length > 0;
  const isCleanEmpty = source === "none";
  const isUnavailable =
    source === "unavailable" ||
    (!hasRisks && blindspotAlert === "Analysis temporarily unavailable.");

  const showStandingRisks = !hasRisks && !isUnavailable;

  const enrichedBlindspot = useMemo(() => {
    if (!blindspotAlert || blindspotAlert === GENERIC_EMPTY_BLINDSPOT) {
      return "";
    }
    if (blindspotAlert === GENERIC_HEADLINE_BLINDSPOT && hasRisks) {
      return synthesizeBlindspotFromRisks(risks);
    }
    return blindspotAlert;
  }, [blindspotAlert, hasRisks, risks]);

  const showBlindspotAlert =
    enrichedBlindspot && !suppressBlindspotAlert && (hasRisks || showStandingRisks);

  const sourceLabel = isMock
    ? "Demo adversarial pass"
    : showStandingRisks
      ? SOURCE_LABELS.none
      : source === "headlines"
        ? headlineSourceLabel(risks.length)
        : SOURCE_LABELS[source] ||
          (hasRisks ? "Claude · adversarial pass" : SOURCE_LABELS.none);

  const standingIntro = useMemo(() => {
    if (!showStandingRisks) return "";
    if (isCleanEmpty) {
      return "No live counter-signals in today's headline sample — these structural bear watches from the thesis config stay on radar regardless.";
    }
    return "Live adversarial pass returned no risk cards — structural bear watches from the thesis config remain on radar.";
  }, [showStandingRisks, isCleanEmpty]);

  const wrapperClass = embedded
    ? "flex flex-col"
    : "glass-panel p-6 rounded-2xl border border-rose-500/15 h-full flex flex-col";

  return (
    <div className={wrapperClass}>
      <div className="flex-1">
        {!embedded && (
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-rose-400/80 mb-1">
            Counter-thesis · read with the brief
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {!embedded && <ShieldAlert size={16} className="text-rose-400" />}
            <h3
              className={`font-semibold text-slate-200 ${
                embedded
                  ? "text-sm text-slate-300"
                  : "text-sm uppercase tracking-widest"
              }`}
            >
              {embedded ? "Bear cases from today's headlines" : "Challenge the Thesis"}
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
              isMock
                ? "text-amber-400/90 border-amber-500/20 bg-amber-500/5"
                : showStandingRisks
                  ? "text-slate-400 border-slate-700/50 bg-slate-900/40"
                  : "text-rose-400/90 border-rose-500/20 bg-rose-500/5"
            }`}
          >
            {sourceLabel}
          </span>
        </div>

        {!embedded && (
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Stress-tests each pillar&apos;s investment logic — bear cases, blind
            spots, and &ldquo;what if we are wrong?&rdquo;
          </p>
        )}

        {isUnavailable ? (
          <div
            className={`mt-4 rounded-xl border p-4 ${
              embedded
                ? "border-slate-800/80 bg-transparent"
                : "border-slate-800 bg-slate-950/40"
            }`}
          >
            <p className="text-sm text-slate-400 leading-relaxed">
              Adversarial analysis could not run this sync — usually a timeout or
              API error. Retry Sync once.
            </p>
          </div>
        ) : showStandingRisks ? (
          <div className="mt-4 space-y-3">
            {showBlindspotAlert && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <p className="text-[10px] font-mono uppercase tracking-wide text-rose-400/90 mb-1">
                  Today&apos;s read
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {enrichedBlindspot}
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 leading-relaxed">{standingIntro}</p>
            <p className="text-[10px] font-mono uppercase tracking-wide text-rose-400/90">
              Standing risks — always on radar
            </p>
            <ol className="space-y-3">
              {STANDING_RISKS.map((risk, index) => (
                <RiskCard
                  key={risk.targetTheme}
                  risk={risk}
                  index={index}
                  embedded={embedded}
                  standing
                />
              ))}
            </ol>
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {risks.map((risk, index) => (
              <RiskCard
                key={`${risk.targetTheme}-${index}`}
                risk={risk}
                index={index}
                embedded={embedded}
              />
            ))}
          </ol>
        )}

        {hasRisks && showBlindspotAlert && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-[10px] font-mono uppercase tracking-wide text-rose-400/90 mb-1">
              Thesis gap
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {enrichedBlindspot}
            </p>
          </div>
        )}

        {source === "headlines" && hasRisks && !embedded && (
          <p className="mt-3 text-[10px] font-mono text-slate-600 leading-relaxed">
            Claude adversarial pass did not complete (often a Vercel timeout or
            API rate limit during Sync) — showing high-significance bearish
            headlines (significance ≥ 3) instead. Unrelated to Thesis Stress
            Tester, which runs separately on demand.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChallengeThesis;
