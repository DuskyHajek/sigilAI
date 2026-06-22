import { ShieldAlert } from "lucide-react";
import { THEMES } from "@config/thesis.js";

const getTheme = (themeId) => THEMES.find((theme) => theme.id === themeId);

const SOURCE_LABELS = {
  claude: "Claude · adversarial pass",
  headlines: "High-sig bearish headlines only",
  none: "No counter-signals today",
  unavailable: "Unavailable this sync",
};

const ChallengeTheCio = ({ adversarialAssessment, isMock }) => {
  const risks = adversarialAssessment?.asymmetricRisks ?? [];
  const blindspotAlert = adversarialAssessment?.blindspotAlert ?? "";
  const source = adversarialAssessment?.source;
  const hasRisks = risks.length > 0;
  const isCleanEmpty = source === "none";
  const isUnavailable =
    source === "unavailable" ||
    (!hasRisks && blindspotAlert === "Analysis temporarily unavailable.");

  const sourceLabel = isMock
    ? "Demo adversarial pass"
    : SOURCE_LABELS[source] ||
      (hasRisks ? "Claude · adversarial pass" : "No counter-signals today");

  return (
    <div className="glass-panel p-6 rounded-2xl border border-rose-500/15 h-full flex flex-col">
      <div className="flex-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-rose-400/80 mb-1">
          Counter-thesis · read with the brief
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">
              Challenge the CIO
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
              isMock
                ? "text-amber-400/90 border-amber-500/20 bg-amber-500/5"
                : isCleanEmpty
                  ? "text-slate-400 border-slate-700/50 bg-slate-900/40"
                  : "text-rose-400/90 border-rose-500/20 bg-rose-500/5"
            }`}
          >
            {sourceLabel}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          Deliberately searches for blind spots, bear cases, and &ldquo;what if we
          are wrong?&rdquo; scenarios — separate from the brief&apos;s single
          counter-signal line. Silence beats noise: no card is shown when
          today&apos;s feed has no material counter-signal.
        </p>

        {!hasRisks ? (
          <div
            className={`mt-4 rounded-xl border p-4 ${
              isCleanEmpty
                ? "border-slate-800 bg-slate-950/30"
                : "border-slate-800 bg-slate-950/40"
            }`}
          >
            <p className="text-sm text-slate-400 leading-relaxed">
              {isUnavailable
                ? "Adversarial analysis could not run this sync — usually a timeout or API error. Retry Sync once."
                : blindspotAlert ||
                  "No meaningful counter-signals detected in today's headline sample."}
            </p>
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {risks.map((risk, index) => {
              const theme = getTheme(risk.targetTheme);
              const themeColor = theme?.color_hex || "#f43f5e";

              return (
                <li
                  key={`${risk.targetTheme}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 p-4"
                >
                  <div
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="pl-2 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-rose-400/80">
                        Risk {String(index + 1).padStart(2, "0")}
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
            })}
          </ol>
        )}

        {hasRisks && blindspotAlert && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-[10px] font-mono uppercase tracking-wide text-rose-400/90 mb-1">
              Blindspot alert
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {blindspotAlert}
            </p>
          </div>
        )}

        {source === "headlines" && hasRisks && (
          <p className="mt-3 text-[10px] font-mono text-slate-600 leading-relaxed">
            Claude did not complete — showing only high-significance bearish
            headlines (significance ≥ 3), deduplicated to one risk per story.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChallengeTheCio;
