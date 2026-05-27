import { SearchCheck } from "lucide-react";
import { THEMES } from "@config/thesis.js";

const themeLabel = (themeId) =>
  THEMES.find((theme) => theme.id === themeId)?.display_name || themeId;

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

      <ol className="space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item.action}-${index}`}
            className="rounded-xl border border-slate-900 bg-slate-950/40 p-3 md:p-4"
          >
            <div className="flex gap-3">
              <span className="text-[11px] font-mono text-sigil-gold/80 shrink-0 pt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-100 leading-relaxed">
                  {item.action}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.theme && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-700 text-slate-400">
                      {themeLabel(item.theme)}
                    </span>
                  )}
                  {(item.tickers || []).map((ticker) => (
                    <span
                      key={ticker}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-sigil-gold/20 text-sigil-gold/90 bg-sigil-gold/5"
                    >
                      {ticker}
                    </span>
                  ))}
                  {(item.keywords || []).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-800 text-slate-500 bg-slate-900/60"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ResearchQueue;
