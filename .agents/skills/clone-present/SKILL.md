---
name: clone-present
description: "Generates a high-end redesign proposal package. Uses a 4-stage pipeline calling existing repository scripts via PROJECT_DIR."
argument-hint: "<url or report content>"
---

# Clone and Present

## CORE DIRECTIVES
1.  **Design Rules**: Follow all instructions in `.agents/skills/redesign-existing-projects/SKILL.md`.
2.  **Mockup Requirements**: Generate a high-fidelity `index.html`. It MUST contain:
    - A unique `Header`.
    - **Minimum 7 distinct content sections** (each with a unique `id`).
    - A unique `Footer`.
3.  **Environment**: Use `PROJECT_DIR` from `.env` to locate templates and scripts.
4.  **No Script Cloning**: Do not output Node.js code for scripts. Use the ones in the repository.

## EXECUTION STEPS
1.  **Mockup**: Write `index.html` with the required sections/IDs.
2.  **Metadata**: Write `content.json` mapping IDs to the improvements made.
3.  **Orchestration**: Provide a Bash script that runs the Node.js scripts.

---

## BASH OUTPUT TEMPLATE

```bash
# 1. Setup paths
source ${SHAP_YASA_DIR}/.env
P_DIR=${PROJECT_DIR}
CLIENT="[client-slug]"
# Generate flat folder like in the screenshot
TARGET_DIR="$(pwd)/${CLIENT}-redesign-$(date +%s)"
mkdir -p "$TARGET_DIR"

# 2. Generate local files
cat << 'EOF' > "$TARGET_DIR/index.html"
<!-- Design per redesign-existing-projects/SKILL.md -->
<!-- Header + 7 Sections (id="s1", etc) + Footer -->
EOF

cat << 'EOF' > "$TARGET_DIR/content.json"
{
  "hero_title": "...",
  "hero_subtitle": "...",
  "hero_description": "...",
  "updates": [
    {"id": "s1", "title": "...", "description": "..."},
    ...
  ]
}
EOF

# 3. Call core scripts (Passing absolute TARGET_DIR for flat output)
# Stage 1: Capture
node "$P_DIR/scripts/capture-redisign-site.js" "$TARGET_DIR" "$TARGET_DIR/index.html"
# Stage 2: Presentation
node "$P_DIR/scripts/make-presentation.js" "$TARGET_DIR" "$TARGET_DIR/content.json"
# Stage 3: Email
node "$P_DIR/scripts/make-email-html.js" "$TARGET_DIR" "$TARGET_DIR/content.json"
# Stage 4: Messenger
node "$P_DIR/scripts/make-text-for-messengers.js" "$TARGET_DIR" "$TARGET_DIR/content.json"

echo "✅ Package created: $TARGET_DIR"
```