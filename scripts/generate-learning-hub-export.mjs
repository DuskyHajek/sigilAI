/**
 * Generates docs/sigil-supernova-learning-hub-export.html — a static, fully-expanded
 * snapshot of everything in the Learning Hub (Reference + Practice) for review/analysis.
 * Run: node scripts/generate-learning-hub-export.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { THEMES, READING_LIST, GLOSSARY } from "../frontend/src/data/masteryGuideData.js";
import { QUIZ_QUESTIONS, SCENARIOS, QUIZ_THEME_FILTERS } from "../frontend/src/data/academyData.js";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../docs/sigil-supernova-learning-hub-export.html");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slug(id) {
  return id.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function levelBadge(level) {
  const cls =
    level === "Start Here" ? "badge-start" : level === "Advanced" ? "badge-advanced" : "badge-intermediate";
  return `<span class="badge ${cls}">${esc(level)}</span>`;
}

const conceptCount = THEMES.reduce((n, t) => n + t.concepts.length, 0);
const modelCount = THEMES.reduce((n, t) => n + t.mentalModels.length, 0);
const courseCount = THEMES.reduce((n, t) => n + t.courses.length, 0);
const voiceCount = THEMES.reduce((n, t) => n + t.voices.length, 0);
const bookCountTheme = THEMES.reduce((n, t) => n + t.books.length, 0);

const themeSections = THEMES.map((t, i) => {
  const sid = slug(t.id);
  const num = String(i).padStart(2, "0");

  const concepts = t.concepts
    .map(
      (c) =>
        `<tr><td class="term">${esc(c.term)}</td><td>${esc(c.definition)}</td></tr>`
    )
    .join("\n");

  const books = t.books
    .map(
      (b) =>
        `<tr><td>${esc(b.title)}</td><td>${esc(b.author)}</td><td>${levelBadge(b.level)}</td><td>${esc(b.why)}</td></tr>`
    )
    .join("\n");

  const courses = t.courses
    .map(
      (c) =>
        `<div class="block"><div class="block-title">${esc(c.name)}</div><div class="block-meta">${esc(c.platform)}</div><div class="block-body">${esc(c.focus)}</div></div>`
    )
    .join("\n");

  const voices = t.voices
    .map(
      (v) =>
        `<tr><td>${esc(v.name)}</td><td>${esc(v.type)}</td><td>${esc(v.focus)}</td></tr>`
    )
    .join("\n");

  const models = t.mentalModels
    .map(
      (m) =>
        `<div class="model"><div class="model-title">${esc(m.name)}</div><div class="model-body">${esc(m.description)}</div></div>`
    )
    .join("\n");

  return `
<section id="theme-${sid}" class="section">
  <div class="section-head">
    <div class="section-num">${num}</div>
    <div>
      <h2>${esc(t.label)}</h2>
      <p class="tagline">${esc(t.tagline)}</p>
    </div>
  </div>
  <p class="desc">${esc(t.description)}</p>
  <p class="counts">${t.concepts.length} concepts · ${t.books.length} books · ${t.courses.length} courses · ${t.voices.length} voices · ${t.mentalModels.length} mental models</p>

  <h3>Key concepts</h3>
  <table><thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>${concepts}</tbody></table>

  <h3>Essential books</h3>
  <table><thead><tr><th>Title</th><th>Author</th><th>Level</th><th>Why read it</th></tr></thead><tbody>${books}</tbody></table>

  <h3>Courses &amp; resources</h3>
  ${courses}

  <h3>Voices to follow</h3>
  <table><thead><tr><th>Name</th><th>Format</th><th>Focus</th></tr></thead><tbody>${voices}</tbody></table>

  <h3>Mental models</h3>
  ${models}
</section>`;
}).join("\n");

const readingRows = READING_LIST.map(
  (b) =>
    `<tr><td>${esc(b.title)}</td><td>${esc(b.author)}</td><td>${levelBadge(b.level)}</td><td><span class="badge badge-theme">${esc(b.theme)}</span></td><td>${esc(b.why)}</td></tr>`
).join("\n");

const glossaryRows = GLOSSARY.slice()
  .sort((a, b) => a.term.localeCompare(b.term))
  .map(
    (g) =>
      `<tr><td class="term">${esc(g.term)}</td><td><span class="badge badge-theme">${esc(g.theme)}</span></td><td>${esc(g.definition)}</td></tr>`
  )
  .join("\n");

const quizBlocks = QUIZ_QUESTIONS.map((q, i) => {
  const label = QUIZ_THEME_FILTERS.find((f) => f.slug === q.theme)?.label || q.theme;
  const choices = q.choices
    .map((c, j) => `<li${j === q.correct ? ' class="correct"' : ""}>${esc(c)}</li>`)
    .join("");
  return `
<div class="quiz-item">
  <div class="quiz-meta">Q${i + 1} · <span class="badge badge-theme">${esc(label)}</span></div>
  <div class="quiz-q">${esc(q.q)}</div>
  <ol class="choices">${choices}</ol>
  <div class="quiz-explain"><strong>Explanation:</strong> ${esc(q.explain)}</div>
</div>`;
}).join("\n");

const scenarioBlocks = SCENARIOS.map(
  (s) => `
<div class="scenario">
  <h4>${esc(s.title)}</h4>
  <p><strong>Context:</strong> ${esc(s.ctx)}</p>
  <p><strong>Question:</strong> ${esc(s.q)}</p>
  <p><strong>Themes:</strong> ${s.themes.map((t) => `<span class="badge badge-theme">${esc(QUIZ_THEME_FILTERS.find((f) => f.slug === t)?.label || t)}</span>`).join(" ")}</p>
  <div class="analysis"><strong>Analysis:</strong> ${esc(s.analysis)}</div>
</div>`
).join("\n");

const tocThemes = THEMES.map((t, i) => {
  const n = String(i).padStart(2, "0");
  return `<li><a href="#theme-${slug(t.id)}">${n} — ${esc(t.label)}</a> <span class="toc-sub">${t.concepts.length} concepts</span></li>`;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Sigil Supernova — Learning Hub (Full Export)</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#1a1a1a;line-height:1.55;background:#fff;font-size:11pt}
.container{max-width:980px;margin:0 auto;padding:32px 40px 60px}
.sync{background:#f7f7f5;border:1px solid #ddd;border-radius:8px;padding:14px 18px;margin-bottom:28px;font-size:10pt;color:#444}
.sync code{font-size:9pt;background:#eee;padding:1px 5px;border-radius:3px}
.cover{border-bottom:3px solid #111;padding-bottom:28px;margin-bottom:32px}
.cover-label{font-size:8pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#666;margin-bottom:8px}
.cover h1{font-size:22pt;font-weight:700;line-height:1.15;margin-bottom:8px}
.cover-sub{font-size:12pt;color:#555;margin-bottom:20px}
.stats{display:flex;flex-wrap:wrap;gap:24px;margin-bottom:16px}
.stat-val{font-size:18pt;font-weight:700;line-height:1}
.stat-lbl{font-size:7.5pt;color:#777;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
.toc{margin-bottom:36px;padding:20px;background:#fafafa;border:1px solid #eee;border-radius:8px}
.toc h2{font-size:13pt;margin-bottom:12px}
.toc ul{list-style:none}
.toc li{padding:4px 0;border-bottom:1px dotted #ddd;font-size:10pt}
.toc a{color:#111;text-decoration:none}
.toc a:hover{text-decoration:underline}
.toc-sub{color:#888;font-size:9pt;margin-left:6px}
.part{margin:48px 0 24px;padding-top:20px;border-top:2px solid #111}
.part h2{font-size:16pt;margin-bottom:6px}
.part-desc{font-size:10pt;color:#555;margin-bottom:24px}
.section{margin-bottom:48px;padding-top:8px}
.section-head{display:flex;gap:14px;align-items:flex-start;margin-bottom:10px}
.section-num{font-size:10pt;font-weight:700;color:#888;min-width:28px;padding-top:4px}
.section h2{font-size:14pt;margin-bottom:4px}
.tagline{font-size:10pt;color:#555;font-style:italic}
.desc{font-size:10pt;color:#333;background:#f7f7f7;border-left:3px solid #111;padding:12px 14px;margin:12px 0}
.counts{font-size:9pt;color:#888;margin-bottom:16px}
h3{font-size:10pt;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#444;margin:22px 0 10px;padding-bottom:4px;border-bottom:1px solid #e0e0e0}
table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:9.5pt}
th{background:#f0f0f0;text-align:left;padding:7px 9px;font-size:8pt;text-transform:uppercase;letter-spacing:.04em;color:#555;border:1px solid #ddd}
td{padding:7px 9px;border:1px solid #e8e8e8;vertical-align:top}
.term{font-weight:600;white-space:nowrap}
.badge{display:inline-block;padding:2px 7px;border-radius:3px;font-size:7.5pt;font-weight:600}
.badge-start{background:#e0f2e8;color:#1b6a3e}
.badge-intermediate{background:#dbeeff;color:#1a4d8f}
.badge-advanced{background:#fef0d8;color:#7a4a08}
.badge-theme{background:#f0f0f0;color:#444}
.block,.model{margin-bottom:10px;padding:10px 12px;border:1px solid #e8e8e8;border-radius:6px;background:#fafafa}
.block-title,.model-title{font-weight:700;font-size:10pt;margin-bottom:2px}
.block-meta{font-size:8.5pt;color:#777;margin-bottom:4px}
.block-body,.model-body{font-size:9.5pt;color:#444}
.quiz-item,.scenario{margin-bottom:18px;padding:14px;border:1px solid #e0e0e0;border-radius:8px}
.quiz-meta,.scenario h4{font-size:9pt;font-weight:700;margin-bottom:6px;color:#666}
.quiz-q{font-weight:600;margin-bottom:8px}
.choices{margin:0 0 8px 20px;font-size:9.5pt}
.choices li{margin-bottom:3px}
.choices li.correct{font-weight:700;color:#0a5c3a}
.quiz-explain,.analysis{font-size:9.5pt;color:#444;background:#f7f7f7;padding:10px;border-radius:4px;margin-top:8px}
.scenario p{font-size:9.5pt;margin-bottom:6px}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:8pt;color:#aaa;text-align:center}
@media print{.container{padding:20px}.sync{display:none}}
</style>
</head>
<body>
<div class="container">

<div class="sync">
  <strong>Full Learning Hub export</strong> — static snapshot for review and gap analysis.
  Source: <code>frontend/src/data/masteryGuideData.js</code> + <code>academyData.js</code>.
  Regenerate: <code>node scripts/generate-learning-hub-export.mjs</code>.
  Live app: <code>/mastery-guide</code> (Reference + Practice modes).
</div>

<div class="cover">
  <div class="cover-label">Sigil Supernova · Learning Hub</div>
  <h1>Complete Curriculum Export</h1>
  <p class="cover-sub">Everything currently in the Learning Hub — reference curriculum and practice content</p>
  <div class="stats">
    <div><div class="stat-val">${THEMES.length}</div><div class="stat-lbl">Theme sections</div></div>
    <div><div class="stat-val">${conceptCount}</div><div class="stat-lbl">Key concepts</div></div>
    <div><div class="stat-val">${bookCountTheme}</div><div class="stat-lbl">Theme books</div></div>
    <div><div class="stat-val">${READING_LIST.length}</div><div class="stat-lbl">Reading list</div></div>
    <div><div class="stat-val">${courseCount}</div><div class="stat-lbl">Courses</div></div>
    <div><div class="stat-val">${voiceCount}</div><div class="stat-lbl">Voices</div></div>
    <div><div class="stat-val">${modelCount}</div><div class="stat-lbl">Mental models</div></div>
    <div><div class="stat-val">${GLOSSARY.length}</div><div class="stat-lbl">Glossary terms</div></div>
    <div><div class="stat-val">${QUIZ_QUESTIONS.length}</div><div class="stat-lbl">Quiz questions</div></div>
    <div><div class="stat-val">${SCENARIOS.length}</div><div class="stat-lbl">Scenarios</div></div>
  </div>
</div>

<nav class="toc">
  <h2>Contents</h2>
  <ul>
    <li><a href="#part-reference">Part 1 — Reference curriculum</a></li>
    ${tocThemes}
    <li><a href="#reading-list">Master reading list</a> <span class="toc-sub">${READING_LIST.length} books</span></li>
    <li><a href="#glossary">Glossary</a> <span class="toc-sub">${GLOSSARY.length} terms</span></li>
    <li><a href="#part-practice">Part 2 — Practice content</a></li>
    <li><a href="#quiz">Quiz bank</a> <span class="toc-sub">${QUIZ_QUESTIONS.length} questions</span></li>
    <li><a href="#scenarios">Scenario drills</a> <span class="toc-sub">${SCENARIOS.length} cases</span></li>
  </ul>
</nav>

<div id="part-reference" class="part">
  <h2>Part 1 — Reference curriculum</h2>
  <p class="part-desc">Per-theme key concepts, books, courses, voices, and mental models. This is what appears under Reference mode in the app.</p>
</div>

${themeSections}

<section id="reading-list" class="section">
  <h2>Master reading list</h2>
  <p class="desc">${READING_LIST.length} books ordered by priority across all themes. Start with every "Start Here" book before Intermediate.</p>
  <table>
    <thead><tr><th>Title</th><th>Author</th><th>Level</th><th>Theme</th><th>Why</th></tr></thead>
    <tbody>${readingRows}</tbody>
  </table>
</section>

<section id="glossary" class="section">
  <h2>Glossary</h2>
  <p class="desc">${GLOSSARY.length} terms alphabetically. Same terms used for flashcards in Practice mode.</p>
  <table>
    <thead><tr><th>Term</th><th>Theme</th><th>Definition</th></tr></thead>
    <tbody>${glossaryRows}</tbody>
  </table>
</section>

<div id="part-practice" class="part">
  <h2>Part 2 — Practice content</h2>
  <p class="part-desc">Quiz questions and scenario drills from Practice mode. Correct answers are marked in green.</p>
</div>

<section id="quiz" class="section">
  <h2>Quiz bank</h2>
  ${quizBlocks}
</section>

<section id="scenarios" class="section">
  <h2>Scenario drills</h2>
  ${scenarioBlocks}
</section>

<div class="footer">
  Generated from Learning Hub data · Sigil Supernova · For internal curriculum review
</div>

</div>
</body>
</html>`;

writeFileSync(OUT, html, "utf8");
console.log("Wrote", OUT);
console.log(`  ${conceptCount} concepts · ${READING_LIST.length} reading list · ${GLOSSARY.length} glossary · ${QUIZ_QUESTIONS.length} quiz · ${SCENARIOS.length} scenarios`);
