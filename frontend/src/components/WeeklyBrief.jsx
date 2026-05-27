import { FileText } from "lucide-react";

const WeeklyBrief = ({ weeklyBriefText, isMock, generatedAt }) => {
  const formatGeneratedAt = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (!Number.isFinite(date.getTime())) return "N/A";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-sigil-gold" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
                ANALYST BRIEF
              </h3>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Generated {formatGeneratedAt(generatedAt)}
            </span>

            <span className="text-[11px] font-mono text-slate-500">
              Source: {isMock ? "SIMULATION" : "CLAUDE"}
            </span>
          </div>

          <p className="mt-3 text-[15px] text-slate-100 leading-relaxed whitespace-pre-wrap border-l-2 border-emerald-500/30 pl-4 py-1 font-sans">
            {weeklyBriefText || "Syncing with intelligence networks..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBrief;
