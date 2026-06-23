import { useMemo, useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import { THEMES } from "@config/thesis.js";
import { SectionHeader, SearchInput } from "./learning/LearningUI";
import { filterBtn } from "./learning/learningStyles";

const SPOTLIGHT_LABELS = {
  ipo: "IPO",
};

const spotlightSortKey = (stock) => (stock.spotlight ? 0 : 1);

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
    backgroundColor: "transparent",
    borderColor: `${theme.color_hex}55`,
  };
};

const Watchlist = ({ watchlistData, stressResult }) => {
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [query, setQuery] = useState("");
  const [expandedTicker, setExpandedTicker] = useState(null);
  const stocks = useMemo(() => watchlistData || [], [watchlistData]);

  const exposureMaps = useMemo(() => {
    const exposed = new Set(
      (stressResult?.tickerExposure?.mostExposed ?? []).map((r) => r.ticker)
    );
    const resilient = new Set(
      (stressResult?.tickerExposure?.mostResilient ?? []).map((r) => r.ticker)
    );
    const rationaleByTicker = Object.fromEntries([
      ...(stressResult?.tickerExposure?.mostExposed ?? []).map((r) => [
        r.ticker,
        { type: "exposed", ...r },
      ]),
      ...(stressResult?.tickerExposure?.mostResilient ?? []).map((r) => [
        r.ticker,
        { type: "resilient", ...r },
      ]),
    ]);
    return { exposed, resilient, rationaleByTicker };
  }, [stressResult]);

  const stressActive = !!stressResult;

  const themeFilters = ["all", ...THEMES.map((t) => t.id)];

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = stocks.filter((item) => {
      const matchesTheme =
        selectedTheme === "all" || item.theme === selectedTheme;
      const matchesQuery =
        !q ||
        [item.ticker, item.name, item.company, item.context]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));

      return matchesTheme && matchesQuery;
    });

    return [...matches].sort(
      (a, b) =>
        spotlightSortKey(a) - spotlightSortKey(b) ||
        a.ticker.localeCompare(b.ticker)
    );
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
    <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col h-full min-h-[480px] max-h-[min(720px,75vh)]">
      <SectionHeader
        eyebrow="Portfolio"
        title="Watchlist"
        description={
          stressActive
            ? `${stocks.length} public names · rose border = exposed · green = resilient`
            : `${stocks.length} public names · search or filter by theme`
        }
        icon={Sparkles}
        size="lg"
      />

      <div className="flex flex-col gap-3 -mt-2 mb-4">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ticker, company, or note..."
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-[#a0a0a0] shrink-0 mr-0.5" />
          {themeFilters.map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={filterBtn(selectedTheme === theme)}
            >
              {FILTER_SHORT_NAMES[theme] ?? theme}
            </button>
          ))}
          <span className="ml-auto text-[11px] font-mono text-[#a0a0a0]">
            {filteredData.length}/{stocks.length}
          </span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 min-h-0 pr-1 divide-y divide-slate-800/70">
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
            const spotlightLabel = stock.spotlight
              ? SPOTLIGHT_LABELS[stock.spotlight] || stock.spotlight
              : null;
            const stressInfo = exposureMaps.rationaleByTicker[stock.ticker];
            const isExposed = exposureMaps.exposed.has(stock.ticker);
            const isResilient = exposureMaps.resilient.has(stock.ticker);

            const rowAccent = isExposed
              ? "watchlist-row--stress-exposed border-l-2 border-l-rose-500/50"
              : isResilient
                ? "watchlist-row--stress-resilient border-l-2 border-l-emerald-500/50"
                : stock.spotlight
                  ? "border-l-2 border-l-sigil-gold/40"
                  : "border-l-2 border-l-transparent";

            return (
              <div
                key={stock.ticker}
                className={`watchlist-row group py-3 pl-2 pr-1 transition-colors hover:bg-white/[0.02] ${rowAccent}`}
              >
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(200px,0.9fr)_minmax(0,1.4fr)_minmax(110px,auto)] gap-3 xl:items-start">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-slate-100 group-hover:text-sigil-gold transition-colors leading-snug break-words">
                      {displayName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {stock.ticker}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium border capitalize shrink-0"
                        style={themeBadgeStyle(stock.theme)}
                      >
                        {label?.name || stock.theme}
                      </span>
                      {spotlightLabel && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border border-sigil-gold/35 text-sigil-gold shrink-0">
                          {spotlightLabel}
                        </span>
                      )}
                      {isExposed && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border border-rose-500/35 text-rose-400 shrink-0">
                          Exposed
                        </span>
                      )}
                      {isResilient && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide border border-emerald-500/35 text-emerald-400 shrink-0">
                          Resilient
                        </span>
                      )}
                    </div>
                    {stock.angle && (
                      <p className="mt-1 text-[10px] text-slate-600 truncate">
                        {stock.angle}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    {stressInfo && (
                      <p
                        className={`text-[11px] leading-snug mb-1.5 ${
                          stressInfo.type === "exposed"
                            ? "text-rose-300/90"
                            : "text-emerald-300/90"
                        }`}
                      >
                        <span className="text-[9px] font-mono uppercase tracking-wide opacity-80 mr-1">
                          Scenario ·
                        </span>
                        {stressInfo.rationale}
                      </p>
                    )}
                    <div className="flex items-start gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTicker(isExpanded ? null : stock.ticker)
                        }
                        className="text-[10px] font-mono text-slate-500 hover:text-sigil-gold uppercase tracking-wide mt-0.5 shrink-0"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${stock.ticker} note`}
                      >
                        Note
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[13px] text-slate-300 leading-relaxed ${
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
                          className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-slate-600 hover:text-sigil-gold"
                        >
                          {isExpanded ? "Less" : "More"}
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

                  <div className="flex xl:flex-col items-end justify-between xl:justify-start gap-1 shrink-0">
                    <span className="text-[15px] font-mono font-semibold text-slate-200 whitespace-nowrap">
                      {formatPrice(stock.price, stock.ticker, stock.currency)}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-medium flex items-center gap-0.5 whitespace-nowrap ${
                        isPositive ? "text-bullish" : "text-bearish"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      <span className="text-[9px] opacity-70 mr-0.5">
                        {stock.spotlight === "ipo" ? "IPO" : "52W"}
                      </span>
                      {isPositive ? "+" : ""}
                      {change}%
                    </span>
                    {stock.priceSource !== "yahoo" && (
                      <span
                        className={`text-[9px] font-mono uppercase ${
                          stock.priceSource === "unavailable"
                            ? "text-rose-400/90"
                            : "text-slate-600"
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
