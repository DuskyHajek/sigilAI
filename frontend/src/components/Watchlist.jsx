import { useState } from "react";
import { Sparkles, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { THEMES } from "@config/thesis.js";

const THEME_LABELS = Object.fromEntries(
  THEMES.map((t) => [
    t.id,
    {
      name: t.display_name.replace(/^Physical |^Future of /, "").split(" ")[0],
      colorHex: t.color_hex,
    },
  ])
);

const FILTER_SHORT_NAMES = {
  all: "All",
  datacenters: "Datacenters",
  application: "App Layer",
  robotics: "Robotics",
  warfare: "Warfare",
  space: "Space",
  biotech: "Biotech",
  adversarial_ai: "Adv. AI",
};

const themeBadgeStyle = (themeId) => {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return {};
  return {
    color: theme.color_hex,
    backgroundColor: `${theme.color_hex}18`,
    borderColor: `${theme.color_hex}40`,
  };
};

const Watchlist = ({ watchlistData }) => {
  const [selectedTheme, setSelectedTheme] = useState("all");

  if (!watchlistData) return null;

  const themeFilters = [
    "all",
    ...THEMES.map((t) => t.id),
  ];

  const filteredData =
    selectedTheme === "all"
      ? watchlistData
      : watchlistData.filter((item) => item.theme === selectedTheme);

  const formatPrice = (price, ticker) => {
    if (price === 0) return "N/A";
    if (ticker.endsWith(".KS")) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(price);
    }
    if (ticker.endsWith(".TO")) {
      return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(price);
    }
    if (ticker.endsWith(".DE")) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl flex flex-col h-full">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-sigil-gold shrink-0" />
          <h2 className="text-xl font-semibold text-slate-100">
            Watchlist Intelligence
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {watchlistData.length} Supernova tickers with prices & thesis-specific insight overlays
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-slate-500 shrink-0 mr-0.5" />
          {themeFilters.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                selectedTheme === theme
                  ? "bg-sigil-gold/10 text-sigil-gold border-sigil-gold/40"
                  : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {FILTER_SHORT_NAMES[theme] ?? theme}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 max-h-[580px] pr-2 space-y-3">
        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No tickers loaded under this category.
          </div>
        ) : (
          filteredData.map((stock) => {
            const change = stock.change52w ?? stock.change30d ?? 0;
            const isPositive = change >= 0;
            const label = THEME_LABELS[stock.theme];

            return (
              <div
                key={stock.ticker}
                className="glass-panel glass-panel-hover p-4 rounded-xl border border-slate-900 flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[18px] font-bold text-slate-100 group-hover:text-sigil-gold transition-colors">
                        {stock.ticker}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {stock.name}
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-medium border capitalize"
                      style={themeBadgeStyle(stock.theme)}
                    >
                      {label?.name || stock.theme}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[16px] font-mono font-bold text-slate-200">
                        {formatPrice(stock.price, stock.ticker)}
                      </span>
                      {stock.priceSource === "mock" && (
                        <span className="text-[9px] font-mono text-amber-400/90 uppercase">
                          demo price
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-0.5 border ${
                        isPositive
                          ? "text-bullish bg-bullish/5 border-bullish/20"
                          : "text-bearish bg-bearish/5 border-bearish/20"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      <span className="text-[9px] opacity-70 mr-0.5">52W</span>
                      {isPositive ? "+" : ""}
                      {change}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-900/60 group-hover:border-slate-850 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-sigil-gold uppercase tracking-wider mt-0.5 border border-sigil-gold/30 bg-sigil-gold/10 px-2 py-1 rounded shrink-0">
                      SIGIL AI
                    </span>
                    <p className="text-[13px] text-slate-200 leading-relaxed font-sans border-l border-sigil-gold/20 pl-3 py-1">
                      {stock.context}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Watchlist;
