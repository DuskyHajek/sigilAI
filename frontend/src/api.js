export const fetchHealth = async () => {
  const response = await fetch("/api/health");
  if (!response.ok) {
    throw new Error(`Failed to load health: ${response.statusText}`);
  }
  return response.json();
};

export const fetchDashboard = async () => {
  const response = await fetch("/api/dashboard");
  if (!response.ok) {
    throw new Error(`Failed to load dashboard: ${response.statusText}`);
  }
  return response.json();
};

export const fetchStressScenarios = async () => {
  const response = await fetch("/api/stress-scenarios");
  if (!response.ok) {
    throw new Error(`Failed to load stress scenarios: ${response.statusText}`);
  }
  return response.json();
};

export const runStressTest = async (scenarioId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch("/api/stress-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId }),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.error || `Stress test failed (${response.status})`);
    }

    return body;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Stress test timed out — try again or pick another scenario.", {
        cause: err,
      });
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

export const triggerSync = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 58000);

  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      signal: controller.signal,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.error || `Sync failed (${response.status})`);
    }

    return body;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        "Sync timed out after 58s. Vercel functions cap at 60s — the pipeline may still be too heavy. Retry once, or run sync locally with the same API keys.",
        { cause: err }
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};
