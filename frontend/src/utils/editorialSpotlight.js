const UNAVAILABLE_BLINDSPOT = "Analysis temporarily unavailable.";

const SPOTLIGHT_COPY = {
  ipo: (stock) => ({
    title: `${stock.company || stock.name} is now public`,
    body: `Trades as ${stock.ticker}${stock.angle ? ` — ${stock.angle}` : ""}`,
  }),
};

export const pickEditorialSpotlight = ({
  watchlist,
  adversarialAssessment,
  thesisDriftReport,
  stressActive,
}) => {
  if (stressActive) return null;

  const spotlightStock = (watchlist ?? []).find((item) => item.spotlight);
  if (spotlightStock) {
    const copyFn = SPOTLIGHT_COPY[spotlightStock.spotlight];
    const copy = copyFn?.(spotlightStock) ?? {
      title: spotlightStock.company || spotlightStock.name,
      body: spotlightStock.angle || spotlightStock.context || "",
    };

    return {
      kind: "ticker",
      ticker: spotlightStock.ticker,
      themeId: spotlightStock.theme,
      title: copy.title,
      body: copy.body,
    };
  }

  const blindspot = adversarialAssessment?.blindspotAlert?.trim();
  const source = adversarialAssessment?.source;
  if (
    blindspot &&
    source !== "unavailable" &&
    blindspot !== UNAVAILABLE_BLINDSPOT &&
    source !== "none"
  ) {
    return {
      kind: "blindspot",
      text: blindspot.replace(/^SPOTLIGHT:\s*/i, ""),
    };
  }

  const clusters = thesisDriftReport?.detectedClusters ?? [];
  if (clusters.length > 0) {
    const top = [...clusters].sort(
      (a, b) => (b.severityScore ?? 0) - (a.severityScore ?? 0)
    )[0];

    return {
      kind: "signal",
      cluster: top,
    };
  }

  return null;
};

export const editorialShowsBlindspot = (spotlight) =>
  spotlight?.kind === "blindspot";
