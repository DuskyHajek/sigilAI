import { Radio } from "lucide-react";
import { THEMES } from "@config/thesis.js";
import { SectionHeader } from "./learning/LearningUI";

const SignalStrip = ({ thesisDriftReport, onClusterClick }) => {
  const clusters = thesisDriftReport?.detectedClusters ?? [];
  if (clusters.length === 0) return null;

  const getThemeName = (themeId) =>
    THEMES.find((theme) => theme.id === themeId)?.display_name || themeId;

  return (
    <section
      className="glass-panel rounded-2xl border border-sigil-gold/20 px-4 py-4 md:px-5 md:py-5"
      aria-label="Today's signal clusters"
    >
      <SectionHeader
        eyebrow="Today"
        title="Signal clusters"
        description="Cross-company patterns from this sync — separate stories hitting the same bottleneck or shift."
        icon={Radio}
      />

      <div className="flex flex-col gap-2 -mt-2">
        {clusters.map((cluster, index) => (
          <button
            key={`${cluster.clusterName}-${index}`}
            type="button"
            onClick={() => onClusterClick?.(cluster)}
            className="text-left rounded-xl border border-white/8 bg-[#1a1a1a] hover:bg-sigil-gold/[0.06] hover:border-sigil-gold/30 px-3.5 py-3 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="text-sm font-medium text-white leading-snug">
                {cluster.clusterName}
              </p>
              <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 text-[#a0a0a0]">
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
