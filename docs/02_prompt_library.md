# Supernova Prompt Library

## Source of truth

All runtime prompts live in `backend/services/prompts.js`.

This doc explains what each prompt is responsible for and how to tune it. If you change a prompt in code, update this doc when the behavior or output contract changes.

## Shared system prompt

**Code:** `SYSTEM_PROMPT`

The system prompt encodes the Supernova worldview:

- hard assets and physical bottlenecks matter;
- distribution and incumbency matter;
- cybersecurity and agentic infrastructure are important exceptions;
- analysis must be thesis-specific and opinionated;
- counter-signals should be acknowledged honestly.

The prompt currently duplicates thesis language from `config/thesis.js`. Keep both aligned when the thesis changes.

## Prompt 1 — Article classification

**Code:** `buildClassifyPrompt(article)`

**Used by:** `backend/services/news.js`

**Purpose:** Classify each selected NewsAPI article against the 7 Supernova themes.

**Expected output:** JSON

```json
{
  "relevant": true,
  "themes": ["datacenters"],
  "sentiment": "bullish",
  "significance": 3,
  "one_line": "HBM supply constraints reinforce memory as the AI infrastructure bottleneck."
}
```

Important contract:

- `themes` must use the canonical IDs from `config/thesis.js`.
- `sentiment` is relative to the Supernova thesis, not the market in general.
- `significance` is an integer from 1 to 5.
- `one_line` is null when not relevant.
- The backend filters by `SETTINGS.significance_threshold`.

Tuning:

- Too much noise: raise `significance_threshold` in `config/settings.js`.
- Missing software/agent headlines: adjust application keywords or the application-specific prompt rule.
- Too many broad theme matches: add stronger primary-subject language to the prompt.

## Prompt 2 — Stock context line

**Code:** `buildStockContextPrompt(ticker, companyName, theme, companyAngle, recentHeadlines, matchType)`

**Used by:** `backend/services/prices.js`

**Purpose:** Generate the short watchlist note shown under each ticker.

The prompt receives:

- ticker and company name;
- theme ID;
- company investment angle;
- direct, theme-level, or raw headline match type;
- recent headlines.

Important contract:

- One sentence.
- Maximum 25 words.
- Do not start with the company name or ticker.
- Connect headlines to the company's specific investment angle.
- If no meaningful news exists, return exactly: `No thesis-relevant developments in the last 7 days.`

Tuning:

- If notes feel generic, strengthen the instruction to mention one concrete proper noun, product, contract, or metric from the headline.
- If theme-level matches overstate company relevance, make the `matchType !== "direct"` instruction more cautious.

## Prompt 3 — Theme pulse score

**Code:** `buildThemePulsePrompt(themeName, themeDescription, articles)`

**Used by:** `backend/services/news.js`

**Purpose:** Convert relevant theme articles into an activity score and thesis-fit score.

**Expected output:** JSON

```json
{
  "activity_score": 7,
  "thesis_score": 3,
  "reason": "HBM supply tightening confirmed"
}
```

Important contract:

- `activity_score`: integer 1-10.
- `thesis_score`: integer -5 to +5.
- `reason`: short phrase.

On Vercel, the backend may use a programmatic fallback instead of a Claude pulse call to stay within hosted function limits.

## Prompt 4 — Analyst brief

**Code:** `buildWeeklyBriefPrompt(weekArticles, themePulses)`

**Used by:** `backend/services/brief.js`

**Purpose:** Generate the page's top analyst brief from significant articles and theme pulse summaries.

Important contract:

- 3-4 sentences.
- Sentence 1: most important development and thesis implication.
- Sentence 2: secondary development or pattern.
- Sentence 3: counter-signal or risk.
- Sentence 4 optional: specific implication or watch item.
- No bullets, headers, or generic newsletter tone.

Tuning:

- Too generic: increase significance filtering or pass fewer but higher-quality developments.
- Too bullish: strengthen sentence 3 to require a genuine thesis challenge.
- Too long: reduce `weekly_brief_max_tokens` or tighten word limits.

## Prompt 5 — Research queue

**Code:** `buildResearchQueuePrompt(signals)`

**Used by:** `backend/services/researchQueue.js`

**Purpose:** Turn sync output into a practical analyst checklist.

**Expected output:** JSON

```json
{
  "items": [
    {
      "action": "Compare HBM memory supply headlines with SK Hynix and Micron capacity commentary.",
      "keywords": ["HBM supply", "SK Hynix", "Micron"],
      "theme": "datacenters",
      "tickers": ["000660.KS", "MU"]
    }
  ]
}
```

Important contract:

- 3-7 items.
- Each `action` is a short imperative sentence.
- `keywords` are concrete search terms.
- `theme` is a canonical theme ID or null.
- `tickers` is an array of watchlist tickers.
- Include at least one item that tests or challenges the thesis.

The service has a programmatic fallback if Claude fails or returns invalid JSON.

## Prompt 6 — Challenge the CIO (adversarial assessment)

**Code:** `buildChallengeTheCioPrompt(thesisConfig, newsItems)`

**Used by:** `backend/services/adversarial.js`

**Purpose:** Produce a structured adversarial dossier — asymmetric risks, blindspot alert, and counter-indicators — to fight confirmation bias. Complements (does not replace) the analyst brief's single counter-signal sentence.

**Inputs:**

- `thesisConfig` from `buildThesisConfig()` — theme id, display name, descriptions, bull/bear signals from `config/thesis.js`.
- Top 20 classified articles sorted by significance (bearish tie-break).

**Expected output:** JSON

```json
{
  "asymmetricRisks": [
    {
      "targetTheme": "datacenters",
      "headlineRisk": "HBM exclusivity may be a mirage",
      "adversarialArgument": "...",
      "counterIndicatorToWatch": "SK Hynix capacity utilization vs Samsung HBM3e yield rates"
    }
  ],
  "blindspotAlert": "..."
}
```

Important contract:

- 2–3 `asymmetricRisks` when signal exists.
- Service accepts output only if at least one risk and a non-empty `blindspotAlert`; otherwise uses programmatic fallback from negative thesis scores and bearish articles.
- Never returns `null` or `{}` — empty schema uses `asymmetricRisks: []` and a fallback alert string.

## Prompt 7 — Thesis drift & signal clustering

**Code:** `buildThesisDriftPrompt(thesisConfig, annotatedNewsFlow)`

**Used by:** `backend/services/thesisDrift.js`

**Purpose:** Detect cross-watchlist signal clusters and per-theme narrative drift status for the day.

**Inputs:**

- `thesisConfig` from `buildThesisConfig()`.
- Annotated news flow from `buildAnnotatedNewsFlow()` — top 20 articles by significance with matched tickers/companies.

**Expected output:** JSON

```json
{
  "detectedClusters": [
    {
      "clusterName": "Advanced Packaging Supply Bottlenecks",
      "impactedThemes": ["datacenters"],
      "evidenceSummary": "...",
      "severityScore": 7
    }
  ],
  "themeStatusUpdate": [
    {
      "themeId": "datacenters",
      "status": "ACCELERATING",
      "narrativeShiftDetails": "..."
    }
  ]
}
```

Important contract:

- `status` must be `ACCELERATING`, `STAGNANT`, or `DRIFTING`.
- `severityScore` clamped to 1–10 post-parse.
- `themeId` validated against known theme ids.
- On Claude failure, programmatic fallback derives `themeStatusUpdate` from `themePulse.thesis_score` and leaves `detectedClusters` empty.

## JSON parsing

`backend/services/llm.js` strips markdown fences before parsing JSON:

```javascript
text.replace(/```json|```/g, "").trim()
```

Prompts should still say "Return ONLY valid JSON" because malformed output will fail the sync step for that item or trigger a fallback.

## Prompt versioning

Record meaningful prompt changes here:

| Date | Prompt | Change | Reason |
|---|---|---|---|
| 2026-05-01 | All | Initial v0.1 prompts | First working dashboard |
| 2026-05-27 | Research queue docs | Documented shipped research queue prompt | Docs refresh |
| 2026-06-22 | Adversarial + thesis drift | Added Challenge the CIO and thesis drift prompts | Anti-confirmation-bias pipeline |

## Practical review checklist

After prompt changes, run a sync and inspect:

- Did article classification reduce noise without losing important signals?
- Do theme scores explain the news rather than just restating a headline?
- Do watchlist notes connect to company angle, not just theme buzzwords?
- Does the analyst brief include a real counter-signal?
- Does Challenge the CIO surface distinct asymmetric risks (not duplicate brief copy)?
- Do thesis drift badges and clusters match today's headline flow?
- Does the research queue give concrete next actions?
