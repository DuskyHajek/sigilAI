/** Preset macro scenarios for the Thesis Stress Tester (counterfactual "what if" pass). */
export const STRESS_SCENARIOS = [
  {
    id: "taiwan-blockade",
    label: "Taiwan Strait blockade",
    shortDescription:
      "China effectively blocks commercial transit through the Taiwan Strait — supply chain shock, not full invasion.",
    category: "geopolitical",
    memoRef: "Primary geopolitical bear case",
    prompt:
      "Assume China imposes an effective commercial blockade of the Taiwan Strait lasting 6+ months. TSMC and advanced semiconductor logistics are severely disrupted. Export controls tighten globally. This is a supply-chain shock scenario — not a full military invasion, but enough to halt normal chip flows.",
  },
  {
    id: "model-cost-collapse",
    label: "Frontier models 10× cheaper",
    shortDescription:
      "A major lab releases a frontier-class model at ~10× lower inference cost (DeepSeek-class disruption).",
    category: "technology",
    memoRef: "Physical-layer timing risk",
    prompt:
      "Assume a credible frontier AI lab releases a model matching current top-tier capability at roughly 10× lower training and inference cost, with open weights or trivial API pricing. Hyperscalers publicly revise downward their near-term AI capex guidance. The secular AI trend continues, but the ROI math on massive GPU buildouts is questioned in the market.",
  },
  {
    id: "us-ai-regulation",
    label: "Prohibitive US AI regulation",
    shortDescription:
      "US passes sweeping AI deployment restrictions — licensing, liability, and compute caps for frontier systems.",
    category: "regulatory",
    memoRef: "Deployment friction bear case",
    prompt:
      "Assume the US enacts prohibitive federal AI regulation: frontier model deployment requires federal licensing, strict liability for autonomous agent actions, and compute caps for training runs above a threshold. Enterprise AI adoption slows materially for 12–18 months while legal frameworks catch up. Compliance and security spending rises.",
  },
  {
    id: "hardware-cycle-turn",
    label: "Hardware cycle peaks (Bear C)",
    shortDescription:
      "Semiconductor hardware cycle turns — capex cuts, order book softening. Secular thesis intact, timing risk.",
    category: "cyclical",
    memoRef: "Memo bear case C — timing, not invalidation",
    prompt:
      "Assume the AI hardware supercycle peaks: multiple hyperscalers cut datacenter capex guidance for two consecutive quarters, foundry order books soften, and memory/equipment names de-rate 30–40%. The long-term 'intelligence commoditised → physical layer' thesis may still be correct — but you are holding hardware at the cycle peak. This is a timing and positioning scenario, not necessarily thesis invalidation.",
  },
  {
    id: "agent-moat-collapse",
    label: "Agents replace workflow SaaS",
    shortDescription:
      "Enterprises at scale replace UI-only SaaS with autonomous agents — thin moats break first.",
    category: "technology",
    memoRef: "Application layer invalidation risk",
    prompt:
      "Assume credible evidence that Fortune 500 enterprises are replacing UI-only workflow SaaS with autonomous AI agents at scale — not pilots, but production rollouts affecting renewal cycles. Companies whose moat is interface friction or shallow workflow wrappers face churn. Vertical software with proprietary data and regulatory lock-in may be less affected.",
  },
  {
    id: "defence-peace-dividend",
    label: "NATO ramp stalls",
    shortDescription:
      "Major peace settlement or budget reversal — European defence spending commitments slip.",
    category: "geopolitical",
    memoRef: "Warfare theme cyclical risk",
    prompt:
      "Assume a durable geopolitical de-escalation: major NATO members delay or reverse pledged defence budget increases, attrition-drone procurement programs are paused, and European rearmament timelines slip by 3+ years. The structural asymmetry thesis remains intellectually valid but near-term defence revenue growth stalls.",
  },
  {
    id: "sovereign-ai-capex-boom",
    label: "Sovereign AI capex surge",
    shortDescription:
      "Global sovereign AI buildout accelerates — bull stress test on the physical layer.",
    category: "bull",
    memoRef: "Validates physical-layer thesis",
    prompt:
      "Assume a coordinated global sovereign AI buildout: US, EU, Japan, and Gulf states announce $500B+ in combined AI infrastructure spending over 3 years, with explicit HBM, fab, and power-grid commitments. Hyperscaler capex is reaffirmed and extended. Supply constraints in memory, equipment, and copper intensify.",
  },
  {
    id: "p-doom-tail",
    label: "ASI misalignment (tail)",
    shortDescription:
      "Existential tail risk — memo acknowledges this is not hedgeable via public equities.",
    category: "tail",
    memoRef: "Memo p(doom) acknowledgment",
    prompt:
      "Assume credible evidence emerges that artificial superintelligence misalignment is a near-term (5-year) probability, not a distant tail — causing global risk-off, regulatory freeze, and civilizational uncertainty. Analyze portfolio impact honestly: Sigil acknowledges this scenario cannot be hedged with public equities. Do not force bearish reads on every pillar for narrative effect — distinguish actionable middle scenarios from unhedgeable tails.",
  },
];

export const getStressScenarioById = (id) =>
  STRESS_SCENARIOS.find((s) => s.id === id) || null;
