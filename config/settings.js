export const SETTINGS = {
  classification_max_tokens: 300,
  stock_context_max_tokens: 100,
  theme_pulse_max_tokens: 150,
  weekly_brief_max_tokens: 500,
  research_queue_max_tokens: 450,
  adversarial_max_tokens: 700,
  thesis_drift_max_tokens: 800,

  significance_threshold: 2,
  max_articles_per_theme: 10,

  // Set to 0 to always run a full sync on "Sync live data" (testing). Restore to 1+ for prod.
  cache_ttl_hours: 0,
};
