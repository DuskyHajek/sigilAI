import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RefreshCw, Cpu, Check, X, BookOpen, ExternalLink } from "lucide-react";
import { fetchHealth } from "../api";
import SyncProgress from "./SyncProgress";
import DashboardSectionNav from "./DashboardSectionNav";

const Header = ({ onSync, syncState, lastUpdated, showSectionNav = false }) => {
  const [health, setHealth] = useState(null);
  const location = useLocation();
  const onDashboard = location.pathname === "/";

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ mode: "MOCK", lastSync: null }));
  }, [lastUpdated, syncState]);

  const isLive = health?.mode === "LIVE";

  const formatLastSyncedAgo = () => {
    if (typeof health?.cacheAge === "number") {
      const cacheAgeHours = health.cacheAge;
      if (cacheAgeHours < 1) {
        const mins = Math.max(1, Math.round(cacheAgeHours * 60));
        return `${mins}m ago`;
      }
      const hrs = Math.max(1, Math.round(cacheAgeHours));
      return `${hrs}h ago`;
    }

    if (!lastUpdated) return "N/A";
    const date = new Date(lastUpdated);
    if (!Number.isFinite(date.getTime())) return "N/A";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const syncTitle = () => {
    switch (syncState) {
      case "syncing":
        return "Syncing live data…";
      case "success":
        return "Sync complete";
      case "error":
        return "Sync failed — retry";
      default:
        return "Sync live data";
    }
  };

  const SyncIcon =
    syncState === "success" ? Check : syncState === "error" ? X : RefreshCw;

  const statusLabel = isLive ? "Live" : "Demo";
  const syncedAgo = formatLastSyncedAgo();

  return (
    <header className="border-b border-white/6 bg-black/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="https://sigil.fund"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-sigil-gold/10 border border-sigil-gold/25 text-sigil-gold shrink-0 hover:bg-sigil-gold/15 transition-colors"
              title="Sigil Fund"
            >
              <Cpu size={22} />
            </a>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white m-0 font-sans leading-none truncate">
                  SIGIL SUPERNOVA
                </h1>
                <a
                  href="https://sigil.fund"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-[#a0a0a0] hover:text-sigil-gold transition-colors shrink-0"
                >
                  sigil.fund
                  <ExternalLink size={10} />
                </a>
              </div>
              <p className="text-xs text-[#a0a0a0] font-sans mt-1 hidden sm:block">
                Thesis-aware intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onDashboard && showSectionNav && (
              <DashboardSectionNav variant="desktop" />
            )}

            <div
              className={`hidden sm:flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full border text-xs font-mono ${
                isLive
                  ? "border-emerald-500/20 text-emerald-400/90 bg-emerald-500/5"
                  : "border-amber-500/20 text-amber-400/90 bg-amber-500/5"
              }`}
            >
              <span className="whitespace-nowrap">
                <span className={isLive ? "text-emerald-400" : "text-amber-400"}>
                  ●
                </span>{" "}
                {statusLabel} · {syncedAgo}
              </span>
            </div>

            <button
              type="button"
              onClick={onSync}
              disabled={syncState === "syncing"}
              title={syncTitle()}
              aria-label={syncTitle()}
              className={`hidden sm:inline-flex btn-sigil-outline ml-1 !py-1 !px-3 !text-[11px] disabled:opacity-50 disabled:cursor-not-allowed ${
                syncState === "error" ? "!border-rose-500/50 !text-rose-400" : ""
              }`}
            >
              <SyncIcon
                size={12}
                className={syncState === "syncing" ? "animate-spin" : ""}
              />
              Sync
            </button>
            <div
              className={`flex sm:hidden items-center gap-1 pl-2.5 pr-1 py-1 rounded-full border text-xs font-mono ${
                isLive
                  ? "border-emerald-500/20 text-emerald-400/90 bg-emerald-500/5"
                  : "border-amber-500/20 text-amber-400/90 bg-amber-500/5"
              }`}
            >
              <span className="whitespace-nowrap">
                <span className={isLive ? "text-emerald-400" : "text-amber-400"}>
                  ●
                </span>{" "}
                {statusLabel} · {syncedAgo}
              </span>
              <button
                type="button"
                onClick={onSync}
                disabled={syncState === "syncing"}
                title={syncTitle()}
                aria-label={syncTitle()}
                className={`ml-0.5 p-1.5 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  syncState === "success"
                    ? "text-emerald-400"
                    : syncState === "error"
                      ? "text-rose-400"
                      : "text-[#a0a0a0] hover:text-sigil-gold hover:bg-white/5"
                }`}
              >
                <SyncIcon
                  size={14}
                  className={syncState === "syncing" ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {syncState === "syncing" && <SyncProgress />}

        {onDashboard && showSectionNav && (
          <DashboardSectionNav variant="mobile" />
        )}

        <nav className="flex items-center gap-1 border-t border-white/6 pt-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-sigil-gold text-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/mastery-guide"
            title="Reference curriculum, quizzes, flashcards & scenario practice for all 7 themes"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-sigil-gold text-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <BookOpen size={12} />
            Learning Hub
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
