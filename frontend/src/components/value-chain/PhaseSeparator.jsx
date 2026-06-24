import { forwardRef } from "react";

const PhaseSeparator = forwardRef(function PhaseSeparator({ phase }, ref) {
  return (
    <div
      ref={ref}
      id={`vc-phase-sep-${phase.id}`}
      className="vc-phase-separator scroll-mt-36"
      data-phase-id={phase.id}
      style={{ "--vc-phase-color": phase.color }}
    >
      <div className="vc-phase-separator__inner">
        <span className="vc-phase-separator__label">{phase.label}</span>
        <h3 className="vc-phase-separator__name">{phase.name}</h3>
        <p className="vc-phase-separator__thesis">{phase.thesisRole}</p>
      </div>
    </div>
  );
});

export default PhaseSeparator;
