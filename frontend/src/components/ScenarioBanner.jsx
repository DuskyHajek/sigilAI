import { X } from "lucide-react";
import { VIEW_MODES } from "../utils/stressDisplay.js";
import { filterBtn } from "./learning/learningStyles";

const ScenarioBanner = ({ stressState, onClear, onViewModeChange }) => {
  const { result, viewMode } = stressState;

  if (!result) return null;

  return (
    <div
      className="scenario-banner rounded-xl border border-white/8 bg-[#1a1a1a] px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#a0a0a0] mb-0.5">
            Active scenario
          </p>
          <p className="text-sm text-white leading-snug">
            <span className="font-semibold">{result.scenarioLabel}</span>
            {result.summaryLine ? (
              <span className="text-[#a0a0a0]"> — {result.summaryLine}</span>
            ) : null}
          </p>
          <p className="text-[11px] text-[#a0a0a0] mt-1">
            Impacts reflected in Radar and Watchlist below.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center w-full lg:w-auto lg:shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                title={mode.hint}
                onClick={() => onViewModeChange(mode.id)}
                className={filterBtn(viewMode === mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-semibold uppercase tracking-wide text-[#a0a0a0] hover:text-white hover:border-white/20 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBanner;
