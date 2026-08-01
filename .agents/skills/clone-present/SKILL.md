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
     * Generate **presentation.pdf** (using Puppeteer’s `page.pdf`) – this PDF should be a clean, print‑ready version of the index page (A4, with margins).
     * Generate **offer.html** containing:
       * The full‑page screenshot displayed inline (Base64).
       * A gallery (Ключевые блоки) with each section screenshot and its id as label (e.g., "hero", "features").
       * A description in Russian explaining **improvements (speed, mobile‑friendliness, conversion)**.
       * **Security improvements** – mention at least two security fixes you applied (e.g., SSL hardening, added security headers, CSP, etc.) – show these as part of the offer.
       * **4‑column grid** for the benefits (speed, mobile, conversion, security) – use an HTML table for email compatibility.
       * A clear call‑to‑action (contact for full proposal).
     * **IMPORTANT:** The offer description must include at least two security improvements before showing the website screenshots.
  5. The gallery ({{SECTION_GALLERY}}) must be non‑empty – ensure the script captures at least one section.
  6. For `offer.html` use only inline CSS styles for using it in email text.
  7. HEADER & FOOTER: The Header must be a glassmorphism sticky navigation bar with backdrop-filter: blur(). The Footer must be minimal and aligned with the visual style.
  8. NO UNNECESSARY PILLS/EYEBROWS: Do not place a small pill badge (like "О компании") directly above a large H2 heading unless the section explicitly requires a sub-category. Use only the section-eyebrow (e.g., "Преимущества") where strictly necessary. The layout must feel minimalist, not cluttered with micro-elements.
  9. Use emojis instead of icons: emails are not ready to hanlde svg code
  10. ICON CONSISTENCY: Do NOT use colored circles or varied background shapes for icons. Icons must be monochromatic, use the same stroke width, and inherit color from the text color (or CSS variables) without wrappers.
  11. BENTO GRID INTEGRITY: If a Bento grid card uses `col-span-2` or `row-span-2`, it MUST contain a real image (<img src="picsum.photos/seed/...">) or a dense list of features to fill the space. A large empty space inside a spanned grid card is considered a visual failure.

**Important**: If I provided bash mode you need to give me the one bash script I insert into terminal (everything is preinstalled) and run it. Don't forget about mkdir and touch if needed.

## offer.html creation script (using globally installed puppeteer-core)

### The correct way to grab base64 strings to variables

```bash
# 1. Read base64 file and collapse to a single line (no newlines)
FULL_SCREENSHOT=$(cat file.base64 | tr -d '\r\n')

# 2. Use '|' as sed delimiter (since base64 contains '/')
sed "s|{{FULL_SCREENSHOT}}|$FULL_SCREENSHOT|g" template.html > index.html
```

**CRITICAL:** To avoid "Argument list too long" error, do **not** expand Base64 strings on the command line. Instead, use a single Perl script that reads the `.base64` files directly via file handles and substitutes both placeholders. See the script below.

### The offer.html script template

Give the following as bash code. The script must generate both `offer.html` and `presentation.pdf`. The offer description must include security improvements (e.g., "Внедрены HTTPS с HSTS, заголовки безопасности X‑Content‑Type‑Options и X‑Frame‑Options").

**Updated script:**

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
  const filePath = path.resolve(OUTPUT_DIR, 'index.html');
  await page.goto('file://' + filePath, { waitUntil: 'networkidle0' });
  
  // Generate presentation.pdf (A4, print background)
  await page.pdf({
    path: path.join(OUTPUT_DIR, 'presentation.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px' }
  });
  console.log('✅ presentation.pdf generated.');
  
  // Full page screenshot for email
  await page.setViewport({ width: 1280, height: 800 });
  const fullScreenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'screenshot.base64'), fullScreenshot);
  console.log('✅ Full page screenshot saved.');

  // Section screenshots
  const sectionIds = ['hero', 'features', 'testimonials', 'cta'];
  for (const id of sectionIds) {
    const element = await page.$(`#${id}`);
    if (element) {
      const screenshot = await element.screenshot({ encoding: 'base64' });
      fs.writeFileSync(path.join(OUTPUT_DIR, `section-${id}.base64`), screenshot);
      console.log(`✅ Section #${id} screenshot saved.`);
    } else {
      console.log(`⚠️  Section #${id} not found.`);
    }
  }
  
  await browser.close();
})();
NODE_SCRIPT

# ===== Generate offer.html =====
cat > "${OUTPUT_DIR}/offer.html" <<'OFFER_EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Демонстрация нового дизайна</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fa;padding:20px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.05);max-width:100%;">
      <tr><td style="padding:40px;">

        <img src="https://rovno.dev/logo.png" alt="Rovno.dev" width="160" style="display:block;margin-bottom:32px;">

        <h1 style="font-size:28px;color:#111111;margin:0 0 8px 0;font-weight:700;">
          Демонстрация нового дизайна для <strong>{{COMPANY_NAME}}</strong>
        </h1>
        <p style="font-size:16px;color:#555555;line-height:1.5;margin:0 0 24px 0;">
          Мы подготовили предварительный макет обновлённого сайта.
        </p>

        <!-- ===== INFO BLOCK WITH SECURITY IMPROVEMENTS ===== -->
        <table width="100%" cellpadding="20" cellspacing="0" border="0" style="background:#f0f4ff;border-radius:12px;border:1px solid #dbe4ff;margin-bottom:32px;">
          <tr><td style="font-size:14px;color:#1a2a5e;line-height:1.5;">
            <strong>Что мы улучшили:</strong><br />
            ✅ Скорость загрузки (LCP &#60; 2.5 с)<br />
            ✅ Мобильная адаптация (все экраны)<br />
            ✅ Дизайн и UX (современный, минималистичный)<br />
            ✅ <strong>Безопасность:</strong> внедрены HTTPS с HSTS, заголовки X‑Content‑Type‑Options, X‑Frame‑Options и Content‑Security‑Policy (CSP)<br />
            ✅ <strong>Дополнительно:</strong> защита от XSS и кликджекинга
          </td></tr>
        </table>

        <!-- ===== FULL PAGE SCREENSHOT ===== -->
        <h2 style="font-size:22px;color:#111;margin:0 0 16px 0;">Полная страница</h2>
        <img src="data:image/png;base64,{{FULL_SCREENSHOT}}" alt="Полная страница" style="width:100%;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:32px;" />

        <!-- ===== GALLERY ===== -->
        <h2 style="font-size:22px;color:#111;margin:0 0 16px 0;">Ключевые блоки</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px;">
          {{SECTION_GALLERY}}
        </div>

        <!-- ===== 4‑COLUMN BENEFITS (table layout for email) ===== -->
        <h2 style="font-size:22px;color:#111;margin:0 0 16px 0;">Результаты, которые вы получите</h2>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="25%" style="padding:0 8px 0 0;vertical-align:top;">
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background:#f8fafc;border-left:4px solid #336DFF;border-radius:8px;">
                <tr><td style="text-align:center;">
                  <div style="font-size:40px;font-weight:800;color:#336DFF;line-height:1;">1.6x</div>
                  <div style="font-weight:600;color:#111;margin:4px 0;">Скорость</div>
                  <div style="font-size:13px;color:#666;">LCP &lt; 2.5 с</div>
                </td></tr>
              </table>
            </td>
            <td width="25%" style="padding:0 8px;vertical-align:top;">
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background:#f8fafc;border-left:4px solid #336DFF;border-radius:8px;">
                <tr><td style="text-align:center;">
                  <div style="font-size:40px;font-weight:800;color:#336DFF;line-height:1;">100%</div>
                  <div style="font-weight:600;color:#111;margin:4px 0;">Мобильная</div>
                  <div style="font-size:13px;color:#666;">все экраны</div>
                </td></tr>
              </table>
            </td>
            <td width="25%" style="padding:0 8px;vertical-align:top;">
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background:#f8fafc;border-left:4px solid #336DFF;border-radius:8px;">
                <tr><td style="text-align:center;">
                  <div style="font-size:40px;font-weight:800;color:#336DFF;line-height:1;">+30%</div>
                  <div style="font-weight:600;color:#111;margin:4px 0;">Конверсия</div>
                  <div style="font-size:13px;color:#666;">рост лидов</div>
                </td></tr>
              </table>
            </td>
            <td width="25%" style="padding:0 0 0 8px;vertical-align:top;">
              <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background:#f8fafc;border-left:4px solid #336DFF;border-radius:8px;">
                <tr><td style="text-align:center;">
                  <div style="font-size:40px;font-weight:800;color:#336DFF;line-height:1;">🔒</div>
                  <div style="font-weight:600;color:#111;margin:4px 0;">Безопасность</div>
                  <div style="font-size:13px;color:#666;">HSTS, CSP, X‑Frame</div>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- ===== CONTACT ===== -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;">
          <tr><td align="center" style="font-size:14px;color:#777777;line-height:1.8;">
            <strong>С уважением, команда Rovno.dev</strong><br />
            <a href="https://rovno.dev/projects" style="color:#336DFF;text-decoration:none;">Наши работы</a> &middot;
            <a href="https://t.me/rovno_dev" style="color:#336DFF;text-decoration:none;">Наш Телеграм</a><br />
            <a href="mailto:info@rovno.dev" style="color:#336DFF;text-decoration:none;">info@rovno.dev</a>
          </td></tr>
        </table>

      </td></tr>
    </table>
  </td></tr>
</table>

</body>
</html>
OFFER_EOF

# ===== Inject screenshots using a single Perl script (no argument expansion) =====
perl -i -e '
  use strict; use warnings;
  my $dir = "'"${OUTPUT_DIR}"'";
  my $template = "$dir/offer.html";

  # Read full screenshot
  open(my $fh, "<", "$dir/screenshot.base64") or die $!;
  my $full_b64 = do { local $/; <$fh> };
  close $fh;
  chomp $full_b64;

  # Read template
  open($fh, "<", $template) or die $!;
  my $html = do { local $/; <$fh> };
  close $fh;

  # Substitute full screenshot
  $html =~ s/\{\{FULL_SCREENSHOT\}\}/$full_b64/g;

  # Build gallery from section-*.base64
  my $gallery = "";
  opendir(my $dh, $dir) or die $!;
  my @files = grep { /^section-.*\.base64$/ } readdir($dh);
  closedir $dh;
  foreach my $file (sort @files) {
      (my $id = $file) =~ s/^section-|\.base64$//g;
      open($fh, "<", "$dir/$file") or die $!;
      my $b64 = do { local $/; <$fh> };
      close $fh;
      chomp $b64;
      $gallery .= qq{
        <div style="background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <img src="data:image/png;base64,$b64" alt="$id" style="width:100%;display:block;" />
          <p style="margin:0;padding:8px 12px;font-size:13px;font-weight:600;color:#111;text-align:center;background:#fff;">$id</p>
        </div>
      };
  }
  $html =~ s/\{\{SECTION_GALLERY\}\}/$gallery/g;

  # Write back
  open($fh, ">", $template) or die $!;
  print $fh $html;
  close $fh;
'

# ===== Cleanup temporary Base64 files =====
rm -f "${OUTPUT_DIR}/screenshot.base64"
rm -f "${OUTPUT_DIR}/section-"*.base64

echo "✅ Done! Files are in ${OUTPUT_DIR}"
echo "   - ${OUTPUT_DIR}/index.html"
echo "   - ${OUTPUT_DIR}/offer.html"
echo "   - ${OUTPUT_DIR}/presentation.pdf"
```

## Requirements for the HTML clone

- The cloned HTML must be self‑contained (no external dependencies except images from picsum.photos or similar).
- All links must work (use `#` for missing pages).
- The design must faithfully replicate the reference’s visual style (colors, typography, layout).
- The page should be fully responsive (the screenshot will be taken at 1280×800 viewport, but the design should look good at all sizes).

## Example output (after running the script)

my-site-demo/
├── index.html          # cloned website
├── offer.html          # email‑ready HTML with embedded screenshots and security improvements
└── presentation.pdf    # print‑ready PDF of the redesigned page

User can then open `offer.html`, copy its content, and paste it directly into an email client (Gmail, Outlook, etc.) – the inline images will render correctly because they are Base64‑encoded.