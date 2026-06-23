/** Pre-authored stress results for demo / offline / Claude fallback. */

const theme = (
  themeId,
  impact,
  impactType,
  rationale,
  transmission,
  confidence = "high"
) => ({
  themeId,
  impact,
  impactType,
  confidence,
  rationale,
  transmission,
});

const tickers = (mostExposed, mostResilient) => ({
  mostExposed,
  mostResilient,
});

const MOCK_BY_ID = {
  "taiwan-blockade": {
    summaryLine:
      "Supply chain shock hits datacenters hardest; defence and cyber partially offset.",
    portfolioRead:
      "The secular AI buildout thesis does not die overnight — but the datacenter sleeve faces structural supply disruption, not just sentiment. Warfare and adversarial pillars may benefit from rearmament and cyber escalation; application layer suffers from delayed enterprise deployments.",
    themeImpacts: [
      theme(
        "datacenters",
        "bearish",
        "structural",
        "TSMC/HBM logistics are the portfolio's single point of failure — blockade halts advanced chip flows.",
        "Blockade → fab/logistics halt → GPU and HBM supply shock → capex delays and margin compression"
      ),
      theme(
        "application",
        "bearish",
        "timing",
        "Enterprise AI rollouts stall when compute availability and hardware costs spike.",
        "Chip shortage → inference/training bottlenecks → slower agent deployments"
      ),
      theme(
        "robotics",
        "bearish",
        "timing",
        "Industrial automation capex gets deferred when supply chains freeze and uncertainty rises.",
        "Macro shock → capex pause → delayed robot deployments"
      ),
      theme(
        "warfare",
        "bullish",
        "structural",
        "Geopolitical escalation reinforces attrition economics and NATO rearmament urgency.",
        "Blockade → conflict premium → defence procurement acceleration"
      ),
      theme(
        "space",
        "neutral",
        "sentiment",
        "Launch demand may rise for sovereign comms, but risk-off can hit speculative space names.",
        "Geopolitical stress → mixed: strategic demand up, risk appetite down"
      ),
      theme(
        "biotech",
        "neutral",
        "sentiment",
        "Healthcare AI is less fab-dependent; funding cycles may tighten in risk-off.",
        "Risk-off → biotech funding caution, but diagnostics less supply-chain exposed"
      ),
      theme(
        "adversarial",
        "bullish",
        "structural",
        "State-sponsored cyber and supply-chain attacks expand security budgets.",
        "Geopolitical conflict → cyber escalation → security spend rises"
      ),
    ],
    tickerExposure: tickers(
      [
        {
          ticker: "000660.KS",
          exposure: "high",
          rationale:
            "Pure HBM supply chain leverage — memory is the first bottleneck when Taiwan flows stop.",
        },
        {
          ticker: "NVDA",
          exposure: "high",
          rationale:
            "GPU monopoly is unavoidable pick-and-shovel — but shipment delays crush near-term narrative.",
        },
        {
          ticker: "MU",
          exposure: "high",
          rationale:
            "HBM challenger sits on the same supply chain chokepoint as SK Hynix.",
        },
      ],
      [
        {
          ticker: "CRWD",
          exposure: "low",
          rationale:
            "Platform cyber spend rises in crisis; no fab exposure.",
        },
        {
          ticker: "KTOS",
          exposure: "low",
          rationale:
            "Attritable drones benefit from defence urgency in geopolitical escalation.",
        },
        {
          ticker: "RHM.DE",
          exposure: "low",
          rationale:
            "European defence prime — NATO ramp accelerates when supply chain security fails.",
        },
      ]
    ),
    counterIndicators: [
      "TSMC Arizona/Japan fabs ramp ahead of schedule with meaningful advanced-node output",
      "US strategic HBM stockpile or CHIPS Act emergency allocation announced",
      "Blockade lifted within 30 days with minimal fab disruption reported",
    ],
  },

  "model-cost-collapse": {
    summaryLine:
      "Cheap intelligence compresses datacenter capex ROI; application moats bifurcate.",
    portfolioRead:
      "This is bear case timing for hardware, not necessarily thesis invalidation — intelligence may still commoditise while physical bottlenecks persist at the margin. The critical split is in application: UI-friction moats break; data and distribution moats widen.",
    themeImpacts: [
      theme(
        "datacenters",
        "bearish",
        "timing",
        "Hyperscaler capex guidance cuts if GPU buildout ROI math breaks — cycle risk at peak holdings.",
        "10× cheaper models → less compute per task → capex revision → hardware de-rating"
      ),
      theme(
        "application",
        "neutral",
        "structural",
        "Agents accelerate thin-wrapper SaaS churn but lower dev costs help incumbents with data moats.",
        "Cheap models → moat bifurcation: friction moats die, data moats strengthen"
      ),
      theme(
        "robotics",
        "bullish",
        "structural",
        "Cheaper edge inference makes robot vision and coordination economically viable faster.",
        "Cheap inference → robot component layer scales → industrial automation accelerates"
      ),
      theme(
        "warfare",
        "neutral",
        "sentiment",
        "Defence budgets are geopolitically driven, not GPU-cycle driven.",
        "Minimal direct link — defence ramp is structural, not capex-cycle linked"
      ),
      theme(
        "space",
        "neutral",
        "sentiment",
        "Orbital compute thesis gets questioned if earthbound inference is cheap enough.",
        "Cheap earth inference → orbital compute TAM debate intensifies"
      ),
      theme(
        "biotech",
        "bullish",
        "structural",
        "AI diagnostics and discovery compress further when model costs collapse.",
        "Cheap intelligence → R&D cost curve drops → biotech AI tailwind"
      ),
      theme(
        "adversarial",
        "bullish",
        "structural",
        "Cheap models lower the cost of attacks — defence spending on AI security rises.",
        "Cheap offensive AI → attack surface expands → security budgets rise"
      ),
    ],
    tickerExposure: tickers(
      [
        { ticker: "NVDA", exposure: "high", rationale: "GPU monopoly most exposed to capex cycle revision." },
        { ticker: "AMAT", exposure: "high", rationale: "Equipment orders track hyperscaler capex — first to soften." },
        { ticker: "PATH", exposure: "high", rationale: "Agentic workflow name in crossfire if agents commoditise UI moats." },
      ],
      [
        { ticker: "CSU.TO", exposure: "low", rationale: "Vertical mini-monopolies with switching costs — AI tailwind not threat." },
        { ticker: "VEEV", exposure: "low", rationale: "Regulatory lock-in in life sciences — agents cannot replace compliance moat." },
        { ticker: "CRWD", exposure: "low", rationale: "Cheaper attacks expand TAM for platform cybersecurity." },
      ]
    ),
    counterIndicators: [
      "Hyperscalers reaffirm capex after efficiency gains (Jevons paradox — demand absorbs supply)",
      "HBM and power remain binding constraints despite model efficiency",
      "Enterprise agent adoption accelerates rather than replaces workflow software",
    ],
  },

  "us-ai-regulation": {
    summaryLine:
      "Deployment friction hits application layer; compliance spend lifts adversarial theme.",
    portfolioRead:
      "Regulation slows near-term AI product rollouts — bearish for agent-first names, neutral-to-bullish for cyber compliance platforms. Physical datacenter buildout may continue for sovereign/non-frontier workloads.",
    themeImpacts: [
      theme("datacenters", "neutral", "timing", "Compute caps hit frontier training, not necessarily inference infrastructure for enterprise.", "Regulation → training caps → mixed impact on capex mix"),
      theme("application", "bearish", "structural", "Agent liability and licensing freeze enterprise autonomous deployments.", "Regulation → deployment pause → SaaS/agent names de-rate"),
      theme("robotics", "bearish", "timing", "Autonomous system liability rules slow industrial robot rollouts.", "Regulation → autonomy liability → deployment delays"),
      theme("warfare", "neutral", "sentiment", "Defence AI often exempt or fast-tracked — limited direct impact.", "Defence procurement separate from civilian AI rules"),
      theme("space", "neutral", "sentiment", "Orbital AI compute faces new licensing complexity.", "Regulation → orbital compute regulatory overhead"),
      theme("biotech", "bearish", "timing", "FDA scrutiny on AI-assisted approvals may tighten.", "Regulation → medical AI approval delays"),
      theme("adversarial", "bullish", "structural", "Compliance, audit, and agent governance become mandatory spend.", "Regulation → compliance TAM → security platforms benefit"),
    ],
    tickerExposure: tickers(
      [
        { ticker: "PATH", exposure: "high", rationale: "Agentic workflow infrastructure directly in regulatory crosshairs." },
        { ticker: "S", exposure: "high", rationale: "AI-native challenger — more regulatory uncertainty than incumbents." },
        { ticker: "RXRX", exposure: "high", rationale: "AI drug discovery faces heightened FDA and compute scrutiny." },
      ],
      [
        { ticker: "PANW", exposure: "low", rationale: "SASE platform scale — enterprise compliance spend flows to incumbents." },
        { ticker: "CRWD", exposure: "low", rationale: "Incumbent platform benefits from mandated security controls." },
        { ticker: "VEEV", exposure: "low", rationale: "Already operates inside heavy regulatory moat — rules favour incumbents." },
      ]
    ),
    counterIndicators: [
      "Regulatory framework includes explicit enterprise safe harbours",
      "Defence and sovereign AI exemptions expand faster than expected",
      "Compliance tooling revenue beats guide at PANW/CRWD",
    ],
  },

  "hardware-cycle-turn": {
    summaryLine:
      "Bear case C — hardware de-rates at cycle peak; rotate signal, not thesis funeral.",
    portfolioRead:
      "Secular physical-layer thesis may remain correct while NVDA, HBM, and equipment names suffer 30–40% de-rating. Sigil's nuance: maintain thesis, watch for rotation into cycle-resistant moats (vertical software, defence, diagnostics).",
    themeImpacts: [
      theme("datacenters", "bearish", "timing", "Order book softening and capex cuts — classic capital cycle peak behaviour.", "Capex cut → equipment/memory de-rating → timing risk"),
      theme("application", "bullish", "timing", "Software moats outperform when hardware multiples compress — relative rotation.", "Hardware selloff → relative bid for resilient software"),
      theme("robotics", "neutral", "timing", "Industrial automation less tied to GPU cycle than datacenter names.", "Partial decoupling from hyperscaler capex"),
      theme("warfare", "neutral", "structural", "Defence budgets multi-year — not hyperscaler cyclical.", "NATO ramp independent of GPU cycle"),
      theme("space", "bearish", "sentiment", "Risk-off and capex caution hit speculative space sleeve.", "Cycle peak → speculative de-rating"),
      theme("biotech", "neutral", "structural", "Biotech decoupled from semiconductor capex cycle.", "Separate funding and reimbursement drivers"),
      theme("adversarial", "neutral", "sentiment", "Cyber holds up better in risk-off but not immune to multiple compression.", "Defensive relative performance possible"),
    ],
    tickerExposure: tickers(
      [
        { ticker: "NVDA", exposure: "high", rationale: "Most cyclical large-cap in datacenter sleeve." },
        { ticker: "AMAT", exposure: "high", rationale: "Equipment orders lead capex cycle turns." },
        { ticker: "000660.KS", exposure: "high", rationale: "HBM memory most leveraged to capex revision." },
      ],
      [
        { ticker: "CSU.TO", exposure: "low", rationale: "Cycle-resistant vertical software — rotation destination." },
        { ticker: "EXAS", exposure: "low", rationale: "Diagnostics path independent of GPU cycle." },
        { ticker: "RHM.DE", exposure: "low", rationale: "Defence backlog insulated from hyperscaler capex." },
      ]
    ),
    counterIndicators: [
      "Hyperscaler capex guide-up after single soft quarter",
      "HBM supply remains structurally tight despite capex rhetoric",
      "Foundry utilisation stays above 90% through downturn",
    ],
  },

  "agent-moat-collapse": {
    summaryLine:
      "Thin UI moats break; vertical data and regulatory lock-in names diverge.",
    portfolioRead:
      "Application layer splits sharply: PATH-type workflow names under maximum pressure; CSU and VEEV demonstrate the resilient pattern. This is the moat classification test applied at portfolio scale.",
    themeImpacts: [
      theme("datacenters", "neutral", "sentiment", "Agents still run on compute — indirect demand impact only.", "Agent adoption → mixed: more agents, potentially less per-agent compute"),
      theme("application", "bearish", "structural", "UI-friction SaaS moats collapse when agents navigate any interface.", "Agents → workflow replacement → thin moat churn"),
      theme("robotics", "bullish", "structural", "Agent intelligence improves robot coordination and deployment economics.", "Better agents → robot software layer accelerates"),
      theme("warfare", "neutral", "sentiment", "Military agents face separate procurement and trust barriers.", "Defence autonomy ≠ enterprise agent replacement"),
      theme("space", "neutral", "sentiment", "Limited direct application layer exposure.", "Minimal SaaS moat linkage"),
      theme("biotech", "neutral", "structural", "Regulated verticals resist agent replacement — VEEV pattern holds.", "Regulatory moats block agent substitution"),
      theme("adversarial", "bullish", "structural", "Autonomous agents create new attack surface — agent security TAM expands.", "Agents → new attack vectors → security spend"),
    ],
    tickerExposure: tickers(
      [
        { ticker: "PATH", exposure: "high", rationale: "Agentic workflow name — directly in replacement crosshairs." },
        { ticker: "S", exposure: "medium", rationale: "Challenger with less distribution moat than incumbents." },
        { ticker: "RXRX", exposure: "medium", rationale: "AI-native biotech without reimbursement moat — sentiment hit." },
      ],
      [
        { ticker: "CSU.TO", exposure: "low", rationale: "1000 mini-monopolies with switching costs — agent tailwind." },
        { ticker: "VEEV", exposure: "low", rationale: "Life sciences regulatory lock-in — agents cannot replace compliance." },
        { ticker: "CRWD", exposure: "low", rationale: "Agent security becomes mandatory infrastructure spend." },
      ]
    ),
    counterIndicators: [
      "Enterprise renewals hold for workflow names despite agent pilots",
      "Agent deployments augment rather than replace existing SaaS seats",
      "PATH shows net retention stabilisation with agent upsell",
    ],
  },

  "defence-peace-dividend": {
    summaryLine:
      "Warfare pillar stalls; attrition names de-rate while cyber holds relatively.",
    portfolioRead:
      "European defence ramp was priced as structural — a peace dividend scenario hits KTOS, AVAV, and RHM hardest. Thesis logic remains valid but near-term revenue growth disappears.",
    themeImpacts: [
      theme("datacenters", "neutral", "sentiment", "Peace dividend is risk-on — slight relief for supply chains.", "De-escalation → risk premium fades → mixed hardware read"),
      theme("application", "neutral", "sentiment", "Macro risk-on modestly helps software multiples.", "Peace → lower geopolitical discount rate"),
      theme("robotics", "neutral", "timing", "Defence-adjacent automation demand may soften.", "Defence pause → some automation deferral"),
      theme("warfare", "bearish", "timing", "NATO budget reversals directly hit attrition and prime contractors.", "Peace deal → procurement pause → defence de-rating"),
      theme("space", "bearish", "sentiment", "Orbital defence narrative weakens without geopolitical urgency.", "De-escalation → space defence premium fades"),
      theme("biotech", "neutral", "sentiment", "Minimal direct defence linkage.", "Independent sector dynamics"),
      theme("adversarial", "neutral", "sentiment", "Cyber threats persist even in peacetime — less cyclical than drones.", "Cyber less tied to defence budget cycle"),
    ],
    tickerExposure: tickers(
      [
        { ticker: "KTOS", exposure: "high", rationale: "Pure attritable drone play — first cut in procurement pause." },
        { ticker: "AVAV", exposure: "high", rationale: "Loitering munitions volume tied to active conflict demand." },
        { ticker: "RHM.DE", exposure: "high", rationale: "European defence prime — budget reversal hits backlog narrative." },
      ],
      [
        { ticker: "CSU.TO", exposure: "low", rationale: "No defence exposure — cycle-resistant software." },
        { ticker: "EXAS", exposure: "low", rationale: "Healthcare diagnostics decoupled from NATO budgets." },
        { ticker: "CRWD", exposure: "low", rationale: "Cyber persists regardless of peace dividends." },
      ]
    ),
    counterIndicators: [
      "NATO reaffirms 2%+ spending targets despite diplomatic progress",
      "European drone procurement contracts continue at pace",
      "KTOS/AVAV backlog growth reported in next earnings",
    ],
  },

  "sovereign-ai-capex-boom": {
    summaryLine:
      "Bull stress — physical layer validated; memory, equipment, and copper lead.",
    portfolioRead:
      "This is the thesis working as designed: cheap intelligence narrative reinforces that atoms, not models, are the bottleneck. Datacenter sleeve maximally benefits; speculative space names ride risk-on.",
    themeImpacts: [
      theme("datacenters", "bullish", "structural", "Sovereign + hyperscaler capex surge tightens HBM, fab, and power bottlenecks.", "Capex boom → supply constraints → second-order winners rally"),
      theme("application", "bullish", "timing", "Enterprise AI adoption accelerates when infrastructure is guaranteed.", "Buildout certainty → deployment confidence → software rerating"),
      theme("robotics", "bullish", "structural", "Industrial automation capex rises with sovereign manufacturing push.", "Sovereign manufacturing → automation demand"),
      theme("warfare", "bullish", "structural", "Sovereign AI includes dual-use defence compute and drone AI.", "Sovereign spend → dual-use defence AI"),
      theme("space", "bullish", "timing", "Orbital compute and sovereign constellations get funded.", "Sovereign space programs → launch demand"),
      theme("biotech", "neutral", "sentiment", "Biotech benefits indirectly from AI infrastructure confidence.", "Risk-on spillover — not direct capex link"),
      theme("adversarial", "bullish", "structural", "Sovereign AI buildout requires security and governance from day one.", "Sovereign AI → mandatory security stack"),
    ],
    tickerExposure: tickers(
      [
        { ticker: "000660.KS", exposure: "high", rationale: "HBM gating component — first beneficiary of supply tightness." },
        { ticker: "FCX", exposure: "high", rationale: "Copper bottleneck of grid buildout — physical layer pure play." },
        { ticker: "AMAT", exposure: "high", rationale: "Fab equipment orders surge with sovereign fab commitments." },
      ],
      [
        { ticker: "PATH", exposure: "low", rationale: "Relative laggard in bull hardware scenario — not a direct capex play." },
        { ticker: "ASTS", exposure: "low", rationale: "Speculative — less direct sovereign datacenter linkage." },
        { ticker: "RXRX", exposure: "low", rationale: "Biotech lags in pure infrastructure boom." },
      ]
    ),
    counterIndicators: [
      "Sovereign announcements fail to convert to signed contracts",
      "HBM supply expands faster than demand — memory prices fall",
      "Power grid bottlenecks delay datacenter construction timelines",
    ],
  },

  "p-doom-tail": {
    summaryLine:
      "Tail scenario — not hedgeable via public equities; middle-regime analysis still matters.",
    portfolioRead:
      "If ASI misalignment is imminent, no public portfolio protects you — Sigil acknowledges this honestly. Between the tails, adversarial AI and physical-layer assets may still matter for the actionable middle path. Do not treat this as a trading signal.",
    themeImpacts: [
      theme("datacenters", "bearish", "sentiment", "Risk-off and regulatory freeze would hit capex multiples — but hedging is impossible.", "Existential fear → risk-off → multiples compress", "medium"),
      theme("application", "bearish", "sentiment", "AI product value uncertain if alignment fails — but this is not a tradable edge.", "Tail risk → software derating — unhedgeable", "medium"),
      theme("robotics", "neutral", "sentiment", "Physical automation may persist regardless — tail impact unclear.", "Uncertain second-order effects", "low"),
      theme("warfare", "neutral", "sentiment", "Geopolitical chaos cuts both ways — not a clean portfolio read.", "Conflict may rise or institutions freeze", "low"),
      theme("space", "bearish", "sentiment", "Speculative assets sell first in existential risk-off.", "Tail risk-off → speculative space hit", "medium"),
      theme("biotech", "neutral", "sentiment", "Human health demand persists — tail scenario poorly mapped to biotech.", "Healthcare relatively inelastic", "low"),
      theme("adversarial", "neutral", "structural", "Only pillar with partial hedge logic — and even that fails in true p(doom).", "Adversarial helps in middle regime, not existential tail", "medium"),
    ],
    tickerExposure: tickers(
      [
        { ticker: "ASTS", exposure: "high", rationale: "Highest-beta speculative name — first sold in existential risk-off." },
        { ticker: "RXRX", exposure: "high", rationale: "Speculative biotech with no earnings floor." },
        { ticker: "PATH", exposure: "medium", rationale: "AI-native software with no physical moat in tail scenario." },
      ],
      [
        { ticker: "FCX", exposure: "low", rationale: "Physical copper — may retain value in chaos, but not an ASI hedge." },
        { ticker: "EXAS", exposure: "low", rationale: "Healthcare demand relatively inelastic." },
        { ticker: "RHM.DE", exposure: "low", rationale: "Defence may benefit from instability — imperfect hedge." },
      ]
    ),
    counterIndicators: [
      "This scenario is explicitly not hedgeable — counter-indicators are epistemic, not market signals",
      "Focus on actionable middle-regime adversarial and physical-layer positions instead",
    ],
  },
};

export const getMockStressResult = (scenarioId) => {
  const mock = MOCK_BY_ID[scenarioId];
  if (!mock) {
    throw new Error(`No mock stress result for scenario: ${scenarioId}`);
  }
  return mock;
};

export const hasMockStressResult = (scenarioId) => !!MOCK_BY_ID[scenarioId];
