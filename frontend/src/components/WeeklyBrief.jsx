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
    <div className="glass-panel p-6 md:p-7 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-sigil-gold shrink-0" />
          <h2 className="text-base font-semibold text-slate-100">
            Analyst Brief
          </h2>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          {formatGeneratedAt(generatedAt)}
        </span>

        <span
          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            isMock
              ? "text-amber-400/90 border-amber-500/20 bg-transparent"
              : "text-emerald-400/90 border-emerald-500/20 bg-transparent"
          }`}
        >
          {isMock ? "Demo narrative" : "Claude · Supernova prompt"}
        </span>
      </div>

      <p className="text-[17px] md:text-lg text-slate-100 leading-relaxed whitespace-pre-wrap border-l-2 border-sigil-gold/30 pl-4 py-0.5 font-sans">
        {weeklyBriefText || "Click Sync to generate the latest brief."}
      </p>
    </div>
  );
};

export default WeeklyBrief;
