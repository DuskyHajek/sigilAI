import { Link } from "react-router-dom";
import { WATCHLIST_STACK_ENTRIES } from "../../utils/valueChainUtils.js";

const WatchlistStack = ({ onTierSelect }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      {WATCHLIST_STACK_ENTRIES.map(({ ticker, tierNumber, note, tier }) => (
        <button
          key={ticker}
          type="button"
          onClick={() => onTierSelect(tierNumber)}
          className="w-full text-left glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:border-sigil-gold/20 transition-colors group"
        >
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-mono font-bold text-sigil-gold min-w-[4.5rem]">
              {ticker}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 text-white/70">
              T{tierNumber}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white group-hover:text-sigil-gold transition-colors">
              {tier?.name ?? `Tier ${tierNumber}`}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
              {note}
            </p>
          </div>
        </button>
      ))}
    </div>

    <p className="text-xs text-slate-500 leading-relaxed">
      13 other watchlist names live outside this physical stack (robotics, space,
      cyber, biotech). See the{" "}
      <Link to="/" className="text-sigil-gold hover:underline">
        Dashboard watchlist
      </Link>
      .
    </p>
  </div>
);

export default WatchlistStack;
