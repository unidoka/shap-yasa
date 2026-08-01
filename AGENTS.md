# shap-yasa Agent Skills

This repository contains two production-ready AI agent skills for high-ticket web sales engineering.

## find-check-websites
- **Description:** Conducts a Russian market search for companies with critical technical debt (LCP > 4s, broken mobile, SSL/security flaws). Automatically extracts decision-maker contacts and outputs a strict JSON report.
- **Arguments:** `<city-1> [<city-2> ...]` (e.g., `Moscow SPb`). If none provided, defaults to Moscow & St Petersburg.
- **Skill Path:** `.agents/skills/find-check-websites/SKILL.md`

## clone-present
- **Description:** Clones the visual style of a target URL, applies premium "Taste Skills v2" design upgrades (banning Inter, AI-purple, centered heroes, and emojis), and generates a self-contained `index.html`, email-ready `offer.html`, and `presentation.pdf`.
- **Arguments:** `<url>`
- **Skill Path:** `.agents/skills/clone-present/SKILL.md`