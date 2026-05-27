import { useState, useEffect } from "react";
import { ServerCrash } from "lucide-react";
import ThemePulse from "./components/ThemePulse";
import Watchlist from "./components/Watchlist";
import WeeklyBrief from "./components/WeeklyBrief";
import Header from "./components/Header";
import WhatIsThis from "./components/WhatIsThis";
import ResearchQueue from "./components/ResearchQueue";
import { fetchDashboard, fetchHealth, triggerSync } from "./api";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState("idle");
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await fetchDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Could not connect to backend intelligence node.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (syncState === "syncing") return;
    try {
      setSyncState("syncing");
      setError(null);
      const dashboardData = await triggerSync();
      const health = await fetchHealth().catch(() => null);

      if (health?.mode === "LIVE" && dashboardData.isMock) {
        throw new Error(
          "Sync returned demo data. API keys may be missing on this deployment."
        );
      }

      setData(dashboardData);
      setSyncState("success");
      setTimeout(() => setSyncState("idle"), 2000);
    } catch (err) {
      console.error("Error syncing data:", err);
      setError("Signal synchronization failed. Please retry.");
      setSyncState("error");
      setTimeout(() => setSyncState("idle"), 3000);
    }
  };

  useEffect(() => {
    // Defer initial state updates so the effect body stays pure.
    const t = setTimeout(() => {
      void loadDashboardData();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col font-sans">
      <Header
        onSync={handleSync}
        syncState={syncState}
        lastUpdated={data?.lastUpdated}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col gap-6">
        <WhatIsThis />

        {error && (
          <div className="glass-panel border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <ServerCrash size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-1 glass-panel p-6 rounded-2xl shimmer min-h-[300px]"></div>
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shimmer min-h-[500px]"></div>
            <div className="lg:col-span-3 glass-panel p-6 rounded-2xl shimmer min-h-[150px]"></div>
          </div>
        ) : (
          <>
            <div className="w-full">
              <WeeklyBrief
                weeklyBriefText={data?.weeklyBrief}
                isMock={data?.isMock}
                generatedAt={data?.lastUpdated}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-1 h-full">
                <ThemePulse themeData={data?.themePulse} />
              </div>
              <div className="lg:col-span-2 h-full">
                <Watchlist watchlistData={data?.watchlist} />
              </div>
            </div>

            <ResearchQueue
              researchQueue={data?.researchQueue}
              isMock={data?.isMock}
            />

            <footer className="text-center pb-4 pt-2">
              <p className="text-[11px] font-mono text-slate-600">
                Application demo · Supernova thesis encoded in{" "}
                <span className="text-slate-500">config/thesis.js</span> · AI
                prompts in <span className="text-slate-500">services/prompts.js</span>
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
