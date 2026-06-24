# Sigil Supernova — Documentation Index

Read these in order when onboarding to the repo.

## Product & architecture

| Doc | Purpose |
|-----|---------|
| [00_overview.md](./00_overview.md) | What the product is, all three frontend areas, APIs, refresh model |
| [supernova_dashboard_spec.md](./supernova_dashboard_spec.md) | Current architecture spec, payload shape, file map, demo story |

## Configuration & operations

| Doc | Purpose |
|-----|---------|
| [01_thesis_config.md](./01_thesis_config.md) | Theme IDs, watchlist, keywords, colors (`config/thesis.js`) |
| [02_prompt_library.md](./02_prompt_library.md) | Full Claude prompt text, stress scenarios, token limits, tuning |
| [03_maintenance_playbook.md](./03_maintenance_playbook.md) | Day-to-day edits: watchlist, prompts, cache, troubleshooting |
| [04_dev_setup.md](./04_dev_setup.md) | Local install, env vars, Vercel deploy, validation commands |

## Feature reference

| Doc | Purpose |
|-----|---------|
| [06_value_chain.md](./06_value_chain.md) | AI Infrastructure Value Chain explorer (`/value-chain`) |

## Offline exports (generated — do not edit by hand)

Regenerate after changing Learning Hub data modules:

```bash
node scripts/generate-learning-hub-export.mjs
node scripts/generate-learning-academy-html.mjs
```

| File | Contents |
|------|----------|
| [sigil-supernova-learning-hub-export.html](./sigil-supernova-learning-hub-export.html) | Flat HTML export of Reference + Practice content |
| [sigil-supernova-learning-academy.html](./sigil-supernova-learning-academy.html) | Interactive offline mirror of Learning Hub |

## Archive (implemented specs — historical)

| Doc | Status |
|-----|--------|
| [archive/LEARNING_HUB_UPGRADE_SPEC.md](./archive/LEARNING_HUB_UPGRADE_SPEC.md) | Implemented June 2026 |
| [archive/05_adversarial_thesis_drift_plan.md](./archive/05_adversarial_thesis_drift_plan.md) | Implemented — adversarial + thesis drift in sync pipeline |

## Static data (source of truth in `frontend/src/data/`)

| Module | Route / use |
|--------|----------------|
| `masteryGuideData.js` | Learning Hub Reference |
| `academyData.js` | Learning Hub Practice (quiz, flashcards, scenarios) |
| `aiInfraData.js` | Value Chain (`/value-chain`) |

Do **not** duplicate these under `docs/`. Edit the frontend modules directly.
