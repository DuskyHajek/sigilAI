# Backend Implementation Plan: Challenge the CIO & Thesis Drift

> **Archived.** Implemented in `backend/services/adversarial.js` and `thesisDrift.js`. See [../00_overview.md](../00_overview.md).

**Status:** Finalized — ready for implementation  
**Scope:** Backend pipeline only (frontend is a separate pass)  
**Last updated:** 2026-06-22

---

## Executive Summary

This plan adds two anti-confirmation-bias features to the `/api/sync` pipeline:

1. **Challenge the CIO** — structured adversarial assessment (`adversarialAssessment`)
2. **Thesis Drift & Signal Clustering** — cross-watchlist macro pattern detection (`thesisDriftReport`)

Both features integrate into the existing sync cycle, extend the dashboard KV cache blob, and run **concurrently** with the Analyst Brief during watchlist enrichment to stay within Vercel's 60s limit.

---

## Addendum Review — All Refinements Accepted

The three addendum items are correct and have been folded into this plan:

| Refinement | Verdict | Rationale |
|------------|---------|-----------|
| **Sort before truncate** in `buildAnnotatedNewsFlow` | ✅ Adopted | Chronological slicing would starve the LLM of high-significance signals. Sort by `significance` descending (tie-break: bearish sentiment, then thesis-relevant themes count) before taking top 20. |
| **Strict empty schema fallbacks** | ✅ Adopted | Prevents frontend `.map()` crashes when Claude fails or Vercel skips LLM. Never return `null` or `{}`. |
| **Exact prompt templates** | ✅ Adopted | Injected verbatim into Step 1 as `buildChallengeTheCioPrompt` and `buildThesisDriftPrompt`. |

---

## Relationship to Existing Features

These features complement — not replace — existing counter-thesis logic:

| Existing | Role after this change |
|----------|------------------------|
| **Analyst Brief** (`weeklyBrief`) | Executive 3–4 sentence summary; sentence 3 remains a single counter-signal |
| **Theme Pulse** (`thesis_score`) | Quantitative daily per-theme score (−5 to +5) |
| **Research Queue** | Actionable analyst to-dos; ≥1 thesis-challenging item |
| **Challenge the CIO** *(new)* | Structured adversarial dossier: 2–3 asymmetric risks + blindspot alert + metrics to watch |
| **Thesis Drift** *(new)* | Cross-company signal clustering + per-theme narrative status (`ACCELERATING` / `STAGNANT` / `DRIFTING`) |

**Naming note:** Theme id `adversarial` (cybersecurity) is unrelated to the "Adversarial Assessment" UI card.

---

## Current Pipeline (Baseline)

```
POST /api/sync
  │
  ├─ Cache hit (TTL) → return cached blob
  │
  └─ runFullSync()
       ├─ Promise.all([ fetchNewsAndProcess(), fetchPrices() ])
       ├─ generateWeeklyBrief()          ← starts (async)
       ├─ enrichWatchlistWithContext()   ← blocks
       ├─ Promise.all([ weeklyBrief, generateResearchQueue() ])
       ├─ assemble liveData
       └─ writeCache(liveData)           ← single KV key: supernova:dashboard
```

**Key inputs available after news processing:**
- `classifiedArticles` — title, themes, sentiment, significance, one_line
- `themePulse` — per-theme activity_score, thesis_score, reason
- `THEMES`, `WATCHLIST` from `config/thesis.js`

---

## Target Pipeline (After Implementation)

```
POST /api/sync
  │
  └─ runFullSync()
       ├─ Promise.all([ fetchNewsAndProcess(), fetchPrices() ])
       │
       ├─ buildAnnotatedNewsFlow(classifiedArticles, watchlist)  ← sync helper
       │
       ├─ Promise.all([                                    ← parallel LLM window
       │     generateWeeklyBrief(...),
       │     generateAdversarialAnalysis(...),
       │     generateThesisDriftReport(...),
       │   ])
       │
       ├─ enrichWatchlistWithContext(...)                   ← runs concurrently
       │     with the three LLM calls above
       │
       ├─ generateResearchQueue(...)                        ← needs enriched watchlist
       │
       ├─ assemble liveData (extended payload)
       └─ writeCache(liveData)
```

> **Timing strategy:** Start all three LLM calls immediately after news processing completes. Run `enrichWatchlistWithContext` in the same parallel window. Await research queue only after enrichment finishes.

---

## Extended Sync Payload

```javascript
{
  // --- existing fields (unchanged) ---
  isMock: boolean,
  pricesLive: boolean,
  livePriceCount: number,
  lastUpdated: string,          // ISO
  themePulse: { ... },
  watchlist: [ ... ],
  weeklyBrief: string,
  researchQueue: { items: [ ... ] },

  // --- new fields ---
  adversarialAssessment: {
    asymmetricRisks: Array<{
      targetTheme: string,
      headlineRisk: string,
      adversarialArgument: string,
      counterIndicatorToWatch: string,
    }>,
    blindspotAlert: string,
  },
  thesisDriftReport: {
    detectedClusters: Array<{
      clusterName: string,
      impactedThemes: string[],
      evidenceSummary: string,
      severityScore: number,      // 1–10, clamped post-parse
    }>,
    themeStatusUpdate: Array<{
      themeId: string,
      status: "ACCELERATING" | "STAGNANT" | "DRIFTING",
      narrativeShiftDetails: string,
    }>,
  },
}
```

**Cache strategy:** Extend the existing single blob (`supernova:dashboard`). No separate KV keys needed at Phase 1. `isCacheShapeValid()` only checks 7 themes + 20 watchlist entries — new top-level fields will not break validation. Old cache entries will lack new fields; frontend must treat them as optional.

---

## Implementation Steps

### Step 1 — Prompt builders (`backend/services/prompts.js`)

Add two exports using the exact templates below. Also add token budgets to `config/settings.js`:

```javascript
adversarial_max_tokens: 700,
thesis_drift_max_tokens: 800,
```

#### `buildChallengeTheCioPrompt(thesisConfig, newsItems)`

```javascript
export function buildChallengeTheCioPrompt(thesisConfig, newsItems) {
  return `
You are a ruthlessly pragmatic, elite hedge fund Risk Manager and an aggressive adversarial short-seller. Your sole purpose is to dismantle the confirmation bias of the Chief Investment Officer (CIO) regarding the fund's core investment theses (the "Supernova Memes"). 

You will be provided with the fund's core investment themes and a curated feed of today's market intelligence. Do not look for validation. Your job is to find the cracks, the blind spots, the bear cases, and the alternative structural interpretations that suggest the CIO might be fundamentally wrong or lagging.

Here are the investment theses you must attack:
<investment_theses>
${JSON.stringify(thesisConfig)}
</investment_theses>

Here is the daily raw market intelligence data:
<daily_news_feed>
${JSON.stringify(newsItems)}
</daily_news_feed>

CRITICAL INSTRUCTIONS:
1. Identify 2 to 3 "Adversarial Clusters" where today's data points to macro drift, structural headwinds, or overvaluation in our themes.
2. Formulate explicit "What If We Are Wrong?" scenarios based on today's specific events.
3. Adopt a sharp, sophisticated, intellectually aggressive financial tone. Speak directly to a brilliant, busy CIO. Do not include conversational fluff.

Return your response strictly as a valid JSON object matching this TypeScript interface:
interface AdversarialBrief {
  asymmetricRisks: Array<{
    targetTheme: string;
    headlineRisk: string; 
    adversarialArgument: string; 
    counterIndicatorToWatch: string; 
  }>;
  blindspotAlert: string; 
}

JSON Output:
`;
}
```

#### `buildThesisDriftPrompt(thesisConfig, annotatedNewsFlow)`

```javascript
export function buildThesisDriftPrompt(thesisConfig, annotatedNewsFlow) {
  return `
You are a Lead Quant-Mental Macro Strategist. Your task is to look at the totality of today's news flow across our entire watchlist and identify "Signal Clustering" and "Thesis Drift". We need to know if our core narratives are accelerating, stagnating, or actively drifting into irrelevance based on macro realities.

Here are our core investment themes:
<core_themes>
${JSON.stringify(thesisConfig)}
</core_themes>

Here are all the annotated news items and company involvements from today's sync cycle:
<aggregated_news_flow>
${JSON.stringify(annotatedNewsFlow)}
</aggregated_news_flow>

ANALYSIS PROTOCOL:
1. **Clustering Detection:** Look for patterns where separate articles or companies are hitting the exact same micro-bottleneck, regulatory hurdle, or technological shift today.
2. **Drift Calculation:** Determine if the narrative around our themes is shifting away from our core assumptions.
3. Be hyper-specific. Reference the exact company names and technologies mentioned in the feed.

Return your response strictly as a valid JSON object matching this TypeScript interface:
interface ThesisDriftReport {
  detectedClusters: Array<{
    clusterName: string; 
    impactedThemes: string[];
    evidenceSummary: string; 
    severityScore: number; // Must be clamped between 1 and 10
  }>;
  themeStatusUpdate: Array<{
    themeId: string;
    status: 'ACCELERATING' | 'STAGNANT' | 'DRIFTING';
    narrativeShiftDetails: string; 
  }>;
}

JSON Output:
`;
}
```

#### `thesisConfig` builder (shared helper)

Build from `THEMES` in `config/thesis.js`:

```javascript
const buildThesisConfig = () =>
  THEMES.map(({ id, display_name, short_description, bull_signals, bear_signals }) => ({
    id,
    display_name,
    short_description,
    bull_signals,
    bear_signals,
  }));
```

Wire `bull_signals` / `bear_signals` into the adversarial prompt — they exist in config but are currently unused at runtime.

---

### Step 2 — Service modules with strict fallbacks

Create two new files mirroring the pattern in `brief.js` and `researchQueue.js`.

#### `backend/services/adversarial.js`

| Export | Signature |
|--------|-----------|
| `generateAdversarialAnalysis` | `(classifiedArticles, themePulse) → AdversarialBrief` |

**News item selection for prompt:**
- Sort classified articles by `significance` descending
- Tie-break: bearish sentiment first, then number of matched themes
- Slice top **20** items
- Slim payload: `{ title, themes, sentiment, significance, one_line }`

**Strict fallback (never `null` or `{}`):**

```javascript
const ADVERSARIAL_FALLBACK = {
  asymmetricRisks: [],
  blindspotAlert: "Analysis temporarily unavailable.",
};
```

**Post-parse normalization:**
- Ensure `asymmetricRisks` is always an array
- Ensure `blindspotAlert` is always a string
- Trim string fields; drop malformed risk objects missing required keys
- Accept result only if `asymmetricRisks.length >= 1` and `blindspotAlert` is non-empty; else use fallback

**Vercel behavior:** Attempt Claude call. On timeout/error, use programmatic fallback derived from themes with negative `thesis_score` and bearish articles (still return strict schema).

#### `backend/services/thesisDrift.js`

| Export | Signature |
|--------|-----------|
| `generateThesisDriftReport` | `(classifiedArticles, watchlist, themePulse) → ThesisDriftReport` |

**Strict fallback (never `null` or `{}`):**

```javascript
const THESIS_DRIFT_FALLBACK = {
  detectedClusters: [],
  themeStatusUpdate: [],
};
```

**Post-parse normalization:**
- Clamp `severityScore` to 1–10
- Validate `status` enum; drop invalid entries
- Validate `themeId` against known theme ids
- Accept result only if arrays are present (empty arrays are valid from Claude if no signal — that is not a parse failure)

**Programmatic fallback (Vercel/errors):** Derive `themeStatusUpdate` from `themePulse.thesis_score`:
- `thesis_score >= 2` → `ACCELERATING`
- `thesis_score <= -1` → `DRIFTING`
- else → `STAGNANT`

Populate `narrativeShiftDetails` from `themePulse.reason`. Leave `detectedClusters: []`.

---

### Step 3 — News aggregation helper (`buildAnnotatedNewsFlow`)

**File:** `backend/services/newsAggregation.js` (or extend `articleMatch.js`)

```javascript
export const buildAnnotatedNewsFlow = (classifiedArticles, watchlist) => { ... }
```

**Algorithm:**

1. **Sort** all classified articles by quality signal (descending):
   ```javascript
   .sort((a, b) => {
     const sigDiff = (b.significance || 0) - (a.significance || 0);
     if (sigDiff !== 0) return sigDiff;
     const bearishRank = (s) => (s === "bearish" ? 1 : s === "neutral" ? 0 : -1);
     const sentDiff = bearishRank(b.sentiment) - bearishRank(a.sentiment);
     if (sentDiff !== 0) return sentDiff;
     return (b.themes?.length || 0) - (a.themes?.length || 0);
   })
   ```

2. **Slice** top **20** articles after sorting (not before).

3. **Annotate** each article with watchlist company matches using `articleMatchesStock()` from `articleMatch.js`:
   ```javascript
   {
     title, themes, sentiment, significance, one_line,
     matchedTickers: ["NVDA", "AMAT"],
     matchedCompanies: ["Nvidia", "Applied Materials"],
   }
   ```

4. Return the annotated array for `buildThesisDriftPrompt`.

> **Why sort first:** Chronological or insertion-order slicing would send low-significance noise to the LLM and degrade clustering quality. Significance-first guarantees the highest-quality signals regardless of fetch order.

---

### Step 4 — Rewire `runFullSync()` (`backend/server.js`)

```javascript
import { generateAdversarialAnalysis } from "./services/adversarial.js";
import { generateThesisDriftReport } from "./services/thesisDrift.js";

// Inside runFullSync(), after fetchNewsAndProcess + fetchPrices:

const annotatedNewsFlow = buildAnnotatedNewsFlow(
  classifiedArticles,
  watchlistWithPrices
);

const weeklyBriefPromise = generateWeeklyBrief(classifiedArticles, themePulse);
const adversarialPromise = generateAdversarialAnalysis(classifiedArticles, themePulse);
const thesisDriftPromise = generateThesisDriftReport(
  classifiedArticles,
  watchlistWithPrices,
  themePulse
);

const enrichPromise = enrichWatchlistWithContext(watchlistWithPrices, classifiedArticles, {
  maxStocks: IS_VERCEL ? 10 : undefined,
  aiConcurrency: 5,
  rawArticlesByTheme,
});

const [weeklyBrief, adversarialAssessment, thesisDriftReport] = await Promise.all([
  weeklyBriefPromise,
  adversarialPromise,
  thesisDriftPromise,
  enrichPromise,
]);

const researchQueue = await generateResearchQueue(
  classifiedArticles,
  themePulse,
  watchlistWithPrices
);

const liveData = {
  // ...existing fields...
  adversarialAssessment,
  thesisDriftReport,
};
```

---

### Step 5 — Mock mode (`backend/services/mockData.js`)

Add realistic sample data for both new fields so dev/mock mode renders completely:

```javascript
adversarialAssessment: {
  asymmetricRisks: [
    {
      targetTheme: "datacenters",
      headlineRisk: "HBM exclusivity may be a mirage",
      adversarialArgument: "...",
      counterIndicatorToWatch: "SK Hynix capacity utilization vs Samsung HBM3e yield rates",
    },
    // 1–2 more
  ],
  blindspotAlert: "...",
},
thesisDriftReport: {
  detectedClusters: [
    {
      clusterName: "Advanced Packaging Supply Bottlenecks",
      impactedThemes: ["datacenters"],
      evidenceSummary: "...",
      severityScore: 7,
    },
  ],
  themeStatusUpdate: THEMES.map(({ id }) => ({
    themeId: id,
    status: "ACCELERATING", // vary per theme in mock
    narrativeShiftDetails: "...",
  })),
},
```

---

### Step 6 — Documentation updates (after code lands)

| File | Update |
|------|--------|
| `docs/supernova_dashboard_spec.md` | Add payload fields + feature descriptions |
| `docs/02_prompt_library.md` | Document new prompt builders |
| `docs/03_maintenance_playbook.md` | Add maintenance notes for new services |

---

## Frontend Contract (Reference — Separate Pass)

| Feature | Component target | Prop |
|---------|------------------|------|
| Challenge the CIO | Adjacent to `WeeklyBrief.jsx` | `data.adversarialAssessment` |
| Thesis Drift gauge | Extend `ThemePulse.jsx` | `data.thesisDriftReport.themeStatusUpdate` |
| Signal clusters | Theme Pulse panel or sub-section | `data.thesisDriftReport.detectedClusters` |

**Defensive rendering (required):**

```javascript
(adversarialAssessment?.asymmetricRisks ?? []).map(...)
(thesisDriftReport?.themeStatusUpdate ?? []).map(...)
```

**Drift gauge mapping (Phase 1 — daily status only):**

| Status | Color |
|--------|-------|
| `ACCELERATING` | Green (`--color-bullish`) |
| `STAGNANT` | Orange/amber |
| `DRIFTING` | Red (`--color-bearish`) |

**Phase 2 (deferred):** Historical drift requires storing prior `themeStatusUpdate` snapshots in a second KV key or diffing against `previousCache.themePulse` on each sync.

---

## Risk Matrix

| Risk | Severity | Mitigation |
|------|----------|------------|
| Vercel 60s timeout | **High** | Parallel LLM calls during enrichment; programmatic fallbacks; consider `maxDuration: 120` on Pro |
| Frontend crash on missing data | **High** | Strict schema fallbacks; optional chaining in UI |
| Redundant counter-thesis copy | Medium | Distinct prompt contracts + UI labels (see table above) |
| Invalid JSON from Claude | Medium | `callClaudeJSON` + normalization + fallback |
| Large prompt payloads | Medium | Top-20 cap after significance sort; slim JSON payloads |
| Old cache missing new fields | Low | Frontend treats missing fields as empty schema |

---

## Implementation Checklist

- [ ] **Step 1** — Add `buildChallengeTheCioPrompt`, `buildThesisDriftPrompt` to `prompts.js`; add token settings
- [ ] **Step 2** — Create `adversarial.js` with strict `ADVERSARIAL_FALLBACK`
- [ ] **Step 2** — Create `thesisDrift.js` with strict `THESIS_DRIFT_FALLBACK`
- [ ] **Step 3** — Create `buildAnnotatedNewsFlow` with significance sort → top 20 → company annotation
- [ ] **Step 4** — Rewire `runFullSync()` for parallel execution
- [ ] **Step 5** — Extend `buildMockDashboard()` with sample payloads
- [ ] **Test locally** — Full sync with API keys; verify payload shape
- [ ] **Test Vercel** — Measure sync duration; confirm fallbacks activate if needed
- [ ] **Step 6** — Update docs after code merge
- [ ] **Frontend pass** — New components (separate PR)

---

## File Map (New & Modified)

```
config/settings.js                          — add token budgets
backend/services/prompts.js                 — add 2 prompt builders
backend/services/newsAggregation.js         — NEW: buildAnnotatedNewsFlow
backend/services/adversarial.js             — NEW: generateAdversarialAnalysis
backend/services/thesisDrift.js             — NEW: generateThesisDriftReport
backend/services/mockData.js                — extend mock payload
backend/server.js                           — rewire runFullSync()
docs/05_adversarial_thesis_drift_plan.md    — this document
```

---

## Summary

The addendum refinements are sound and necessary:

1. **Sort-before-slice** ensures LLM quality over chronological noise.
2. **Strict empty schemas** prevent frontend runtime errors.
3. **Exact prompts** are production-ready and slotted into Step 1.

The plan is finalized. Implementation can proceed in checklist order, starting with prompts and aggregation helper, then services, then `runFullSync()` wiring.
