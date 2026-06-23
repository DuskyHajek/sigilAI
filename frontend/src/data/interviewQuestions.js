export const INTERVIEW_CATEGORIES = {
  motivation: "Motivation & fit",
  investment: "Investment thesis",
  dashboard: "Dashboard & tools",
  curveball: "Curveball",
};

export const INTERVIEW_QUESTIONS = [
  {
    id: "iq1",
    category: "motivation",
    question: "Why Sigil Supernova specifically — and why now, rather than a generalist tech fund or a pure AI ETF?",
    hint: "Connect disruptive-tech DNA, physical-layer thesis, and Day 0 learner posture. Avoid generic 'AI is the future' answers.",
    sampleAnswer: "Sigil isn't pivoting to AI — they're applying the same disruptive-tech playbook (asymmetric bets, inefficient markets, bottleneck thinking) to a new wave. Supernova is thesis-concentrated around the physical layer when intelligence commoditises. The fund is deliberately Day 0: epistemic humility plus a structured curriculum (this Learning Hub) to build genuine edge across seven themes, not surface-level AI hype.",
  },
  {
    id: "iq2",
    category: "investment",
    question: "Walk me through the physical layer thesis in 60 seconds. Where does value concentrate today vs. 2027?",
    hint: "Use bottleneck migration: software → GPUs → HBM/packaging → energy. Name one stock or category per rung.",
    sampleAnswer: "When intelligence commoditises, bottlenecks move to atoms: compute, memory bandwidth, packaging, power, materials. Today (2025–26) value sits in HBM, CoWoS capacity, and power delivery — not just NVIDIA GPUs. By 2027+, energy and grid constraints may dominate. I'd rotate with the binding constraint, not chase last year's winner.",
  },
  {
    id: "iq3",
    category: "investment",
    question: "CSU.TO is on the watchlist while many SaaS names are viewed skeptically. Explain the difference using the moat taxonomy.",
    hint: "UI/UX friction (dying) vs. proprietary data + switching costs (resilient). Constellation = vertical data moats.",
    sampleAnswer: "Many SaaS moats were UI/UX friction — AI agents collapse that. Constellation owns niche vertical software with extreme switching costs and decades of proprietary operational data. AI is a tailwind: they can deploy features to captive customers without CAC. That's the 'data moat gets wider' pattern, not the dying friction moat.",
  },
  {
    id: "iq4",
    category: "investment",
    question: "Why hold both Rheinmetall (RHM.DE) and Kratos (KTOS) in the same warfare theme?",
    hint: "Legacy rearm vs. attritable autonomous systems — complementary, not redundant.",
    sampleAnswer: "They express different legs of the same thesis. Rheinmetall captures European NATO rearmament in traditional platforms — artillery, armour, ammunition — high visibility, lower asymmetry. Kratos is a bet on attritable autonomous systems and the new cost-exchange ratio paradigm — higher risk, higher asymmetry. Ukraine proved 150:1 drone economics; Europe is restocking tanks. The portfolio holds both outcomes.",
  },
  {
    id: "iq5",
    category: "dashboard",
    question: "How would you use Thesis Radar and the Research Queue after a sync to stress-test the Supernova thesis?",
    hint: "Thesis Radar = drift status + headline count + tickers per pillar. Research Queue = actionable follow-ups. Mention Challenge the Thesis.",
    sampleAnswer: "Thesis Radar shows all seven pillars at once — I'd flag Diverging rows (news pulling against the thesis) even when headline count is high. Signal clusters at the top surface cross-company bottlenecks I'd miss reading tickers one by one. Research Queue gives concrete next checks: verify a claim, compare tickers, read a primary source. I'd pair that with Challenge the Thesis for adversarial risks the bullish flow might miss — confirmation bias audit in practice.",
  },
  {
    id: "iq6",
    category: "dashboard",
    question: "A watchlist name shows strong price action but a weak or neutral AI note. What do you do?",
    hint: "Price ≠ thesis validation. The note is the product. Check if the move is thematic or macro beta.",
    sampleAnswer: "I'd treat the AI note as the judgment layer — it explains why the move matters to Supernova specifically. Strong price + weak note might mean macro beta or sector rotation, not thesis confirmation. I'd add a Research Queue item: find the headline driving the move and classify it as first-order (GPU demand) vs. second-order (power, materials). Avoid confusing momentum with thesis fit.",
  },
  {
    id: "iq7",
    category: "curveball",
    question: "Open-source models match frontier performance and enterprise pilots switch to local Llama. Bull or bear for Supernova — and for which themes?",
    hint: "Second/third order effects across all 7 themes. Not a simple 'bear AI'.",
    sampleAnswer: "Mixed, not uniformly bearish. Application layer: hurts pure API wrappers; helps companies with data moats. Infrastructure: second-order bullish — more inference at the edge, more total compute. Cybersecurity: strongly bullish — easier to fine-tune models for abuse. Robotics/biotech: cheaper models accelerate deployment. The physical layer thesis survives; adversarial AI accelerates. I'd rotate within themes, not abandon the thesis.",
  },
  {
    id: "iq8",
    category: "curveball",
    question: "Sigil acknowledges p(doom) in the bear case but still runs a long-biased tech portfolio. Isn't that inconsistent?",
    hint: "Hedge what you can hedge. Existential tails aren't investable hedges. Theme 7 = adversarial humans, not ASI.",
    sampleAnswer: "Not inconsistent — it's probabilistic honesty. ASI misalignment can't be hedged with a long/short book; if it happens, portfolio outcomes are irrelevant. Theme 7 hedges the actionable middle: adversarial AI by criminals and nation-states — prompt injection, deepfakes, identity fraud. That's structurally growing demand regardless of the existential tail. Acknowledge the tail; invest in what you can underwrite.",
  },
  {
    id: "iq9",
    category: "motivation",
    question: "What's one concept from the Learning Hub you'd teach a new analyst in their first week — and one you'd defer?",
    hint: "Essentials first: second/third order, moat taxonomy, bottleneck theory. Defer deep specialty until overview sticks.",
    sampleAnswer: "Week one: First/Second/Third Order Effects plus Software Moat Taxonomy — they unlock every theme conversation. Defer: deep orbital mechanics or FDA SaMD pathways until they can classify secular vs. cyclical and run the moat test on any pitch. Breadth of frameworks before depth in one vertical.",
  },
  {
    id: "iq10",
    category: "investment",
    question: "Hyperscalers guide capex down 10–15% for next year. Is that a sell signal for the AI infrastructure theme?",
    hint: "Capital Cycle Theory + secular vs. cyclical. What would flip you genuinely bearish?",
    sampleAnswer: "Cyclical pause within a secular buildout — not automatic sell. Capital Cycle: high returns drew excess capex; guidance normalises. Bull case: competition prevents sustained under-investment; cyclical PTSD extends the next upcycle. I'd watch for structural signals: three consecutive down guides plus open-source efficiency destroying training economics. Until then, rotate to the current bottleneck (HBM, power), don't abandon the theme.",
  },
];
