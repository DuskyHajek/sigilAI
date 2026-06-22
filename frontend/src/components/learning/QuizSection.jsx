import { useState } from "react";
import {
  QUIZ_QUESTIONS,
  QUIZ_THEME_FILTERS,
  shuffle,
} from "../../data/academyData";
import ThemeBadge from "./ThemeBadge";

const filterBtn = (active) =>
  `text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
    active
      ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
      : "text-slate-500 hover:text-slate-300 bg-slate-800/40 border border-slate-700/40"
  }`;

export default function QuizSection({ onReviewFlashcards }) {
  const [phase, setPhase] = useState("setup");
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
      mode === "quick" ? 10 : mode === "theme" ? Math.min(pool.length, 8) : 30;
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
    setQuestions([]);
  };

  if (phase === "setup") {
    return (
      <div>
        <p className="text-sm text-slate-400 mb-5">
          Test your mastery across all 7 themes. Choose a mode.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {[
            { mode: "quick", title: "Quick (10 questions)", desc: "Random mix across all themes" },
            { mode: "full", title: "Full (30 questions)", desc: "Comprehensive coverage of every theme" },
          ].map(({ mode, title, desc }) => (
            <button
              key={mode}
              type="button"
              onClick={() => startQuiz(mode)}
              className="glass-panel rounded-xl p-4 text-left border border-transparent hover:border-sigil-gold/30 transition-all"
            >
              <p className="text-sm font-semibold text-white mb-1">{title}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </button>
          ))}
        </div>
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
          Or quiz by theme
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

    return (
      <div>
        <div className="glass-panel rounded-xl p-8 text-center mb-5">
          <p className="text-4xl font-bold text-sigil-gold mb-2">
            {score}/{questions.length} ({pct}%)
          </p>
          <p className="text-sm text-slate-400">{msg}</p>
        </div>
        {wrong.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              Review these questions
            </p>
            <div className="space-y-2">
              {wrong.map((r, i) => (
                <div key={i} className="glass-panel rounded-lg p-3 text-xs text-slate-400">
                  {r.q}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => startQuiz("full")}
            className="text-xs font-mono font-bold px-4 py-2 rounded-lg bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={onReviewFlashcards}
            className="text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200"
          >
            Review flashcards
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200"
          >
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
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-slate-500">
          Question {index + 1} of {questions.length}
        </span>
        <ThemeBadge slug={q.theme} />
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-sigil-gold/70 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="glass-panel rounded-xl p-5 mb-4">
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
          <button
            type="button"
            onClick={next}
            className="text-xs font-mono font-bold px-4 py-2 rounded-lg bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
          >
            {index + 1 >= questions.length ? "See results" : "Next question →"}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200"
        >
          End quiz
        </button>
      </div>
    </div>
  );
}
