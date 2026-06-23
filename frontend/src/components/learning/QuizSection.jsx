import { useState } from "react";
import { Clock, HelpCircle, Layers, Target, Zap } from "lucide-react";
import {
  QUIZ_QUESTIONS,
  QUIZ_THEME_FILTERS,
  DIFFICULTY_LABELS,
  shuffle,
} from "../../data/academyData";
import ThemeBadge from "./ThemeBadge";
import { SectionHeader, TipBox } from "./LearningUI";
import { actionBtn, filterBtn } from "./learningStyles";

const QUIZ_MODES = [
  {
    mode: "quick",
    title: "Quick",
    subtitle: "10 questions",
    desc: "Random mix — good for a daily check-in.",
    icon: Zap,
  },
  {
    mode: "full",
    title: "Full",
    subtitle: "60 questions",
    desc: "Every theme covered — best before a review session.",
    icon: Layers,
  },
];

function quizHeader({ phase, quizMode, themeLabel, questionCount, index, score }) {
  if (phase === "setup") {
    return {
      title: "Quiz",
      description:
        "Choose quick (10 questions), full (60), or drill one theme. Instant feedback after each answer.",
    };
  }
  if (phase === "results") {
    return {
      title: "Quiz complete",
      description: `You answered ${score} of ${questionCount} correctly. Review misses below or pick another mode.`,
    };
  }
  const modeTitle =
    quizMode === "quick"
      ? "Quick quiz · 10 questions"
      : quizMode === "full"
        ? "Full quiz · 60 questions"
        : themeLabel
          ? `${themeLabel} · ${questionCount} questions`
          : `${questionCount}-question quiz`;
  return {
    title: modeTitle,
    description: `Question ${index + 1} of ${questionCount}. Choose an answer to see the explanation.`,
  };
}

function DifficultyBadge({ difficulty }) {
  const styles = {
    beginner: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    intermediate: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    advanced: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  const label = DIFFICULTY_LABELS[difficulty] ?? difficulty;
  return (
    <span
      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${styles[difficulty] ?? "bg-slate-800/60 text-slate-500 border border-slate-700/40"}`}
    >
      {label}
    </span>
  );
}

export default function QuizSection({ onReviewFlashcards }) {
  const [phase, setPhase] = useState("setup");
  const [quizMode, setQuizMode] = useState(null);
  const [themeLabel, setThemeLabel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);

  const startQuiz = (mode, theme) => {
    let pool = QUIZ_QUESTIONS.slice();
    if (mode === "theme" && theme) {
      pool = QUIZ_QUESTIONS.filter((q) => q.theme === theme);
    }
    pool = shuffle(pool);
    const count =
      mode === "quick" ? 10 : mode === "theme" ? Math.min(pool.length, 8) : pool.length;
    setQuizMode(mode);
    setThemeLabel(
      mode === "theme"
        ? QUIZ_THEME_FILTERS.find((t) => t.slug === theme)?.label ?? theme
        : null
    );
    setQuestions(pool.slice(0, count));
    setIndex(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setResults([]);
    setPhase("active");
  };

  const answer = (choiceIndex) => {
    if (answered) return;
    const q = questions[index];
    const correct = choiceIndex === q.correct;
    setAnswered(true);
    setSelected(choiceIndex);
    if (correct) setScore((s) => s + 1);
    setResults((r) => [...r, { q: q.q, correct }]);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase("results");
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(false);
    setSelected(null);
  };

  const reset = () => {
    setPhase("setup");
    setQuizMode(null);
    setThemeLabel(null);
    setQuestions([]);
  };

  const header = quizHeader({
    phase,
    quizMode,
    themeLabel,
    questionCount: questions.length,
    index,
    score,
  });

  const quizHeaderBlock = (
    <SectionHeader
      eyebrow="Knowledge Check"
      title={header.title}
      description={header.description}
      icon={HelpCircle}
    />
  );

  if (phase === "setup") {
    return (
      <div>
        {quizHeaderBlock}
        <TipBox icon={Target}>
          Choose a mode below. Each answer shows an explanation immediately — use wrong
          answers as a map to topics worth revisiting in Reference or Flashcards.
        </TipBox>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {QUIZ_MODES.map(({ mode, title, subtitle, desc, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => startQuiz(mode)}
              className="glass-panel rounded-xl p-4 text-left border border-slate-800/60 hover:border-sigil-gold/30 hover:bg-slate-800/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-sigil-gold/10 border border-sigil-gold/20 flex items-center justify-center group-hover:bg-sigil-gold/15 transition-colors">
                  <Icon size={16} className="text-sigil-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {title}{" "}
                    <span className="text-slate-500 font-normal">· {subtitle}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
          Or drill one theme
        </p>
        <div className="flex flex-wrap gap-2">
          {QUIZ_THEME_FILTERS.map(({ slug, label }) => (
            <button
              key={slug}
              type="button"
              onClick={() => startQuiz("theme", slug)}
              className={filterBtn(false)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const pct = Math.round((score / questions.length) * 100);
    const msg =
      pct >= 80
        ? "Excellent mastery — Sigil would approve."
        : pct >= 60
          ? "Good progress — review the missed questions and try again."
          : "Keep studying — use flashcards for the themes you missed.";
    const wrong = results.filter((r) => !r.correct);
    const ringColor =
      pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-sky-400" : "text-amber-400";

    return (
      <div>
        {quizHeaderBlock}
        <div className="glass-panel rounded-xl p-8 text-center mb-5 border border-slate-800/60">
          <p className={`text-5xl font-bold mb-1 ${ringColor}`}>{pct}%</p>
          <p className="text-lg font-semibold text-white mb-1">
            {score} of {questions.length} correct
          </p>
          <p className="text-sm text-slate-400">{msg}</p>
        </div>
        {wrong.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
              Review these ({wrong.length})
            </p>
            <div className="space-y-2">
              {wrong.map((r, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-lg p-3 text-xs text-slate-400 border-l-2 border-rose-500/30"
                >
                  {r.q}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => startQuiz("full")} className={actionBtn.primary}>
            Try again
          </button>
          <button type="button" onClick={onReviewFlashcards} className={actionBtn.secondary}>
            Review flashcards
          </button>
          <button type="button" onClick={reset} className={actionBtn.secondary}>
            Quiz menu
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div>
      {quizHeaderBlock}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
          <Clock size={12} />
          Question {index + 1} of {questions.length}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {q.difficulty && <DifficultyBadge difficulty={q.difficulty} />}
          <ThemeBadge slug={q.theme} />
        </div>
      </div>
      <div className="h-2 bg-slate-800/80 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sigil-gold/50 to-sigil-gold rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="glass-panel rounded-xl p-5 mb-4 border border-slate-800/60">
        <p className="text-sm font-semibold text-white mb-4 leading-relaxed">{q.q}</p>
        <div className="flex flex-col gap-2">
          {q.choices.map((choice, i) => {
            let cls =
              "w-full text-left text-sm px-4 py-3 rounded-lg border transition-all ";
            if (answered) {
              cls += "cursor-default ";
              if (i === q.correct) {
                cls += "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
              } else if (i === selected) {
                cls += "border-rose-500/40 bg-rose-500/10 text-rose-300";
              } else {
                cls += "border-slate-700/40 text-slate-500";
              }
            } else {
              cls +=
                "border-slate-700/40 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600/40 cursor-pointer";
            }
            return (
              <button key={i} type="button" className={cls} onClick={() => answer(i)}>
                <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                {choice}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="mt-4 pl-3 border-l-2 border-sigil-gold/40 text-xs text-slate-400 leading-relaxed">
            {selected === q.correct ? "✓ Correct — " : "✗ Wrong — "}
            {q.explain}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {answered && (
          <button type="button" onClick={next} className={actionBtn.primary}>
            {index + 1 >= questions.length ? "See results" : "Next question →"}
          </button>
        )}
        <button type="button" onClick={reset} className={actionBtn.secondary}>
          End quiz
        </button>
      </div>
    </div>
  );
}
