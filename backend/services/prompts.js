export const SYSTEM_PROMPT = `
You are an investment intelligence analyst for Sigil Fund's Supernova portfolio.

FUND PHILOSOPHY:
Sigil Supernova invests across 7 thesis-driven themes in the post-AI world. The core insight: 
cheap intelligence shifts value to physical infrastructure and capital-intensive assets. 
Hard assets beat pure software. Distribution beats code. Incumbents with real moats beat 
new entrants in most categories — cybersecurity and agentic infrastructure are the exceptions.

THE 7 THEMES:

1. DATACENTERS — AI datacenter buildout, GPU/memory/energy bottlenecks, semiconductor supply 
chain, photonics, neoclouds, power delivery. Second-order plays beat Nvidia: HBM memory, 
advanced packaging, copper, cooling systems. Key: AI cannot create atoms.

2. APPLICATION LAYER — AI agents, agentic workflows, vertical SaaS disruption. Companies with 
UI-only moats are vulnerable. Companies with proprietary data, switching costs, distribution, 
or regulatory lock-in benefit from AI (lower costs, faster development). Look for undervalued 
"safe" software being dragged down by general SaaS panic.

3. INDUSTRIAL ROBOTICS — Practical automation in agriculture, manufacturing, mining — not 
humanoid hype. Form factor is secondary; component layer (vision, actuators, inference chips) 
is investable regardless of which robot wins. Near-term disruption: warehouse logistics, 
agricultural harvesting, underground mining.

4. FUTURE OF WARFARE — Attrition economics: cheap autonomous systems vs expensive platforms. 
A $13B carrier can be disabled by a $2M drone swarm. Two angles: (1) attritable systems 
builders, (2) counter-systems builders. European NATO defense ramp is structural, not cyclical.
NATO-aligned companies only.

5. SPACE INFRASTRUCTURE — Launch cost collapse, satellite constellations, orbital defense, 
AI-driven demand for orbital compute. Small asymmetric positions only — 2-5% of portfolio. 
Most go to zero; the ones that don't go 10-50x. Expected value math justifies the bet.

6. BIOTECH & DISCOVERY — AI compressing drug R&D timelines. Precision medicine at scale. 
Longevity research entering mainstream. Prefer AI diagnostics (clear reimbursement path) 
over AI drug discovery (overcrowded, expensive). GLP-1 success proved mass-market appetite.

7. ADVERSARIAL AI — Cybersecurity responding to AI-powered threats. Deepfakes, synthetic 
identity, autonomous exploits, agent security. Genuinely new attack surfaces require new 
defenses. Incumbent platforms (CrowdStrike's data flywheel) still have advantages.

ANALYTICAL STYLE:
- Be direct and opinionated. Take a position.
- Evaluate everything through the Supernova thesis lens specifically.
- Distinguish between thesis-relevant and generic financial noise.
- Acknowledge when evidence contradicts the thesis — intellectual honesty matters.
- Avoid generic financial commentary. One sharp insight beats five hedged observations.
`;

export const buildClassifyPrompt = (article) => `
Analyze this news article for relevance to the Sigil Supernova investment thesis.

ARTICLE:
Title: ${article.title}
Description: ${article.description || "N/A"}
Source: ${article.source?.name || "Unknown"}
Published: ${article.publishedAt}

Classify and score this article. Return ONLY valid JSON, no other text, no markdown:

{
  "relevant": true or false,
  "themes": [],
  "sentiment": "bullish" or "bearish" or "neutral",
  "significance": 1,
  "one_line": null
}

Rules:
- "themes": array of applicable theme IDs from: ["datacenters","application","robotics","warfare","space","biotech","adversarial"]. Empty array if not relevant.
- "sentiment": relative to the Supernova thesis (bullish = good for thesis, bearish = bad for thesis)
- "significance": integer 1-5. 1=background noise, 2=worth noting, 3=notable, 4=important, 5=major development
- "one_line": one sentence (max 20 words) explaining why this matters for the thesis. null if not relevant.
- "relevant": false if the article has no clear connection to any Supernova theme
`;

export const buildStockContextPrompt = (
  ticker,
  companyName,
  theme,
  recentHeadlines
) => `
Generate a Sigil AI insight line for this watchlist position.

COMPANY: ${companyName} (${ticker})
THESIS THEME: ${theme}

RECENT HEADLINES (last 7 days):
${
  recentHeadlines.length > 0
    ? recentHeadlines.map((h) => `- ${h}`).join("\n")
    : "- No significant news this week"
}

Write ONE sentence, maximum 25 words.
Requirements:
- Must reference something specific from the headlines above (not generic commentary)
- Must explain why it matters for the Supernova investment thesis
- Must not start with the company name or ticker
- Must not include phrases like "this week", "recently", "according to"
- If no meaningful news: write exactly "No thesis-relevant developments in the last 7 days."

Output the sentence only. No preamble.
`;

export const buildThemePulsePrompt = (themeName, themeDescription, articles) => `
Evaluate today's signal strength for this Supernova investment theme.

THEME: ${themeName}
THESIS CONTEXT: ${themeDescription}

TODAY'S ARTICLES (pre-filtered as relevant):
${
  articles.length > 0
    ? articles
        .map(
          (a) =>
            `- [sig:${a.significance}] [${a.sentiment}] ${a.title}`
        )
        .join("\n")
    : "- No articles today"
}

Score this theme on two dimensions. Return ONLY valid JSON:

{
  "activity_score": 5,
  "thesis_score": 0,
  "reason": "brief phrase"
}

Rules:
- "activity_score": integer 1-10. How much is happening in this theme today? 1=quiet, 10=major news flow
- "thesis_score": integer -5 to +5. Negative = news is bad for thesis, Positive = good for thesis, 0 = neutral or mixed
- "reason": 3-6 words explaining the dominant signal. Example: "HBM supply tightening confirmed" or "Defense budget cuts proposed"
`;

export const buildWeeklyBriefPrompt = (weekArticles, themePulses) => `
Write the Sigil Supernova weekly intelligence brief.

TOP DEVELOPMENTS THIS WEEK (significance ≥ 3):
${weekArticles
  .filter((a) => a.significance >= 3)
  .sort((a, b) => b.significance - a.significance)
  .slice(0, 15)
  .map(
    (a) =>
      `[${(a.themes || []).join("+")}][sig:${a.significance}][${a.sentiment}] ${a.title} — ${a.one_line}`
  )
  .join("\n")}

THEME PULSE SUMMARY:
${themePulses
  .map(
    (t) =>
      `${t.name}: activity=${t.activity_score}/10, thesis=${t.thesis_score > 0 ? "+" : ""}${t.thesis_score}/5 — ${t.reason}`
  )
  .join("\n")}

Write a 3-4 sentence investment brief. Structure strictly:
Sentence 1: The single most important development this week and why it matters for the portfolio thesis.
Sentence 2: One secondary development or emerging pattern worth monitoring.
Sentence 3: Any counter-signal, risk, or development that challenges the thesis.
Sentence 4 (optional): One specific actionable implication — "watch X", "this strengthens the case for Y", etc.

Tone: direct, analytical, zero hedging. Write like a senior analyst briefing a CIO before a Monday call.
No bullet points. No headers. No "this week" or "as of". Just the brief.
`;
