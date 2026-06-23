import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Brain,
  ChevronDown,
  FileText,
  LineChart,
  Newspaper,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

const TOUR_DISMISSED_KEY = "supernova-dashboard-tour-dismissed";

const PANELS = [
  {
    icon: FileText,
    label: "Analyst Brief",
    text: "Start here — a short AI summary of the strongest signals found in the current news pull.",
  },
  {
    icon: ShieldAlert,
    label: "Stress test",
    text: "Live adversarial pass on today's headlines, or hypothetical macro scenarios — two tabs in one zone.",
  },
  {
    icon: Activity,
    label: "Thesis Radar",
    text: "All seven pillars with a headline preview on each row — click for full evidence.",
  },
  {
    icon: Sparkles,
    label: "Watchlist",
    text: "21 public names with price data and a short note tied to each company angle.",
  },
  {
    icon: SearchCheck,
    label: "Research Queue",
    text: "3–7 follow-ups on what to read, verify, or search next based on this sync.",
  },
];

const DATA_FLOW = [
  { icon: Newspaper, name: "NewsAPI", detail: "Headlines per theme" },
  { icon: LineChart, name: "Yahoo", detail: "Live prices" },
  { icon: Brain, name: "Claude", detail: "Summaries + scoring" },
];

const readTourDismissed = () => {
  try {
    return localStorage.getItem(TOUR_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};

const WhatIsThis = () => {
  const [expanded, setExpanded] = useState(() => !readTourDismissed());

  const dismiss = () => {
    setExpanded(false);
    try {
      localStorage.setItem(TOUR_DISMISSED_KEY, "1");
    } catch {
      /* private browsing */
    }
  };

  const reopen = () => setExpanded(true);

  if (!expanded) {
    return (
      <section className="dashboard-tour-bar" aria-label="Dashboard overview">
        <p className="text-sm text-[#a0a0a0]">
          Thesis-aware demo · sync for live headlines and AI summaries
        </p>
        <button
          type="button"
          onClick={reopen}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sigil-gold/80 hover:text-sigil-gold transition-colors shrink-0"
        >
          How this works
          <ChevronDown size={12} />
        </button>
      </section>
    );
  }

  return (
    <section className="hero-guide rounded-2xl border border-sigil-gold/20 overflow-hidden">
      <div className="hero-guide__accent" aria-hidden="true" />

      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-sigil-gold/90">
            Supernova thesis · intelligence demo
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1 text-[11px] font-semibold text-[#a0a0a0] hover:text-white hover:border-white/20 transition-colors shrink-0"
            aria-label="Dismiss tour"
          >
            <X size={12} />
            Got it
          </button>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white leading-snug max-w-3xl">
          Active crypto hedge fund strategies — applied to Supernova thesis monitoring.
        </h2>

        <p className="mt-3 text-sm text-[#a0a0a0] max-w-3xl leading-relaxed">
          A live demo for tracking Sigil&apos;s seven investment themes across news,
          prices, and watchlist companies. Sync to pull headlines, compare against
          thesis notes, and generate AI summaries.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/mastery-guide" className="btn-sigil-primary">
            Open Learning Hub
          </Link>
          <a
            href="https://sigil.fund/insights"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sigil-outline"
          >
            Read Sigil insights
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PANELS.map(({ icon: Icon, label, text }) => (
            <div
              key={label}
              className="glass-panel glass-panel-hover rounded-xl p-3.5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className="text-sigil-gold shrink-0" />
                <span className="text-[11px] font-mono font-semibold text-white uppercase tracking-wide">
                  {label}
                </span>
              </div>
              <p className="text-xs text-[#a0a0a0] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4 border-t border-white/5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a0a0a0] shrink-0">
            Data pipeline
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#a0a0a0]">
            {DATA_FLOW.map(({ icon: Icon, name, detail }, index) => (
              <span key={name} className="flex items-center gap-2">
                {index > 0 && (
                  <ArrowRight size={12} className="text-[#a0a0a0]/50 shrink-0" />
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a1a] border border-white/8">
                  <Icon size={12} className="text-sigil-gold/70" />
                  <span className="font-medium text-white">{name}</span>
                  <span className="text-[#a0a0a0] hidden sm:inline">· {detail}</span>
                </span>
              </span>
            ))}
            <ArrowRight size={12} className="text-[#a0a0a0]/50 shrink-0 hidden sm:block" />
            <span className="text-[#a0a0a0] font-mono text-[11px]">this dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsThis;
