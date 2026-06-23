import { useState, useMemo } from "react";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Layers,
  Library,
  Search,
  Sparkles,
} from "lucide-react";
import {
  THEMES,
  NAV_TABS,
  READING_LIST,
  GLOSSARY,
  MENTAL_MODELS,
  ESSENTIAL_CONCEPT_COUNT,
} from "../data/masteryGuideData";
import { QUIZ_QUESTIONS, SCENARIOS } from "../data/academyData";
import QuizSection from "../components/learning/QuizSection";
import FlashcardSection from "../components/learning/FlashcardSection";
import ScenarioSection from "../components/learning/ScenarioSection";
import EssentialBadge from "../components/learning/EssentialBadge";
import ThemeBadge from "../components/learning/ThemeBadge";
import { ModeCard, SectionHeader, TipBox } from "../components/learning/LearningUI";
import { filterBtn } from "../components/learning/learningStyles";

const PRACTICE_TABS = [
  { id: "quiz", label: "Quiz", shortLabel: "Quiz", icon: HelpCircle },
  { id: "flashcards", label: "Flashcards", shortLabel: "Cards", icon: Layers },
  { id: "scenarios", label: "Scenarios", shortLabel: "Scenarios", icon: Sparkles },
];

const tabBtn = (active) =>
  `w-full text-center text-[10px] sm:text-xs font-mono font-bold px-2 sm:px-3 py-2 rounded-lg transition-all leading-snug ${
    active
      ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
      : "text-slate-500 hover:text-slate-200 bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/40"
  }`;

// ─── Level badge ─────────────────────────────────────────────────────────────

function LevelBadge({ level }) {
  const styles = {
    "Start Here":   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    "Intermediate": "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    "Advanced":     "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? ""}`}>
      {level}
    </span>
  );
}

// ─── Collapsible sub-section ─────────────────────────────────────────────────

function SubSection({ title, count, hint, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-slate-800/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <div className="flex items-center gap-2 min-w-0">
          {open
            ? <ChevronDown size={14} className="text-sigil-gold shrink-0" />
            : <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 shrink-0" />
          }
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-widest ${open ? "text-sigil-gold" : "text-slate-400 group-hover:text-slate-200"}`}>
                {title}
              </span>
              <span className="text-[10px] font-mono text-slate-600">{count}</span>
            </div>
            {hint && !open && (
              <p className="text-[10px] text-slate-600 mt-0.5 truncate">{hint}</p>
            )}
          </div>
        </div>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ─── Theme section ────────────────────────────────────────────────────────────

function ThemeSection({ data }) {
  const [essentialsOnly, setEssentialsOnly] = useState(false);

  const concepts = essentialsOnly
    ? data.concepts.filter((c) => c.essential)
    : data.concepts;
  const mentalModels = essentialsOnly
    ? data.mentalModels.filter((m) => m.essential)
    : data.mentalModels;
  const essentialCount =
    data.concepts.filter((c) => c.essential).length +
    data.mentalModels.filter((m) => m.essential).length;

  return (
    <div className="space-y-0">
      {essentialCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-1 border-b border-slate-800/40">
          <button
            type="button"
            onClick={() => setEssentialsOnly((v) => !v)}
            className={filterBtn(essentialsOnly)}
          >
            {essentialsOnly ? "Show all concepts" : "⚡ Essentials only"}
          </button>
          <span className="text-[10px] font-mono text-slate-600">
            {essentialCount} essential in this theme
          </span>
        </div>
      )}

      {/* Concepts */}
      <SubSection
        title="Key Concepts"
        count={concepts.length}
        hint="Core vocabulary for this theme"
        defaultOpen
      >
        <div className="space-y-2">
          {concepts.map((c, i) => (
            <div key={i} className="glass-panel rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white">{c.term}</p>
                {c.essential && <EssentialBadge />}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.definition}</p>
            </div>
          ))}
          {concepts.length === 0 && (
            <p className="text-xs text-slate-500 py-2">No essential concepts in this theme.</p>
          )}
        </div>
      </SubSection>

      {/* Books */}
      <SubSection title="Essential Books" count={data.books.length} hint="Curated reading with level badges">
        <div className="space-y-3">
          {data.books.map((b, i) => (
            <div key={i} className="flex gap-3 glass-panel rounded-xl p-4">
              <BookOpen size={16} className="text-sigil-gold shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{b.title}</span>
                  <LevelBadge level={b.level} />
                </div>
                <p className="text-[11px] font-mono text-slate-500 mb-1.5">{b.author}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{b.why}</p>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Courses */}
      <SubSection title="Courses & Resources" count={data.courses.length} hint="Free and paid learning paths">
        <div className="space-y-3">
          {data.courses.map((c, i) => (
            <div key={i} className="glass-panel rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-white">{c.name}</span>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">{c.platform}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.focus}</p>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Voices */}
      <SubSection title="Voices to Follow" count={data.voices.length} hint="Newsletters, podcasts & analysts">
        <div className="md:hidden space-y-3">
          {data.voices.map((v, i) => (
            <div key={i} className="glass-panel rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">{v.name}</p>
              <p className="text-[10px] font-mono text-slate-500 mb-2">{v.type}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{v.focus}</p>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left font-mono text-slate-500 pb-2 pr-4 w-44">Name</th>
                <th className="text-left font-mono text-slate-500 pb-2 pr-4 w-36">Format</th>
                <th className="text-left font-mono text-slate-500 pb-2">What They Cover</th>
              </tr>
            </thead>
            <tbody>
              {data.voices.map((v, i) => (
                <tr key={i} className="border-b border-slate-800/40">
                  <td className="py-2.5 pr-4 font-semibold text-white align-top">{v.name}</td>
                  <td className="py-2.5 pr-4 text-slate-500 font-mono align-top">{v.type}</td>
                  <td className="py-2.5 text-slate-400 align-top leading-relaxed">{v.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      {/* Mental Models */}
      <SubSection
        title="Mental Models"
        count={mentalModels.length}
        hint="Frameworks Sigil applies when investing"
      >
        <div className="space-y-3">
          {mentalModels.map((m, i) => (
            <div key={i} className="border-l-2 border-sigil-gold/40 pl-4 py-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-sigil-gold">{m.name}</p>
                {m.essential && <EssentialBadge />}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
            </div>
          ))}
          {mentalModels.length === 0 && (
            <p className="text-xs text-slate-500 py-2">No essential mental models in this theme.</p>
          )}
        </div>
      </SubSection>
    </div>
  );
}

// ─── Mental models (standalone tab) ───────────────────────────────────────────

function MentalModelsSection() {
  const [filterTheme, setFilterTheme] = useState("all");
  const [essentialsOnly, setEssentialsOnly] = useState(false);

  const themeFilters = useMemo(
    () => [
      { id: "all", label: "All themes" },
      ...THEMES.map((t) => ({ id: t.id, label: t.label.replace(/^\d+\.\s*/, "") })),
    ],
    []
  );

  const filtered = useMemo(
    () =>
      MENTAL_MODELS.filter((m) => {
        if (filterTheme !== "all" && m.themeId !== filterTheme) return false;
        if (essentialsOnly && !m.essential) return false;
        return true;
      }),
    [filterTheme, essentialsOnly]
  );

  return (
    <div className="space-y-5">
      <TipBox icon={Brain}>
        All {MENTAL_MODELS.length} mental models in one place — filter by theme or show
        essentials only. Each also lives inside its theme section for context.
      </TipBox>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEssentialsOnly((v) => !v)}
          className={filterBtn(essentialsOnly)}
        >
          {essentialsOnly ? "Show all models" : "⚡ Essentials only"}
        </button>
      </div>

      <div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">
          Theme
        </p>
        <div className="flex flex-wrap gap-2">
          {themeFilters.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilterTheme(id)}
              className={filterBtn(filterTheme === id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] font-mono text-slate-600">{filtered.length} models</p>

      <div className="space-y-3">
        {filtered.map((m, i) => (
          <div key={`${m.themeId}-${m.name}`} className="glass-panel rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-slate-600">{i + 1}</span>
              <p className="text-sm font-semibold text-sigil-gold">{m.name}</p>
              {m.essential && <EssentialBadge />}
              {m.themeSlug && <ThemeBadge slug={m.themeSlug} />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No models match the current filters.</p>
        )}
      </div>
    </div>
  );
}

// ─── Reading list ─────────────────────────────────────────────────────────────

function ReadingListSection() {
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterTheme, setFilterTheme] = useState("All");
  const levels = ["All", "Start Here", "Intermediate", "Advanced"];
  const themes = useMemo(() => ["All", ...Array.from(new Set(READING_LIST.map(b => b.theme)))], []);
  const filtered = useMemo(
    () => READING_LIST.filter(b =>
      (filterLevel === "All" || b.level === filterLevel) &&
      (filterTheme === "All" || b.theme === filterTheme)
    ),
    [filterLevel, filterTheme]
  );

  return (
    <div className="space-y-6">
      <TipBox icon={BookOpen}>
        Filter by reading level or theme. Work through all &ldquo;Start Here&rdquo; books across themes
        before moving to Intermediate — the list is ordered by priority, not alphabetically.
      </TipBox>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Start Here", count: READING_LIST.filter(b => b.level === "Start Here").length, color: "text-emerald-400" },
          { label: "Intermediate", count: READING_LIST.filter(b => b.level === "Intermediate").length, color: "text-sky-400" },
          { label: "Advanced", count: READING_LIST.filter(b => b.level === "Advanced").length, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-3 sm:p-4 text-center">
            <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Level</p>
          <div className="flex flex-wrap gap-2">
            {levels.map(l => (
              <button key={l} onClick={() => setFilterLevel(l)}
                className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
                  filterLevel === l
                    ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
                    : "text-slate-500 hover:text-slate-300 bg-slate-800/40 border border-slate-700/40"
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Theme</p>
          <div className="flex flex-wrap gap-2">
            {themes.map(t => (
              <button key={t} onClick={() => setFilterTheme(t)}
                className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
                  filterTheme === t
                    ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
                    : "text-slate-500 hover:text-slate-300 bg-slate-800/40 border border-slate-700/40"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book list */}
      <div className="space-y-3">
        {filtered.map((b, i) => (
          <div key={i} className="flex gap-3 glass-panel rounded-xl p-4">
            <BookOpen size={15} className="text-sigil-gold shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white">{b.title}</span>
                <LevelBadge level={b.level} />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-500">{b.theme}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 mb-1">{b.author}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{b.why}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No books match the current filters.</p>
        )}
      </div>
    </div>
  );
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

function GlossarySection() {
  const [search, setSearch] = useState("");
  const [filterTheme, setFilterTheme] = useState("All");
  const themes = useMemo(() => ["All", ...Array.from(new Set(GLOSSARY.map(t => t.theme)))], []);
  const filtered = useMemo(
    () => GLOSSARY
      .filter(t =>
        (filterTheme === "All" || t.theme === filterTheme) &&
        (search === "" || t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.definition.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => a.term.localeCompare(b.term)),
    [search, filterTheme]
  );

  return (
    <div className="space-y-5">
      <TipBox icon={Search}>
        Search while reading research or evaluating pitches. These same terms appear as flashcards
        in Practice mode — use both together to build retention.
      </TipBox>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search terms or definitions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sigil-gold/40"
        />
      </div>

      {/* Theme filter */}
      <div className="flex flex-wrap gap-2">
        {themes.map(t => (
          <button key={t} onClick={() => setFilterTheme(t)}
            className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all ${
              filterTheme === t
                ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
                : "text-slate-500 hover:text-slate-300 bg-slate-800/40 border border-slate-700/40"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <p className="text-[10px] font-mono text-slate-600">{filtered.length} terms</p>

      {/* Terms */}
      <div className="space-y-2">
        {filtered.map((t, i) => (
          <div key={i} className="glass-panel rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-sm font-semibold text-white">{t.term}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-500">{t.theme}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{t.definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No terms match your search.</p>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MasteryGuide() {
  const [mode, setMode] = useState("reference");
  const [activeTab, setActiveTab] = useState("overview");
  const [practiceTab, setPracticeTab] = useState("quiz");
  const activeTheme = mode === "reference" ? THEMES.find(t => t.id === activeTab) : null;

  const switchMode = (next) => {
    setMode(next);
    if (next === "practice") setPracticeTab("quiz");
    else setActiveTab("overview");
  };

  const goToFlashcards = () => {
    setMode("practice");
    setPracticeTab("flashcards");
  };

  const conceptCount = useMemo(
    () => THEMES.reduce((n, t) => n + t.concepts.length, 0),
    []
  );

  const heroStats =
    mode === "reference"
      ? [
          { value: String(conceptCount), label: "Concepts" },
          { value: String(ESSENTIAL_CONCEPT_COUNT), label: "Essential" },
          { value: String(MENTAL_MODELS.length), label: "Models" },
        ]
      : [
          { value: String(QUIZ_QUESTIONS.length), label: "Questions" },
          { value: String(GLOSSARY.length), label: "Flashcards" },
          { value: String(SCENARIOS.length), label: "Scenarios" },
        ];

  return (
    <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full min-w-0">
      {/* Hero */}
      <div className="hero-guide rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden border border-sigil-gold/10">
        <div className="hero-guide__accent" />
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">Sigil Supernova</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Learning Hub</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {mode === "reference"
                ? "Books, concepts, mental models & glossary for all 7 themes"
                : "Quizzes, flashcards & scenarios to test your mastery"}
            </p>
            <p className="text-[11px] font-mono text-slate-600 mt-2 flex items-center gap-1.5">
              <GraduationCap size={12} className="text-sigil-gold/60 shrink-0" />
              Reference to learn · Practice to retain
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {heroStats.map(s => (
              <div
                key={s.label}
                className="text-center px-2 sm:px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800/60"
              >
                <p className="text-lg sm:text-xl font-bold text-sigil-gold">{s.value}</p>
                <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-tight mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-5">
        <ModeCard
          active={mode === "reference"}
          icon={Library}
          label="Reference"
          description="Read curriculum — concepts, books, glossary & mental models"
          onClick={() => switchMode("reference")}
        />
        <ModeCard
          active={mode === "practice"}
          icon={Brain}
          label="Practice"
          description="Active study — quiz yourself, flip flashcards, walk through scenarios"
          onClick={() => switchMode("practice")}
        />
      </div>

      {/* Tab navigation — wrapping grid, no horizontal scroll */}
      <nav
        aria-label={mode === "reference" ? "Reference sections" : "Practice sections"}
        className={`grid gap-1.5 mb-4 sm:mb-6 ${
          mode === "reference"
            ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11"
            : "grid-cols-3"
        }`}
      >
        {mode === "reference"
          ? NAV_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={tabBtn(activeTab === tab.id)}
                title={tab.label}
              >
                {tab.shortLabel}
              </button>
            ))
          : PRACTICE_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPracticeTab(tab.id)}
                  className={`${tabBtn(practiceTab === tab.id)} flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5`}
                  title={tab.label}
                >
                  <Icon size={12} className="shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
      </nav>

      {/* Content panel */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 min-w-0">
        {mode === "practice" && practiceTab === "quiz" && (
          <QuizSection onReviewFlashcards={goToFlashcards} />
        )}

        {mode === "practice" && practiceTab === "flashcards" && (
          <>
            <SectionHeader
              eyebrow="Spaced Review"
              title={`Flashcards — ${GLOSSARY.length} Terms`}
              description="Same glossary terms, flipped into active recall. Filter by theme to focus your session."
              icon={Layers}
            />
            <FlashcardSection />
          </>
        )}

        {mode === "practice" && practiceTab === "scenarios" && (
          <>
            <SectionHeader
              eyebrow="Applied Thinking"
              title={`Scenario Practice — ${SCENARIOS.length} Cases`}
              description="Realistic investment situations. Form your view first, then compare with the framework analysis."
              icon={Sparkles}
            />
            <ScenarioSection />
          </>
        )}

        {mode === "reference" && activeTab === "mental-models" && (
          <>
            <SectionHeader
              eyebrow="Frameworks"
              title={`Mental Models — ${MENTAL_MODELS.length} Frameworks`}
              description="Sigil's decision-making toolkit across all themes. Filter by theme or essentials."
              icon={Brain}
            />
            <MentalModelsSection />
          </>
        )}

        {mode === "reference" && activeTheme && (
          <>
            <SectionHeader
              eyebrow={activeTheme.label}
              title={activeTheme.tagline}
              description={activeTheme.description}
              icon={BookOpen}
            />
            <TipBox icon={ClipboardList}>
              Expand each section below — concepts first, then books, courses, voices, and mental
              models. Collapsed hints show what each block contains.
            </TipBox>
            <ThemeSection data={activeTheme} />
          </>
        )}

        {mode === "reference" && activeTab === "reading" && (
          <>
            <SectionHeader
              eyebrow="Master Reading List"
              title={`Complete Curriculum — ${READING_LIST.length} Books`}
              description='Ordered by priority. Start with all "Start Here" books across themes before Intermediate.'
              icon={BookOpen}
            />
            <ReadingListSection />
          </>
        )}

        {mode === "reference" && activeTab === "glossary" && (
          <>
            <SectionHeader
              eyebrow="Reference Dictionary"
              title={`Glossary — ${GLOSSARY.length} Terms`}
              description="Alphabetical quick-reference for all key terms. Pair with Flashcards in Practice to test recall."
              icon={Search}
            />
            <GlossarySection />
          </>
        )}
      </div>
    </main>
  );
}
