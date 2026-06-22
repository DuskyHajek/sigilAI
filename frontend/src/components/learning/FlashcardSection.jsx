import { useMemo, useState } from "react";
import { GLOSSARY } from "../../data/masteryGuideData";
import {
  GLOSSARY_THEME_TO_SLUG,
  QUIZ_THEME_FILTERS,
  THEME_LABELS,
  shuffle,
} from "../../data/academyData";
const filterBtn = (active) =>
  `text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
    active
      ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
      : "text-slate-500 hover:text-slate-300 bg-slate-800/40 border border-slate-700/40"
  }`;

const ALL_FLASHCARDS = GLOSSARY.map(({ term, definition, theme }) => ({
  term,
  def: definition,
  theme: GLOSSARY_THEME_TO_SLUG[theme] ?? "overview",
}));

export default function FlashcardSection() {
  const [themeFilter, setThemeFilter] = useState("all");
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [deck, setDeck] = useState(() => shuffle(ALL_FLASHCARDS));

  const filteredDeck = useMemo(() => {
    if (themeFilter === "all") return deck;
    return deck.filter((c) => c.theme === themeFilter);
  }, [deck, themeFilter]);

  const card = filteredDeck[index] ?? filteredDeck[0];

  const setTheme = (slug) => {
    setThemeFilter(slug);
    setFlipped(false);
    setIndex(0);
    if (slug === "all") {
      setDeck(shuffle(ALL_FLASHCARDS));
    } else {
      setDeck(shuffle(ALL_FLASHCARDS.filter((c) => c.theme === slug)));
    }
  };

  const navigate = (dir) => {
    if (filteredDeck.length === 0) return;
    setFlipped(false);
    setIndex((i) => (i + dir + filteredDeck.length) % filteredDeck.length);
  };

  const shuffleDeck = () => {
    setFlipped(false);
    setIndex(0);
    setDeck((d) => shuffle(d));
  };

  if (!card) {
    return <p className="text-sm text-slate-500 text-center py-8">No cards for this theme.</p>;
  }

  return (
    <div>
      <p className="text-sm text-slate-400 mb-4">
        Click the card to flip and reveal the definition.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        <button type="button" onClick={() => setTheme("all")} className={filterBtn(themeFilter === "all")}>
          All
        </button>
        {QUIZ_THEME_FILTERS.map(({ slug, label }) => (
          <button
            key={slug}
            type="button"
            onClick={() => setTheme(slug)}
            className={filterBtn(themeFilter === slug)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flashcard-perspective mb-4">
        <button
          type="button"
          className={`flashcard-inner w-full h-52 ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Hide definition" : "Reveal definition"}
        >
          <div className="flashcard-face flashcard-front glass-panel rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
              {THEME_LABELS[card.theme]}
            </p>
            <p className="text-xl font-bold text-white">{card.term}</p>
            <p className="text-xs text-slate-500 mt-4">Click to reveal definition</p>
          </div>
          <div className="flashcard-face flashcard-back glass-panel rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
              Definition
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{card.def}</p>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200"
        >
          ← Prev
        </button>
        <span className="text-xs font-mono text-slate-500">
          {index + 1} / {filteredDeck.length}
        </span>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200"
        >
          Next →
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={shuffleDeck}
          className="text-xs font-mono font-bold px-4 py-2 rounded-lg text-slate-400 bg-slate-800/40 border border-slate-700/40 hover:text-slate-200"
        >
          Shuffle deck
        </button>
      </div>
    </div>
  );
}
