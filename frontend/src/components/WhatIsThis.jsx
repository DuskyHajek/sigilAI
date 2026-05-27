import { Activity, ArrowRight, Brain, FileText, LineChart, Newspaper, Sparkles } from "lucide-react";

const PANELS = [
  {
    icon: FileText,
    label: "01 · Analyst Brief",
    text: "Start here — a 3-sentence CIO note: top signal, secondary watch, counter-thesis risk.",
  },
  {
    icon: Activity,
    label: "02 · Theme Pulse",
    text: "Which themes are active today — and is the news good or bad for the Supernova thesis?",
  },
  {
    icon: Sparkles,
    label: "03 · Watchlist",
    text: "20 curated tickers. Price + one SIGIL AI line on why this week matters for each angle.",
  },
];

const DATA_FLOW = [
  { icon: Newspaper, name: "NewsAPI", detail: "Headlines per theme" },
  { icon: LineChart, name: "Yahoo", detail: "Live prices" },
  { icon: Brain, name: "Claude", detail: "Thesis-filtered analysis" },
];

const WhatIsThis = () => {
  return (
    <section className="hero-guide rounded-2xl border border-sigil-gold/20 overflow-hidden">
      <div className="hero-guide__accent" aria-hidden="true" />

      <div className="relative p-5 md:p-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-sigil-gold/90 mb-2">
          Supernova thesis · intelligence demo
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-white leading-snug max-w-3xl">
          Not a news feed. A thesis lens on disruptive tech — built around Sigil&apos;s
          7-theme framework.
        </h2>

        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          Every headline is classified, scored, and explained through the Supernova
          investment memo — the same way an analyst would filter signal from noise.
          Click{" "}
          <span className="text-sigil-gold font-medium">Sync</span> to pull fresh data.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {PANELS.map(({ icon: Icon, label, text }) => (
            <div
              key={label}
              className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className="text-sigil-gold shrink-0" />
                <span className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wide">
                  {label}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4 border-t border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 shrink-0">
            Data pipeline
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {DATA_FLOW.map(({ icon: Icon, name, detail }, index) => (
              <span key={name} className="flex items-center gap-2">
                {index > 0 && (
                  <ArrowRight size={12} className="text-slate-600 shrink-0" />
                )}
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800">
                  <Icon size={12} className="text-slate-500" />
                  <span className="font-medium text-slate-300">{name}</span>
                  <span className="text-slate-500 hidden sm:inline">· {detail}</span>
                </span>
              </span>
            ))}
            <ArrowRight size={12} className="text-slate-600 shrink-0 hidden sm:block" />
            <span className="text-slate-500 font-mono text-[11px]">this dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsThis;
