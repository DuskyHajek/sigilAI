import React, { useEffect, useState } from "react";
import { RefreshCw, Radio, Cpu, Check, X } from "lucide-react";
import { fetchHealth } from "../api";

const Header = ({ onSync, syncState, lastUpdated }) => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth({ mode: "MOCK", lastSync: null }));
  }, [lastUpdated, syncState]);

  const isLive = health?.mode === "LIVE";

  const formatLastUpdated = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const syncLabel = () => {
    switch (syncState) {
      case "syncing":
        return "SYNCING...";
      case "success":
        return "SYNCED";
      case "error":
        return "SYNC FAILED";
      default:
        return "SYNC ENGINE";
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sigil-gold/10 border border-sigil-gold/30 text-sigil-gold shadow-lg shadow-sigil-gold/5">
            <Cpu size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 font-sans leading-none">
                SIGIL SUPERNOVA
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sigil-gold/10 text-sigil-gold border border-sigil-gold/20">
                v0.2 DEMO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
              INVESTMENT COGNITIVE OVERLAY ENGINE
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold ${
              isLive
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/5 border-amber-500/20 text-amber-400"
            }`}
          >
            <Radio size={14} className={isLive ? "animate-ping" : ""} />
            <span>{isLive ? "LIVE MODE" : "OFFLINE // MOCK MODE"}</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-1 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 px-3 py-1">
              LAST SYNC:{" "}
              {formatLastUpdated(lastUpdated || health?.lastSync)}
            </span>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
