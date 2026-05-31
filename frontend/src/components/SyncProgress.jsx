import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  { label: "Scanning global news feeds", seconds: 8 },
  { label: "Fetching live price data", seconds: 6 },
  { label: "Mapping signals across 7 themes", seconds: 9 },
  { label: "Running AI analysis on 20 tickers", seconds: 12 },
  { label: "Generating weekly intelligence brief", seconds: 9 },
];

const TOTAL_ESTIMATE = STEPS.reduce((sum, s) => sum + s.seconds, 0);

const MESSAGES = [
  "Patience is the edge. Let the data breathe.",
  "Good signals are worth the wait.",
  "Claude is reading the market tea leaves.",
  "Alpha takes time. The market doesn't rush.",
  "Synthesizing thesis across all positions...",
  "Cross-referencing news with your 7 themes.",
];

export default function SyncProgress() {
  const [elapsed, setElapsed] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const rotate = setInterval(
      () => setMessageIdx((i) => (i + 1) % MESSAGES.length),
      4000
    );
    return () => clearInterval(rotate);
  }, []);

  // Figure out which step is currently active
  let cumulative = 0;
  const activeStep = STEPS.findIndex((step) => {
    cumulative += step.seconds;
    return elapsed < cumulative;
  });
  // If elapsed has passed all steps, clamp to last
  const currentStep = activeStep === -1 ? STEPS.length - 1 : activeStep;

  const remaining = TOTAL_ESTIMATE - elapsed;
  const overdue = remaining <= 0;

  return (
    <div className="glass-panel border-sigil-gold/25 rounded-2xl p-5">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-2.5 rounded-xl bg-sigil-gold/10 border border-sigil-gold/20 shrink-0 mt-0.5">
          <Loader2 size={18} className="text-sigil-gold animate-spin" />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Title + timer row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white leading-snug">
                Syncing live market intelligence
              </h3>
              <p className="text-[11px] font-mono text-sigil-gold/60 mt-0.5 truncate">
                {MESSAGES[messageIdx]}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-mono font-bold text-sigil-gold tabular-nums">
                {elapsed}s
              </p>
              <p className="text-[10px] font-mono text-slate-600 tabular-nums">
                {overdue ? "almost there…" : `~${remaining}s left`}
              </p>
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-1.5">
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 ${
                      done
                        ? "bg-emerald-400"
                        : active
                          ? "bg-sigil-gold animate-pulse"
                          : "bg-slate-700"
                    }`}
                  />
                  <span
                    className={`text-xs font-mono transition-colors duration-500 ${
                      done
                        ? "text-emerald-400/60 line-through decoration-emerald-400/40"
                        : active
                          ? "text-sigil-gold"
                          : "text-slate-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sigil-gold/60 rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${Math.min(100, (elapsed / TOTAL_ESTIMATE) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
