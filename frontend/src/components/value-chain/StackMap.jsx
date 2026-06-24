import { ChevronRight } from "lucide-react";
import { PHASES } from "../../data/aiInfraData.js";

const PhaseCard = ({ phase, active, onSelect }) => {
  const tierLabel = `T${phase.tierRange[0]}–${phase.tierRange[1]}`;
  const tierCount = phase.tierRange[1] - phase.tierRange[0] + 1;

  return (
    <button
      type="button"
      onClick={() => onSelect(phase.id)}
      className={`vc-phase-card${active ? " vc-phase-card--active" : ""}`}
      style={{ "--vc-phase-color": phase.color }}
      aria-pressed={active}
      aria-label={`${phase.label}: ${phase.name}, tiers ${tierLabel}`}
    >
      <div className="vc-phase-card__head">
        <span className="vc-phase-card__label">{phase.label}</span>
        <span className="vc-phase-card__tiers">{tierLabel}</span>
      </div>
      <p className="vc-phase-card__name">{phase.name}</p>
      <p className="vc-phase-card__focus">{phase.focus}</p>
      <span className="vc-phase-card__count">
        {tierCount} tier{tierCount === 1 ? "" : "s"}
      </span>
    </button>
  );
};

const StackMap = ({ activePhaseId, onPhaseSelect }) => {
  const activePhase = PHASES.find((p) => p.id === activePhaseId);

  return (
    <div className="space-y-3">
      <div className="vc-phase-track-wrap">
        <div className="vc-phase-track" role="list">
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
          className="vc-phase-insight"
          style={{ "--vc-phase-color": activePhase.color }}
        >
          <p className="vc-phase-insight__label">
            {activePhase.label} · insight
          </p>
          <p className="vc-phase-insight__text">{activePhase.insight}</p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-600 leading-relaxed px-0.5">
          Select a phase to see its strategic insight and filter tiers below.
        </p>
      )}
    </div>
  );
};

export default StackMap;
