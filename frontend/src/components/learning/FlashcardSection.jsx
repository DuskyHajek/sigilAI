import { useMemo, useState } from "react";
import { FlipHorizontal2, Shuffle } from "lucide-react";
import { GLOSSARY } from "../../data/masteryGuideData";
import {
  GLOSSARY_THEME_TO_SLUG,
  QUIZ_THEME_FILTERS,
  THEME_LABELS,
  shuffle,
} from "../../data/academyData";
import { TipBox } from "./LearningUI";
import { actionBtn, filterBtn } from "./learningStyles";

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
      <TipBox icon={FlipHorizontal2}>
        Tap the card to flip. Try to recall the definition before revealing it — then use
        Prev/Next to move through the deck or filter by theme to focus your review.
      </TipBox>

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

      <div className="flashcard-perspective mb-2">
        <button
          type="button"
          className={`flashcard-inner w-full h-56 ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Hide definition" : "Reveal definition"}
        >
          <div className="flashcard-face flashcard-front glass-panel rounded-xl flex flex-col items-center justify-center p-6 text-center border border-sigil-gold/10">
            <p className="text-[10px] font-mono text-sigil-gold/80 uppercase tracking-widest mb-3">
              {THEME_LABELS[card.theme]}
            </p>
            <p className="text-xl font-bold text-white max-w-md">{card.term}</p>
            <p className="text-xs text-slate-500 mt-5 flex items-center gap-1.5">
              <FlipHorizontal2 size={12} />
              Tap to reveal
            </p>
          </div>
          <div className="flashcard-face flashcard-back glass-panel rounded-xl flex flex-col items-center justify-center p-6 text-center border border-emerald-500/15">
            <p className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest mb-3">
              Definition
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg overflow-y-auto max-h-40">
              {card.def}
            </p>
          </div>
        </button>
      </div>

      <p className="text-center text-[10px] font-mono text-slate-600 mb-4">
        Card {index + 1} of {filteredDeck.length}
      </p>

      <div className="flex items-center justify-center gap-3 mb-4">
        <button type="button" onClick={() => navigate(-1)} className={actionBtn.secondary}>
          ← Prev
        </button>
        <button
          type="button"
          onClick={shuffleDeck}
          className={`${actionBtn.secondary} flex items-center gap-1.5`}
        >
          <Shuffle size={12} />
          Shuffle
        </button>
        <button type="button" onClick={() => navigate(1)} className={actionBtn.secondary}>
          Next →
        </button>
      </div>
    </div>
  );
}
