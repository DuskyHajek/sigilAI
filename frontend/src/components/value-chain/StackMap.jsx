import { ChevronRight } from "lucide-react";
import { PHASES } from "../../data/aiInfraData.js";

const PhaseCard = ({ phase, active, onSelect }) => {
  const tierLabel = `T${phase.tierRange[0]}–${phase.tierRange[1]}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(phase.id)}
      className={`vc-phase-card text-left rounded-xl p-3 sm:p-4 border min-w-[min(280px,82vw)] sm:min-w-[240px] lg:min-w-0 snap-center shrink-0 lg:shrink ${
        active
          ? "vc-phase-card--active border-white/25 bg-white/[0.05]"
          : "border-white/8 bg-[#121212]"
      }`}
      style={{ borderLeftWidth: 3, borderLeftColor: phase.color }}
      aria-pressed={active}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-widest"
          style={{ color: phase.color }}
        >
          {phase.label}
        </span>
        <span className="text-[10px] font-mono text-white/40 shrink-0">
          {tierLabel}
        </span>
      </div>
      <p className="text-xs font-semibold text-white leading-snug mb-1 line-clamp-2">
        {phase.name}
      </p>
      <p className="text-[11px] text-[#a0a0a0] leading-relaxed line-clamp-2">
        {phase.thesisRole}
      </p>
    </button>
  );
};

const StackMap = ({ activePhaseId, onPhaseSelect }) => {
  const activePhase = PHASES.find((p) => p.id === activePhaseId);

  return (
    <div className="space-y-3">
      <div className="vc-phase-track-wrap">
        <div className="vc-phase-track lg:grid lg:grid-cols-4 lg:gap-3 lg:overflow-visible">
          {PHASES.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              active={activePhaseId === phase.id}
              onSelect={onPhaseSelect}
            />
          ))}
        </div>
        <p className="text-[10px] font-mono text-slate-600 mt-2 flex items-center gap-1 lg:hidden">
          <ChevronRight size={10} aria-hidden="true" />
          Swipe phases · tap to filter tiers
        </p>
      </div>

      {activePhase ? (
        <div
          className="vc-phase-insight rounded-xl border border-white/8 bg-white/[0.02] px-3 sm:px-4 py-3"
          style={{ borderLeftWidth: 3, borderLeftColor: activePhase.color }}
        >
          <p
            className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5"
            style={{ color: activePhase.color }}
          >
            {activePhase.label} · insight
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activePhase.insight}
          </p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-600 leading-relaxed px-0.5">
          Select a phase above to see its strategic insight and filter tiers
          below.
        </p>
      )}
    </div>
  );
};

export default StackMap;
