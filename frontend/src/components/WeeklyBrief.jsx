import { FileText } from "lucide-react";
import { SectionHeader } from "./learning/LearningUI";

const splitBriefSentences = (text) => {
  const trimmed = String(text || "").trim();
  if (!trimmed) return [];

  const parts = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g);
  if (!parts) return [trimmed];

  return parts.map((part) => part.trim()).filter(Boolean);
};

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

  const sentences = splitBriefSentences(weeklyBriefText);
  const hasContent = sentences.length > 0;

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

      {hasContent ? (
        <div className="space-y-3 pl-3 sm:pl-4 -mt-2 border-l-2 border-white/10">
          {sentences.map((sentence, index) => (
            <p
              key={`${index}-${sentence.slice(0, 24)}`}
              className={
                index === 0
                  ? "text-base sm:text-[17px] font-semibold text-white leading-snug tracking-tight"
                  : "text-sm sm:text-[15px] text-[#b8b8b8] leading-relaxed"
              }
            >
              {sentence}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#a0a0a0] pl-3 sm:pl-4 -mt-2 border-l-2 border-white/10">
          Click Sync to generate the latest brief.
        </p>
      )}
    </div>
  );
};

export default WeeklyBrief;
