export const THEMES = [
  {
    id: "datacenters",
    display_name: "Physical Datacenters",
    icon: "server",
    color_hex: "#00C896",
    short_description: "AI infrastructure buildout, GPUs, HBM memory, copper, energy",
    long_description:
      "The AI datacenter buildout is the defining capital expenditure story of this decade. Hyperscalers are spending hundreds of billions to stay competitive, and sovereign nations are investing heavily to not fall behind. Key insight: AI cannot create atoms. Intelligence is becoming cheap — the physical layer that runs it is the bottleneck. Winners are those controlling compute, memory, energy, cooling, and the materials supply chain. Nvidia is overowned; the edge is in second-order plays: HBM memory (SK Hynix, Micron), advanced packaging (AMAT, ASML), power delivery (Vertiv, Eaton), and raw materials (copper, rare earths).",
    news_keywords: [
      "GPU datacenter",
      "HBM memory",
      "hyperscaler capex",
      "TSMC capacity",
      "semiconductor supply chain",
      "AI power consumption",
      "datacenter construction",
      "Nvidia Blackwell",
      "advanced packaging",
      "neoclouds",
    ],
    bull_signals: [
      "capex increase announcements",
      "supply constraints tightening",
      "sovereign AI investment",
      "new fab construction",
    ],
    bear_signals: [
      "capex pause or cut",
      "model efficiency breakthrough reducing compute need",
      "Taiwan geopolitical escalation",
    ],
  },
  {
    id: "application",
    display_name: "Application Layer",
    icon: "layers",
    color_hex: "#FF6B6B",
    short_description:
      "AI agents, vertical SaaS with real moats, agentic workflow infrastructure",
    long_description:
      "The most nuanced theme. The market is mispricing the AI software disruption in both directions. Companies most at risk: those whose moat is the user interface (pure UI SaaS, no data lock-in, no workflow integration). Companies that benefit: those with proprietary data, switching costs, regulatory moats, or deep workflow integration that AI accelerates rather than replaces. Key insight: AI reduces the cost of building software — but it also reduces the cost of building software for incumbents. Distribution is now the scarce resource, not code. Look for vertical market software with sticky customer bases being dragged down by general SaaS panic.",
    news_keywords: [
      "AI agents",
      "AI agent",
      "agentic AI",
      "agentic workflow",
      "vertical SaaS AI",
      "enterprise AI",
      "enterprise copilot",
      "AI coding",
      "GitHub Copilot",
      "Microsoft Copilot",
      "Salesforce Agentforce",
      "Cursor AI",
      "Claude Code",
      "OpenAI Codex",
      "UiPath AI",
      "SaaS AI",
      "AI automation workflows",
      "workflow automation AI",
      "replacing SaaS with AI",
      "AI workflow software",
    ],
    bull_signals: [
      "incumbents using AI to expand margins",
      "agentic deployments at enterprise scale",
      "vertical SaaS showing AI-resilient churn",
    ],
    bear_signals: [
      "major enterprise replacing SaaS with custom AI build",
      "open-source models commoditizing core workflows",
      "coding AI making software startups trivially cheap to build",
    ],
  },
  {
    id: "robotics",
    display_name: "Industrial Robotics",
    icon: "cpu",
    color_hex: "#FFB347",
    short_description:
      "Real-world automation in logistics, mining, agriculture — not humanoid hype",
    long_description:
      "Despite the humanoid robot hype, the real near-term opportunity is in unglamorous industrial automation: agriculture, mining, heavy manufacturing, logistics. Key insight: form factor is secondary. All robots regardless of shape require the same components — vision systems, force-torque sensors, local inference chips, magnetic joints, coordination software. The component layer is investable regardless of which humanoid wins. Sectors being disrupted first: warehouse logistics (already happening), agricultural harvesting (labor shortage + precision demand), underground mining (safety regulation push). Humanoid robots are a 5-10 year story; industrial automation is a 2-3 year story.",
    news_keywords: [
      "industrial automation",
      "warehouse robotics",
      "agricultural robot",
      "mining automation",
      "humanoid robot deployment",
      "robot components",
      "force torque sensor",
      "autonomous mobile robot",
      "robot inference chip",
      "manufacturing automation AI",
    ],
    bull_signals: [
      "labor shortage driving automation capex",
      "new industrial deployment contracts",
      "component shortages (vision chips, actuators)",
    ],
    bear_signals: [
      "humanoid robot hype exceeding industrial reality",
      "component oversupply",
      "regulatory pushback on autonomous systems",
    ],
  },
  {
    id: "warfare",
    display_name: "Future of Warfare",
    icon: "shield",
    color_hex: "#E05C5C",
    short_description:
      "Asymmetric attrition warfare: cheap autonomous systems vs expensive platforms",
    long_description:
      "Ukraine proved the economic asymmetry argument in real time: a $13B aircraft carrier can be functionally disabled by a $2M drone swarm. The defining shift is from expensive, complex, crewed platforms toward cheap, autonomous, expendable systems at volume. This creates two investable angles: (1) companies building attritable autonomous systems — drones, loitering munitions, undersea vehicles; (2) companies building defenses against these systems — counter-drone, electronic warfare, hardened comms. Separate from the attrition angle: European NATO members are structurally under-invested in defense after 30 years of peace dividend. Germany, Poland, and Nordic countries are legally committed to large defense budget increases through 2030. European defense primes are multi-year backlogged. Only invest in NATO-aligned companies.",
    news_keywords: [
      "drone warfare",
      "autonomous drone military",
      "loitering munition",
      "counter-drone",
      "NATO defense spending",
      "European defense budget",
      "attritable aircraft",
      "hypersonic",
      "electronic warfare",
      "defense procurement 2026",
    ],
    bull_signals: [
      "NATO defense budget increases",
      "new drone program contracts",
      "counter-drone procurement",
      "European defense ramp",
    ],
    bear_signals: [
      "defense budget sequestration",
      "peace negotiations reducing urgency",
      "export restriction on dual-use tech",
    ],
  },
  {
    id: "space",
    display_name: "Space Infrastructure",
    icon: "globe",
    color_hex: "#7B68EE",
    short_description:
      "Launch cost collapse, satellite constellations, orbital defense — asymmetric bets",
    long_description:
      "Three forces converging: (1) Launch costs have collapsed — SpaceX's reusable rockets dropped cost-to-orbit by two orders of magnitude, opening entirely new use cases; (2) New US-China space race with national security implications — sovereign satellite networks, space-based ISR, orbital defense systems; (3) AI creating new demand drivers — orbital data centers with constant solar power, satellite-based AI inference for remote regions. Key insight: Launch cost collapse and sovereign space race are converging — SpaceX anchors the theme, secondary names are asymmetric bets. SpaceX (SPCX) is the space theme anchor — launch monopoly, Starlink scale, Starship optionality, and now the largest IPO in history. Secondary names (RKLB, ASTS) remain small asymmetric bets: options on massive outcomes, not core holdings. Most will go to zero. A small number will 10-50x. Size the anchor separately from the asymmetric sleeve.",
    news_keywords: [
      "SpaceX IPO",
      "SPCX stock",
      "SpaceX launch",
      "satellite constellation",
      "orbital infrastructure",
      "Starlink expansion",
      "space defense",
      "lunar mission",
      "reusable rocket",
      "LEO satellite",
      "space AI",
      "launch contract",
    ],
    bull_signals: [
      "launch cadence increasing",
      "new government satellite contracts",
      "commercial space station progress",
    ],
    bear_signals: [
      "Kessler syndrome risk (debris)",
      "launch failure causing market pullback",
      "regulatory delays on spectrum",
    ],
  },
  {
    id: "biotech",
    display_name: "Biotech & Discovery",
    icon: "activity",
    color_hex: "#20B2AA",
    short_description:
      "AI compressing drug R&D timelines, precision medicine, longevity research",
    long_description:
      "AI makes precision medicine economically viable at scale — customized diagnosis and treatment no longer require hours of specialist time per patient. On the research side, AI compresses the R&D cycle: target identification, molecule screening, clinical trial design. The bottleneck historically was compute + data; both are now cheaper. Key positioning: AVOID overcrowded AI drug discovery (Recursion, Insilico already expensive), PREFER AI-enabled diagnostics and imaging (defensible, regulatory moat, clear reimbursement path), and longevity research (early but enormous TAM with increasing mainstream acceptance). The structural catalyst: GLP-1 drugs (Ozempic, Wegovy) proved mass market appetite for biology-as-software. Next wave is personalized.",
    news_keywords: [
      "AI drug discovery",
      "precision medicine AI",
      "longevity research",
      "biotech FDA approval",
      "GLP-1 next generation",
      "AI diagnostics",
      "protein folding",
      "clinical trial AI",
      "digital biomarker",
      "CRISPR therapy",
    ],
    bull_signals: [
      "AI-discovered molecule entering Phase 2/3 trials",
      "FDA approval of AI-designed diagnostic",
      "longevity funding rounds increasing",
    ],
    bear_signals: [
      "AI drug discovery failures",
      "FDA regulatory tightening on AI-assisted approval",
      "reimbursement pushback on AI diagnostics",
    ],
  },
  {
    id: "adversarial",
    display_name: "Adversarial AI",
    icon: "lock",
    color_hex: "#9B59B6",
    short_description:
      "Cybersecurity responding to AI-powered threats, digital identity, agent governance",
    long_description:
      "AI agents and AI-generated content are saturating the internet and empowering bad actors at scale. Deepfakes, AI-written phishing, autonomous exploit generation, synthetic identity fraud — these are not future threats, they are happening now. Key insight: this is the cleanest exception to Sigil's general skepticism about new software startups, because defending against AI-native threats requires solutions that genuinely don't exist yet. The incumbent advantage still holds for platform cybersecurity (CrowdStrike's threat data flywheel), but there are genuine greenfield opportunities in: AI agent security (new attack surface), synthetic identity detection (new problem), and autonomous red teaming. Also a portfolio HEDGE — cybersecurity tends to perform when markets are stressed.",
    news_keywords: [
      "AI cybersecurity",
      "deepfake detection",
      "AI fraud",
      "synthetic identity",
      "autonomous hacking",
      "LLM security",
      "agent security",
      "AI phishing",
      "zero day AI",
      "cybersecurity breach 2026",
    ],
    bull_signals: [
      "major AI-powered breach",
      "new attack vector discovered",
      "enterprise AI security spending increase",
    ],
    bear_signals: [
      "consolidation compressing startup valuations",
      "open-source security tools eroding moats",
    ],
  },
];

// Fixed identity mapping used by theme panels (Thesis Radar).
// These are intentionally independent of live data sentiment scores.
export const THEME_COLORS = {
  datacenters: "teal",
  application: "red",
  robotics: "amber",
  warfare: "coral",
  space: "blue",
  biotech: "mint",
  adversarial: "purple",
};

// Tabler icon names (webfont: `ti` + `ti-<name>`).
export const THEME_ICONS = {
  datacenters: "ti-server-2",
  application: "ti-layers-subtract",
  robotics: "ti-robot",
  warfare: "ti-target-arrow",
  space: "ti-satellite",
  biotech: "ti-dna",
  adversarial: "ti-shield-lock",
};

export const WATCHLIST = [
  {
    ticker: "NVDA",
    company: "Nvidia Corp.",
    aliases: ["Nvidia", "Nvidia Corp", "Blackwell", "GPU", "GeForce"],
    theme: "datacenters",
    angle: "GPU monopoly — the unavoidable pick-and-shovel",
    priority: "core",
  },
  {
    ticker: "000660.KS",
    company: "SK Hynix",
    aliases: ["SK Hynix", "Hynix", "HBM", "HBM3e", "high bandwidth memory"],
    theme: "datacenters",
    angle: "HBM memory — gating component for AI accelerators",
    priority: "core",
  },
  {
    ticker: "MU",
    company: "Micron Technology",
    aliases: ["Micron", "Micron Technology", "DRAM", "HBM", "memory chip"],
    theme: "datacenters",
    angle: "HBM challenger + DRAM supply leverage",
    priority: "core",
  },
  {
    ticker: "AMAT",
    company: "Applied Materials",
    aliases: [
      "Applied Materials",
      "semiconductor equipment",
      "EUV",
      "advanced packaging",
      "wafer fabrication",
    ],
    theme: "datacenters",
    angle: "Semiconductor equipment — advanced packaging bottleneck",
    priority: "core",
  },
  {
    ticker: "FCX",
    company: "Freeport-McMoRan",
    aliases: ["Freeport", "Freeport-McMoRan", "copper", "copper mine"],
    theme: "datacenters",
    angle: "Copper — the physical bottleneck of grid buildout",
    priority: "core",
  },
  {
    ticker: "CSU.TO",
    company: "Constellation Software",
    aliases: ["Constellation Software", "Constellation", "CSI", "vertical SaaS"],
    theme: "application",
    angle: "1000 mini-monopolies with switching-cost moats",
    priority: "core",
  },
  {
    ticker: "PATH",
    company: "UiPath",
    aliases: ["UiPath", "agentic", "RPA", "robotic process automation"],
    theme: "application",
    angle: "Agentic workflow infrastructure",
    priority: "core",
  },
  {
    ticker: "VEEV",
    company: "Veeva Systems",
    aliases: ["Veeva", "Veeva Systems", "life sciences cloud", "Vault CRM"],
    theme: "application",
    angle: "Life sciences vertical — regulatory lock-in",
    priority: "core",
  },
  {
    ticker: "ISRG",
    company: "Intuitive Surgical",
    aliases: ["Intuitive Surgical", "da Vinci", "surgical robot", "robot-assisted surgery"],
    theme: "robotics",
    angle: "Surgical robotics — proven, regulated moat",
    priority: "core",
  },
  {
    ticker: "CGNX",
    company: "Cognex",
    aliases: ["Cognex", "machine vision", "industrial vision", "barcode reader"],
    theme: "robotics",
    angle: "Machine vision — eyes of every industrial robot",
    priority: "core",
  },
  {
    ticker: "KTOS",
    company: "Kratos Defense",
    aliases: [
      "Kratos",
      "Kratos Defense",
      "target drone",
      "attritable",
      "Valkyrie",
    ],
    theme: "warfare",
    angle: "Attritable jet drones — pure play on asymmetry",
    priority: "core",
  },
  {
    ticker: "AVAV",
    company: "AeroVironment",
    aliases: [
      "AeroVironment",
      "loitering munition",
      "Switchblade",
      "small UAS",
      "kamikaze drone",
    ],
    theme: "warfare",
    angle: "Loitering munitions + small UAS volume",
    priority: "core",
  },
  {
    ticker: "RHM.DE",
    company: "Rheinmetall",
    aliases: [
      "Rheinmetall",
      "European defense",
      "artillery",
      "Leopard",
      "NATO procurement",
    ],
    theme: "warfare",
    angle: "European defense prime — NATO ramp structural",
    priority: "core",
  },
  {
    ticker: "SPCX",
    company: "SpaceX",
    aliases: [
      "SpaceX",
      "Space Exploration Technologies",
      "Starlink",
      "Starship",
      "Falcon 9",
      "Falcon Heavy",
      "reusable rocket",
      "SpaceX IPO",
    ],
    theme: "space",
    angle:
      "Launch monopoly + Starlink scale + Starship optionality — now public (SPCX)",
    priority: "core",
    spotlight: "ipo",
  },
  {
    ticker: "RKLB",
    company: "Rocket Lab",
    aliases: ["Rocket Lab", "Neutron", "Electron", "small launch"],
    theme: "space",
    angle: "Small launch + satellite components — SpaceX alternative",
    priority: "core",
  },
  {
    ticker: "ASTS",
    company: "AST SpaceMobile",
    aliases: [
      "AST SpaceMobile",
      "SpaceMobile",
      "direct-to-cell",
      "satellite broadband",
    ],
    theme: "space",
    angle: "Satellite direct-to-phone broadband — asymmetric bet",
    priority: "speculative",
  },
  {
    ticker: "EXAS",
    company: "Exact Sciences",
    aliases: ["Exact Sciences", "Cologuard", "cancer screening", "colonoscopy"],
    theme: "biotech",
    angle: "AI-powered cancer diagnostics — reimbursement path",
    priority: "core",
  },
  {
    ticker: "RXRX",
    company: "Recursion Pharma",
    aliases: [
      "Recursion",
      "Recursion Pharmaceuticals",
      "AI drug discovery",
      "in silico",
    ],
    theme: "biotech",
    angle: "AI drug discovery — high risk/reward pipeline",
    priority: "speculative",
  },
  {
    ticker: "CRWD",
    company: "CrowdStrike",
    aliases: ["CrowdStrike", "Falcon", "endpoint security", "threat intelligence"],
    theme: "adversarial",
    angle: "Platform + threat data flywheel — incumbent",
    priority: "core",
  },
  {
    ticker: "PANW",
    company: "Palo Alto Networks",
    aliases: ["Palo Alto Networks", "Palo Alto", "PAN-OS", "SASE", "Prisma"],
    theme: "adversarial",
    angle: "Network security + SASE platform scale",
    priority: "core",
  },
  {
    ticker: "S",
    company: "SentinelOne",
    aliases: ["SentinelOne", "Singularity", "endpoint detection", "EDR"],
    theme: "adversarial",
    angle: "AI-native challenger to legacy endpoint security",
    priority: "watch",
  },
];

/** Terms used to match classified articles to a watchlist position. */
export const getStockMatchTerms = (item) => {
  const terms = new Set([item.company, ...(item.aliases || [])]);
  if (item.ticker.length >= 3) {
    terms.add(item.ticker);
  }
  return [...terms].filter((t) => t && t.length >= 2);
};

export const getThemeById = (id) => THEMES.find((t) => t.id === id);

export const getWatchlistItem = (ticker) =>
  WATCHLIST.find((w) => w.ticker === ticker);
