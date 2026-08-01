---
name: clone-present
description: "Makes copy of website (provide url or report)"
argument-hint: "<url or report>"
user-invocable: true
---

# Clone and present

We need to fix the clone website prompt to **$ARGUMENTS** (use information from url provided, if report provided use info from it in offer and presentation):
  1. Suck colors – enforce a premium, modern palette (off-white, zinc, one accent) and ban generic AI colors.
  2. Missing placeholder images – use picsum.photos/seed/… with descriptive seeds for hero, cards, etc. Use site theme images, not random (e.g., delivery company Mariya means using delivers images, not woman)
  3. Empty "Ключевые блоки" section in offer.html – ensure each section in index.html has a unique id so the screenshot script can capture them, and the gallery is populated.
  4. Don't install packages.
  5. **NEW** Add a "Короткие возможности" (short opportunities) 2×2 table in offer.html highlighting key security and UX/UI fixes.
  6. **NEW** Include Telegram and form call‑to‑action buttons with emojis in offer.html.
  7. **NEW** Generate a descriptive PDF (from offer.html) that includes all screenshots and a detailed analysis of security vulnerabilities and frontend improvements.

You are a frontend engineer. Given a reference website URL (the user will provide it), you must:
  1. Create a single HTML file that clones the visual style of the reference site – use its colors, typography, layout, and keep all anchor links (<a href="...">) working (use # for missing pages).
  CRITICAL design upgrades:
     * Palette: Use off-white (#F9FAFB), zinc‑950 (#18181B) for text, zinc‑500 (#71717A) for secondary, one accent (e.g., #336DFF). No pure black, no over‑saturated colors, no purple/blue AI gradients.
     * Typography: Use Geist, Outfit, Cabinet Grotesk, or Satoshi – never Inter.
     * Images: Use picsum.photos with descriptive seeds for hero, feature cards, testimonials, etc.
     * Layout: Asymmetric or split hero, not centered text-only. Bento grids with varied cell sizes.
  2. Every major section (hero, features, testimonials, CTA, etc.) must have a unique id (e.g., id="hero", id="features", id="testimonials"). This is mandatory for the screenshot script.
  3. Output the complete HTML code in your response.
  4. Provide a single bash script that the user can run in an empty folder. The script must:
     * Create a directory named [site‑name]-demo (replace with a sensible name).
     * Save the HTML as index.html inside that directory.
     * Use Puppeteer (globally installed) to take a full‑page screenshot of index.html and individual screenshots of every section (section‑<id>.base64).
     * Generate offer.html containing:
       * The full‑page screenshot displayed inline (Base64).
       * A gallery (Ключевые блоки) with each section screenshot and its id as label (e.g., "hero", "features").
       * A **2×2 table** (Короткие возможности) with four improvement areas (e.g., Security: SSL, CSP; Performance: LCP, CLS; Mobile: Responsiveness; UX: Modern design). Each cell must include an emoji and a concise description.
       * A clear call‑to‑action with **Telegram button** (📱) and **form button** (📝) – both using # links.
       * A detailed section **Анализ безопасности и фронтенд-исправления** that lists specific vulnerabilities and frontend fixes (extracted from the audit report, if provided, otherwise generic but plausible).
       * A description in Russian explaining improvements (speed, mobile‑friendliness, conversion).
     * Generate a **PDF** from offer.html (not from index.html) using Puppeteer. The PDF must include all screenshots and the analysis text, making it a complete proposal.
  5. The gallery ({{SECTION_GALLERY}}) must be non‑empty – ensure the script captures at least one section.
  6. For `offer.html` use only inline css styles for using it in email text.
  7. HEADER & FOOTER: The Header must be a glassmorphism sticky navigation bar with backdrop-filter: blur(). The Footer must be minimal and aligned with the visual style.
  8. NO UNNECESSARY PILLS/EYEBROWS: Do not place a small pill badge (like "О компании") directly above a large H2 heading unless the section explicitly requires a sub-category. Use only the section-eyebrow (e.g., "Преимущества") where strictly necessary. The layout must feel minimalist, not cluttered with micro-elements.
  9. Use emojis instead of icons: emails are not ready to hanlde svg code.
  10. ICON CONSISTENCY: Do NOT use colored circles or varied background shapes for icons. Icons must be monochromatic, use the same stroke width, and inherit color from the text color (or CSS variables) without wrappers.
  11. BENTO GRID INTEGRITY: If a Bento grid card uses `col-span-2` or `row-span-2`, it MUST contain a real image (<img src="picsum.photos/seed/...">) or a dense list of features to fill the space. A large empty space inside a spanned grid card is considered a visual failure.

**Important**: If I provided bash mode you need to give me the one bash script I insert into terminal (everything is preinstalled) and run it. Don't forget about mkdir and touch if needed.

## offer.html creation script (using globally installed puppeteer-core)

### The correct way to grab base64 strings to variables

**CRITICAL**: To avoid `Argument list too long` errors when using `sed` or `perl`, **never** expand the base64 variable directly on the command line. Instead, use file‑based replacement or Perl’s `BEGIN` block to read the file content.

**Safe method** (Perl with BEGIN block):
```bash
perl -i -pe '
  BEGIN {
    open(F, "'"${OUTPUT_DIR}/screenshot.base64"'") or die $!;
    $b64 = do { local $/; <F> };
    chomp $b64;
    close F;
  }
  s/{{FULL_SCREENSHOT}}/$b64/g;
' "${OUTPUT_DIR}/offer.html"
```
This reads the file inside Perl, avoiding shell argument expansion.

### The offer.html script template

Give the following as bash code. Don't forget to update the description about sections in Section Gallery and Benefits with Big Numbers sections to make offer fully and having actual pain fixed Big Numbers. Also, generate PDF from offer.html.

```bash
#!/bin/bash

SITE_NAME=${1:-"site-demo"}
OUTPUT_DIR="./${SITE_NAME}-demo"

mkdir -p "$OUTPUT_DIR"
cp index.html "$OUTPUT_DIR/"

export OUTPUT_DIR

node <<'NODE_SCRIPT'
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = process.env.OUTPUT_DIR;

(async () => {
  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (!executablePath) {
    const commonPaths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        executablePath = p;
        break;
      }
    }
    if (!executablePath) {
      const { execSync } = require('child_process');
      try {
        executablePath = execSync('which google-chrome || which chromium-browser || which chromium', { encoding: 'utf8' }).trim();
      } catch (e) {}
    }
  }
  if (!executablePath) {
    console.error('ERROR: Cannot find Chrome. Set PUPPETEER_EXECUTABLE_PATH.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  
  // 1. Load index.html to take screenshots
  const indexFilePath = path.resolve(OUTPUT_DIR, 'index.html');
  await page.goto('file://' + indexFilePath, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 1280, height: 800 });

  // Full‑page screenshot
  const fullScreenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'screenshot.base64'), fullScreenshot);

  // Section screenshots (ids from the cloned page)
  const sectionIds = ['hero', 'features', 'testimonials', 'cta']; // add more if needed
  for (const id of sectionIds) {
    const element = await page.$(`#${id}`);
    if (element) {
      const box = await element.boundingBox();
      if (box) {
        const clip = {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height
        };
        const base64 = await page.screenshot({ encoding: 'base64', clip });
        fs.writeFileSync(path.join(OUTPUT_DIR, `section-${id}.base64`), base64);
        console.log(`Captured section: ${id}`);
      }
    } else {
      console.warn(`Section #${id} not found.`);
    }
  }

  // 2. Generate PDF from offer.html (after it is created)
  // We will call this later, after offer.html is generated.
  // We close the browser for now, but we'll re-open later for PDF.
  await browser.close();
})();
NODE_SCRIPT

# ------------------------------------------------------------------
# Create offer.html with inline styles and all sections
# ------------------------------------------------------------------
cat > "${OUTPUT_DIR}/offer.html" <<'OFFER_EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Демонстрация нового дизайна — Ваша Компания</title>
</head>
<body style="margin: 0; padding: 0; background: #f4f6fa; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">

<!-- Main Container -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f6fa; padding: 20px 0;">
  <tr>
    <td align="center">
      <!-- Email Card -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); max-width: 100%;">
        <tr>
          <td style="padding: 40px;">

            <img src="https://rovno.dev/logo.png" alt="Rovno.dev" width="160" style="display: block; margin-bottom: 32px;">

            <!-- Header -->
            <h1 style="font-size: 28px; color: #111111; margin: 0 0 8px 0; font-weight: 700;">
              Демонстрация нового дизайна для <strong>Вашей Компании</strong>
            </h1>
            <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 24px 0;">
              Мы подготовили предварительный макет обновлённого сайта.
            </p>

            <!-- Info Block -->
            <table width="100%" cellpadding="20" cellspacing="0" border="0" style="background: #f0f4ff; border-radius: 12px; border: 1px solid #dbe4ff; margin-bottom: 32px;">
              <tr>
                <td style="font-size: 14px; color: #1a2a5e; line-height: 1.5;">
                  <strong>Это демонстрация улучшенного дизайна вашего сайта.</strong> 
                  Она позволяет создавать адаптивные, эстетичные и конверсионные страницы. 
                  Мы подготовили полную презентацию с визуализацией всех ключевых блоков.
                </td>
              </tr>
            </table>

            <!-- Full‑page screenshot -->
            <h2 style="font-size: 22px; color: #111; margin: 0 0 16px 0;">Общий вид страницы</h2>
            <img src="data:image/png;base64,{{FULL_SCREENSHOT}}" alt="Полный скриншот" style="width:100%; max-width:100%; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:32px;">

            <!-- Gallery: Key sections -->
            <h2 style="font-size: 22px; color: #111; margin: 0 0 16px 0;">Ключевые блоки</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
              {{SECTION_GALLERY}}
            </div>

            <!-- NEW: 2x2 Table of Short Opportunities (Security & UX/UI) -->
            <h2 style="font-size: 22px; color: #111; margin: 0 0 16px 0;">Короткие возможности</h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; width: 50%; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border-left: 4px solid #336DFF;">
                    <tr><td>
                      <div style="font-size: 24px; font-weight: 700; color: #336DFF;">🔒 Безопасность</div>
                      <div style="font-size: 14px; color: #333; margin-top: 4px;">SSL, HSTS, CSP, защита от XSS</div>
                    </td></tr>
                  </table>
                </td>
                <td style="padding: 8px; width: 50%; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border-left: 4px solid #336DFF;">
                    <tr><td>
                      <div style="font-size: 24px; font-weight: 700; color: #336DFF;">⚡ Производительность</div>
                      <div style="font-size: 14px; color: #333; margin-top: 4px;">LCP < 2.5с, CLS < 0.1, кеширование</div>
                    </td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; width: 50%; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border-left: 4px solid #336DFF;">
                    <tr><td>
                      <div style="font-size: 24px; font-weight: 700; color: #336DFF;">📱 Мобильность</div>
                      <div style="font-size: 14px; color: #333; margin-top: 4px;">Адаптив, таргеты 44pt, отзывчивость</div>
                    </td></tr>
                  </table>
                </td>
                <td style="padding: 8px; width: 50%; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-radius: 8px; border-left: 4px solid #336DFF;">
                    <tr><td>
                      <div style="font-size: 24px; font-weight: 700; color: #336DFF;">🎨 UX/UI</div>
                      <div style="font-size: 14px; color: #333; margin-top: 4px;">Современный дизайн, контрастность, иконки</div>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Detailed Security & Frontend Fixes -->
            <h2 style="font-size: 22px; color: #111; margin: 0 0 16px 0;">Анализ безопасности и фронтенд-исправления</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
              <h3 style="font-size: 18px; color: #111; margin: 0 0 12px 0;">🛡️ Уязвимости (выявленные)</h3>
              <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.6;">
                <li>Отсутствие HSTS – риск перехвата трафика</li>
                <li>Нет Content-Security-Policy – уязвимость к XSS</li>
                <li>Неактуальный TLS (поддержка старых шифров)</li>
                <li>Отсутствие заголовка X-Frame-Options – кликджекинг</li>
                <li>Незащищённые куки (нет Secure, HttpOnly)</li>
              </ul>
              <h3 style="font-size: 18px; color: #111; margin: 0 0 12px 0;">🔧 Фронтенд-исправления</h3>
              <ul style="margin: 0 0 0 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.6;">
                <li>Добавлены заголовки безопасности (HSTS, CSP, X-Frame-Options)</li>
                <li>Оптимизированы изображения (lazy loading, WebP)</li>
                <li>Устранены сдвиги макета (CLS) за счёт задания размеров</li>
                <li>Сокращено количество запросов (объединение CSS/JS)</li>
                <li>Внедрена адаптивная вёрстка с правильными медиа-точками</li>
                <li>Использована современная система дизайна (css-переменные, единые отступы)</li>
                <li>Добавлены микроразметка и Open Graph для соцсетей</li>
              </ul>
            </div>

            <!-- Call to Action with Telegram and Form buttons -->
            <h2 style="font-size: 22px; color: #111; margin: 0 0 16px 0;">Свяжитесь с нами</h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
              <tr>
                <td align="center" style="padding: 8px;">
                  <a href="#" style="display: inline-block; background: #336DFF; color: white; padding: 14px 28px; border-radius: 40px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 0 8px;">📱 Telegram</a>
                  <a href="#" style="display: inline-block; background: #18181B; color: white; padding: 14px 28px; border-radius: 40px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 0 8px;">📝 Заявка</a>
                </td>
              </tr>
            </table>

            <!-- Benefits with Big Numbers (as before) -->
            <h2 style="font-size: 22px; color: #111; margin: 0 0 16px 0;">Какие результаты могут получиться?</h2>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="32%" style="padding: 0 8px 0 0; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-left: 4px solid #336DFF; border-radius: 8px;">
                    <tr><td><div style="font-size: 40px; font-weight: 800; color: #336DFF; line-height: 1;">1.4x</div>
                    <div style="font-weight: 600; color: #111; margin: 4px 0;">Скорость загрузки</div>
                    <div style="font-size: 14px; color: #666;">LCP &lt; 2.5 с, оптимизация кода.</div></td></tr>
                  </table>
                </td>
                <td width="32%" style="padding: 0 8px; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-left: 4px solid #336DFF; border-radius: 8px;">
                    <tr><td><div style="font-size: 40px; font-weight: 800; color: #336DFF; line-height: 1;">100%</div>
                    <div style="font-weight: 600; color: #111; margin: 4px 0;">Мобильная адаптация</div>
                    <div style="font-size: 14px; color: #666;">Безупречно на всех экранах.</div></td></tr>
                  </table>
                </td>
                <td width="32%" style="padding: 0 0 0 8px; vertical-align: top;">
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background: #f8fafc; border-left: 4px solid #336DFF; border-radius: 8px;">
                    <tr><td><div style="font-size: 40px; font-weight: 800; color: #336DFF; line-height: 1;">+25%</div>
                    <div style="font-weight: 600; color: #111; margin: 4px 0;">Рост конверсии</div>
                    <div style="font-size: 14px; color: #666;">Чёткие CTA и усиленное доверие.</div></td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Contacts & Works -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <tr>
                <td align="center" style="font-size: 14px; color: #777777; line-height: 1.8;">
                  <strong>С уважением, команда Rovno.dev</strong><br>
                  <a href="https://rovno.dev/projects" style="color: #336DFF; text-decoration: none;">Наши работы</a> &middot; 
                  <a href="https://t.me/rovno_dev" style="color: #336DFF; text-decoration: none;">Наш Телеграм</a><br>
                  <a href="mailto:info@rovno.dev" style="color: #336DFF; text-decoration: none;">info@rovno.dev</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>
OFFER_EOF

# ------------------------------------------------------------------
# Insert full screenshot (Perl reads from file – safe)
# ------------------------------------------------------------------
perl -i -pe '
  BEGIN {
    open(F, "'"${OUTPUT_DIR}/screenshot.base64"'") or die $!;
    $b64 = do { local $/; <F> };
    chomp $b64;
    close F;
  }
  s/{{FULL_SCREENSHOT}}/$b64/g;
' "${OUTPUT_DIR}/offer.html"

# ------------------------------------------------------------------
# Build gallery HTML and replace using Perl with a temp file
# ------------------------------------------------------------------
GALLERY_TMP=$(mktemp)
> "$GALLERY_TMP"
for b64_file in "${OUTPUT_DIR}"/section-*.base64; do
  if [ -f "$b64_file" ]; then
    id=$(basename "$b64_file" .base64 | sed 's/section-//')
    b64_data=$(cat "$b64_file" | tr -d '\r\n')
    echo "<div style=\"background:#f8fafc; border-radius:8px; overflow:hidden; border:1px solid #e2e8f0;\">
            <img src=\"data:image/png;base64,${b64_data}\" alt=\"${id}\" style=\"width:100%; display:block;\">
            <div style=\"padding:6px 12px; font-weight:600; font-size:14px; color:#18181B; background:white;\">${id}</div>
          </div>" >> "$GALLERY_TMP"
  fi
done

perl -i -e '
  open(F, "'"${OUTPUT_DIR}/offer.html"'") or die $!;
  $html = do { local $/; <F> };
  close F;
  open(G, "'"$GALLERY_TMP"'") or die $!;
  $gallery = do { local $/; <G> };
  chomp $gallery;
  close G;
  $html =~ s/{{SECTION_GALLERY}}/$gallery/g;
  open(OUT, ">", "'"${OUTPUT_DIR}/offer.html"'") or die $!;
  print OUT $html;
  close OUT;
'
rm -f "$GALLERY_TMP"

# ------------------------------------------------------------------
# Clean up temporary base64 files (no longer needed)
# ------------------------------------------------------------------
rm -f "${OUTPUT_DIR}/screenshot.base64"
rm -f "${OUTPUT_DIR}/section-"*.base64

# ------------------------------------------------------------------
# Generate PDF from offer.html (using Puppeteer again)
# ------------------------------------------------------------------
node <<'NODE_PDF'
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = process.env.OUTPUT_DIR;

(async () => {
  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (!executablePath) {
    const commonPaths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const p of commonPaths) {
      if (fs.existsSync(p)) { executablePath = p; break; }
    }
    if (!executablePath) {
      const { execSync } = require('child_process');
      try {
        executablePath = execSync('which google-chrome || which chromium-browser || which chromium', { encoding: 'utf8' }).trim();
      } catch (e) {}
    }
  }
  if (!executablePath) {
    console.error('ERROR: Cannot find Chrome. Set PUPPETEER_EXECUTABLE_PATH.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  const offerPath = path.resolve(OUTPUT_DIR, 'offer.html');
  await page.goto('file://' + offerPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.join(OUTPUT_DIR, 'redesign-proposal.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });
  console.log('✅ PDF generated: redesign-proposal.pdf');
  await browser.close();
})();
NODE_PDF

echo "✅ Done! Files are in ${OUTPUT_DIR}"
echo "   - ${OUTPUT_DIR}/index.html"
echo "   - ${OUTPUT_DIR}/offer.html"
echo "   - ${OUTPUT_DIR}/redesign-proposal.pdf"
```

## Requirements for the HTML clone

- The cloned HTML must be self‑contained (no external dependencies except images from picsum.photos or similar).
- All links must work (use `#` for missing pages).
- The design must faithfully replicate the reference’s visual style (colors, typography, layout).
- The page should be fully responsive (the screenshot will be taken at 1280×800 viewport, but the design should look good at all sizes).

## Example output (after running the script)

my-site-demo/
├── index.html              # cloned website
├── offer.html              # email‑ready HTML with embedded screenshots
└── redesign-proposal.pdf   # proposal PDF with security analysis

User can then open `offer.html`, copy its content, and paste it directly into an email client (Gmail, Outlook, etc.) – the inline images will render correctly because they are Base64‑encoded. The PDF can be used as a standalone proposal or attached.

**Note about the Perl replacement**: The script uses Perl’s `BEGIN` block to read the base64 file, which avoids the `Argument list too long` error that can occur when the base64 string is large and passed directly on the command line. This is now the recommended method and is already implemented in the script above.