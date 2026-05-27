import { useMemo, useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";
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
  adversarial: "Adv. AI",
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
  const [query, setQuery] = useState("");
  const [expandedTicker, setExpandedTicker] = useState(null);
  const stocks = useMemo(() => watchlistData || [], [watchlistData]);

  const themeFilters = ["all", ...THEMES.map((t) => t.id)];

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stocks.filter((item) => {
      const matchesTheme =
        selectedTheme === "all" || item.theme === selectedTheme;
      const matchesQuery =
        !q ||
        [item.ticker, item.name, item.company, item.context]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));

      return matchesTheme && matchesQuery;
    });
  }, [query, selectedTheme, stocks]);

  if (!watchlistData) return null;

  const formatPrice = (price, ticker, currency) => {
    if (!price || price === 0) return "N/A";
    if (currency === "KRW" || ticker.endsWith(".KS")) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(price);
    }
    if (currency === "CAD" || ticker.endsWith(".TO")) {
      return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(price);
    }
    if (currency === "EUR" || ticker.endsWith(".DE")) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  };

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl flex flex-col h-full">
      <div className="mb-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Panel 03
        </p>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-sigil-gold shrink-0" />
          <h2 className="text-xl font-semibold text-slate-100">
            Watchlist
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {stocks.length} public names mapped to the thesis. Search or
          filter by theme, then expand a note when something looks worth
          researching.
        </p>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ticker, company, or note..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-sigil-gold/40"
            />
          </div>

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
            <span className="ml-auto text-[11px] font-mono text-slate-600">
              {filteredData.length}/{stocks.length}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 max-h-[70vh] lg:max-h-[620px] pr-2 space-y-2">
        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No tickers match this view.
          </div>
        ) : (
          filteredData.map((stock) => {
            const change = stock.change52w ?? stock.change30d ?? 0;
            const isPositive = change >= 0;
            const label = THEME_LABELS[stock.theme];
            const isExpanded = expandedTicker === stock.ticker;
            const displayName = stock.company || stock.name || stock.ticker;

            return (
              <div
                key={stock.ticker}
                className="glass-panel glass-panel-hover rounded-xl border border-slate-900 p-3 group"
              >
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.35fr)_minmax(118px,auto)] gap-3 xl:items-center">
                  <div className="min-w-0">
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold text-slate-100 group-hover:text-sigil-gold transition-colors leading-snug break-words">
                        {displayName}
                      </p>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950/70 text-[10px] font-mono text-slate-500 shrink-0">
                        {stock.ticker}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-medium border capitalize shrink-0"
                        style={themeBadgeStyle(stock.theme)}
                      >
                        {label?.name || stock.theme}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] text-slate-500 truncate">
                        {stock.angle}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg bg-slate-950/60 border border-slate-900/60 px-3 py-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTicker(isExpanded ? null : stock.ticker)
                        }
                        className="text-[10px] font-bold text-sigil-gold uppercase tracking-wider mt-0.5 shrink-0 rounded border border-sigil-gold/20 px-2 py-0.5 hover:bg-sigil-gold/10"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${stock.ticker} note`}
                      >
                        Note
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[13px] text-slate-200 leading-relaxed font-sans ${
                            isExpanded ? "" : "watchlist-note-text"
                          }`}
                        >
                          {stock.context}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTicker(isExpanded ? null : stock.ticker)
                          }
                          className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-slate-500 hover:text-sigil-gold"
                        >
                          {isExpanded ? "Collapse" : "Full note"}
                          <ChevronDown
                            size={12}
                            className={`transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex xl:flex-col items-end justify-between xl:justify-center gap-1 shrink-0">
                    <span className="text-[16px] font-mono font-bold text-slate-200 whitespace-nowrap">
                      {formatPrice(stock.price, stock.ticker, stock.currency)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-0.5 border whitespace-nowrap ${
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
                    {stock.priceSource !== "yahoo" && (
                      <span
                        className={`text-[9px] font-mono uppercase ${
                          stock.priceSource === "unavailable"
                            ? "text-rose-400/90"
                            : "text-slate-500"
                        }`}
                      >
                        {stock.priceSource === "mock"
                          ? "demo"
                          : stock.priceSource === "yahoo_cached"
                            ? "cached"
                            : "unavailable"}
                      </span>
                    )}
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
