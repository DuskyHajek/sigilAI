import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { RISK_OVERLAYS } from "../../data/aiInfraData.js";

const TYPE_STYLES = {
  bear: {
    badge: "BEAR",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    border: "border-rose-500/25",
  },
  cyclical: {
    badge: "CYCLICAL",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    border: "border-amber-500/25",
  },
  bull: {
    badge: "BULL",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    border: "border-emerald-500/25",
  },
};

const OverlayCard = ({ overlay, onTierSelect }) => {
  const [open, setOpen] = useState(false);
  const styles = TYPE_STYLES[overlay.type] ?? TYPE_STYLES.cyclical;

  return (
    <article
      className={`glass-panel rounded-xl border ${styles.border} overflow-hidden`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 sm:p-5 group"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${styles.badgeClass}`}
              >
                {styles.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-600">
                Overlay {overlay.number}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              {overlay.name}
            </h4>
            <p className="text-xs text-[#a0a0a0] leading-relaxed">
              {overlay.summary}
            </p>
          </div>
          {open ? (
            <ChevronDown size={16} className="text-sigil-gold shrink-0 mt-1" />
          ) : (
            <ChevronRight
              size={16}
              className="text-slate-500 group-hover:text-slate-300 shrink-0 mt-1"
            />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/6 pt-4 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">{overlay.detail}</p>

          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
              Affected tiers
            </p>
            <div className="flex flex-wrap gap-2">
              {overlay.tiersAffected.map((tierNum) => (
                <button
                  key={tierNum}
                  type="button"
                  onClick={() => onTierSelect(tierNum)}
                  className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full border border-white/10 text-white/80 hover:border-sigil-gold/40 hover:text-sigil-gold transition-colors"
                >
                  T{tierNum}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
              Watch signals
            </p>
            <ul className="space-y-1.5">
              {overlay.watchSignals.map((signal) => (
                <li
                  key={signal}
                  className="text-xs text-slate-400 leading-relaxed flex gap-2"
                >
                  <span className="text-sigil-gold shrink-0">·</span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
};

const RiskOverlays = ({ onTierSelect }) => (
  <div className="space-y-3">
    {RISK_OVERLAYS.map((overlay) => (
      <OverlayCard
        key={overlay.id}
        overlay={overlay}
        onTierSelect={onTierSelect}
      />
    ))}
  </div>
);

export default RiskOverlays;
