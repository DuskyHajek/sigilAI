import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { PHASES } from "../../data/aiInfraData.js";

const PhaseCard = ({ phase, active, onSelect }) => {
  const [showInsight, setShowInsight] = useState(false);
  const tierLabel = `T${phase.tierRange[0]}–${phase.tierRange[1]}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(phase.id)}
      onMouseEnter={() => setShowInsight(true)}
      onMouseLeave={() => setShowInsight(false)}
      onFocus={() => setShowInsight(true)}
      onBlur={() => setShowInsight(false)}
      className={`text-left rounded-xl p-3 sm:p-4 border transition-all min-w-[220px] sm:min-w-0 snap-start shrink-0 sm:shrink ${
        active
          ? "border-white/20 bg-white/[0.04]"
          : "border-white/8 bg-[#121212] hover:border-white/15 hover:bg-white/[0.02]"
      }`}
      style={{ borderLeftWidth: 3, borderLeftColor: phase.color }}
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
      {showInsight && (
        <p className="mt-2 pt-2 border-t border-white/6 text-[11px] text-slate-400 leading-relaxed line-clamp-4">
          {phase.insight}
        </p>
      )}
    </button>
  );
};

const StackMap = ({ activePhaseId, onPhaseSelect }) => (
  <div className="space-y-4">
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:snap-none">
        {PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            active={activePhaseId === phase.id}
            onSelect={onPhaseSelect}
          />
        ))}
      </div>
      <p className="text-[10px] font-mono text-slate-600 mt-1 flex items-center gap-1 lg:hidden">
        <ChevronRight size={10} aria-hidden="true" />
        Scroll phases
      </p>
    </div>
  </div>
);

export default StackMap;
