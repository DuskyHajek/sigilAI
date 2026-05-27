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

export const triggerSync = async () => {
  const response = await fetch("/api/sync", { method: "POST" });
  if (!response.ok) {
    throw new Error(`Failed to sync dashboard: ${response.statusText}`);
  }
  return response.json();
};
