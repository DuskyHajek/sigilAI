/** Active filter / nav pill — solid neon green, black text (sigil.fund style) */
export const filterBtn = (active) =>
  `text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
    active
      ? "bg-sigil-gold text-black"
      : "text-white/70 hover:text-white bg-[#1a1a1a] border border-white/8 hover:border-white/15"
  }`;

/** Tab button variant — same pill pattern, full width for mobile grids */
export const tabBtn = (active) =>
  `w-full text-center text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-2 rounded-full transition-all leading-snug ${
    active
      ? "bg-sigil-gold text-black"
      : "text-white/60 hover:text-white bg-[#1a1a1a] border border-white/8 hover:border-white/15"
  }`;

/** Primary / secondary CTAs */
export const actionBtn = {
  primary:
    "text-xs font-semibold px-5 py-2 rounded-full bg-sigil-gold text-black hover:bg-[#00e67a] hover:shadow-[0_0_20px_rgba(0,255,136,0.25)] transition-all",
  secondary:
    "text-xs font-semibold px-5 py-2 rounded-full text-sigil-gold border border-sigil-gold hover:bg-sigil-gold/8 transition-colors",
};

/** Header / section nav active state */
export const navBtn = (active) =>
  `px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
    active
      ? "bg-sigil-gold text-black"
      : "text-white/60 hover:text-white hover:bg-white/5"
  }`;
