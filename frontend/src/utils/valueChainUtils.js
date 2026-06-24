import {
  TIERS,
  PHASES,
  WATCHLIST_TIER_MAP,
} from "../data/aiInfraData.js";

export const getTierByNumber = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  return TIERS.find((t) => t.tier === num) ?? null;
};

export const getPhaseByNumber = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return null;
  return PHASES.find((p) => p.number === num) ?? null;
};

export const getPhaseById = (id) => PHASES.find((p) => p.id === id) ?? null;

export const getTiersForPhase = (phaseId) =>
  TIERS.filter((t) => t.phase === phaseId);

export const getWatchlistTierNumbers = () =>
  new Set(Object.values(WATCHLIST_TIER_MAP).map((entry) => entry.tier));

export const getTickersForTier = (tierNumber) =>
  Object.entries(WATCHLIST_TIER_MAP)
    .filter(([, entry]) => entry.tier === tierNumber)
    .map(([ticker]) => ticker);

export const tierHasWatchlistExposure = (tier) =>
  getWatchlistTierNumbers().has(tier.tier);

export const filterTiers = ({
  phaseId = null,
  essentialOnly = true,
  watchlistOnly = false,
  query = "",
}) => {
  const q = query.trim().toLowerCase();

  return TIERS.filter((tier) => {
    if (phaseId && tier.phase !== phaseId) return false;
    if (essentialOnly && !tier.essential) return false;
    if (watchlistOnly && !tierHasWatchlistExposure(tier)) return false;
    if (!q) return true;

    const haystack = [
      tier.name,
      tier.subtitle,
      tier.role,
      tier.moat,
      tier.bottleneck,
      tier.sigil_angle,
      tier.metric,
      ...(tier.players?.map((p) => `${p.name} ${p.note}`) ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
};

export const parseSearchParams = (searchParams) => {
  const phaseRaw = searchParams.get("phase");
  const phase =
    phaseRaw != null && phaseRaw !== "" ? getPhaseByNumber(phaseRaw) : null;

  const tierRaw = searchParams.get("tier");
  let tierNumber = null;
  if (tierRaw != null && tierRaw !== "") {
    const n = Number(tierRaw);
    if (Number.isFinite(n) && getTierByNumber(n)) tierNumber = n;
  }

  return {
    phaseId: phase?.id ?? null,
    tierNumber,
    essentialOnly: searchParams.get("essential") !== "0",
    watchlistOnly: searchParams.get("watchlist") === "1",
    query: searchParams.get("q") ?? "",
  };
};

export const buildSearchParams = (state) => {
  const params = new URLSearchParams();

  if (state.phaseId) {
    const phase = getPhaseById(state.phaseId);
    if (phase) params.set("phase", String(phase.number));
  }
  if (state.tierNumber != null) {
    params.set("tier", String(state.tierNumber));
  }
  if (!state.essentialOnly) params.set("essential", "0");
  if (state.watchlistOnly) params.set("watchlist", "1");
  if (state.query?.trim()) params.set("q", state.query.trim());

  return params;
};

export const WATCHLIST_STACK_ENTRIES = Object.entries(WATCHLIST_TIER_MAP)
  .map(([ticker, entry]) => ({
    ticker,
    tierNumber: entry.tier,
    note: entry.note,
    tier: getTierByNumber(entry.tier),
  }))
  .sort((a, b) => a.tierNumber - b.tierNumber);
