import { Radio } from "lucide-react";
import { THEMES } from "@config/thesis.js";

const SignalStrip = ({ thesisDriftReport, onClusterClick }) => {
  const clusters = thesisDriftReport?.detectedClusters ?? [];
  if (clusters.length === 0) return null;

  const getThemeName = (themeId) =>
    THEMES.find((theme) => theme.id === themeId)?.display_name || themeId;

  return (
    <section
      className="rounded-2xl border border-sigil-gold/25 bg-sigil-gold/[0.04] px-4 py-3 md:px-5 md:py-4"
      aria-label="Today's signal clusters"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-sigil-gold/10 border border-sigil-gold/20 shrink-0">
          <Radio size={16} className="text-sigil-gold" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/90">
            Today&apos;s signals
          </p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Cross-company patterns from this sync — separate stories hitting the
            same bottleneck or shift.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {clusters.map((cluster, index) => (
          <button
            key={`${cluster.clusterName}-${index}`}
            type="button"
            onClick={() => onClusterClick?.(cluster)}
            className="text-left rounded-xl border border-sigil-gold/15 bg-slate-950/50 hover:bg-sigil-gold/[0.06] hover:border-sigil-gold/30 px-3.5 py-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-sm font-medium text-slate-100 leading-snug">
                {cluster.clusterName}
              </p>
              <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                SEV {cluster.severityScore}/10
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {cluster.evidenceSummary}
            </p>
            {(cluster.impactedThemes ?? []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cluster.impactedThemes.map((themeId) => (
                  <span
                    key={themeId}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-800 text-slate-500"
                  >
                    {getThemeName(themeId)}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SignalStrip;
