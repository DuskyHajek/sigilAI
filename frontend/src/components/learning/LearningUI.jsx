export function TipBox({ children, icon: Icon }) {
  return (
    <div className="flex gap-3 rounded-xl border border-sigil-gold/15 bg-sigil-gold/[0.04] px-4 py-3 mb-6">
      {Icon && (
        <Icon size={16} className="text-sigil-gold shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <p className="text-xs text-slate-400 leading-relaxed">{children}</p>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="shrink-0 w-9 h-9 rounded-lg bg-sigil-gold/10 border border-sigil-gold/20 flex items-center justify-center">
            <Icon size={18} className="text-sigil-gold" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">
              {eyebrow}
            </p>
          )}
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ModeCard({ active, icon: Icon, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-[140px] text-left rounded-xl p-4 transition-all border ${
        active
          ? "bg-sigil-gold/10 border-sigil-gold/35 shadow-[0_0_20px_rgba(229,193,88,0.06)]"
          : "bg-slate-900/40 border-slate-800/60 hover:border-slate-600/50 hover:bg-slate-800/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && (
          <Icon
            size={15}
            className={active ? "text-sigil-gold" : "text-slate-500"}
            aria-hidden="true"
          />
        )}
        <span
          className={`text-xs font-mono font-bold uppercase tracking-widest ${
            active ? "text-sigil-gold" : "text-slate-400"
          }`}
        >
          {label}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">{description}</p>
    </button>
  );
}
