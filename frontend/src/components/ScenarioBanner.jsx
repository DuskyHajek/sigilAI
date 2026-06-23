import { X } from "lucide-react";
import { VIEW_MODES } from "../utils/stressDisplay.js";

const ScenarioBanner = ({ stressState, onClear, onViewModeChange }) => {
  const { result, viewMode } = stressState;

  if (!result) return null;

  return (
    <div
      className="scenario-banner rounded-xl border border-sigil-gold/25 bg-sigil-gold/[0.04] px-4 py-3"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/90 mb-0.5">
            Active scenario
          </p>
          <p className="text-sm text-slate-200 leading-snug">
            <span className="font-semibold text-slate-100">
              {result.scenarioLabel}
            </span>
            {result.summaryLine ? (
              <span className="text-slate-400"> — {result.summaryLine}</span>
            ) : null}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Pillar impacts and ticker exposure are reflected in Radar and
            Watchlist below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex flex-wrap gap-1">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                title={mode.hint}
                onClick={() => onViewModeChange(mode.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wide border transition-colors ${
                  viewMode === mode.id
                    ? "bg-sigil-gold/10 text-sigil-gold border-sigil-gold/35"
                    : "bg-slate-950/50 text-slate-500 border-slate-800 hover:text-slate-300"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-700 text-[10px] font-mono uppercase tracking-wide text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
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
