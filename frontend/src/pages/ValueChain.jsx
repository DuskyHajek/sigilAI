import { useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Layers } from "lucide-react";
import "../styles/value-chain.css";
import DashboardZone from "../components/DashboardZone";
import StackMap from "../components/value-chain/StackMap";
import ValueChainInfographic from "../components/value-chain/ValueChainInfographic";
import TierExplorer from "../components/value-chain/TierExplorer";
import WatchlistStack from "../components/value-chain/WatchlistStack";
import { TipBox } from "../components/learning/LearningUI";
import { PHASES, TIERS, WATCHLIST_TIER_MAP } from "../data/aiInfraData.js";
import {
  parseSearchParams,
  buildSearchParams,
} from "../utils/valueChainUtils.js";

export default function ValueChain() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams]
  );

  const updateParams = useCallback(
    (patch) => {
      const next = {
        phaseId:
          patch.phaseId !== undefined ? patch.phaseId : filters.phaseId,
        tierNumber:
          patch.tierNumber !== undefined
            ? patch.tierNumber
            : filters.tierNumber,
        essentialOnly:
          patch.essentialOnly !== undefined
            ? patch.essentialOnly
            : filters.essentialOnly,
        watchlistOnly:
          patch.watchlistOnly !== undefined
            ? patch.watchlistOnly
            : filters.watchlistOnly,
        query: patch.query !== undefined ? patch.query : filters.query,
      };
      setSearchParams(buildSearchParams(next), { replace: true });
    },
    [filters, setSearchParams]
  );

  const scrollToTiers = () => {
    document
      .getElementById("vc-tiers")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePhaseSelect = (phaseId) => {
    updateParams({
      phaseId: filters.phaseId === phaseId ? null : phaseId,
      tierNumber: null,
    });
    scrollToTiers();
  };

  const handleTierSelect = (tierNumber) => {
    updateParams({ tierNumber });
    scrollToTiers();
  };

  return (
    <main className="value-chain-page flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex flex-col min-w-0">
      <div className="hero-guide rounded-2xl p-3.5 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden border border-sigil-gold/10">
        <div className="hero-guide__accent" />
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">
              Sigil Supernova
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              AI Infrastructure Value Chain
            </h2>
            <p className="text-xs sm:text-sm text-[#a0a0a0] leading-relaxed">
              22 tiers · 7 phases · from raw earth to token monetisation
            </p>
            <p className="text-[11px] font-mono text-slate-600 mt-2 flex items-center gap-1.5">
              <Layers size={12} className="text-sigil-gold/60 shrink-0" />
              Structure before signals · Reference map for the physical stack
            </p>
            <Link
              to="/mastery-guide"
              className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-sigil-gold hover:underline"
            >
              <BookOpen size={12} aria-hidden="true" />
              Learn concepts in Learning Hub →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { value: String(PHASES.length), label: "Phases" },
              { value: String(TIERS.length), label: "Tiers" },
              {
                value: String(Object.keys(WATCHLIST_TIER_MAP).length),
                label: "Holdings",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center px-2 sm:px-4 py-2 rounded-xl bg-[#1a1a1a] border border-white/8"
              >
                <p className="text-lg sm:text-xl font-bold text-sigil-gold">
                  {stat.value}
                </p>
                <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-tight mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ValueChainInfographic />

      <DashboardZone id="vc-map" label="Stack map" className="mt-0">
        <div className="mb-4 rounded-xl border border-sigil-gold/25 bg-sigil-gold/[0.06] px-4 py-3.5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-sigil-gold mb-2">
            Start here
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every tier is a potential single point of failure. If one link jams,
            the global AI engine halts. This map traces the full physical stack —
            so you know where bottlenecks and holdings sit before diving into 22
            tiers.
          </p>
        </div>
        <TipBox icon={Layers}>
          Most investors stop at NVDA. Sigil tracks all 22 tiers — from Spruce
          Pine quartz to RAG infrastructure. Select a phase to filter the tier
          explorer.
        </TipBox>
        <StackMap
          activePhaseId={filters.phaseId}
          onPhaseSelect={handlePhaseSelect}
        />
      </DashboardZone>

      <DashboardZone id="vc-holdings" label="Holdings on the stack">
        <div className="vc-holdings-feature">
          <p className="vc-holdings-feature__lead">
            {Object.keys(WATCHLIST_TIER_MAP).length} of 21 watchlist names mapped
            to the physical stack — no other terminal maps tickers to
            supply-chain tier. Click to jump.
          </p>
          <WatchlistStack onTierSelect={handleTierSelect} />
        </div>
      </DashboardZone>

      <DashboardZone id="vc-tiers" label="Tier explorer">
        <TierExplorer
          phaseId={filters.phaseId}
          essentialOnly={filters.essentialOnly}
          watchlistOnly={filters.watchlistOnly}
          query={filters.query}
          expandedTier={filters.tierNumber}
          onPhaseChange={(phaseId) =>
            updateParams({ phaseId, tierNumber: null })
          }
          onEssentialChange={(essentialOnly) => updateParams({ essentialOnly })}
          onWatchlistChange={(watchlistOnly) => updateParams({ watchlistOnly })}
          onQueryChange={(query) => updateParams({ query, tierNumber: null })}
          onTierToggle={(tierNumber) =>
            updateParams({
              tierNumber:
                tierNumber === filters.tierNumber ? null : tierNumber,
            })
          }
        />
      </DashboardZone>
    </main>
  );
}
