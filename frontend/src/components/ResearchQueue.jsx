import { SearchCheck } from "lucide-react";
import { THEMES } from "@config/thesis.js";
import { SectionHeader } from "./learning/LearningUI";

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
    <section className="glass-panel rounded-2xl p-5 md:p-6">
      <SectionHeader
        eyebrow="Follow-ups"
        title="Research Tasks"
        description={`Suggested checks after this sync — from headlines, theme scores, and watchlist notes.${isMock ? " Demo data shown." : ""}`}
        icon={SearchCheck}
        size="lg"
      />

      <ol className="grid grid-cols-1 xl:grid-cols-2 gap-3 -mt-2">
        {items.map((item, index) => {
          const theme = getTheme(item.theme);
          const themeColor = theme?.color_hex || "#00ff88";
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
              className="relative overflow-hidden rounded-xl border border-white/8 bg-[#1a1a1a] p-3.5 transition-colors hover:border-white/15 hover:bg-[#222]"
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
                          : "border-white/10 text-[#a0a0a0]"
                      }`}
                      style={
                        secondaryBadge.type === "ticker"
                          ? outlineBadgeStyle("#00ff88")
                          : undefined
                      }
                    >
                      {secondaryBadge.label}
                    </span>
                  )}
                  {overflowCount > 0 && (
                    <span className="text-[10px] font-mono text-[#a0a0a0]">
                      +{overflowCount} more
                    </span>
                  )}
                </div>

                <p className="text-sm text-white leading-relaxed">
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
