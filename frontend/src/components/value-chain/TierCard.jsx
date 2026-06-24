import { ChevronDown, ChevronRight } from "lucide-react";
import EssentialBadge from "../learning/EssentialBadge";
import {
  getPhaseById,
  getTickersForTier,
  tierHasWatchlistExposure,
} from "../../utils/valueChainUtils.js";

function DetailBlock({ label, children, accent = null }) {
  return (
    <div
      className={`rounded-lg p-3 bg-white/[0.02] border border-white/6 ${
        accent ?? ""
      }`}
    >
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

const TierCard = ({
  tier,
  expanded,
  highlighted = false,
  compactPhase = false,
  onToggle,
  cardRef,
}) => {
  const phase = getPhaseById(tier.phase);
  const hasWatchlist = tierHasWatchlistExposure(tier);
  const tickers = getTickersForTier(tier.tier);

  return (
    <article
      ref={cardRef}
      id={`tier-${tier.tier}`}
      className={`glass-panel rounded-xl overflow-hidden scroll-mt-28 transition-all duration-300 ${
        tier.essential ? "vc-tier-card--essential" : "vc-tier-card--normal"
      } ${hasWatchlist ? "vc-tier-card--watchlist" : ""} ${
        expanded ? "border-sigil-gold/25" : ""
      } ${highlighted ? "vc-tier-card--highlight" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full text-left group min-h-[44px] ${
          tier.essential ? "p-3.5 sm:p-5" : "p-3 sm:p-4"
        }`}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span
            className={`shrink-0 rounded-lg flex items-center justify-center font-mono font-bold border ${
              tier.essential
                ? "w-8 h-8 sm:w-9 sm:h-9 text-[11px] sm:text-xs"
                : "w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-[11px]"
            }`}
            style={{
              color: phase?.color ?? "#a0a0a0",
              borderColor: `${phase?.color ?? "#a0a0a0"}44`,
              backgroundColor: `${phase?.color ?? "#a0a0a0"}11`,
            }}
          >
            T{tier.tier}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
              <h4
                className={`leading-snug ${
                  tier.essential
                    ? "text-[13px] sm:text-sm font-semibold text-white"
                    : "text-xs sm:text-[13px] font-medium text-white/75"
                }`}
              >
                {tier.name}
              </h4>
              {tier.essential && <EssentialBadge />}
            </div>
            {tickers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {tickers.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-sigil-gold/30 text-sigil-gold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 mb-1 leading-relaxed">
              {tier.subtitle}
              {!compactPhase && phase ? ` · ${phase.label}` : ""}
            </p>
            <p
              className={`text-xs text-[#a0a0a0] leading-relaxed ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {tier.role}
            </p>
          </div>
          {expanded ? (
            <ChevronDown size={16} className="text-sigil-gold shrink-0 mt-0.5" />
          ) : (
            <ChevronRight
              size={16}
              className="text-slate-500 group-hover:text-slate-300 shrink-0 mt-0.5"
            />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 space-y-3 border-t border-white/6 pt-3 sm:pt-4">
          <DetailBlock label="Key players">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {tier.players.map((player) => (
                <span
                  key={player.name}
                  className="inline-flex flex-col gap-0.5 rounded-lg border border-white/8 bg-[#1a1a1a] px-2.5 py-1.5 sm:max-w-[280px]"
                >
                  <span className="text-xs font-semibold text-white">
                    {player.name}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-relaxed">
                    {player.note}
                  </span>
                </span>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock label="Moat">
            <p className="text-xs text-slate-400 leading-relaxed">{tier.moat}</p>
          </DetailBlock>

          <DetailBlock
            label="Bottleneck"
            accent="border-l-2 border-l-amber-500/60 pl-3"
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              {tier.bottleneck}
            </p>
          </DetailBlock>

          <DetailBlock label="Key metric">
            <p className="text-xs font-mono text-sigil-gold/90 leading-relaxed break-words">
              {tier.metric}
            </p>
          </DetailBlock>

          <DetailBlock
            label="Investment angle"
            accent="border-l-2 border-l-sigil-gold/40 pl-3"
          >
            <p className="text-xs text-[#a0a0a0] leading-relaxed">
              {tier.sigil_angle}
            </p>
          </DetailBlock>
        </div>
      )}
    </article>
  );
};

export default TierCard;
