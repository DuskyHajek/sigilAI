import { FileText } from "lucide-react";

const WeeklyBrief = ({ weeklyBriefText, isMock, generatedAt }) => {
  const formatGeneratedAt = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (!Number.isFinite(date.getTime())) return "N/A";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/15">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-emerald-400/80 mb-1">
            Panel 01 · Start here
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">
                Analyst Brief
              </h3>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              {formatGeneratedAt(generatedAt)}
            </span>

            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                isMock
                  ? "text-amber-400/90 border-amber-500/20 bg-amber-500/5"
                  : "text-emerald-400/90 border-emerald-500/20 bg-emerald-500/5"
              }`}
            >
              {isMock ? "Demo narrative" : "Claude · Supernova prompt"}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Synthesized across all themes — top signal, secondary watch, counter-thesis risk.
          </p>

          <p className="mt-3 text-[15px] text-slate-100 leading-relaxed whitespace-pre-wrap border-l-2 border-emerald-500/30 pl-4 py-1 font-sans">
            {weeklyBriefText || "Click Sync to generate the latest brief."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBrief;
