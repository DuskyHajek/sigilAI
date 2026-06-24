import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RefreshCw, Cpu, Check, X, BookOpen, Layers, LayoutDashboard } from "lucide-react";
import { fetchHealth } from "../api";
import SyncProgress from "./SyncProgress";
import DashboardSectionNav from "./DashboardSectionNav";
import ValueChainSectionNav from "./ValueChainSectionNav";

const APP_SECTIONS = [
  {
    to: "/",
    end: true,
    label: "Dashboard",
    Icon: LayoutDashboard,
    title: "Live briefing, watchlist, and thesis radar",
  },
  {
    to: "/value-chain",
    label: "Value Chain",
    mobileLabel: "Value Chain",
    Icon: Layers,
    title: "22-tier AI infrastructure stack — phases, bottlenecks & holdings",
  },
  {
    to: "/mastery-guide",
    label: "Learning Hub",
    mobileLabel: "Learning",
    Icon: BookOpen,
    title: "Reference curriculum, quizzes, flashcards & scenarios",
  },
];

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

          <div className="flex items-center gap-3 shrink-0">
            {onDashboard && showSectionNav && (
              <DashboardSectionNav variant="desktop" />
            )}
            {onValueChain && showValueChainNav && (
              <ValueChainSectionNav variant="desktop" />
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

        <nav className="app-main-nav" aria-label="Main sections">
          <div className="app-main-nav__track">
            {APP_SECTIONS.map(({ to, end, label, mobileLabel, Icon, title }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={title}
                className={({ isActive }) =>
                  `app-main-nav__link${
                    isActive
                      ? " app-main-nav__link--active"
                      : " app-main-nav__link--inactive"
                  }`
                }
              >
                <Icon size={18} className="app-main-nav__icon shrink-0" aria-hidden="true" />
                <span className="app-main-nav__label">{label}</span>
                <span className="app-main-nav__label app-main-nav__label--mobile">
                  {mobileLabel ?? label}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        {onDashboard && showSectionNav && (
          <DashboardSectionNav variant="mobile" />
        )}
        {onValueChain && showValueChainNav && (
          <ValueChainSectionNav variant="mobile" />
        )}
      </div>
    </header>
  );
};

export default Header;
