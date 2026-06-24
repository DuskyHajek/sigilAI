import { Link } from "react-router-dom";
import { WATCHLIST_STACK_ENTRIES } from "../../utils/valueChainUtils.js";

const WatchlistStack = ({ onTierSelect }) => (
  <div className="space-y-4">
    <div className="vc-ticker-grid">
      {WATCHLIST_STACK_ENTRIES.map(({ ticker, tierNumber, note }) => (
        <button
          key={ticker}
          type="button"
          onClick={() => onTierSelect(tierNumber)}
          className="vc-ticker-row group"
        >
          <span className="text-xs font-mono font-bold text-sigil-gold shrink-0 w-[4.5rem] truncate">
            {ticker}
          </span>
          <span className="vc-tier-badge">Tier {tierNumber}</span>
          <span className="text-[11px] text-slate-400 leading-snug line-clamp-2 min-w-0 flex-1 group-hover:text-slate-300 transition-colors">
            {note}
          </span>
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
