import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RefreshCw, Cpu, Check, X } from "lucide-react";
import { fetchHealth } from "../api";
import SyncProgress from "./SyncProgress";
import AppMainNav from "./AppMainNav";
import DashboardSectionNav from "./DashboardSectionNav";
import ValueChainSectionNav from "./ValueChainSectionNav";

const Header = ({
  onSync,
  syncState,
  lastUpdated,
  showSectionNav = false,
  showValueChainNav = false,
}) => {
  const [health, setHealth] = useState(null);
  const location = useLocation();
  const onDashboard = location.pathname === "/";
  const onValueChain = location.pathname === "/value-chain";

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
            <div className="p-2 rounded-xl bg-sigil-gold/10 border border-sigil-gold/25 text-sigil-gold shrink-0">
              <Cpu size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-white m-0 font-sans leading-none truncate">
                SIGIL SUPERNOVA
              </h1>
              <p className="text-xs text-[#a0a0a0] font-sans mt-1 hidden sm:block">
                Thesis-aware intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
              className={`hidden sm:inline-flex btn-sigil-outline !py-1 !px-3 !text-[11px] disabled:opacity-50 disabled:cursor-not-allowed ${
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

        <AppMainNav />

        {(onDashboard && showSectionNav) || (onValueChain && showValueChainNav) ? (
          <div className="app-subnav">
            {onDashboard && showSectionNav && <DashboardSectionNav />}
            {onValueChain && showValueChainNav && <ValueChainSectionNav />}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
