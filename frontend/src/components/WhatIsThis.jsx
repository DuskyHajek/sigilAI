import { Activity, ArrowRight, Brain, FileText, FlaskConical, LineChart, Newspaper, SearchCheck, ShieldAlert, Sparkles } from "lucide-react";

const PANELS = [
  {
    icon: FileText,
    label: "01 · Analyst Brief",
    text: "Start here — a short AI summary of the strongest signals found in the current news pull.",
  },
  {
    icon: ShieldAlert,
    label: "01b · Challenge the Thesis",
    text: "Adversarial pass on today's headlines — bear cases, blind spots, and counter-indicators.",
  },
  {
    icon: FlaskConical,
    label: "01c · Thesis Stress Tester",
    text: "Hypothetical “what if” scenarios — see all 7 pillars and watchlist exposure without waiting for news.",
  },
  {
    icon: Activity,
    label: "02 · Thesis Radar",
    text: "All seven pillars with a headline preview on each row — click for full evidence.",
  },
  {
    icon: Sparkles,
    label: "03 · Watchlist",
    text: "21 public names with price data and a short note tied to each company angle.",
  },
  {
    icon: SearchCheck,
    label: "04 · Research Queue",
    text: "3–7 follow-ups on what to read, verify, or search next based on this sync.",
  },
];

const DATA_FLOW = [
  { icon: Newspaper, name: "NewsAPI", detail: "Headlines per theme" },
  { icon: LineChart, name: "Yahoo", detail: "Live prices" },
  { icon: Brain, name: "Claude", detail: "Summaries + scoring" },
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
          A small live demo for tracking Sigil&apos;s Supernova themes across news,
          prices, and watchlist companies.
        </h2>

        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          It pulls recent headlines, compares them with the thesis notes in the
          config, and asks Claude for short summaries. The point is not perfect
          research automation — it is a quick, transparent way to monitor what
          deserves a closer analyst look.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
