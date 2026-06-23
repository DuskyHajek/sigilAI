import { useMemo, useRef, useEffect } from "react";
import { PHASES } from "../../data/aiInfraData.js";
import { filterTiers } from "../../utils/valueChainUtils.js";
import { SearchInput } from "../learning/LearningUI";
import { filterBtn } from "../learning/learningStyles";
import TierCard from "./TierCard.jsx";

const TierExplorer = ({
  phaseId,
  essentialOnly,
  watchlistOnly,
  query,
  expandedTier,
  onPhaseChange,
  onEssentialChange,
  onWatchlistChange,
  onQueryChange,
  onTierToggle,
}) => {
  const tierRefs = useRef({});

  const filtered = useMemo(
    () =>
      filterTiers({
        phaseId,
        essentialOnly,
        watchlistOnly,
        query,
      }),
    [phaseId, essentialOnly, watchlistOnly, query]
  );

  useEffect(() => {
    if (expandedTier == null) return;
    const node = tierRefs.current[expandedTier];
    if (!node) return;
    window.requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [expandedTier, filtered.length]);

  return (
    <div className="space-y-4">
      <div className="vc-filter-track sm:flex-wrap">
        <button
          type="button"
          onClick={() => onPhaseChange(null)}
          className={`${filterBtn(!phaseId)} shrink-0 snap-start`}
        >
          All phases
        </button>
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onPhaseChange(phase.id)}
            className={`${filterBtn(phaseId === phase.id)} shrink-0 snap-start`}
            style={
              phaseId === phase.id
                ? { backgroundColor: phase.color, color: "#000" }
                : undefined
            }
          >
            {phase.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => onEssentialChange(!essentialOnly)}
          className={filterBtn(essentialOnly)}
        >
          {essentialOnly ? "Show all tiers" : "⚡ Essentials only"}
        </button>
        <button
          type="button"
          onClick={() => onWatchlistChange(!watchlistOnly)}
          className={filterBtn(watchlistOnly)}
        >
          {watchlistOnly ? "Show all tiers" : "🔖 Watchlist only"}
        </button>
        <span className="text-[10px] font-mono text-slate-600">
          {filtered.length} tier{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <SearchInput
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search tiers, players, bottlenecks…"
      />

      <div className="space-y-3">
        {filtered.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            expanded={expandedTier === tier.tier}
            onToggle={() =>
              onTierToggle(expandedTier === tier.tier ? null : tier.tier)
            }
            cardRef={(el) => {
              if (el) tierRefs.current[tier.tier] = el;
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-10">
            No tiers match the current filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default TierExplorer;
