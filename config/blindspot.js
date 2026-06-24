import { THEMES, WATCHLIST } from "./thesis.js";

const getThemeDisplayName = (themeId) =>
  THEMES.find((theme) => theme.id === themeId)?.display_name || themeId;

const getPrimaryTickerForTheme = (themeId) => {
  const core = WATCHLIST.find(
    (entry) => entry.theme === themeId && entry.priority === "core"
  );
  if (core) return core.ticker;
  return WATCHLIST.find((entry) => entry.theme === themeId)?.ticker ?? null;
};

const formatThemeList = (themeNames) => {
  if (themeNames.length === 1) return themeNames[0];
  if (themeNames.length === 2) return `${themeNames[0]} and ${themeNames[1]}`;
  return `${themeNames.slice(0, -1).join(", ")}, and ${themeNames.at(-1)}`;
};

const isStandingCounter = (text) =>
  /always on radar/i.test(String(text || ""));

/** Action-oriented Thesis gap copy — what to verify, not a headline restatement. */
export const buildActionBlindspotAlert = (risks) => {
  if (!risks?.length) return "";

  const themeNames = [
    ...new Set(risks.map((risk) => getThemeDisplayName(risk.targetTheme))),
  ];

  if (risks.length === 1) {
    const risk = risks[0];
    const ticker = getPrimaryTickerForTheme(risk.targetTheme);
    const hook = risk.headlineRisk.replace(/\.$/, "");
    const counter = risk.counterIndicatorToWatch?.replace(/\.$/, "");

    if (ticker && counter && !isStandingCounter(counter)) {
      const action =
        counter.charAt(0).toLowerCase() + counter.slice(1);
      return `Verify whether ${ticker} ${action}.`;
    }

    if (ticker) {
      return `Verify whether ${ticker} supply chain and earnings disclosures address: ${hook.toLowerCase()}.`;
    }

    return `Cross-check ${themeNames[0]} watchlist names against today's risk before sizing: ${hook}.`;
  }

  const themeList = formatThemeList(themeNames);
  const tickers = [
    ...new Set(
      risks
        .map((risk) => getPrimaryTickerForTheme(risk.targetTheme))
        .filter(Boolean)
    ),
  ];
  const tickerHint =
    tickers.length > 0
      ? ` Start with ${tickers.slice(0, 2).join(" and ")} latest filings.`
      : "";

  return `${risks.length} bearish signals across ${themeList} — reconcile watchlist thesis notes with today's headlines before sizing.${tickerHint}`;
};
