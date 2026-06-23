import { THEMES } from "@config/thesis.js";

const SignalStrip = ({ thesisDriftReport, onClusterClick }) => {
  const clusters = thesisDriftReport?.detectedClusters ?? [];
  if (clusters.length === 0) return null;

  const getThemeName = (themeId) =>
    THEMES.find((theme) => theme.id === themeId)?.display_name || themeId;

  return (
    <section
      className="glass-panel rounded-2xl px-4 py-4 md:px-5 md:py-4"
      aria-label="Today's signal clusters"
    >
      <div className="mb-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#a0a0a0] mb-0.5">
          Related signals
        </p>
        <p className="text-sm text-[#a0a0a0] leading-relaxed">
          Cross-company patterns hitting the same bottleneck or shift.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {clusters.map((cluster, index) => (
          <button
            key={`${cluster.clusterName}-${index}`}
            type="button"
            onClick={() => onClusterClick?.(cluster)}
            className="text-left rounded-xl border border-white/6 bg-black/40 hover:bg-white/[0.03] hover:border-white/12 px-3.5 py-3 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-sm font-medium text-white leading-snug">
                {cluster.clusterName}
              </p>
              <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/8 text-[#a0a0a0]">
                SEV {cluster.severityScore}/10
              </span>
            </div>
            <p className="text-xs text-[#a0a0a0] leading-relaxed line-clamp-2">
              {cluster.evidenceSummary}
            </p>
            {(cluster.impactedThemes ?? []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cluster.impactedThemes.map((themeId) => (
                  <span
                    key={themeId}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/8 text-[#a0a0a0]"
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
