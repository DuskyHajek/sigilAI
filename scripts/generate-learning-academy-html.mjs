/**
 * Generates docs/sigil-supernova-learning-academy.html from Learning Hub data.
 * Run: node scripts/generate-learning-academy-html.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { THEMES, NAV_TABS, READING_LIST, GLOSSARY } from "../frontend/src/data/masteryGuideData.js";
import {
  QUIZ_QUESTIONS,
  SCENARIOS,
  GLOSSARY_THEME_TO_SLUG,
  QUIZ_THEME_FILTERS,
} from "../frontend/src/data/academyData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../docs/sigil-supernova-learning-academy.html");

const THEME_ID_TO_SLUG = {
  overview: "overview",
  datacentres: "infra",
  application: "app",
  robotics: "robot",
  defence: "defence",
  space: "space",
  biotech: "bio",
  cybersecurity: "cyber",
};

const SLUG_LABELS = {
  overview: "Overview",
  infra: "AI Infra",
  app: "App Layer",
  robot: "Robotics",
  defence: "Defence",
  space: "Space",
  bio: "Biotech",
  cyber: "Cybersec",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonScript(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

const conceptCount = THEMES.reduce((n, t) => n + t.concepts.length, 0);
const modelCount = THEMES.reduce((n, t) => n + t.mentalModels.length, 0);
const bookCount = READING_LIST.length;

const glossaryForFlash = GLOSSARY.map((g) => ({
  theme: GLOSSARY_THEME_TO_SLUG[g.theme] || "overview",
  term: g.term,
  def: g.definition,
  themeLabel: g.theme,
}));

const themesPayload = THEMES.map((t) => ({
  id: t.id,
  slug: THEME_ID_TO_SLUG[t.id],
  label: t.label,
  tagline: t.tagline,
  description: t.description,
  concepts: t.concepts,
  books: t.books,
  courses: t.courses,
  voices: t.voices,
  mentalModels: t.mentalModels,
}));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Sigil Supernova — Learning Hub</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:#f7f7f5;color:#1a1a1a;line-height:1.55;}
.app{max-width:960px;margin:0 auto;padding:24px 20px;}
.sync-note{font-size:12px;color:#666;background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:10px 14px;margin-bottom:16px;}
.sync-note strong{color:#333;}
.top-bar{background:#111;color:#fff;padding:16px 24px;margin-bottom:0;border-radius:8px 8px 0 0;}
.top-bar h1{font-size:20px;font-weight:700;letter-spacing:-0.3px;}
.top-bar p{font-size:13px;color:#aaa;margin-top:4px;}
.mode-row{display:flex;gap:8px;background:#fff;border:1px solid #e0e0e0;border-top:0;padding:12px 12px 0;}
.mode-btn{flex:1;padding:10px 14px;font-size:13px;font-weight:600;border:1px solid #ddd;border-radius:8px 8px 0 0;background:#f5f5f3;cursor:pointer;color:#555;font-family:inherit;border-bottom:none;margin-bottom:-1px;}
.mode-btn.active{background:#fff;color:#111;border-color:#e0e0e0;}
.nav{display:flex;gap:4px;flex-wrap:wrap;background:#fff;border:1px solid #e0e0e0;border-top:0;padding:12px;border-radius:0 0 8px 8px;margin-bottom:20px;}
.nav-btn{padding:7px 14px;font-size:13px;border:1px solid #ddd;border-radius:6px;background:transparent;cursor:pointer;color:#555;font-family:inherit;}
.nav-btn:hover{background:#f5f5f5;}
.nav-btn.active{background:#111;color:#fff;border-color:#111;}
.screen{display:none;}
.screen.active{display:block;}
.card{background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:20px;margin-bottom:16px;}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px;}
.metric{background:#f5f5f3;border-radius:8px;padding:16px;text-align:center;}
.metric .val{font-size:26px;font-weight:700;color:#111;}
.metric .lbl{font-size:11px;color:#777;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;}
h2{font-size:20px;font-weight:700;color:#111;margin-bottom:6px;}
h3{font-size:15px;font-weight:700;color:#111;margin:18px 0 10px;}
.sub-p{font-size:14px;color:#666;margin-bottom:20px;}
.tagline{font-size:15px;font-weight:600;color:#333;margin-bottom:8px;}
.badge{display:inline-block;padding:3px 9px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:0.02em;}
.b-overview,.b-all{background:#f0f0f0;color:#444;}
.b-infra{background:#dbeeff;color:#1a4d8f;}
.b-app{background:#ede9fd;color:#4a3a9b;}
.b-robot{background:#e0f2e8;color:#1b6a3e;}
.b-defence{background:#fde8e0;color:#8a3318;}
.b-space{background:#d8f5ed;color:#0b5e48;}
.b-bio{background:#fce8f1;color:#7a2050;}
.b-cyber{background:#fef0d8;color:#7a4a08;}
.l-start{background:#e0f2e8;color:#1b6a3e;}
.l-intermediate{background:#dbeeff;color:#1a4d8f;}
.l-advanced{background:#fef0d8;color:#7a4a08;}
.progress-wrap{height:6px;background:#eee;border-radius:3px;margin-bottom:20px;overflow:hidden;}
.progress-fill{height:100%;background:#222;border-radius:3px;transition:width 0.3s;}
.q-card{background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:20px;margin-bottom:14px;}
.q-text{font-size:16px;font-weight:600;color:#111;margin-bottom:16px;line-height:1.5;}
.choices{display:flex;flex-direction:column;gap:8px;}
.choice{padding:11px 15px;border:1px solid #ddd;border-radius:8px;cursor:pointer;font-size:14px;color:#222;background:#fff;text-align:left;font-family:inherit;transition:all 0.15s;}
.choice:hover:not(.locked){background:#f5f5f5;border-color:#aaa;}
.choice.correct{border-color:#1D9E75;background:#e8f8f2;color:#0a5c3a;}
.choice.wrong{border-color:#D85A30;background:#fdeae0;color:#7a2a10;}
.choice.locked{cursor:default;}
.explain{margin-top:14px;padding:14px;background:#f8f8f8;border-left:3px solid #555;border-radius:0 8px 8px 0;font-size:13px;color:#444;line-height:1.6;display:none;}
.btn{padding:9px 18px;font-size:13px;border:1px solid #ccc;border-radius:7px;background:#fff;cursor:pointer;color:#222;font-family:inherit;transition:all 0.15s;}
.btn:hover{background:#f5f5f5;}
.btn-primary{background:#111;color:#fff;border-color:#111;}
.btn-primary:hover{background:#333;}
.row-btns{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}
.flashcard{margin-bottom:20px;}
.fc-wrap{perspective:800px;}
.fc-inner{position:relative;width:100%;height:200px;transform-style:preserve-3d;transition:transform 0.5s;cursor:pointer;}
.fc-inner.flipped{transform:rotateY(180deg);}
.fc-face{position:absolute;inset:0;backface-visibility:hidden;border:1px solid #e0e0e0;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;}
.fc-front{background:#fff;}
.fc-back{background:#f8f8f6;transform:rotateY(180deg);}
.fc-label{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;}
.fc-term{font-size:22px;font-weight:700;color:#111;}
.fc-def{font-size:14px;color:#444;line-height:1.6;}
.fc-nav{display:flex;align-items:center;gap:12px;justify-content:center;margin-top:14px;}
.fc-counter{font-size:13px;color:#666;}
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.filter-btn{padding:5px 11px;font-size:12px;border:1px solid #ddd;border-radius:5px;cursor:pointer;background:#fff;color:#555;font-family:inherit;}
.filter-btn:hover{background:#f0f0f0;}
.filter-btn.active{background:#111;color:#fff;border-color:#111;}
.score-box{text-align:center;padding:32px;background:#f5f5f3;border-radius:10px;margin-bottom:16px;}
.score-num{font-size:54px;font-weight:700;color:#111;}
.score-label{font-size:15px;color:#666;margin-top:8px;}
.theme-section{margin-bottom:28px;}
.theme-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.concept-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;}
.concept-card,.item-card{background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:14px;margin-bottom:8px;}
.concept-term,.item-title{font-size:13px;font-weight:700;color:#111;margin-bottom:5px;}
.concept-def,.item-meta{font-size:12px;color:#777;margin-bottom:4px;}
.concept-def,.item-body{font-size:12px;color:#555;line-height:1.5;}
.mm-card{border-left:3px solid #111;padding:13px 16px;background:#f8f8f8;border-radius:0 8px 8px 0;margin-bottom:10px;}
.mm-title{font-size:14px;font-weight:700;color:#111;margin-bottom:5px;}
.mm-desc{font-size:13px;color:#555;line-height:1.55;}
.gloss-card{background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:14px;margin-bottom:8px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
.gloss-term{font-size:14px;font-weight:700;color:#111;}
.gloss-def{font-size:12px;color:#555;margin-top:3px;line-height:1.5;}
.scenario{background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:18px;margin-bottom:14px;}
.scenario-title{font-size:15px;font-weight:700;color:#111;margin-bottom:6px;}
.scenario-ctx{font-size:13px;color:#555;margin-bottom:10px;line-height:1.55;}
.scenario-q{font-size:13px;font-weight:600;color:#222;margin-bottom:10px;}
details summary{font-size:13px;cursor:pointer;color:#555;padding:6px 0;}
details summary:hover{color:#111;}
details[open] summary{color:#111;}
.analysis-box{margin-top:10px;font-size:13px;color:#444;line-height:1.6;padding:12px;background:#f8f8f8;border-radius:6px;}
.theme-map-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f0f0f0;}
.theme-map-row:last-child{border-bottom:0;}
input[type=text],select{padding:9px 12px;font-size:14px;border:1px solid #ddd;border-radius:7px;font-family:inherit;background:#fff;color:#111;outline:none;margin-bottom:12px;}
input[type=text]{width:100%;}
input[type=text]:focus,select:focus{border-color:#aaa;}
.q-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.q-num{font-size:13px;color:#666;}
.collapsible{border:1px solid #e8e8e8;border-radius:8px;margin-bottom:8px;overflow:hidden;}
.collapsible summary{padding:12px 14px;font-size:13px;font-weight:600;cursor:pointer;background:#fafafa;list-style:none;display:flex;justify-content:space-between;align-items:center;}
.collapsible summary::-webkit-details-marker{display:none;}
.collapsible .coll-body{padding:0 14px 14px;}
</style>
</head>
<body>
<div class="app">
<p class="sync-note"><strong>Offline mirror</strong> of the Sigil Supernova Learning Hub (<code>/mastery-guide</code>). Generated from <code>masteryGuideData.js</code> and <code>academyData.js</code>. Reference to learn · Practice to retain.</p>

<div class="top-bar">
  <h1>Sigil Supernova — Learning Hub</h1>
  <p id="hero-sub">Books, concepts, glossary &amp; mental models for all 7 themes</p>
</div>

<div class="mode-row">
  <button class="mode-btn active" id="mode-ref" onclick="setMode('reference')">Reference — Read curriculum</button>
  <button class="mode-btn" id="mode-prac" onclick="setMode('practice')">Practice — Quiz, flashcards, scenarios</button>
</div>

<div class="nav" id="main-nav"></div>

<div class="grid2" id="hero-stats">
  <div class="metric"><div class="val">${conceptCount}+</div><div class="lbl">Concepts</div></div>
  <div class="metric"><div class="val">${bookCount}</div><div class="lbl">Books</div></div>
  <div class="metric"><div class="val">${GLOSSARY.length}+</div><div class="lbl">Glossary</div></div>
  <div class="metric"><div class="val">${modelCount}</div><div class="lbl">Mental models</div></div>
</div>

<div id="screen-home" class="screen active"></div>
<div id="screen-theme" class="screen"></div>
<div id="screen-reading" class="screen"></div>
<div id="screen-glossary-ref" class="screen"></div>
<div id="screen-quiz" class="screen"></div>
<div id="screen-flash" class="screen"></div>
<div id="screen-scenarios" class="screen"></div>
</div>

<script id="hub-data" type="application/json">${jsonScript({
  themes: themesPayload,
  navTabs: NAV_TABS.filter((t) => t.id !== "reading" && t.id !== "glossary"),
  readingList: READING_LIST,
  glossary: glossaryForFlash,
  quizQuestions: QUIZ_QUESTIONS,
  scenarios: SCENARIOS,
  quizFilters: QUIZ_THEME_FILTERS,
  slugLabels: SLUG_LABELS,
})}</script>

<script>
const DATA=JSON.parse(document.getElementById('hub-data').textContent);
const SLUG_LABELS=DATA.slugLabels;
const THEME_SLUG={overview:'overview',datacentres:'infra',application:'app',robotics:'robot',defence:'defence',space:'space',biotech:'bio',cybersecurity:'cyber'};

let mode='reference',refTab='overview',pracTab='quiz';
let quizQuestions=[],quizIndex=0,quizScore=0,quizAnswered=false,quizResults=[];
let fcCards=[],fcIndex=0,glossTheme='all',readingLevel='all',readingTheme='all';

function escHtml(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

function setMode(m){
  mode=m;
  document.getElementById('mode-ref').classList.toggle('active',m==='reference');
  document.getElementById('mode-prac').classList.toggle('active',m==='practice');
  document.getElementById('hero-sub').textContent=m==='reference'
    ?'Books, concepts, glossary & mental models for all 7 themes'
    :'Quizzes, flashcards & scenario drills to test your mastery';
  const stats=document.getElementById('hero-stats');
  if(m==='reference'){
    const cc=DATA.themes.reduce((n,t)=>n+t.concepts.length,0);
    const mc=DATA.themes.reduce((n,t)=>n+t.mentalModels.length,0);
    stats.innerHTML='<div class="metric"><div class="val">'+cc+'+</div><div class="lbl">Concepts</div></div>'
      +'<div class="metric"><div class="val">'+DATA.readingList.length+'</div><div class="lbl">Books</div></div>'
      +'<div class="metric"><div class="val">'+DATA.glossary.length+'+</div><div class="lbl">Glossary</div></div>'
      +'<div class="metric"><div class="val">'+mc+'</div><div class="lbl">Mental models</div></div>';
  }else{
    stats.innerHTML='<div class="metric"><div class="val">'+DATA.quizQuestions.length+'</div><div class="lbl">Questions</div></div>'
      +'<div class="metric"><div class="val">'+DATA.glossary.length+'</div><div class="lbl">Flashcards</div></div>'
      +'<div class="metric"><div class="val">'+DATA.scenarios.length+'</div><div class="lbl">Scenarios</div></div>'
      +'<div class="metric"><div class="val">7</div><div class="lbl">Themes</div></div>';
  }
  renderNav();showCurrentScreen();
}

function renderNav(){
  const nav=document.getElementById('main-nav');
  if(mode==='reference'){
    let h='<button class="nav-btn'+(refTab==='home'?' active':'')+'" onclick="goRef(\\'home\\')">Home</button>';
    DATA.navTabs.forEach(t=>{
      h+='<button class="nav-btn'+(refTab===t.id?' active':'')+'" onclick="goRef(\\''+t.id+'\\')">'+escHtml(t.label)+'</button>';
    });
    h+='<button class="nav-btn'+(refTab==='reading'?' active':'')+'" onclick="goRef(\\'reading\\')">Reading List</button>';
    h+='<button class="nav-btn'+(refTab==='glossary'?' active':'')+'" onclick="goRef(\\'glossary\\')">Glossary</button>';
    nav.innerHTML=h;
  }else{
    nav.innerHTML=
      '<button class="nav-btn'+(pracTab==='quiz'?' active':'')+'" onclick="goPrac(\\'quiz\\')">Quiz</button>'
      +'<button class="nav-btn'+(pracTab==='flash'?' active':'')+'" onclick="goPrac(\\'flash\\')">Flashcards</button>'
      +'<button class="nav-btn'+(pracTab==='scenarios'?' active':'')+'" onclick="goPrac(\\'scenarios\\')">Scenarios</button>';
  }
}

function goRef(tab){refTab=tab;renderNav();showCurrentScreen();}
function goPrac(tab){pracTab=tab;renderNav();showCurrentScreen();if(tab==='flash'&&!fcCards.length)startFlash();}

function showCurrentScreen(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if(mode==='reference'){
    if(refTab==='home'){document.getElementById('screen-home').classList.add('active');renderHome();}
    else if(refTab==='reading'){document.getElementById('screen-reading').classList.add('active');renderReading();}
    else if(refTab==='glossary'){document.getElementById('screen-glossary-ref').classList.add('active');renderGlossaryRef();}
    else{document.getElementById('screen-theme').classList.add('active');renderTheme(refTab);}
  }else{
    if(pracTab==='quiz')document.getElementById('screen-quiz').classList.add('active');
    else if(pracTab==='flash')document.getElementById('screen-flash').classList.add('active');
    else document.getElementById('screen-scenarios').classList.add('active');
    if(pracTab==='quiz'&&!document.getElementById('quiz-setup'))renderQuiz();
    if(pracTab==='flash'&&!document.getElementById('fc-inner'))renderFlash();
    if(pracTab==='scenarios'&&!document.getElementById('scenarios-content'))renderScenarios();
  }
}

function levelClass(l){
  if(l==='Start Here')return 'l-start';
  if(l==='Advanced')return 'l-advanced';
  return 'l-intermediate';
}

function renderHome(){
  const el=document.getElementById('screen-home');
  let h='<h2>7 Themes at a Glance</h2><p class="sub-p">The meta-layer and six investable themes — select a tab above for full curriculum.</p>';
  DATA.themes.forEach(t=>{
    const slug=t.slug||'overview';
    h+='<div class="theme-map-row"><span class="badge b-'+slug+'">'+escHtml(t.label.split('. ').pop()||t.label)+'</span>'
      +'<div><strong style="font-size:13px;">'+escHtml(t.tagline)+'</strong>'
      +'<div style="font-size:12px;color:#666;margin-top:2px;">'+escHtml(t.description.slice(0,140))+'…</div></div></div>';
  });
  h+='<div class="row-btns"><button class="btn btn-primary" onclick="goRef(\\'overview\\')">Start with Overview</button>'
    +'<button class="btn" onclick="setMode(\\'practice\\');goPrac(\\'quiz\\')">Take the quiz</button></div>';
  el.innerHTML=h;
}

function renderTheme(id){
  const t=DATA.themes.find(x=>x.id===id);
  if(!t)return;
  const slug=t.slug;
  const el=document.getElementById('screen-theme');
  let h='<p class="tagline">'+escHtml(t.tagline)+'</p><p class="sub-p">'+escHtml(t.description)+'</p>';

  h+='<h3>Key Concepts ('+t.concepts.length+')</h3><div class="concept-grid">';
  t.concepts.forEach(c=>{
    h+='<div class="concept-card"><div class="concept-term">'+escHtml(c.term)+'</div><div class="concept-def">'+escHtml(c.definition)+'</div></div>';
  });
  h+='</div>';

  if(t.books.length){
    h+='<h3>Essential Books ('+t.books.length+')</h3>';
    t.books.forEach(b=>{
      h+='<div class="item-card"><div class="item-title">'+escHtml(b.title)+' <span class="badge '+levelClass(b.level)+'">'+escHtml(b.level)+'</span></div>'
        +'<div class="item-meta">'+escHtml(b.author)+'</div><div class="item-body">'+escHtml(b.why)+'</div></div>';
    });
  }
  if(t.courses.length){
    h+='<h3>Courses &amp; Resources ('+t.courses.length+')</h3>';
    t.courses.forEach(c=>{
      h+='<div class="item-card"><div class="item-title">'+escHtml(c.name)+'</div>'
        +'<div class="item-meta">'+escHtml(c.platform)+'</div><div class="item-body">'+escHtml(c.focus)+'</div></div>';
    });
  }
  if(t.voices.length){
    h+='<h3>Voices to Follow ('+t.voices.length+')</h3>';
    t.voices.forEach(v=>{
      h+='<div class="item-card"><div class="item-title">'+escHtml(v.name)+'</div>'
        +'<div class="item-meta">'+escHtml(v.type)+'</div><div class="item-body">'+escHtml(v.focus)+'</div></div>';
    });
  }
  if(t.mentalModels.length){
    h+='<h3>Mental Models ('+t.mentalModels.length+')</h3>';
    t.mentalModels.forEach(m=>{
      h+='<div class="mm-card"><div class="mm-title">'+escHtml(m.name)+'</div><div class="mm-desc">'+escHtml(m.description)+'</div></div>';
    });
  }
  el.innerHTML=h;
}

function renderReading(){
  const el=document.getElementById('screen-reading');
  const themes=[...new Set(DATA.readingList.map(b=>b.theme))].sort();
  const levels=['Start Here','Intermediate','Advanced'];
  let h='<h2>Master Reading List</h2><p class="sub-p">'+DATA.readingList.length+' books ordered by priority. Start with all "Start Here" books across themes.</p>';
  h+='<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">';
  h+='<select id="read-level" onchange="renderReading()"><option value="all">All levels</option>';
  levels.forEach(l=>h+='<option value="'+escHtml(l)+'"'+(readingLevel===l?' selected':'')+'>'+escHtml(l)+'</option>');
  h+='</select><select id="read-theme" onchange="renderReading()"><option value="all">All themes</option>';
  themes.forEach(t=>h+='<option value="'+escHtml(t)+'"'+(readingTheme===t?' selected':'')+'>'+escHtml(t)+'</option>');
  h+='</select></div>';
  readingLevel=document.getElementById('read-level')?.value||readingLevel;
  readingTheme=document.getElementById('read-theme')?.value||readingTheme;
  const filtered=DATA.readingList.filter(b=>(readingLevel==='all'||b.level===readingLevel)&&(readingTheme==='all'||b.theme===readingTheme));
  h+='<p style="font-size:12px;color:#777;margin-bottom:12px;">'+filtered.length+' books</p>';
  filtered.forEach(b=>{
    h+='<div class="item-card"><div class="item-title">'+escHtml(b.title)+' <span class="badge '+levelClass(b.level)+'">'+escHtml(b.level)+'</span> <span class="badge b-all">'+escHtml(b.theme)+'</span></div>'
      +'<div class="item-meta">'+escHtml(b.author)+'</div><div class="item-body">'+escHtml(b.why)+'</div></div>';
  });
  el.innerHTML=h;
}

function renderGlossaryRef(){
  const el=document.getElementById('screen-glossary-ref');
  let h='<h2>Glossary</h2><p class="sub-p">'+DATA.glossary.length+' terms alphabetically. Pair with Flashcards in Practice mode.</p>';
  h+='<input type="text" id="gloss-ref-search" placeholder="Search terms and definitions..." oninput="filterGlossRef()">';
  h+='<div class="filter-row" id="gloss-ref-filters">';
  h+='<button class="filter-btn active" onclick="setGlossRefTheme(\\'all\\',this)">All</button>';
  DATA.quizFilters.forEach(f=>{
    h+='<button class="filter-btn" onclick="setGlossRefTheme(\\''+f.slug+'\\',this)">'+escHtml(f.label)+'</button>';
  });
  h+='</div><div id="gloss-ref-list"></div>';
  el.innerHTML=h;
  filterGlossRef();
}

function setGlossRefTheme(theme,btn){
  glossTheme=theme;
  document.querySelectorAll('#gloss-ref-filters .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  filterGlossRef();
}

function filterGlossRef(){
  const q=(document.getElementById('gloss-ref-search')?.value||'').toLowerCase();
  const list=DATA.glossary.slice().sort((a,b)=>a.term.localeCompare(b.term))
    .filter(c=>(glossTheme==='all'||c.theme===glossTheme)&&(!q||c.term.toLowerCase().includes(q)||c.def.toLowerCase().includes(q)));
  document.getElementById('gloss-ref-list').innerHTML=list.map(c=>
    '<div class="gloss-card"><div style="flex:1;"><div class="gloss-term">'+escHtml(c.term)+'</div><div class="gloss-def">'+escHtml(c.def)+'</div></div>'
    +'<span class="badge b-'+c.theme+'" style="white-space:nowrap;flex-shrink:0;">'+escHtml(c.themeLabel)+'</span></div>'
  ).join('')||'<p style="color:#666;text-align:center;padding:20px;">No terms match.</p>';
}

function renderQuiz(){
  const el=document.getElementById('screen-quiz');
  el.innerHTML='<div id="quiz-setup"><h2>Quiz</h2><p class="sub-p">Test your mastery across all 7 themes. Choose a mode.</p>'
    +'<div class="grid2" style="margin-bottom:14px;">'
    +'<div class="card" style="cursor:pointer;" onclick="startQuiz(\\'quick\\')"><div style="font-size:16px;font-weight:700;margin-bottom:4px;">Quick (10 questions)</div><div style="font-size:13px;color:#666;">Random mix across all themes</div></div>'
    +'<div class="card" style="cursor:pointer;" onclick="startQuiz(\\'full\\')"><div style="font-size:16px;font-weight:700;margin-bottom:4px;">Full ('+DATA.quizQuestions.length+' questions)</div><div style="font-size:13px;color:#666;">Comprehensive coverage of every theme</div></div></div>'
    +'<div style="font-size:14px;font-weight:600;margin-bottom:10px;">Or quiz by theme:</div><div class="filter-row">'
    +DATA.quizFilters.map(f=>'<button class="filter-btn" onclick="startQuiz(\\'theme\\',\\''+f.slug+'\\')">'+escHtml(f.label)+'</button>').join('')
    +'</div></div>'
    +'<div id="quiz-active" style="display:none;"><div class="q-meta"><span class="q-num" id="q-counter"></span><span class="badge" id="q-theme-badge"></span></div>'
    +'<div class="progress-wrap"><div class="progress-fill" id="q-progress"></div></div>'
    +'<div class="q-card"><div class="q-text" id="q-text"></div><div class="choices" id="q-choices"></div><div class="explain" id="q-explain"></div></div>'
    +'<div class="row-btns"><button class="btn btn-primary" id="q-next" onclick="nextQuestion()" style="display:none;">Next question &rarr;</button>'
    +'<button class="btn" onclick="endQuiz()">End quiz</button></div></div>'
    +'<div id="quiz-results" style="display:none;"><div class="score-box"><div class="score-num" id="final-score"></div><div class="score-label" id="score-msg"></div></div>'
    +'<div id="results-breakdown"></div><div class="row-btns" style="margin-top:16px;">'
    +'<button class="btn btn-primary" onclick="startQuiz(\\'full\\')">Try again</button>'
    +'<button class="btn" onclick="setMode(\\'practice\\');goPrac(\\'flash\\');startFlash()">Review flashcards</button>'
    +'<button class="btn" onclick="resetQuizMenu()">Quiz menu</button></div></div>';
}

function resetQuizMenu(){
  document.getElementById('quiz-results').style.display='none';
  document.getElementById('quiz-active').style.display='none';
  document.getElementById('quiz-setup').style.display='block';
}

function startQuiz(mode,theme){
  let pool=DATA.quizQuestions.slice();
  if(mode==='theme'&&theme)pool=pool.filter(q=>q.theme===theme);
  pool=shuffle(pool);
  quizQuestions=mode==='quick'?pool.slice(0,10):mode==='theme'?pool.slice(0,Math.min(pool.length,8)):pool.slice(0,DATA.quizQuestions.length);
  quizIndex=0;quizScore=0;quizAnswered=false;quizResults=[];
  document.getElementById('quiz-setup').style.display='none';
  document.getElementById('quiz-active').style.display='block';
  document.getElementById('quiz-results').style.display='none';
  showQuestion();
}

function showQuestion(){
  const q=quizQuestions[quizIndex];
  document.getElementById('q-counter').textContent='Question '+(quizIndex+1)+' of '+quizQuestions.length;
  const badge=document.getElementById('q-theme-badge');
  badge.textContent=SLUG_LABELS[q.theme]||q.theme;
  badge.className='badge b-'+(q.theme||'overview');
  document.getElementById('q-progress').style.width=((quizIndex+1)/quizQuestions.length*100)+'%';
  document.getElementById('q-text').textContent=q.q;
  document.getElementById('q-explain').style.display='none';
  document.getElementById('q-next').style.display='none';
  quizAnswered=false;
  const ch=document.getElementById('q-choices');ch.innerHTML='';
  q.choices.forEach((c,i)=>{
    const btn=document.createElement('button');
    btn.className='choice';btn.textContent=c;
    btn.onclick=()=>answerQ(i);
    ch.appendChild(btn);
  });
}

function answerQ(i){
  if(quizAnswered)return;
  quizAnswered=true;
  const q=quizQuestions[quizIndex];
  document.querySelectorAll('.choice').forEach((c,idx)=>{
    c.classList.add('locked');
    if(idx===q.correct)c.classList.add('correct');
    else if(idx===i&&i!==q.correct)c.classList.add('wrong');
  });
  if(i===q.correct)quizScore++;
  quizResults.push({q:q.q,correct:i===q.correct});
  const exp=document.getElementById('q-explain');
  exp.textContent=(i===q.correct?'✓ Correct — ':'✗ Wrong — ')+q.explain;
  exp.style.display='block';
  document.getElementById('q-next').style.display='inline-block';
}

function nextQuestion(){
  quizIndex++;
  if(quizIndex>=quizQuestions.length){finishQuiz();return;}
  showQuestion();
}

function finishQuiz(){
  document.getElementById('quiz-active').style.display='none';
  document.getElementById('quiz-results').style.display='block';
  const pct=Math.round(quizScore/quizQuestions.length*100);
  document.getElementById('final-score').textContent=quizScore+'/'+quizQuestions.length+' ('+pct+'%)';
  document.getElementById('score-msg').textContent=pct>=80?'Excellent mastery — Sigil would approve.':pct>=60?'Good progress — review missed questions and try again.':'Keep studying — use flashcards and reference tabs for themes you missed.';
  const wrong=quizResults.filter(r=>!r.correct);
  document.getElementById('results-breakdown').innerHTML=wrong.length
    ?'<div style="font-size:14px;font-weight:700;margin:16px 0 10px;">Review these questions:</div>'
      +wrong.map(r=>'<div style="font-size:13px;color:#555;padding:8px 12px;background:#f8f8f8;border-radius:6px;margin-bottom:6px;">'+escHtml(r.q)+'</div>').join('')
    :'';
}

function endQuiz(){
  if(quizQuestions.length&&quizIndex<quizQuestions.length)finishQuiz();
  else resetQuizMenu();
}

function renderFlash(){
  const el=document.getElementById('screen-flash');
  el.innerHTML='<h2>Flashcards</h2><p class="sub-p">'+DATA.glossary.length+' glossary terms — click to flip.</p>'
    +'<div class="filter-row" id="fc-filters"><button class="filter-btn active" onclick="setFCTheme(\\'all\\',this)">All</button>'
    +DATA.quizFilters.map(f=>'<button class="filter-btn" onclick="setFCTheme(\\''+f.slug+'\\',this)">'+escHtml(f.label)+'</button>').join('')
    +'</div><div class="flashcard"><div class="fc-wrap"><div class="fc-inner" id="fc-inner" onclick="flipCard()">'
    +'<div class="fc-face fc-front"><div class="fc-label" id="fc-theme-lbl"></div><div class="fc-term" id="fc-term"></div>'
    +'<div style="font-size:12px;color:#aaa;margin-top:14px;">Click to reveal definition</div></div>'
    +'<div class="fc-face fc-back"><div class="fc-label">Definition</div><div class="fc-def" id="fc-def"></div></div>'
    +'</div></div><div class="fc-nav"><button class="btn" onclick="fcNav(-1)">&larr; Prev</button>'
    +'<span class="fc-counter" id="fc-counter"></span><button class="btn" onclick="fcNav(1)">Next &rarr;</button></div>'
    +'<div class="row-btns" style="justify-content:center;margin-top:14px;"><button class="btn" onclick="shuffleCards()">Shuffle deck</button></div>';
  startFlash();
}

function startFlash(){
  fcCards=shuffle(DATA.glossary.slice());
  fcIndex=0;
  renderCard();
}

function renderCard(){
  if(!fcCards.length||!document.getElementById('fc-inner'))return;
  const c=fcCards[fcIndex];
  document.getElementById('fc-inner').classList.remove('flipped');
  document.getElementById('fc-theme-lbl').textContent=c.themeLabel;
  document.getElementById('fc-term').textContent=c.term;
  document.getElementById('fc-def').textContent=c.def;
  document.getElementById('fc-counter').textContent=(fcIndex+1)+' / '+fcCards.length;
}

function flipCard(){document.getElementById('fc-inner').classList.toggle('flipped');}
function fcNav(dir){fcIndex=(fcIndex+dir+fcCards.length)%fcCards.length;renderCard();}
function setFCTheme(theme,btn){
  document.querySelectorAll('#fc-filters .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  fcCards=theme==='all'?shuffle(DATA.glossary.slice()):shuffle(DATA.glossary.filter(c=>c.theme===theme));
  fcIndex=0;renderCard();
}
function shuffleCards(){fcCards=shuffle(fcCards);fcIndex=0;renderCard();}

function renderScenarios(){
  const el=document.getElementById('screen-scenarios');
  el.innerHTML='<h2>Investment Scenario Practice</h2><p class="sub-p">'+DATA.scenarios.length+' cases — think before revealing analysis.</p><div id="scenarios-content"></div>';
  document.getElementById('scenarios-content').innerHTML=DATA.scenarios.map(s=>
    '<div class="scenario"><div class="scenario-title">'+escHtml(s.title)+'</div><div class="scenario-ctx">'+escHtml(s.ctx)+'</div>'
    +'<div class="scenario-q">'+escHtml(s.q)+'</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">'
    +s.themes.map(t=>'<span class="badge b-'+t+'">'+(SLUG_LABELS[t]||t)+'</span>').join('')
    +'</div><details><summary>Reveal analysis</summary><div class="analysis-box">'+escHtml(s.analysis)+'</div></details></div>'
  ).join('');
}

function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

renderNav();
renderHome();
</script>
</body>
</html>`;

writeFileSync(OUT, html, "utf8");
console.log("Wrote", OUT);
console.log("  concepts:", conceptCount, "| books:", bookCount, "| glossary:", GLOSSARY.length);
console.log("  mental models:", modelCount, "| quiz:", QUIZ_QUESTIONS.length, "| scenarios:", SCENARIOS.length);
