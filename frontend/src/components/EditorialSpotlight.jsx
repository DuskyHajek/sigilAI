import { Rocket, Radio, ShieldAlert } from "lucide-react";
import { pickEditorialSpotlight } from "../utils/editorialSpotlight.js";

const KIND_STYLES = {
  ticker: {
    icon: Rocket,
    label: "Spotlight",
    border: "border-sigil-gold/25",
    bg: "bg-sigil-gold/[0.04]",
    labelColor: "text-sigil-gold/90",
    iconWrap: "bg-sigil-gold/10 border-sigil-gold/20 text-sigil-gold",
  },
  blindspot: {
    icon: ShieldAlert,
    label: "Counter-thesis watch",
    border: "border-rose-500/20",
    bg: "bg-rose-500/[0.04]",
    labelColor: "text-rose-400/90",
    iconWrap: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  },
  signal: {
    icon: Radio,
    label: "Top signal",
    border: "border-sigil-gold/20",
    bg: "bg-sigil-gold/[0.03]",
    labelColor: "text-sigil-gold/90",
    iconWrap: "bg-sigil-gold/10 border-sigil-gold/20 text-sigil-gold",
  },
};

const EditorialSpotlight = ({
  watchlist,
  adversarialAssessment,
  thesisDriftReport,
  stressActive,
  onClusterClick,
}) => {
  const spotlight = pickEditorialSpotlight({
    watchlist,
    adversarialAssessment,
    thesisDriftReport,
    stressActive,
  });

  if (!spotlight) return null;

  const styles = KIND_STYLES[spotlight.kind];
  const Icon = styles.icon;

  const handleAction = () => {
    if (spotlight.kind === "ticker") {
      document
        .getElementById("zone-watchlist")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (spotlight.kind === "signal" && spotlight.cluster) {
      onClusterClick?.(spotlight.cluster);
      return;
    }

    if (spotlight.kind === "blindspot") {
      document
        .getElementById("zone-today")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className={`editorial-spotlight glass-panel glass-panel-hover rounded-2xl border ${styles.border} ${styles.bg} px-4 py-4 md:px-5 md:py-5`}
      aria-label="Editorial spotlight"
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-xl border shrink-0 ${styles.iconWrap}`}
          aria-hidden="true"
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-mono uppercase tracking-[0.15em] ${styles.labelColor} mb-1`}
          >
            {styles.label}
          </p>

          {spotlight.kind === "ticker" && (
            <>
              <p className="text-base font-semibold text-white leading-snug">
                {spotlight.title}
              </p>
              <p className="text-sm text-[#a0a0a0] leading-relaxed mt-1">
                {spotlight.body.split(spotlight.ticker).map((part, index, arr) =>
                  index < arr.length - 1 ? (
                    <span key={index}>
                      {part}
                      <span className="font-mono text-sigil-gold">
                        {spotlight.ticker}
                      </span>
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
              </p>
            </>
          )}

          {spotlight.kind === "blindspot" && (
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {spotlight.text}
            </p>
          )}

          {spotlight.kind === "signal" && (
            <>
              <p className="text-base font-semibold text-white leading-snug">
                {spotlight.cluster.clusterName}
              </p>
              <p className="text-sm text-[#a0a0a0] leading-relaxed mt-1 line-clamp-2">
                {spotlight.cluster.evidenceSummary}
              </p>
            </>
          )}

          {(spotlight.kind === "ticker" || spotlight.kind === "signal") && (
            <button
              type="button"
              onClick={handleAction}
              className="btn-sigil-outline mt-3 !text-[11px] !py-1 !px-3"
            >
              {spotlight.kind === "ticker"
                ? `View ${spotlight.ticker} in watchlist`
                : "View impacted theme"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialSpotlight;
