# shap-yasa Agent Skills

This repository contains two production-ready AI agent skills for high-ticket web sales engineering.

## find-check-websites
- **Description:** Conducts a Russian market search for companies with critical technical debt (LCP > 4s, broken mobile, SSL/security flaws). Automatically extracts decision-maker contacts and outputs a strict JSON report.
- **Arguments:** `<city-1> [<city-2> ...]` (e.g., `Moscow SPb`). If none provided, defaults to Moscow & St Petersburg.
- **Skill Path:** `.agents/skills/find-check-websites/SKILL.md`

## clone-present

- **Description:** Make redisign, presentation and text for messengers or email of url or urls given. If context or prompt has errors description you need to try to fix it.
- **Platforms**: only Unix (WSL, Linux, MacOS).
- **Important**: Use scripts and tempates from context (`./scripts` and `./templates` folders). Dont clone files, use PROJECT_DIR as orientir to grab content and execute scripts from this absolute path.
- **Arguments**: `<url or report content>`