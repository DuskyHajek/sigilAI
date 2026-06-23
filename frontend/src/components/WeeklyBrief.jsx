import { FileText } from "lucide-react";
import { SectionHeader } from "./learning/LearningUI";

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

  const badge = (
    <span
      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
        isMock
          ? "text-amber-400/90 border-amber-500/20"
          : "text-sigil-gold/90 border-sigil-gold/25 bg-sigil-gold/5"
      }`}
    >
      {isMock ? "Demo" : "Live"}
    </span>
  );

  return (
    <div className="glass-panel p-4 sm:p-5 md:p-6 rounded-2xl">
      <SectionHeader
        eyebrow="Summary"
        title="Analyst Brief"
        description={`AI narrative · synced ${formatGeneratedAt(generatedAt)}`}
        icon={FileText}
        action={badge}
      />

      <p className="text-sm sm:text-[15px] text-[#d4d4d4] leading-[1.65] whitespace-pre-wrap pl-3 sm:pl-4 py-0.5 font-sans -mt-2 border-l-2 border-white/10">
        {weeklyBriefText || "Click Sync to generate the latest brief."}
      </p>
    </div>
  );
};

export default WeeklyBrief;
