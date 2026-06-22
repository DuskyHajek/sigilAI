import { WATCHLIST, THEMES } from "../../config/thesis.js";

export const getMockThemePulse = () => ({
  datacenters: {
    activity_score: 9,
    thesis_score: 4,
    reason: "Blackwell ramp validates physical bottleneck thesis",
    headline_count: 4,
    source: "estimated",
    evidence: [
      {
        title: "Nvidia Blackwell shipments on track for H2 ramp",
        sentiment: "bullish",
        significance: 5,
        one_line: "Blackwell timeline validation reinforces GPU supply bottleneck thesis",
      },
      {
        title: "SK Hynix HBM3e allocation remains tight for hyperscalers",
        sentiment: "bullish",
        significance: 4,
        one_line: "Memory exclusivity widens second-order datacenter bottlenecks",
      },
    ],
  },
  application: {
    activity_score: 6,
    thesis_score: -1,
    reason: "Thin-wrapper SaaS churn rising",
    headline_count: 3,
    source: "estimated",
    evidence: [
      {
        title: "Enterprise teams pilot AI agents to replace workflow SaaS",
        sentiment: "bearish",
        significance: 4,
        one_line: "Agentic replacement risk for thin-wrapper SaaS moats",
      },
    ],
  },
  robotics: {
    activity_score: 5,
    thesis_score: 2,
    reason: "Industrial cobot adoption accelerating",
    headline_count: 2,
    source: "estimated",
    evidence: [
      {
        title: "Warehouse automation orders rise across Europe",
        sentiment: "bullish",
        significance: 3,
        one_line: "Industrial automation demand supports component-layer thesis",
      },
    ],
  },
  warfare: {
    activity_score: 8,
    thesis_score: 5,
    reason: "Attritable drone contracts expanding",
    headline_count: 3,
    source: "estimated",
    evidence: [
      {
        title: "Kratos wins Air Force attritable drone contract",
        sentiment: "bullish",
        significance: 4,
        one_line: "Attrition economics gaining defense procurement traction",
      },
    ],
  },
  space: {
    activity_score: 7,
    thesis_score: 3,
    reason: "Launch cadence and constellation buildout",
    headline_count: 2,
    source: "estimated",
    evidence: [
      {
        title: "Rocket Lab Neutron hot-fire test succeeds",
        sentiment: "bullish",
        significance: 3,
        one_line: "Alternative launch capacity progressing on schedule",
      },
    ],
  },
  biotech: {
    activity_score: 5,
    thesis_score: 2,
    reason: "AI diagnostics pipeline momentum",
    headline_count: 2,
    source: "estimated",
    evidence: [
      {
        title: "AI-assisted pathology adoption accelerates in US screening",
        sentiment: "bullish",
        significance: 3,
        one_line: "Diagnostics path clearer than crowded AI drug discovery",
      },
    ],
  },
  adversarial: {
    activity_score: 8,
    thesis_score: 4,
    reason: "Deepfake fraud driving security budgets",
    headline_count: 3,
    source: "estimated",
    evidence: [
      {
        title: "Deepfake fraud wave pushes banks toward zero-trust AI controls",
        sentiment: "bullish",
        significance: 4,
        one_line: "AI-native threats expanding security budgets",
      },
    ],
  },
});

const MOCK_CONTEXTS = {
  NVDA:
    "Blackwell shipping timelines confirmed on schedule, reinforcing physical GPU supply limits as the primary barrier to competitor entry.",
  "000660.KS":
    "SK Hynix secures exclusive HBM3e supply agreement for H2 2026, widening memory access bottlenecks for competing hyperscalers.",
  MU: "Micron's Q3 results exceed capacity expectations, demonstrating that advanced DRAM density demand remains structurally undersupplied.",
  AMAT:
    "Applied Materials signals rising bookings for advanced EUV patterning, solidifying control over foundational lithography bottlenecks.",
  FCX: "Freeport signals tight copper supply amid massive grid upgrades, illustrating the physical commodity limits of datacenter buildouts.",
  "CSU.TO":
    "Constellation acquires niche logistics ERPs with deep operational databases, showing how vertical data moats survive LLM disruption.",
  PATH: "UiPath pivots to agentic process automation, illustrating workflow integration value over thin-wrapper SaaS.",
  VEEV: "Veeva expands life-sciences cloud modules, leveraging regulatory lock-in as horizontal SaaS faces AI commoditization pressure.",
  ISRG:
    "da Vinci 5 procedure volumes beat guidance, validating regulated hardware moats over pure-software robotics plays.",
  CGNX: "Cognex wins new machine-vision contracts in warehouse automation, confirming the component layer thesis over humanoid hype.",
  KTOS: "Kratos secures $112M Air Force contract for target drones, validating attritable fleet economics in defense procurement.",
  AVAV: "AeroVironment posts record backlog on European loitering-munition demand, proving tactical drone asymmetry at scale.",
  "RHM.DE":
    "Rheinmetall expands artillery shell capacity, showing European industrial manufacturing — not software — is the NATO ramp bottleneck.",
  RKLB: "Rocket Lab executes successful Neutron hot-fire test, positioning as the key alternative launch provider to SpaceX.",
  ASTS: "AST SpaceMobile advances direct-to-cell satellite tests, a high-beta bet on orbital broadband bypassing terrestrial towers.",
  EXAS: "Cologuard adoption accelerates with AI-assisted pathology reads, strengthening diagnostics-over-drug-discovery positioning.",
  RXRX:
    "Recursion partners with Sanofi on lead optimization, compressing discovery timelines but highlighting high execution risk.",
  CRWD:
    "CrowdStrike posts 33% ARR growth driven by autonomous agent threat detection, validating AI-native defensive platforms.",
  PANW: "Palo Alto introduces zero-trust AI agents for network boundaries, capturing share amid rising adversarial threat vectors.",
  S: "SentinelOne gains enterprise wins on AI-powered endpoint detection, challenging incumbents on autonomous response speed.",
};

export const getMockWatchlist = () =>
  WATCHLIST.map((item) => ({
    ticker: item.ticker,
    name: item.company,
    company: item.company,
    aliases: item.aliases,
    theme: item.theme,
    angle: item.angle,
    priority: item.priority,
    price: mockPrice(item.ticker),
    change52w: mockChange(item.ticker),
    priceSource: "mock",
    context:
      MOCK_CONTEXTS[item.ticker] ||
      "No thesis-relevant developments in the last 7 days.",
  }));

// Approximate demo prices (post-split era). Updated when Yahoo is unavailable.
const mockPrice = (ticker) => {
  const prices = {
    NVDA: 214.0,
    "000660.KS": 198500,
    MU: 98.5,
    AMAT: 178.2,
    FCX: 44.8,
    "CSU.TO": 4120.0,
    PATH: 11.2,
    VEEV: 218.4,
    ISRG: 542.0,
    CGNX: 38.6,
    KTOS: 48.3,
    AVAV: 168.5,
    "RHM.DE": 485.0,
    RKLB: 24.8,
    ASTS: 32.5,
    EXAS: 62.4,
    RXRX: 7.8,
    CRWD: 398.0,
    PANW: 358.0,
    S: 22.4,
  };
  return prices[ticker] ?? 100;
};

const mockChange = (ticker) => {
  const changes = {
    NVDA: 14.2,
    "000660.KS": 9.8,
    MU: 12.5,
    AMAT: 4.3,
    FCX: 16.9,
    "CSU.TO": 5.6,
    PATH: -8.9,
    VEEV: 2.1,
    ISRG: 3.1,
    CGNX: 6.4,
    KTOS: 18.7,
    AVAV: 22.1,
    "RHM.DE": 25.4,
    RKLB: -5.2,
    ASTS: 11.3,
    EXAS: 4.8,
    RXRX: -14.7,
    CRWD: -2.4,
    PANW: 1.8,
    S: 7.2,
  };
  return changes[ticker] ?? 0;
};

export const getMockWeeklyBrief = () =>
  "Physical constraints dominate the Supernova thesis this week, led by Nvidia's Blackwell timeline validation and Freeport-McMoRan signaling acute structural copper deficits for power grid expansions. In warfare, record backlogs at AeroVironment and new drone contracts for Kratos demonstrate that the economic asymmetry of cheap attritable weapons is gaining rapid defense procurement traction. Meanwhile, the application layer continues to undergo valuation pressure, highlighting the risk of thin-wrapper enterprise software as competitors easily replicate user interfaces. Analysts should watch rising deepfake fraud waves, which are shifting defensive budgets toward zero-trust cybersecurity architectures.";

export const getMockAdversarialAssessment = () => ({
  asymmetricRisks: [
    {
      targetTheme: "datacenters",
      headlineRisk: "HBM exclusivity may be a mirage",
      adversarialArgument:
        "SK Hynix capacity headlines mask Samsung HBM3e yield recovery — if memory bottlenecks ease faster than capex cycles, second-order picks re-rate down while Nvidia stays bid.",
      counterIndicatorToWatch:
        "SK Hynix capacity utilization vs Samsung HBM3e yield rates",
    },
    {
      targetTheme: "application",
      headlineRisk: "Agentic AI could collapse vertical SaaS moats faster than modeled",
      adversarialArgument:
        "Enterprise coding agents are shipping workflow replacement, not augmentation — PATH and CSU.TO angles assume sticky ops data; thin-wrapper churn may accelerate before incumbents adapt.",
      counterIndicatorToWatch:
        "Major enterprise replacing SaaS with custom AI build",
    },
    {
      targetTheme: "space",
      headlineRisk: "Launch cadence optimism ignores capital intensity",
      adversarialArgument:
        "Neutron milestones do not fix unit economics — constellation capex remains front-loaded while ASTS-style direct-to-cell bets need sustained funding in a higher-rate environment.",
      counterIndicatorToWatch:
        "Secondary offerings or capex pauses among small-cap space names",
    },
  ],
  blindspotAlert:
    "Three themes still score bullish on activity while thesis fit is mixed or negative — the portfolio may be overweight physical bottlenecks while underpricing software disruption velocity.",
  source: "claude",
});

const MOCK_DRIFT_STATUS = {
  datacenters: "ACCELERATING",
  application: "DRIFTING",
  robotics: "STAGNANT",
  warfare: "ACCELERATING",
  space: "STAGNANT",
  biotech: "ACCELERATING",
  adversarial: "ACCELERATING",
};

const MOCK_DRIFT_NARRATIVES = {
  datacenters:
    "Blackwell ramp and HBM supply stories reinforce the physical bottleneck narrative.",
  application:
    "Thin-wrapper SaaS churn headlines are shifting sentiment away from broad software resilience.",
  robotics:
    "Industrial automation news is steady but not accelerating versus prior weeks.",
  warfare:
    "Attrition drone contracts and NATO ramp headlines cluster across KTOS, AVAV, and RHM.DE.",
  space:
    "Launch milestones continue but funding and constellation build timelines remain uncertain.",
  biotech:
    "AI diagnostics pipeline momentum is building faster than drug-discovery hype.",
  adversarial:
    "Deepfake fraud and agent-security stories are clustering across CRWD, PANW, and S.",
};

export const getMockThesisDriftReport = () => ({
  detectedClusters: [
    {
      clusterName: "Advanced Packaging Supply Bottlenecks",
      impactedThemes: ["datacenters"],
      evidenceSummary:
        "Multiple headlines tie NVDA ramp, AMAT bookings, and HBM allocation to the same advanced packaging constraint — not independent bullish datapoints.",
      severityScore: 7,
    },
    {
      clusterName: "NATO Attrition Procurement Wave",
      impactedThemes: ["warfare"],
      evidenceSummary:
        "KTOS contract wins, AVAV backlog records, and Rheinmetall capacity expansion all point to the same European rearmament bottleneck.",
      severityScore: 6,
    },
  ],
  themeStatusUpdate: THEMES.map(({ id }) => ({
    themeId: id,
    status: MOCK_DRIFT_STATUS[id] || "STAGNANT",
    narrativeShiftDetails:
      MOCK_DRIFT_NARRATIVES[id] || "No major narrative shift detected in demo data.",
  })),
});

export const getMockResearchQueue = () => ({
  items: [
    {
      action:
        "Compare HBM memory supply headlines with SK Hynix and Micron capacity commentary.",
      keywords: ["HBM supply", "SK Hynix", "Micron", "datacenter memory"],
      theme: "datacenters",
      tickers: ["000660.KS", "MU"],
    },
    {
      action:
        "Check whether AI agent / enterprise SaaS news supports PATH and CSU.TO workflow moats.",
      keywords: ["AI agents", "vertical SaaS", "UiPath", "Constellation Software"],
      theme: "application",
      tickers: ["PATH", "CSU.TO"],
    },
    {
      action:
        "Verify attrition drone procurement stories against KTOS and AVAV backlog trends.",
      keywords: ["loitering munitions", "Kratos", "AeroVironment", "NATO drones"],
      theme: "warfare",
      tickers: ["KTOS", "AVAV"],
    },
    {
      action:
        "Look for counter-signals on thin-wrapper SaaS disruption before leaning bullish on application names.",
      keywords: ["SaaS churn", "AI coding", "software moat"],
      theme: "application",
      tickers: [],
    },
    {
      action:
        "Scan latest deepfake / AI fraud headlines and map them to CRWD vs PANW positioning.",
      keywords: ["deepfake fraud", "AI cybersecurity", "CrowdStrike", "Palo Alto"],
      theme: "adversarial",
      tickers: ["CRWD", "PANW"],
    },
  ],
});

export const buildMockDashboard = () => ({
  isMock: true,
  lastUpdated: new Date().toISOString(),
  themePulse: getMockThemePulse(),
  watchlist: getMockWatchlist(),
  weeklyBrief: getMockWeeklyBrief(),
  researchQueue: getMockResearchQueue(),
  adversarialAssessment: getMockAdversarialAssessment(),
  thesisDriftReport: getMockThesisDriftReport(),
});
