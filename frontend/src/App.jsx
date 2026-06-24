import { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { AlertTriangle, ServerCrash } from "lucide-react";
import ThesisRadar from "./components/ThesisRadar";
import SignalStrip from "./components/SignalStrip";
import Watchlist from "./components/Watchlist";
import WeeklyBrief from "./components/WeeklyBrief";
import StressTestZone from "./components/StressTestZone";
import ScenarioBanner from "./components/ScenarioBanner";
import Header from "./components/Header";
import WhatIsThis from "./components/WhatIsThis";
import DashboardZone from "./components/DashboardZone";
import EditorialSpotlight from "./components/EditorialSpotlight";
import ResearchQueue from "./components/ResearchQueue";
import MasteryGuide from "./pages/MasteryGuide";
import ValueChain from "./pages/ValueChain";
import { fetchDashboard, fetchHealth, triggerSync } from "./api";
import {
  editorialShowsBlindspot,
  pickEditorialSpotlight,
} from "./utils/editorialSpotlight.js";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState("idle");
  const [error, setError] = useState(null);
  const [syncNotice, setSyncNotice] = useState(null);
  const [highlightThemeId, setHighlightThemeId] = useState(null);
  const [stressState, setStressState] = useState({
    status: "idle",
    scenarioId: null,
    result: null,
    viewMode: "live",
    error: null,
  });

  const stressActive = stressState.status === "ready" && stressState.result;

  const editorialSpotlight = useMemo(
    () =>
      data
        ? pickEditorialSpotlight({
            watchlist: data.watchlist,
            adversarialAssessment: data.adversarialAssessment,
            thesisDriftReport: data.thesisDriftReport,
            stressActive,
          })
        : null,
    [data, stressActive]
  );

  const suppressBlindspotInChallenge =
    editorialShowsBlindspot(editorialSpotlight);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSyncNotice(null);
      const dashboardData = await fetchDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Could not connect to backend intelligence node.");
    } finally {
      setLoading(false);
    }
  };

  const refreshWatchlist = async () => {
    try {
      const dashboardData = await fetchDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error("Error refreshing watchlist:", err);
    }
  };

  const handleSync = async () => {
    if (syncState === "syncing") return;
    try {
      setSyncState("syncing");
      setError(null);
      setSyncNotice(null);
      // Fresh sync should show live radar — clear any active stress overlay.
      setStressState({
        status: "idle",
        scenarioId: null,
        result: null,
        viewMode: "live",
        error: null,
      });
      const dashboardData = await triggerSync();
      const health = await fetchHealth().catch(() => null);

      if (health?.mode === "LIVE" && dashboardData.isMock) {
        throw new Error(
          "Sync returned demo data. API keys may be missing on this deployment."
        );
      }

      setData(dashboardData);

      const totalHeadlines = Object.values(dashboardData.themePulse || {}).reduce(
        (sum, pulse) =>
          sum + (pulse?.headline_count ?? pulse?.evidence?.length ?? 0),
        0
      );

      if (dashboardData.cacheOnly && dashboardData.syncOk === false) {
        const detail = dashboardData.syncError
          ? ` (${dashboardData.syncError})`
          : "";
        setSyncNotice(
          (dashboardData.hint ||
            "Live sync failed. Showing the latest cached dashboard data.") + detail
        );
        setSyncState("error");
        setTimeout(() => setSyncState("idle"), 3000);
        return;
      }

      if (dashboardData.cacheOnly || dashboardData.syncSkipped) {
        setSyncNotice(
          dashboardData.message ||
            "Showing cached dashboard data because it is still fresh."
        );
      } else if (
        dashboardData.syncOk &&
        !dashboardData.isMock &&
        totalHeadlines === 0
      ) {
        setSyncNotice(
          "Sync completed but no headline evidence was classified — NewsAPI or Claude classification may have failed. Retry Sync once."
        );
      }

      setSyncState("success");
      setTimeout(() => setSyncState("idle"), 2000);
    } catch (err) {
      console.error("Error syncing data:", err);
      setError(
        err.message ||
          "Signal synchronization failed. Please retry."
      );
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

  const handleClusterClick = (cluster) => {
    const themeId = cluster.impactedThemes?.[0];
    if (!themeId) return;

    setHighlightThemeId(themeId);
    window.setTimeout(() => {
      document
        .getElementById(`thesis-row-${themeId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    window.setTimeout(() => setHighlightThemeId(null), 3500);
  };

  const handleClearScenario = () => {
    setStressState({
      status: "idle",
      scenarioId: null,
      result: null,
      viewMode: "live",
      error: null,
    });
  };

  const handleStressViewMode = (mode) => {
    setStressState((prev) => ({ ...prev, viewMode: mode }));
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col font-sans">
      <Header
        onSync={handleSync}
        syncState={syncState}
        lastUpdated={data?.lastUpdated}
        showSectionNav={!loading}
        showValueChainNav
      />

      <Routes>
        <Route
          path="/"
          element={
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col">
              <WhatIsThis />

              {(error || syncNotice) && (
                <div className="mt-4 flex flex-col gap-3">
                  {error && (
                    <div className="border border-rose-500/20 bg-rose-500/5 p-4 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                      <ServerCrash size={18} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {syncNotice && (
                    <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl flex items-center gap-3 text-amber-300 text-sm">
                      <AlertTriangle size={18} className="shrink-0" />
                      <span>{syncNotice}</span>
                    </div>
                  )}
                </div>
              )}

              {loading ? (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                  <div className="lg:col-span-1 glass-panel p-6 rounded-2xl shimmer min-h-[300px]"></div>
                  <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shimmer min-h-[500px]"></div>
                  <div className="lg:col-span-3 glass-panel p-6 rounded-2xl shimmer min-h-[150px]"></div>
                </div>
              ) : (
                <>
                  <DashboardZone id="zone-today" label="Daily briefing">
                    <div className="dashboard-zone__stack-tight">
                    <EditorialSpotlight
                      watchlist={data?.watchlist}
                      adversarialAssessment={data?.adversarialAssessment}
                      thesisDriftReport={data?.thesisDriftReport}
                      stressActive={stressActive}
                      onClusterClick={handleClusterClick}
                    />

                    <WeeklyBrief
                      weeklyBriefText={data?.weeklyBrief}
                      isMock={data?.isMock}
                      generatedAt={data?.lastUpdated}
                    />

                    <SignalStrip
                      thesisDriftReport={
                        stressActive ? null : data?.thesisDriftReport
                      }
                      onClusterClick={handleClusterClick}
                    />
                    </div>
                  </DashboardZone>

                  <DashboardZone id="zone-stress-test" label="Counter-thesis & scenarios">
                    <StressTestZone
                      adversarialAssessment={data?.adversarialAssessment}
                      isMock={data?.isMock}
                      suppressBlindspotAlert={suppressBlindspotInChallenge}
                      stressState={stressState}
                      onStressStateChange={setStressState}
                    />
                  </DashboardZone>

                  <DashboardZone id="zone-explore" label="Pillars & watchlist">
                    {stressActive && (
                      <ScenarioBanner
                        stressState={stressState}
                        onClear={handleClearScenario}
                        onViewModeChange={handleStressViewMode}
                      />
                    )}

                    <div className="flex flex-col gap-4">
                      <div id="zone-radar" className="scroll-mt-28">
                        <ThesisRadar
                          themeData={data?.themePulse}
                          thesisDriftReport={data?.thesisDriftReport}
                          watchlistData={data?.watchlist}
                          isMock={data?.isMock}
                          highlightThemeId={highlightThemeId}
                          stressResult={stressState.result}
                          stressViewMode={stressState.viewMode}
                          stackedLayout
                        />
                      </div>
                      <div id="zone-watchlist" className="scroll-mt-28">
                        <Watchlist
                          watchlistData={data?.watchlist}
                          stressResult={stressState.result}
                          stackedLayout
                          onWatchlistChange={refreshWatchlist}
                        />
                      </div>
                    </div>
                  </DashboardZone>

                  <DashboardZone id="zone-next-steps" label="Research tasks">
                    <ResearchQueue
                      researchQueue={data?.researchQueue}
                      isMock={data?.isMock}
                    />
                  </DashboardZone>
                </>
              )}
            </main>
          }
        />
        <Route path="/value-chain" element={<ValueChain />} />
        <Route path="/mastery-guide" element={<MasteryGuide />} />
      </Routes>
    </div>
  );
}

export default App;
