import { useState } from "react";
import { ChevronDown, ChevronRight, Lightbulb, MessageSquareQuote } from "lucide-react";
import {
  INTERVIEW_CATEGORIES,
  INTERVIEW_QUESTIONS,
} from "../../data/academyData";
import { TipBox } from "./LearningUI";
import { filterBtn } from "./learningStyles";

const CATEGORY_FILTERS = [
  { id: "all", label: "All" },
  ...Object.entries(INTERVIEW_CATEGORIES).map(([id, label]) => ({ id, label })),
];

export default function InterviewPrepSection() {
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered =
    category === "all"
      ? INTERVIEW_QUESTIONS
      : INTERVIEW_QUESTIONS.filter((q) => q.category === category);

  return (
    <div>
      <TipBox icon={MessageSquareQuote}>
        Practice out loud before your interview. Read each question, form your own answer
        first, then reveal the hint and sample answer. These map to Sigil&apos;s Day 0
        analyst expectations — thesis depth, dashboard fluency, and honest uncertainty.
      </TipBox>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setCategory(id)}
            className={filterBtn(category === id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item, i) => {
          const open = expanded === item.id;
          return (
            <div
              key={item.id}
              className="glass-panel rounded-xl border border-slate-800/60 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(open ? null : item.id)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-800/20 transition-colors"
              >
                <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-xs font-mono font-bold text-sigil-gold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {INTERVIEW_CATEGORIES[item.category]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed pr-6">
                    {item.question}
                  </p>
                </div>
                {open ? (
                  <ChevronDown size={16} className="text-sigil-gold shrink-0 mt-1" />
                ) : (
                  <ChevronRight size={16} className="text-slate-500 shrink-0 mt-1" />
                )}
              </button>

              {open && (
                <div className="px-4 pb-4 pt-0 space-y-3 border-t border-slate-800/40 mx-4">
                  <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 px-3 py-2.5">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Lightbulb size={11} />
                      Hint
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.hint}</p>
                  </div>
                  <div className="rounded-lg bg-sigil-gold/[0.04] border border-sigil-gold/15 px-3 py-2.5">
                    <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">
                      Sample answer
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.sampleAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
