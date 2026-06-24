import { Fragment, useMemo, useRef, useEffect, useState } from "react";
import { PHASES } from "../../data/aiInfraData.js";
import { filterTiers } from "../../utils/valueChainUtils.js";
import { SearchInput } from "../learning/LearningUI";
import { filterBtn } from "../learning/learningStyles";
import TierCard from "./TierCard.jsx";
import PhaseSeparator from "./PhaseSeparator.jsx";
import StickyPhaseNav from "./StickyPhaseNav.jsx";

const groupTiersByPhase = (tiers) =>
  PHASES.map((phase) => ({
    phase,
    tiers: tiers.filter((tier) => tier.phase === phase.id),
  })).filter((group) => group.tiers.length > 0);

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
  const separatorRefs = useRef({});
  const [highlightedTier, setHighlightedTier] = useState(null);
  const [activeScrollPhase, setActiveScrollPhase] = useState(null);

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

  const grouped = useMemo(() => groupTiersByPhase(filtered), [filtered]);
  const browsingAllPhases = !phaseId && !query.trim();
  const showPhaseChrome = browsingAllPhases && grouped.length > 1;

  useEffect(() => {
    if (!showPhaseChrome) {
      setActiveScrollPhase(null);
      return;
    }
    setActiveScrollPhase((current) => current ?? grouped[0]?.phase.id ?? null);
  }, [showPhaseChrome, grouped]);

  useEffect(() => {
    if (expandedTier == null) return;
    const node = tierRefs.current[expandedTier];
    if (!node) return;
    window.requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setHighlightedTier(expandedTier);
    const timer = window.setTimeout(() => setHighlightedTier(null), 2000);
    return () => window.clearTimeout(timer);
  }, [expandedTier, filtered.length]);

  useEffect(() => {
    if (!showPhaseChrome) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );

        const phaseIdFromEntry = visible[0]?.target?.dataset?.phaseId;
        if (phaseIdFromEntry) {
          setActiveScrollPhase(phaseIdFromEntry);
        }
      },
      {
        rootMargin: "-32% 0px -52% 0px",
        threshold: [0, 0.25, 0.5],
      }
    );

    grouped.forEach(({ phase }) => {
      const node = separatorRefs.current[phase.id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [showPhaseChrome, grouped]);

  const scrollToPhase = (targetPhaseId) => {
    const node = separatorRefs.current[targetPhaseId];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveScrollPhase(targetPhaseId);
  };

  return (
    <div className="space-y-4">
      {showPhaseChrome ? (
        <div className="vc-explorer-sticky">
          <StickyPhaseNav
            activePhaseId={activeScrollPhase}
            onPhaseClick={scrollToPhase}
          />
          <div className="vc-explorer-sticky__filters">
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
              {filtered.length} tiers
            </span>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}

      <SearchInput
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search tiers, players, bottlenecks…"
      />

      <div className="space-y-2.5">
        {grouped.map(({ phase, tiers }) => (
          <Fragment key={phase.id}>
            {showPhaseChrome && (
              <PhaseSeparator
                phase={phase}
                ref={(el) => {
                  if (el) separatorRefs.current[phase.id] = el;
                }}
              />
            )}
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                expanded={expandedTier === tier.tier}
                highlighted={highlightedTier === tier.tier}
                compactPhase={showPhaseChrome}
                onToggle={() =>
                  onTierToggle(expandedTier === tier.tier ? null : tier.tier)
                }
                cardRef={(el) => {
                  if (el) tierRefs.current[tier.tier] = el;
                }}
              />
            ))}
          </Fragment>
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
