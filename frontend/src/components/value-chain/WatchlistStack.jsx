import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { WATCHLIST_STACK_ENTRIES } from "../../utils/valueChainUtils.js";

const WatchlistStack = ({ onTierSelect }) => (
  <div className="space-y-4">
    <div className="vc-ticker-grid">
      {WATCHLIST_STACK_ENTRIES.map(({ ticker, tierNumber, note, tier }) => (
        <button
          key={ticker}
          type="button"
          onClick={() => onTierSelect(tierNumber)}
          className="vc-ticker-card group"
        >
          <div className="vc-ticker-card__head">
            <span className="vc-ticker-card__sym">{ticker}</span>
            <span className="vc-tier-badge">Tier {tierNumber}</span>
            <ArrowUpRight
              size={14}
              className="vc-ticker-card__arrow text-slate-600 group-hover:text-sigil-gold transition-colors shrink-0 ml-auto"
              aria-hidden="true"
            />
          </div>
          <p className="vc-ticker-card__tier-name">
            {tier?.name ?? `Tier ${tierNumber}`}
          </p>
          <p className="vc-ticker-card__note">{note}</p>
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
