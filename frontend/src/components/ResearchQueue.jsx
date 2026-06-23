import { SearchCheck } from "lucide-react";
import { THEMES } from "@config/thesis.js";

const getTheme = (themeId) => THEMES.find((theme) => theme.id === themeId);

const cleanAction = (action) =>
  String(action || "")
    .replace(/^Review\s+(.+?)\s+news\s+against\s+the\s+thesis\s+[-—]\s+/i, "")
    .replace(/^Read\s+and\s+verify:\s+/i, "")
    .replace(/\.\.+/g, ".")
    .trim();

const cleanKeyword = (keyword) => {
  const value = String(keyword || "").trim();
  if (!value || value.length < 3) return null;
  if (/^(and|the|this|that|with|from)$/i.test(value)) return null;
  return value;
};

const outlineBadgeStyle = (color) => ({
  color,
  borderColor: `${color}55`,
  backgroundColor: "transparent",
});

const ResearchQueue = ({ researchQueue, isMock }) => {
  const items = researchQueue?.items || [];

  if (items.length === 0) return null;

  return (
    <section className="glass-panel border border-slate-800 rounded-2xl p-5 md:p-6">
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-sigil-gold/80 mb-1">
          Next steps
        </p>
        <div className="flex items-center gap-2 mb-1">
          <SearchCheck size={18} className="text-sigil-gold shrink-0" />
          <h2 className="text-lg md:text-xl font-semibold text-slate-100">
            Research Queue
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          A short list of what looks worth checking after this sync — built from
          headlines, theme scores, and watchlist notes. Search terms are
          suggestions, not conclusions.
          {isMock ? " Demo data shown." : ""}
        </p>
      </div>

      <ol className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {items.map((item, index) => {
          const theme = getTheme(item.theme);
          const themeColor = theme?.color_hex || "#D6A742";
          const keywords = (item.keywords || [])
            .map(cleanKeyword)
            .filter(Boolean);
          const tickers = item.tickers || [];
          const secondaryBadge = tickers[0]
            ? { type: "ticker", label: tickers[0] }
            : keywords[0]
              ? { type: "keyword", label: keywords[0] }
              : null;
          const overflowCount =
            tickers.length +
            keywords.length -
            (secondaryBadge?.type === "ticker" ? 1 : 0) -
            (secondaryBadge?.type === "keyword" ? 1 : 0);

          return (
            <li
              key={`${item.action}-${index}`}
              className="relative overflow-hidden rounded-xl border border-slate-900 bg-slate-950/20 p-3.5"
            >
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: themeColor }}
              />
              <div className="pl-2">
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-sigil-gold/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {theme && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                      style={outlineBadgeStyle(themeColor)}
                    >
                      {theme.display_name}
                    </span>
                  )}
                  {secondaryBadge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                        secondaryBadge.type === "ticker"
                          ? "border-sigil-gold/30 text-sigil-gold/90"
                          : "border-slate-700 text-slate-500"
                      }`}
                      style={
                        secondaryBadge.type === "ticker"
                          ? outlineBadgeStyle("#e5c158")
                          : undefined
                      }
                    >
                      {secondaryBadge.label}
                    </span>
                  )}
                  {overflowCount > 0 && (
                    <span className="text-[10px] font-mono text-slate-600">
                      +{overflowCount} more
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-100 leading-relaxed">
                  {cleanAction(item.action)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ResearchQueue;
