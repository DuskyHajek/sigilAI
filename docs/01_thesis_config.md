# Supernova Thesis Configuration
### Single Source of Truth — edit this file to update themes, tickers, or thesis logic everywhere

> **How this works:** The dashboard reads this configuration to drive theme names, descriptions, search keywords, watchlist tickers, and the AI system prompt. Change something here → it propagates everywhere. Never hardcode thesis content directly in components.

---

## Theme Registry

There are 7 themes. Each theme has: an ID, a display name, an icon, a short description (shown in the heatmap), a long description (used in the AI system prompt), and a keyword list (used for news search).

---

### Theme 1 — DATACENTERS

```json
{
  "id": "datacenters",
  "display_name": "Physical Datacenters",
  "icon": "server",
  "color_hex": "#00C896",
  "short_description": "AI infrastructure buildout, GPUs, HBM memory, copper, energy",
  "long_description": "The AI datacenter buildout is the defining capital expenditure story of this decade. Hyperscalers are spending hundreds of billions to stay competitive, and sovereign nations are investing heavily to not fall behind. Key insight: AI cannot create atoms. Intelligence is becoming cheap — the physical layer that runs it is the bottleneck. Winners are those controlling compute, memory, energy, cooling, and the materials supply chain. Nvidia is overowned; the edge is in second-order plays: HBM memory (SK Hynix, Micron), advanced packaging (AMAT, ASML), power delivery (Vertiv, Eaton), and raw materials (copper, rare earths).",
  "news_keywords": [
    "GPU datacenter", "HBM memory", "hyperscaler capex", "TSMC capacity",
    "semiconductor supply chain", "AI power consumption", "datacenter construction",
    "Nvidia Blackwell", "advanced packaging", "neoclouds"
  ],
  "bull_signals": ["capex increase announcements", "supply constraints tightening", "sovereign AI investment", "new fab construction"],
  "bear_signals": ["capex pause or cut", "model efficiency breakthrough reducing compute need", "Taiwan geopolitical escalation"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| NVDA | Nvidia | GPU monopoly — overowned but unmissable | Watch |
| 000660.KS | SK Hynix | HBM memory — gating component | Core |
| MU | Micron | HBM challenger + DRAM | Core |
| AMAT | Applied Materials | Semiconductor equipment | Core |
| ASML | ASML | EUV lithography monopoly | Core |
| SMCI | Super Micro Computer | Datacenter server integration | Watch |
| VRT | Vertiv | Datacenter cooling + power | Watch |
| CDNS | Cadence Design | Chip design software | Watch |
| FCX | Freeport-McMoRan | Copper — the physical bottleneck | Core |
| MP | MP Materials | Rare earth magnets | Speculative |

---

### Theme 2 — APPLICATION LAYER

```json
{
  "id": "application",
  "display_name": "Application Layer",
  "icon": "layers",
  "color_hex": "#FF6B6B",
  "short_description": "AI agents, vertical SaaS with real moats, agentic workflow infrastructure",
  "long_description": "The most nuanced theme. The market is mispricing the AI software disruption in both directions. Companies most at risk: those whose moat is the user interface (pure UI SaaS, no data lock-in, no workflow integration). Companies that benefit: those with proprietary data, switching costs, regulatory moats, or deep workflow integration that AI accelerates rather than replaces. Key insight: AI reduces the cost of building software — but it also reduces the cost of building software for incumbents. Distribution is now the scarce resource, not code. Look for vertical market software with sticky customer bases being dragged down by general SaaS panic.",
  "news_keywords": [
    "AI agents enterprise", "agentic workflow", "vertical SaaS AI", "LLM enterprise adoption",
    "software moat disruption", "AI coding productivity", "SaaS churn AI", "Claude enterprise",
    "OpenAI enterprise", "AI automation workflows"
  ],
  "bull_signals": ["incumbents using AI to expand margins", "agentic deployments at enterprise scale", "vertical SaaS showing AI-resilient churn"],
  "bear_signals": ["major enterprise replacing SaaS with custom AI build", "open-source models commoditizing core workflows", "coding AI making software startups trivially cheap to build"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| CSU.TO | Constellation Software | 1000 mini-monopolies, switching cost moat | Core |
| PATH | UiPath | Agentic workflow infrastructure | Core |
| HUBS | HubSpot | Distribution moat + AI CRM | Watch |
| VEEV | Veeva Systems | Life sciences vertical — regulatory lock-in | Core |
| PCTY | Paylocity | HR SaaS — deep workflow integration | Watch |
| GLBE | Global-E Online | Cross-border commerce infrastructure | Watch |

---

### Theme 3 — INDUSTRIAL ROBOTICS

```json
{
  "id": "robotics",
  "display_name": "Industrial Robotics",
  "icon": "cpu",
  "color_hex": "#FFB347",
  "short_description": "Real-world automation in logistics, mining, agriculture — not humanoid hype",
  "long_description": "Despite the humanoid robot hype, the real near-term opportunity is in unglamorous industrial automation: agriculture, mining, heavy manufacturing, logistics. Key insight: form factor is secondary. All robots regardless of shape require the same components — vision systems, force-torque sensors, local inference chips, magnetic joints, coordination software. The component layer is investable regardless of which humanoid wins. Sectors being disrupted first: warehouse logistics (already happening), agricultural harvesting (labor shortage + precision demand), underground mining (safety regulation push). Humanoid robots are a 5-10 year story; industrial automation is a 2-3 year story.",
  "news_keywords": [
    "industrial automation", "warehouse robotics", "agricultural robot", "mining automation",
    "humanoid robot deployment", "robot components", "force torque sensor", "autonomous mobile robot",
    "robot inference chip", "manufacturing automation AI"
  ],
  "bull_signals": ["labor shortage driving automation capex", "new industrial deployment contracts", "component shortages (vision chips, actuators)"],
  "bear_signals": ["humanoid robot hype exceeding industrial reality", "component oversupply", "regulatory pushback on autonomous systems"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| ISRG | Intuitive Surgical | Surgical robotics — proven, regulated moat | Core |
| ABB | ABB Ltd | Industrial automation incumbent | Core |
| FANUC | Fanuc (6954.T) | Japanese robotics component maker | Watch |
| CGNX | Cognex | Machine vision — eyes of every robot | Core |
| AXON | Axon Enterprise | Automation adjacent — AI hardware | Watch |
| TER | Teradyne | Test equipment + collaborative robots | Watch |
| VIAV | Viavi Solutions | Optical/sensing components | Speculative |

---

### Theme 4 — FUTURE OF WARFARE

```json
{
  "id": "warfare",
  "display_name": "Future of Warfare",
  "icon": "shield",
  "color_hex": "#E05C5C",
  "short_description": "Asymmetric attrition warfare: cheap autonomous systems vs expensive platforms",
  "long_description": "Ukraine proved the economic asymmetry argument in real time: a $13B aircraft carrier can be functionally disabled by a $2M drone swarm. The defining shift is from expensive, complex, crewed platforms toward cheap, autonomous, expendable systems at volume. This creates two investable angles: (1) companies building attritable autonomous systems — drones, loitering munitions, undersea vehicles; (2) companies building defenses against these systems — counter-drone, electronic warfare, hardened comms. Separate from the attrition angle: European NATO members are structurally under-invested in defense after 30 years of peace dividend. Germany, Poland, and Nordic countries are legally committed to large defense budget increases through 2030. European defense primes are multi-year backlogged. Only invest in NATO-aligned companies.",
  "news_keywords": [
    "drone warfare", "autonomous drone military", "loitering munition", "counter-drone",
    "NATO defense spending", "European defense budget", "attritable aircraft", "hypersonic",
    "electronic warfare", "defense procurement 2026", "Ukraine drone", "AI military"
  ],
  "bull_signals": ["NATO defense budget increases", "new drone program contracts", "counter-drone procurement", "European defense ramp"],
  "bear_signals": ["defense budget sequestration", "peace negotiations reducing urgency", "export restriction on dual-use tech"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| KTOS | Kratos Defense | Attritable jet drones — pure play | Core |
| AVAV | AeroVironment | Loitering munitions + small UAS | Core |
| RHM.DE | Rheinmetall | European defense prime — artillery, vehicles | Core |
| LHN.SW | Linde (defense adj.) | Industrial gases for defense manufacturing | Watch |
| LDOS | Leidos | Defense AI + C2 systems | Watch |
| HII | Huntington Ingalls | Shipbuilding — undersea systems | Watch |
| SARCOS | Sarcos Tech | Exoskeletons + defense robotics | Speculative |
| JOBY | Joby Aviation | eVTOL — dual-use potential | Speculative |

---

### Theme 5 — SPACE INFRASTRUCTURE

```json
{
  "id": "space",
  "display_name": "Space Infrastructure",
  "icon": "globe",
  "color_hex": "#7B68EE",
  "short_description": "Launch cost collapse, satellite constellations, orbital defense — asymmetric bets",
  "long_description": "Three forces converging: (1) Launch costs have collapsed — SpaceX's reusable rockets dropped cost-to-orbit by two orders of magnitude, opening entirely new use cases; (2) New US-China space race with national security implications — sovereign satellite networks, space-based ISR, orbital defense systems; (3) AI creating new demand drivers — orbital data centers with constant solar power, satellite-based AI inference for remote regions. Important framing: space positions are SMALL and ASYMMETRIC. These are options on massive outcomes, not core holdings. Most will go to zero. A small number will 10-50x. Allocate accordingly — 2-5% of portfolio maximum, expected value math justifies the risk.",
  "news_keywords": [
    "SpaceX launch", "satellite constellation", "orbital infrastructure", "Starlink expansion",
    "space defense", "lunar mission", "reusable rocket", "LEO satellite", "space AI",
    "launch contract", "space economy"
  ],
  "bull_signals": ["launch cadence increasing", "new government satellite contracts", "commercial space station progress"],
  "bear_signals": ["Kessler syndrome risk (debris)", "launch failure causing market pullback", "regulatory delays on spectrum"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| RKLB | Rocket Lab | Small launch + satellite components | Core (small position) |
| ASTS | AST SpaceMobile | Satellite direct-to-phone broadband | Speculative |
| MNTS | Momentus | In-space transportation | Speculative |
| BWXT | BWX Technologies | Nuclear propulsion for space | Speculative |
| MAXN | Maxeon Solar | Space-grade solar (dual-use) | Watch |

---

### Theme 6 — BIOTECH & DISCOVERY

```json
{
  "id": "biotech",
  "display_name": "Biotech & Discovery",
  "icon": "activity",
  "color_hex": "#20B2AA",
  "short_description": "AI compressing drug R&D timelines, precision medicine, longevity research",
  "long_description": "AI makes precision medicine economically viable at scale — customized diagnosis and treatment no longer require hours of specialist time per patient. On the research side, AI compresses the R&D cycle: target identification, molecule screening, clinical trial design. The bottleneck historically was compute + data; both are now cheaper. Key positioning: AVOID overcrowded AI drug discovery (Recursion, Insilico already expensive), PREFER AI-enabled diagnostics and imaging (defensible, regulatory moat, clear reimbursement path), and longevity research (early but enormous TAM with increasing mainstream acceptance). The structural catalyst: GLP-1 drugs (Ozempic, Wegovy) proved mass market appetite for biology-as-software. Next wave is personalized.",
  "news_keywords": [
    "AI drug discovery", "precision medicine AI", "longevity research", "biotech FDA approval",
    "GLP-1 next generation", "AI diagnostics", "protein folding", "clinical trial AI",
    "digital biomarker", "CRISPR therapy", "AI genomics"
  ],
  "bull_signals": ["AI-discovered molecule entering Phase 2/3 trials", "FDA approval of AI-designed diagnostic", "longevity funding rounds increasing"],
  "bear_signals": ["AI drug discovery failures", "FDA regulatory tightening on AI-assisted approval", "reimbursement pushback on AI diagnostics"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| ISRG | Intuitive Surgical | Surgical AI — proven revenue model | Core |
| RXRX | Recursion Pharma | AI drug discovery — high risk/reward | Speculative |
| NVAX | Novavax | mRNA platform — AI-optimized design | Watch |
| EXAS | Exact Sciences | AI-powered cancer diagnostics | Core |
| ILMN | Illumina | Genomic sequencing infrastructure | Watch |
| BEAM | Beam Therapeutics | Base editing — precision genetic medicine | Speculative |
| HIMS | Hims & Hers | Longevity/lifestyle medicine distribution | Watch |

---

### Theme 7 — ADVERSARIAL AI

```json
{
  "id": "adversarial",
  "display_name": "Adversarial AI",
  "icon": "lock",
  "color_hex": "#9B59B6",
  "short_description": "Cybersecurity responding to AI-powered threats, digital identity, agent governance",
  "long_description": "AI agents and AI-generated content are saturating the internet and empowering bad actors at scale. Deepfakes, AI-written phishing, autonomous exploit generation, synthetic identity fraud — these are not future threats, they are happening now. Key insight: this is the cleanest exception to Sigil's general skepticism about new software startups, because defending against AI-native threats requires solutions that genuinely don't exist yet. The incumbent advantage still holds for platform cybersecurity (CrowdStrike's threat data flywheel), but there are genuine greenfield opportunities in: AI agent security (new attack surface), synthetic identity detection (new problem), and autonomous red teaming. Also a portfolio HEDGE — cybersecurity tends to perform when markets are stressed.",
  "news_keywords": [
    "AI cybersecurity", "deepfake detection", "AI fraud", "synthetic identity",
    "autonomous hacking", "LLM security", "agent security", "AI phishing",
    "zero day AI", "cybersecurity breach 2026", "identity verification AI"
  ],
  "bull_signals": ["major AI-powered breach", "new attack vector discovered", "enterprise AI security spending increase"],
  "bear_signals": ["consolidation compressing startup valuations", "open-source security tools eroding moats"]
}
```

**Tickers to follow:**

| Ticker | Company | Angle | Priority |
|---|---|---|---|
| CRWD | CrowdStrike | Platform + data flywheel — the incumbent | Core |
| PANW | Palo Alto Networks | Network security + SASE platform | Core |
| S | SentinelOne | AI-native challenger to CrowdStrike | Watch |
| TENB | Tenable | Vulnerability management | Watch |
| QLYS | Qualys | Cloud security posture | Watch |
| ZS | Zscaler | Zero trust network access | Watch |

---

## How to update this file

**Adding a new ticker:**
1. Find the right theme section
2. Add a row to the tickers table with: Ticker, Company name, investment angle, priority (Core / Watch / Speculative)
3. Restart the backend — the watchlist auto-reads from this config

**Changing thesis description:**
1. Edit the `long_description` field in the relevant theme JSON block
2. The AI system prompt regenerates from this on next restart

**Changing news keywords:**
1. Edit the `news_keywords` array
2. Next sync will use the new keywords for NewsAPI queries

**Changing theme color:**
1. Edit `color_hex` — the heatmap will update automatically
