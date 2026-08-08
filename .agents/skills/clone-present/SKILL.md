---
name: clone-present
description: "Generates a high-end redesign proposal package. Creates a mockup index, a portrait-oriented presentation, email offers, and messenger sales copy. Uses a 4-stage Node.js pipeline (Capture, Present, Email, Messenger).
argument-hint: "<url or report content>"
---

# Clone and Present

## Who you are

Everything told in .agents/skills/redisign-existing projects/SKILL.md file. Use this rules

## CORE DIRECTIVES

1.  **Architecture**: Use the 4-stage script architecture (`./scripts/capture-redisign-site.js`, `./scripts/make-email-html.js`, `./scripts/make-presentation.js`, `./scripts/make-text-for-messengers.js`).
3.  **The Package**: Create a self-contained folder named `[client-name]-redesign-<timestamp>`.

## EXECUTION STEPS

### 1. The Mockup (index.html)
  - Generate a high-fidelity redesign concept. 
  - Every section must have a unique `id` (e.g., `<section id="hero">`) so the capture script can slice them.
  - Generate `minimum 7 sections`, grab info from original url.

### 2. The Content (content.json)
  - Create a JSON file that maps the `id`s from the mockup to human-readable titles and descriptions of what was improved.

### 3. The Bash Script
  Generate a single bash script that builds the following structure relative to the execution path:
  - `templates/` (style.css, presentation.html, email-offer.html)
  - `scripts/` (capture-redisign-site.js, make-email-html.js, make-presentation.js,  make-text-for-messengers.js)
  - `index.html` (the redesign mockup)
  - `content.json` (the content for filling presentation)

---

## BASH TEMPLATE STRUCTURE

When asked to generate the package, output the code in this format:

```bash
#!/bin/bash
# Redesign Package Generator for [CLIENT_NAME]

PROJECT_DIR="$(pwd)/[client-name]-redesign"
mkdir -p "$PROJECT_DIR/templates" "$PROJECT_DIR/scripts"

# 1. GENERATE MOCKUP (INDEX.HTML)
cat << 'EOF' > "$PROJECT_DIR/index.html"
<!-- High-end HTML/CSS Mockup here with IDs -->
EOF

# 2. GENERATE CONTENT JSON
cat << 'EOF' > "$PROJECT_DIR/content.json"
{
  "hero_title": "...",
  "hero_subtitle": "...",
  "hero_description": "...",
  "updates": [
    {"id": "hero", "title": "...", "description": "..."},
    ...
  ]
}
EOF

# 3. GENERATE STYLES & TEMPLATES
cat << 'EOF' > "$PROJECT_DIR/templates/style.css"
/* Sexy Portrait CSS from context */
EOF

cat << 'EOF' > "$PROJECT_DIR/templates/presentation.html"
/* Sexy Portrait HTML from context */
EOF

cat << 'EOF' > "$PROJECT_DIR/templates/email-offer.html"
/* HTML Email template from context */
EOF

# 4. GENERATE 4-STAGE SCRIPTS
# (Insert the 1-capture.js, 2-present.js, 3-email.js, 4-messenger.js here)

# 5. MAKE EXECUTABLE & INSTALL
cat << 'EOF' > "$PROJECT_DIR/package.json"
{
  "dependencies": { "puppeteer-core": "latest" }
}
EOF

cat << 'EOF' > "$PROJECT_DIR/run_all.sh"
#!/bin/bash
node scripts/1-capture.js "demo" "index.html"
node scripts/2-present.js "demo" "content.json"
node scripts/3-email.js "demo" "content.json"
node scripts/4-messenger.js "demo" "content.json"
EOF
chmod +x "$PROJECT_DIR/run_all.sh"

echo "✅ Package created in $PROJECT_DIR"
echo "run 👉 ./$PROJECT_DIR/run_all.sh"
```