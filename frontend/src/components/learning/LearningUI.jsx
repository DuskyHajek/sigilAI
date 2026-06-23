import { Search } from "lucide-react";

export function TipBox({ children, icon: Icon }) {
  return (
    <div className="flex gap-3 rounded-xl border border-sigil-gold/15 bg-sigil-gold/[0.04] px-4 py-3 mb-6">
      {Icon && (
        <Icon size={16} className="text-sigil-gold shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <p className="text-xs text-[#a0a0a0] leading-relaxed">{children}</p>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  size = "default",
  action,
}) {
  const titleClass =
    size === "lg"
      ? "text-lg md:text-xl font-bold text-white mb-1 leading-snug"
      : "text-base sm:text-lg font-bold text-white mb-1 leading-snug";

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sigil-gold/10 border border-sigil-gold/20 flex items-center justify-center">
              <Icon size={18} className="text-sigil-gold" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">
                {eyebrow}
              </p>
            )}
            <h3 className={titleClass}>{title}</h3>
            {description && (
              <p className="text-xs sm:text-sm text-[#a0a0a0] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
      </div>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-white/8 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#a0a0a0] focus:outline-none focus:border-sigil-gold/50 transition-colors"
      />
    </div>
  );
}

export function ModeCard({ active, icon: Icon, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-0 text-left rounded-xl p-3 sm:p-4 transition-all border ${
        active
          ? "bg-sigil-gold/10 border-sigil-gold/35 shadow-[0_0_20px_rgba(0,255,136,0.08)]"
          : "bg-[#1a1a1a] border-white/8 hover:border-white/15 hover:bg-[#222]"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && (
          <Icon
            size={15}
            className={active ? "text-sigil-gold" : "text-[#a0a0a0]"}
            aria-hidden="true"
          />
        )}
        <span
          className={`text-xs font-mono font-bold uppercase tracking-widest ${
            active ? "text-sigil-gold" : "text-[#a0a0a0]"
          }`}
        >
          {label}
        </span>
      </div>
      <p className="text-[11px] text-[#a0a0a0] leading-relaxed">{description}</p>
    </button>
  );
}
