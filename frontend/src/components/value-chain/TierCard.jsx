import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import EssentialBadge from "../learning/EssentialBadge";
import { getPhaseById, getTickersForTier } from "../../utils/valueChainUtils.js";

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
  onToggle,
  cardRef,
}) => {
  const phase = getPhaseById(tier.phase);
  const tickers = [
    ...new Set([
      ...getTickersForTier(tier.tier),
      ...(tier.watchlistTickers ?? []),
    ]),
  ];

  return (
    <article
      ref={cardRef}
      id={`tier-${tier.tier}`}
      className={`glass-panel rounded-xl overflow-hidden scroll-mt-28 transition-colors ${
        expanded ? "border-sigil-gold/25" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 group"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold border"
            style={{
              color: phase?.color ?? "#a0a0a0",
              borderColor: `${phase?.color ?? "#a0a0a0"}44`,
              backgroundColor: `${phase?.color ?? "#a0a0a0"}11`,
            }}
          >
            T{tier.tier}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h4 className="text-sm font-semibold text-white">{tier.name}</h4>
              {tier.essential && <EssentialBadge />}
              {tickers.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-sigil-gold/30 text-sigil-gold"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-mono text-slate-500 mb-1.5">
              {tier.subtitle}
              {phase ? ` · ${phase.label}` : ""}
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
            <ChevronDown size={16} className="text-sigil-gold shrink-0 mt-1" />
          ) : (
            <ChevronRight
              size={16}
              className="text-slate-500 group-hover:text-slate-300 shrink-0 mt-1"
            />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-white/6 pt-4">
          <DetailBlock label="Key players">
            <div className="flex flex-wrap gap-2">
              {tier.players.map((player) => (
                <span
                  key={player.name}
                  className="inline-flex flex-col gap-0.5 rounded-lg border border-white/8 bg-[#1a1a1a] px-2.5 py-1.5"
                >
                  <span className="text-xs font-semibold text-white">
                    {player.name}
                  </span>
                  <span className="text-[10px] text-slate-500">{player.note}</span>
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
            <p className="text-xs font-mono text-sigil-gold/90 leading-relaxed">
              {tier.metric}
            </p>
          </DetailBlock>

          <DetailBlock
            label="Sigil angle"
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
