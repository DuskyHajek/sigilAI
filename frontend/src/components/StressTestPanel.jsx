import { useEffect, useState } from "react";
import {
  FlaskConical,
  Loader2,
  X,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Eye,
  Layers,
  LineChart,
} from "lucide-react";
import { fetchStressScenarios, runStressTest } from "../api";
import { STRESS_SCENARIOS } from "@config/stressScenarios.js";
import {
  SCENARIO_CATEGORY_STYLES,
  VIEW_MODES,
} from "../utils/stressDisplay.js";
import "../styles/stress-test.css";

const STEPS = [
  {
    num: "1",
    title: "Pick a scenario",
    text: "Choose a macro “what if” — memo bear cases and bull tests included.",
  },
  {
    num: "2",
    title: "Read 7 pillar impacts",
    text: "Each theme gets Bullish / Neutral / Bearish plus why — in Thesis Radar below.",
  },
  {
    num: "3",
    title: "Check ticker exposure",
    text: "See which watchlist names are most exposed vs most resilient.",
  },
];

const OUTPUT_TILES = [
  {
    icon: Layers,
    title: "Pillar impact",
    text: "All 7 themes scored for this scenario — structural, timing, or sentiment.",
  },
  {
    icon: LineChart,
    title: "Ticker exposure",
    text: "Top 3 exposed and top 3 resilient names from the 21-name watchlist.",
  },
  {
    icon: Eye,
    title: "Counter-indicators",
    text: "Signals that would prove this stress read wrong — expand a pillar for detail.",
  },
];

const categoryStyle = (category, active) => {
  const styles = SCENARIO_CATEGORY_STYLES[category] || SCENARIO_CATEGORY_STYLES.technology;
  return active ? styles.chipActive : styles.chip;
};

const StressTestPanel = ({
  stressState,
  onStressStateChange,
  isMock,
  embedded = false,
  compactResults = false,
}) => {
  const [scenarios, setScenarios] = useState(
    STRESS_SCENARIOS.map(
      ({ id, label, shortDescription, category, memoRef }) => ({
        id,
        label,
        shortDescription,
        category,
        memoRef,
      })
    )
  );

  useEffect(() => {
    let cancelled = false;
    fetchStressScenarios()
      .then((data) => {
        if (!cancelled) setScenarios(data.scenarios ?? []);
      })
      .catch(() => {
        /* keep bundled STRESS_SCENARIOS fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { status, scenarioId, result, viewMode, error } = stressState;
  const isLoading = status === "loading";
  const isActive = status === "ready" && result;

  const handleSelect = async (id) => {
    if (isLoading) return;
    if (scenarioId === id && isActive) return;

    onStressStateChange({
      status: "loading",
      scenarioId: id,
      result: null,
      viewMode: "split",
      error: null,
    });

    try {
      const data = await runStressTest(id);
      onStressStateChange({
        status: "ready",
        scenarioId: id,
        result: data,
        viewMode: "split",
        error: null,
      });
    } catch (err) {
      onStressStateChange({
        status: "error",
        scenarioId: id,
        result: null,
        viewMode: "split",
        error: err.message || "Stress test failed",
      });
    }
  };

  const handleClear = () => {
    onStressStateChange({
      status: "idle",
      scenarioId: null,
      result: null,
      viewMode: "live",
      error: null,
    });
  };

  const setViewMode = (mode) => {
    onStressStateChange({ ...stressState, viewMode: mode });
  };

  const sourceLabel =
    result?.source === "mock" || isMock
      ? "Demo stress read"
      : result?.cached
        ? "Cached · Claude"
        : "Claude · thesis stress";

  const panelClass = embedded
    ? "stress-panel flex flex-col gap-4"
    : "stress-panel glass-panel border border-sigil-gold/15 rounded-2xl p-5 md:p-6";

  return (
    <section className={panelClass}>
      <div className="flex flex-col gap-4">
        {!embedded && (
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
                Counterfactual
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <FlaskConical size={17} className="text-sigil-gold shrink-0" />
                <h2 className="text-lg font-semibold text-slate-100">
                  Thesis Stress Tester
                </h2>
                {isActive && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border text-sigil-gold/90 border-sigil-gold/25 bg-sigil-gold/5">
                    {sourceLabel}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed max-w-3xl">
                Hypothetical &ldquo;what if&rdquo; simulator — pick a macro shock
                and see how all seven pillars and watchlist names respond.
              </p>
            </div>

            {isActive && !compactResults && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-mono uppercase tracking-wide text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
              >
                <X size={13} />
                Clear scenario
              </button>
            )}
          </div>
        )}

        {embedded && (
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick a macro shock — impacts appear in Radar and Watchlist below.
            </p>
            {isActive && compactResults && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border text-sigil-gold/90 border-sigil-gold/25 shrink-0">
                {sourceLabel}
              </span>
            )}
          </div>
        )}

        {!isActive && !embedded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div key={step.num} className="stress-step rounded-xl border border-slate-800/80 bg-slate-950/30 px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <span className="stress-step__num">{step.num}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-200">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
            Scenarios
          </p>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((scenario) => {
              const active = scenarioId === scenario.id && isActive;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelect(scenario.id)}
                  title={scenario.shortDescription}
                  className={`stress-chip px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${categoryStyle(scenario.category, active)} ${
                    active ? "ring-1 ring-sigil-gold/30" : "bg-slate-950/40"
                  }`}
                >
                  {isLoading && scenarioId === scenario.id ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      {scenario.label}
                    </span>
                  ) : (
                    scenario.label
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {isActive && (
          <div className="space-y-4">
            <div className={`stress-result-card rounded-xl p-4 ${compactResults ? "border border-slate-800/80 bg-transparent" : ""}`}>
              <p className="text-[10px] font-mono uppercase tracking-wide text-sigil-gold/80 mb-1">
                Portfolio read · {result.scenarioLabel}
              </p>
              <p className="text-sm font-semibold text-slate-100 leading-snug">
                {result.summaryLine}
              </p>
              {!compactResults && (
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {result.portfolioRead}
                </p>
              )}
              {result.memoRef && !compactResults && (
                <p className="mt-2 text-[10px] font-mono text-slate-600">
                  Memo · {result.memoRef}
                </p>
              )}

              {!compactResults && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 shrink-0">
                    Radar view
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {VIEW_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        title={mode.hint}
                        onClick={() => setViewMode(mode.id)}
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
                </div>
              )}
            </div>

            {!compactResults && (
              <>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                What you get
              </p>
              <div className="stress-output-grid">
                {OUTPUT_TILES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="stress-output-tile">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className="text-sigil-gold/80 shrink-0" />
                      <span className="text-[10px] font-mono uppercase tracking-wide text-slate-300">
                        {title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="stress-ticker-strip">
              <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.04] p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <ArrowDownRight size={13} className="text-rose-400" />
                  <p className="text-[10px] font-mono uppercase tracking-wide text-rose-400/90">
                    Most exposed
                  </p>
                </div>
                <ul className="space-y-2">
                  {(result.tickerExposure?.mostExposed ?? []).map((row) => (
                    <li key={row.ticker} className="min-w-0">
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {row.ticker}
                      </span>
                      <span className="ml-2 text-[9px] font-mono uppercase text-rose-400/70">
                        {row.exposure}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {row.rationale}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <ArrowUpRight size={13} className="text-emerald-400" />
                  <p className="text-[10px] font-mono uppercase tracking-wide text-emerald-400/90">
                    Most resilient
                  </p>
                </div>
                <ul className="space-y-2">
                  {(result.tickerExposure?.mostResilient ?? []).map((row) => (
                    <li key={row.ticker} className="min-w-0">
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {row.ticker}
                      </span>
                      <span className="ml-2 text-[9px] font-mono uppercase text-emerald-400/70">
                        {row.exposure}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {row.rationale}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {(result.counterIndicators?.length ?? 0) > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Eye size={12} className="text-slate-500" />
                  <p className="text-[10px] font-mono uppercase tracking-wide text-slate-400">
                    Counter-indicators to watch
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {result.counterIndicators.map((item) => (
                    <li
                      key={item}
                      className="text-[11px] text-slate-500 leading-relaxed flex gap-2"
                    >
                      <Minus size={10} className="text-slate-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
              Hypothetical thesis read — not investment advice. Compare{" "}
              <span className="text-slate-500">Both</span> view with today&apos;s
              live drift to spot confirmation bias.
            </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StressTestPanel;
