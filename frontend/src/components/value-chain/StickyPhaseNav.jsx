import { PHASES } from "../../data/aiInfraData.js";

const StickyPhaseNav = ({ activePhaseId, onPhaseClick }) => (
  <nav
    className="vc-sticky-phase-nav"
    aria-label="Stack position by phase"
  >
    <span className="vc-sticky-phase-nav__label">Stack position</span>
    {PHASES.map((phase) => {
      const active = activePhaseId === phase.id;
      return (
        <button
          key={phase.id}
          type="button"
          onClick={() => onPhaseClick(phase.id)}
          className={`vc-sticky-phase-chip${active ? " vc-sticky-phase-chip--active" : ""}`}
          style={
            active
              ? { backgroundColor: phase.color, color: "#000", borderColor: phase.color }
              : undefined
          }
          aria-current={active ? "true" : undefined}
        >
          {phase.label}
        </button>
      );
    })}
  </nav>
);

export default StickyPhaseNav;
