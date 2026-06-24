import { forwardRef } from "react";

const PhaseSeparator = forwardRef(function PhaseSeparator({ phase }, ref) {
  return (
    <div
      ref={ref}
      id={`vc-phase-sep-${phase.id}`}
      className="vc-phase-separator scroll-mt-32"
      data-phase-id={phase.id}
    >
      <div className="vc-phase-separator__line" aria-hidden="true" />
      <span
        className="vc-phase-separator__label"
        style={{
          backgroundColor: `${phase.color}22`,
          color: phase.color,
          borderColor: `${phase.color}55`,
        }}
      >
        {phase.label} — {phase.name}
      </span>
      <span className="vc-phase-separator__thesis">{phase.thesisRole}</span>
      <div className="vc-phase-separator__line" aria-hidden="true" />
    </div>
  );
});

export default PhaseSeparator;
