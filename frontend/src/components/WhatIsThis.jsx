import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ChevronDown,
  FileText,
  Sparkles,
  X,
} from "lucide-react";

const TOUR_DISMISSED_KEY = "supernova-dashboard-tour-dismissed";

/** Core panels only — the rest is discoverable by scrolling */
const PANELS = [
  {
    icon: FileText,
    label: "Analyst Brief",
    text: "Start here — AI summary of the strongest signals from this sync.",
  },
  {
    icon: Activity,
    label: "Thesis Radar",
    text: "All seven pillars at a glance — drift status, headline count, and preview. Click More on any row for evidence and thesis scope.",
  },
  {
    icon: Sparkles,
    label: "Watchlist",
    text: "21 public names with live prices and a short note per company.",
  },
];

const WhatIsThis = () => {
  const [expanded, setExpanded] = useState(false);

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
        <p className="text-xs sm:text-sm text-[#a0a0a0] leading-relaxed">
          Supernova thesis demo · sync for headlines & AI summaries
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

      <div className="relative p-4 md:p-5">
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

        <p className="text-sm text-[#a0a0a0] max-w-2xl leading-relaxed">
          Track all seven investment themes across news, prices, and watchlist
          companies. Hit <span className="text-white font-medium">Sync</span> to
          refresh, or open the Learning Hub to study the thesis.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/mastery-guide" className="btn-sigil-primary w-full sm:w-auto text-center">
            Open Learning Hub
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PANELS.map(({ icon: Icon, label, text }) => (
            <div
              key={label}
              className="rounded-xl border border-white/8 bg-[#1a1a1a] p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="text-sigil-gold shrink-0" />
                <span className="text-[11px] font-mono font-semibold text-white uppercase tracking-wide">
                  {label}
                </span>
              </div>
              <p className="text-xs text-[#a0a0a0] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsThis;
