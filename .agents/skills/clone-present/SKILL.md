---
name: clone-present
description: "Clones a reference style or report into a premium redesign and generates a 3-file presentation package (index, offer, pdf)."
argument-hint: "<url or report content>"
user-invocable: true
---

# Clone and Present (Premium Redesign)

## 1. Who you are

Everything told in .agents/skills/redisign-existing projects/SKILL.md file. Use this rules

## 2. File Requirements

### 2.1. `index.html`: A complete, single-file redising of given website:
  * Use content and info from original site (**use current info**, don't use fake one).
  * Every major section **MUST** have a unique ID (`id="hero"`, `id="features"`, `id="cta"`, etc.).
  * **Important**: add **minimum 7** seciotns and header with footer on index.html!
  * Don't make big whitespaces in cards. Try to fill them.
  * You can add logos from `https://brandfetch.io` to not leave them empty.
  * You can use `https://picsum.photos/seed/[descriptive-seed]/width/height`. Seeds must match the business context (e.g., `seed=hiring` for job sites). Accord to site theme (e.g. Cat Delivery is site about Delivery, not abot cats).
  * You can use icons from `https://jsdelivr.net`.
  * Don't write years (est. from, etc.). Write only current year in footer.

### 2.2. `offer.html`: An email-ready presentation with inline CSS. It must include:
  * It must accord template, email-optimized code from `./offer-template.html file`.
  * **Important**: When generating offer.html, you are **forbidden** from omitting any images or links from the reference template. Use the exact `https://i.rovno.dev/...` image paths and the specific Telegram/Yandex Form URLs provided in template code!
  * CSS need to be inline, HTML 3.2/4.0.
  * You need to add opportunities based on site problems that we fixed (UX/UI) or can fix (security).

### 2.3. `presentation.pdf`: A PDF version of `offer.html`
 * Generated via Puppeteer.
 * PDF making from `presentation.html` file that based on `./presentation-template.html` file code. 
 * Contains additional human-like description of all important information from `offer.html`.

## 3. Implementation Script (Bash)

### 3.1 If user promted bash mode

  * Provide a single bash script with all filex and all operations in one script.
  * If multiple sites providen they need in separate directories.
  * Script need to have index.html code too and no separate files. 
  * Script does everything.
  * Use relative paths for Node scripts.

```bash
#!/bin/bash

SITE_NAME=${1:-"demo"}
OUTPUT_DIR="./${SITE_NAME}-demo"

mkdir -p "$OUTPUT_DIR"

export OUTPUT_DIR

# index.html code

node <<'NODE_SCRIPT'
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = process.env.OUTPUT_DIR;

(async () => {
  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (!executablePath) {
    const commonPaths = [
      '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const p of commonPaths) { if (fs.existsSync(p)) { executablePath = p; break; } }
  }

  const browser = await puppeteer.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  const indexFilePath = path.resolve(OUTPUT_DIR, 'index.html');
  await page.goto('file://' + indexFilePath, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1280, height: 800 });

  // Full screenshot
  const fullScreenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'screenshot.base64'), fullScreenshot);

  // Section screenshots based on IDs generated in index.html
  const sectionIds = ['hero', 'features', 'testimonials', 'cta']; 
  for (const id of sectionIds) {
    const element = await page.$(`#${id}`);
    if (element) {
      const base64 = await element.screenshot({ encoding: 'base64' });
      fs.writeFileSync(path.join(OUTPUT_DIR, `section-${id}.base64`), base64);
    }
  }
  await browser.close();
})();
NODE_SCRIPT

cat > "${OUTPUT_DIR}/offer.html" <<'OFFER_EOF'
  # offer.html code based on template
OFFER_EOF

cat > "${OUTPUT_DIR}/offer.html" <<'OFFER_EOF'
  # presentation.html code based on offer.html but with images and modern css
OFFER_EOF

perl -i -pe '
  BEGIN { open(F, "'"${OUTPUT_DIR}/screenshot.base64"'"); $b = do { local $/; <F> }; chomp $b; close F; }
  s/{{FULL_SCREENSHOT}}/$b/g;
' "${OUTPUT_DIR}/presentation.html"

GALLERY_HTML=""
for f in "${OUTPUT_DIR}"/section-*.base64; do
  id=$(basename "$f" .base64 | sed 's/section-//')
  b64=$(cat "$f" | tr -d '\r\n')
  GALLERY_HTML="${GALLERY_HTML}<div class=\"gallery-item\"><img src=\"data:image/png;base64,${b64}\"><div class=\"gallery-label\">${id}</div></div>"
done

perl -i -e '
  open(F, "'"${OUTPUT_DIR}/presentation.html"'"); $h = do { local $/; <F> }; close F;
  $g = "'"$GALLERY_HTML"'"; $h =~ s/{{SECTION_GALLERY}}/$g/;
  open(O, ">", "'"${OUTPUT_DIR}/presentation.html"'"); print O $h; close O;
'

node <<'NODE_PDF'
const puppeteer = require('puppeteer-core'); 
const fs = require('fs'); 
const path = require('path'); 
const OUTPUT_DIR = process.env.OUTPUT_DIR; 

(async () => { 
    let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH; 
    if (!executablePath) { 
        const commonPaths = ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium']; 
        for (const p of commonPaths) if (fs.existsSync(p)) { executablePath = p; break; } 
    } 
    const browser = await puppeteer.launch({ headless: true, executablePath }); 
    const page = await browser.newPage(); 
    const offerPath = path.resolve(OUTPUT_DIR, 'offer.html'); 
    
    await page.goto('file://' + offerPath, { waitUntil: 'networkidle0' }); 
    
    // 1. Get both the full width and full height of the rendered content
    const dimensions = await page.evaluate(() => { 
        return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
        };
    }); 
    
    // 2. Pass pixel dimensions for both width and height, omitting the 'format' option
    await page.pdf({ 
        path: path.join(OUTPUT_DIR, 'presentation.pdf'), 
        width: dimensions.width + 'px', 
        height: dimensions.height + 'px', 
        printBackground: true, 
        margin: { top: 0, bottom: 0, left: 0, right: 0 } 
    }); 
    
    await browser.close(); 
})();
NODE_PDF

rm "${OUTPUT_DIR}"/*.base64
echo "✅ Redesign Package Created in ${OUTPUT_DIR}"
```