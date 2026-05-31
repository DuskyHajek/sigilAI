import { useState, useMemo } from "react";
import { BookOpen, ChevronDown, ChevronRight, Search } from "lucide-react";
import { THEMES, NAV_TABS, READING_LIST, GLOSSARY } from "../data/masteryGuideData";

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

function SubSection({ title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-slate-800/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <div className="flex items-center gap-2">
          {open
            ? <ChevronDown size={14} className="text-sigil-gold" />
            : <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300" />
          }
          <span className={`text-xs font-mono font-bold uppercase tracking-widest ${open ? "text-sigil-gold" : "text-slate-400 group-hover:text-slate-200"}`}>
            {title}
          </span>
          <span className="text-[10px] font-mono text-slate-600">{count}</span>
        </div>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ─── Theme section ────────────────────────────────────────────────────────────

function ThemeSection({ data }) {
  return (
    <div className="space-y-0">
      {/* Concepts */}
      <SubSection title="Key Concepts" count={data.concepts.length} defaultOpen>
        <div className="space-y-2">
          {data.concepts.map((c, i) => (
            <div key={i} className="glass-panel rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">{c.term}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{c.definition}</p>
            </div>
          ))}
        </div>
      </SubSection>

      {/* Books */}
      <SubSection title="Essential Books" count={data.books.length}>
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
      <SubSection title="Courses & Resources" count={data.courses.length}>
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
      <SubSection title="Voices to Follow" count={data.voices.length}>
        <div className="overflow-x-auto">
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
      <SubSection title="Mental Models" count={data.mentalModels.length}>
        <div className="space-y-3">
          {data.mentalModels.map((m, i) => (
            <div key={i} className="border-l-2 border-sigil-gold/40 pl-4 py-1">
              <p className="text-sm font-semibold text-sigil-gold mb-1">{m.name}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </SubSection>
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
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Start Here", count: READING_LIST.filter(b => b.level === "Start Here").length, color: "text-emerald-400" },
          { label: "Intermediate", count: READING_LIST.filter(b => b.level === "Intermediate").length, color: "text-sky-400" },
          { label: "Advanced", count: READING_LIST.filter(b => b.level === "Advanced").length, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
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
  const [activeTab, setActiveTab] = useState("overview");
  const activeTheme = THEMES.find(t => t.id === activeTab);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Hero */}
      <div className="hero-guide rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="hero-guide__accent" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">Sigil Supernova</p>
            <h2 className="text-2xl font-bold text-white mb-1">Learning Hub</h2>
            <p className="text-sm text-slate-400">Books, concepts, glossary & mental models for all 7 themes</p>
          </div>
          <div className="flex gap-6 shrink-0">
            {[
              { value: "135+", label: "Concepts" },
              { value: "34", label: "Books" },
              { value: "55+", label: "Glossary" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-sigil-gold">{s.value}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 text-xs font-mono font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-sigil-gold/15 text-sigil-gold border border-sigil-gold/30"
                : "text-slate-500 hover:text-slate-200 bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="glass-panel rounded-2xl p-6">
        {activeTheme && (
          <>
            <div className="mb-6">
              <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">{activeTheme.label}</p>
              <h3 className="text-lg font-bold text-white mb-1">{activeTheme.tagline}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{activeTheme.description}</p>
            </div>
            <ThemeSection data={activeTheme} />
          </>
        )}

        {activeTab === "reading" && (
          <>
            <div className="mb-6">
              <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">Master Reading List</p>
              <h3 className="text-lg font-bold text-white mb-1">Complete Curriculum — {READING_LIST.length} Books</h3>
              <p className="text-sm text-slate-400">Ordered by priority. Start with all "Start Here" books across all themes before moving to Intermediate.</p>
            </div>
            <ReadingListSection />
          </>
        )}

        {activeTab === "glossary" && (
          <>
            <div className="mb-6">
              <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-1">Reference Dictionary</p>
              <h3 className="text-lg font-bold text-white mb-1">Glossary — {GLOSSARY.length} Terms</h3>
              <p className="text-sm text-slate-400">All key terms across the 7 themes, alphabetical. Your quick-reference when reading research or evaluating pitches.</p>
            </div>
            <GlossarySection />
          </>
        )}
      </div>
    </main>
  );
}
