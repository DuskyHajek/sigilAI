import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RefreshCw, Cpu, Check, X, BookOpen } from "lucide-react";
import { fetchHealth } from "../api";

const Header = ({ onSync, syncState, lastUpdated }) => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ mode: "MOCK", lastSync: null }));
  }, [lastUpdated, syncState]);

  const isLive = health?.mode === "LIVE";

  const formatLastSyncedAgo = () => {
    // Prefer backend-computed cache age to keep the render pure.
    if (typeof health?.cacheAge === "number") {
      const cacheAgeHours = health.cacheAge;
      if (cacheAgeHours < 1) {
        const mins = Math.max(1, Math.round(cacheAgeHours * 60));
        return `${mins} min ago`;
      }
      const hrs = Math.max(1, Math.round(cacheAgeHours));
      return `${hrs} hr ago`;
    }

    // Fallback: show timestamp if available (still render-pure).
    if (!lastUpdated) return "N/A";
    const date = new Date(lastUpdated);
    if (!Number.isFinite(date.getTime())) return "N/A";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const syncLabel = () => {
    switch (syncState) {
      case "syncing":
        return "Syncing...";
      case "success":
        return "Synced";
      case "error":
        return "Sync failed";
      default:
        return "Sync live data";
    }
  };

  const SyncIcon =
    syncState === "success"
      ? Check
      : syncState === "error"
        ? X
        : RefreshCw;

  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3">
        {/* Top row: branding + sync button */}
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sigil-gold/10 border border-sigil-gold/30 text-sigil-gold shadow-lg shadow-sigil-gold/5">
            <Cpu size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 font-sans leading-none">
                SIGIL SUPERNOVA
              </h1>

              <span
                className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                  isLive
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                }`}
              >
                <span className={isLive ? "text-emerald-400" : "text-amber-400"}>
                  {isLive ? "●" : "◦"}
                </span>
                <span>{isLive ? "LIVE" : "DEMO DATA"}</span>
              </span>

              <span className="text-xs font-mono text-slate-500">
                Last synced {formatLastSyncedAgo()}
              </span>
            </div>

            <p className="text-sm text-slate-400 font-sans mt-1">
              Thesis-aware intelligence · 7 themes · 20 tickers
            </p>
          </div>
        </div>

          <button
            onClick={onSync}
            disabled={syncState === "syncing"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed ${
              syncState === "success"
                ? "bg-emerald-500 text-slate-950"
                : syncState === "error"
                  ? "bg-rose-500 text-white"
                  : "bg-sigil-gold hover:bg-yellow-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500"
            }`}
          >
            <SyncIcon
              size={14}
              className={syncState === "syncing" ? "animate-spin" : ""}
            />
            <span>{syncLabel()}</span>
          </button>
        </div>

        {/* Bottom row: nav links */}
        <nav className="flex items-center gap-1 border-t border-slate-800/50 pt-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                isActive
                  ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
              }`
            }
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/mastery-guide"
            title="Books, key concepts, glossary & mental models for all 7 investment themes"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                isActive
                  ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
              }`
            }
          >
            <BookOpen size={12} />
            LEARNING HUB
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
