export const filterBtn = (active) =>
  `text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
    active
      ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
      : "text-slate-500 hover:text-slate-300 bg-slate-800/40 border border-slate-700/40"
  }`;

export const actionBtn = {
  primary:
    "text-xs font-mono font-bold px-4 py-2 rounded-lg bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30 hover:bg-sigil-gold/20 transition-colors",
  secondary:
    "text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200 hover:border-slate-600/40 transition-colors",
};
