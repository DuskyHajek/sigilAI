import { useEffect, useState } from "react";
import { ShieldAlert, FlaskConical } from "lucide-react";
import ChallengeThesis from "./ChallengeThesis";
import StressTestPanel from "./StressTestPanel";

const TABS = [
  { id: "live", label: "Live headlines", icon: ShieldAlert },
  { id: "scenarios", label: "Hypothetical scenarios", icon: FlaskConical },
];

const StressTestZone = ({
  adversarialAssessment,
  isMock,
  suppressBlindspotAlert,
  stressState,
  onStressStateChange,
}) => {
  const [activeTab, setActiveTab] = useState("live");
  const stressActive =
    stressState.status === "ready" && stressState.result;

  useEffect(() => {
    if (stressActive) {
      setActiveTab("scenarios");
    }
  }, [stressActive]);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 px-5 pt-4 pb-0">
        <div
          className="flex gap-1 p-1 rounded-lg bg-slate-950/60 border border-slate-800 shrink-0 w-full sm:w-auto"
          role="tablist"
          aria-label="Stress test mode"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono transition-colors ${
                activeTab === id
                  ? id === "live"
                    ? "bg-rose-500/10 text-rose-300 border border-rose-500/25"
                    : "bg-sigil-gold/10 text-sigil-gold border border-sigil-gold/25"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              <Icon size={12} className="shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{id === "live" ? "Live" : "Scenarios"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 md:p-6 pt-4 border-t border-slate-800/60 mt-4">
        {activeTab === "live" ? (
          <ChallengeThesis
            adversarialAssessment={adversarialAssessment}
            isMock={isMock}
            suppressBlindspotAlert={suppressBlindspotAlert}
            embedded
          />
        ) : (
          <StressTestPanel
            stressState={stressState}
            onStressStateChange={onStressStateChange}
            isMock={isMock}
            embedded
            compactResults={stressActive}
          />
        )}
      </div>
    </div>
  );
};

export default StressTestZone;
