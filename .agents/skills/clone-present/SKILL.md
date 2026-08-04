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

  * **Important**: When generating offer.html, you are **forbidden** from omitting any images or links from the reference template. Use the exact `https://i.rovno.dev/...` image paths and the specific Telegram/Yandex Form URLs provided in template code!
  * CSS need to be inline, HTML 3.2/4.0.
  * You need to add opportunities based on site problems that we fixed (UX/UI) or can fix (security).

### 2.3. `presentation.pdf`: A PDF version of `offer.html`

 * Generated via Puppeteer.
 * PDF making from `presentation.html` file (code in bash script).
 * Contains additional human-like description of all important information from `offer.html`.

## 3. Implementation Script (Bash)

### 3.1 If user promted bash mode

  * Provide a single bash script with all filex and all operations in one script.
  * If multiple sites providen they need in separate directories.
  * Script need to have index.html code too and no separate files. 
  * Script does everything.
  * Use relative paths for Node scripts.
  * Use timestamps for directory name (e.g. site-demo-aug-4-2026).

```bash
#!/bin/bash

SITE_NAME=${1:-"demo"}
OUTPUT_DIR="./${SITE_NAME}-demo"

mkdir -p "$OUTPUT_DIR"

export OUTPUT_DIR

cat > "${OUTPUT_DIR}/index.html" <<'INDEX_EOF'
  # index.html code here
INDEX_EOF

node <<'NODE_CAPTURE'
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
NODE_CAPTURE

# offer.html template
cat > "${OUTPUT_DIR}/offer.html" <<'OFFER_EOF'
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }

      .stack {
        display: block !important;
        width: 100% !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
      }

      .button-full {
        width: 100% !important;
        display: block !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      .mobile-padding {
        padding: 20px !important;
      }
    }
  </style>
</head>

<body
  style="margin: 0; padding: 0; background-color: #F4F7F9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0"
    style="background-color: #F4F7F9; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0"
          style="background-color: #ffffff; border-radius: 28px; overflow: hidden; border: 1px solid #e2e8f0; border-collapse: collapse;">

          <!-- Header Image -->
          <tr>
            <td style="padding: 30px 30px 0 30px;">
              <img src="https://i.rovno.dev/images/mail/rovno.dev/header-default.png" width="540"
                style="display: block; width: 100%; max-width: 540px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: 0;"
                alt="Rovno.dev Branding">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              <h1
                style="font-size: 32px; line-height: 38px; color: #18181B; margin: 0 0 16px 0; font-weight: 800; letter-spacing: -1px;">
                Обновленная концепция<br>
                <span style="color: #0070FF;">вашего продукта</span>
              </h1>

              <p style="font-size: 16px; line-height: 24px; color: #52525B; margin: 0 0 35px 0;">
                Мы провели глубокий аудит с помощью автоматизированной системы конфиденциального анализа
                <a href="https://github.com/unidoka/shap-yasa" style="color: #0070FF; text-decoration: underline;"
                  target="_blank">Shap-yasa</a>
                вашего текущего решения и подготовили список критических исправлений безопасности и UX/UI сайта.
              </p>

              <!-- Security Section -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0"
                style="margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td
                    style="padding-bottom: 15px; font-size: 13px; font-weight: 800; color: #0070FF; text-transform: uppercase; letter-spacing: 1px;">
                    Исправления Безопасности
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <tr>
                        <!-- XSS Card -->
                        <td class="stack" width="250" valign="top" style="padding-right: 10px; padding-bottom: 15px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0"
                            style="background-color: #F8FAFC; border-radius: 0 16px 16px 0; border-left: 4px solid #0070FF; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="font-size: 15px; font-weight: 700; color: #18181B; margin-bottom: 4px;">
                                  Защита XSS</div>
                                <div style="font-size: 12px; line-height: 18px; color: #71717A;">Внедрена строгая CSP
                                  политика для блокировки сторонних скриптов.</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- HSTS Card -->
                        <td class="stack" width="250" valign="top" style="padding-left: 10px; padding-bottom: 15px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0"
                            style="background-color: #F8FAFC; border-radius: 0 16px 16px 0; border-left: 4px solid #0070FF; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="font-size: 15px; font-weight: 700; color: #18181B; margin-bottom: 4px;">HSTS
                                  & SSL</div>
                                <div style="font-size: 12px; line-height: 18px; color: #71717A;">Принудительное
                                  TLS-шифрование и защита от downgrade атак.</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- UI Section -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0"
                style="margin-bottom: 35px; border-collapse: collapse;">
                <tr>
                  <td
                    style="padding-bottom: 15px; font-size: 13px; font-weight: 800; color: #18181B; text-transform: uppercase; letter-spacing: 1px;">
                    Оптимизация Интерфейса
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0"
                      style="background-color: #F1F4F9; border-radius: 20px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 25px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0"
                            style="border-collapse: collapse;">
                            <tr>
                              <td valign="top" style="padding-bottom: 20px; border-bottom: 1px solid #D1D5DB;">
                                <div style="font-size: 16px; font-weight: 700; color: #18181B; margin-bottom: 5px;">⚡
                                  Быстрая загрузка</div>
                                <div style="font-size: 13px; color: #4B5563;">Оптимизация критического пути рендеринга и
                                  WebP-форматы.</div>
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" style="padding-top: 20px;">
                                <div style="font-size: 16px; font-weight: 700; color: #18181B; margin-bottom: 5px;">📱
                                  100% адаптивность (CLS)</div>
                                <div style="font-size: 13px; color: #4B5563;">Устранены сдвиги макета. Адаптивность под
                                  таргеты 44x44pt.</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:office" href="https://t.me/niyaz_gimadiev" target="_blank" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="24%" stroke="f" fillcolor="#0070FF">
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Написать CTO</center>
                        </v:roundrect>
                        <![endif]-->
                    <a href="https://t.me/niyaz_gimadiev" class="button-full" target="_blank"
                      style="background-color:#0070FF; border-radius:12px; color:#ffffff; display:inline-block; font-size:15px; font-weight:bold; line-height:50px; text-align:center; text-decoration:none; width:240px; -webkit-text-size-adjust:none; mso-hide:all;">Обсудить
                      проект с CTO</a>

                    <span style="display:inline-block; width:15px; height:15px;"></span>

                    <!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:office" href="https://forms.yandex.com/cloud/6936a4b1d0468820623c548e" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="24%" stroke="f" fillcolor="#18181B">
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Заполнить бриф</center>
                        </v:roundrect>
                        <![endif]-->
                    <a href="https://forms.yandex.com/cloud/6936a4b1d0468820623c548e" class="button-full"
                      target="_blank"
                      style="background-color:#18181B; border-radius:12px; color:#ffffff; display:inline-block; font-size:15px; font-weight:bold; line-height:50px; text-align:center; text-decoration:none; width:240px; -webkit-text-size-adjust:none; mso-hide:all;">Заполнить
                      бриф</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer (Don't cut social media buttons) -->
          <tr>
            <td style="background-color: #18181B; padding: 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <td style="color: #ffffff; font-size: 14px; font-weight: 700; padding-bottom: 20px;">Следите за нами в
                    соц. сетях</td>
                </tr>
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding-right: 15px;"><a href="https://t.me/rovno_dev" target="_blank"><img
                              src="https://i.rovno.dev/images/mail/rovno.dev/tg-white.png" width="22" height="22"
                              style="display: block; border: 0;"></a></td>
                        <td style="padding-right: 15px;"><a href="https://vk.com/rovno_dev" target="_blank"><img
                              src="https://i.rovno.dev/images/mail/rovno.dev/vk-white.png" width="22" height="22"
                              style="display: block; border: 0;"></a></td>
                        <td style="padding-right: 15px;"><a href="https://pinterest.com/rovno_dev" target="_blank"><img
                              src="https://i.rovno.dev/images/mail/rovno.dev/pinterest-white.png" width="22" height="22"
                              style="display: block; border: 0;"></a></td>
                        <td style="padding-right: 15px;"><a href="https://dprofile.ru/rovno_dev" target="_blank"><img
                              src="https://i.rovno.dev/images/mail/rovno.dev/dprofile-white.png" width="22" height="22"
                              style="display: block; border: 0;"></a></td>
                        <td><a href="https://github.com/rovno-dev" target="_blank"><img
                              src="https://i.rovno.dev/images/mail/rovno.dev/github-white.png" width="22" height="22"
                              style="display: block; border: 0;"></a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; font-size: 11px; line-height: 18px; color: #A1A1AA;">
                    &copy; 2024-2026 Цифровое aгентство <a href="https://rovno.dev"
                      style="color: #A1A1AA; text-decoration: none;" target="_blank"><strong>Rovno.dev</strong></a>. Все
                    права защищены.<br>
                    Разработка сложных систем и дизайна для тех, кто ценит качество.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Disclaimer -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 25px; font-size: 10px; line-height: 15px; color: #94A3B8; text-align: center;">
              Письмо отправлено автоматически конфиденциальной системой анализа Shap-Yasa. Все временные данные
              удаляются сразу после отправки письма. Файлы хранятся исключительно внутри переписки по электронной почте.
              <a href="https://github.com/unidoka/shap-yasa" style="color: #0070FF; text-decoration: underline;"
                target="_blank">Техническая документация</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>

</html>
OFFER_EOF

# presentation.html code template. Takes info from offer.html but with images and modern css
cat > "${OUTPUT_DIR}/offer.html" <<'PRES_EOF'
<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <title>Премиальное предложение — {{TITLE}}</title>
  <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet">
  <style>
    :root {
      --primary: #0070FF;
      --dark: #18181B;
      --gray: #71717A;
      --bg: #F4F7F9;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Geist', sans-serif;
      background-color: var(--bg);
      color: var(--dark);
      line-height: 1.5;
    }

    .page {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
    }

    /* Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 80px;
    }

    .logo-text {
      font-weight: 800;
      font-size: 24px;
      letter-spacing: -1px;
    }

    .badge {
      background: var(--bg);
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--primary);
    }

    /* Hero Section */
    .hero {
      margin-bottom: 100px;
    }

    h1 {
      font-size: 56px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -3px;
      margin: 0 0 24px 0;
    }

    .accent {
      color: var(--primary);
    }

    .description {
      font-size: 20px;
      color: var(--gray);
      max-width: 600px;
      margin-bottom: 40px;
    }

    /* Main Preview Image */
    .main-screenshot {
      width: 100%;
      border-radius: 24px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
      margin-bottom: 80px;
      border: 1px solid #e2e8f0;
    }

    /* Bento Gallery */
    .gallery-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 30px;
      color: var(--gray);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .gallery-title::after {
      content: "";
      flex-grow: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .section-gallery {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .gallery-item {
      background: var(--bg);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .gallery-item img {
      width: 100%;
      display: block;
    }

    .gallery-label {
      padding: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--gray);
      text-align: center;
    }

    /* Audit Cards */
    .audit-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 60px;
    }

    .audit-card {
      padding: 24px;
      background: #F8FAFC;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
    }

    .audit-card h3 {
      font-size: 16px;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Footer */
    footer {
      margin-top: 100px;
      padding-top: 40px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-info {
      font-size: 12px;
      color: var(--gray);
    }

    @media print {
      .page {
        box-shadow: none;
        padding: 0;
      }

      body {
        background: white;
      }
    }
  </style>
</head>

<body>

  <div class="page">
    <header>
      <div class="logo-text">Rovno<span class="accent">.</span>dev</div>
      <div class="badge">Technical Audit 2026</div>
    </header>

    <section class="hero">
      <h1>Обновленная концепция <span class="accent">вашего продукта</span></h1>
      <p class="description">Мы подготовили видение обновленного интерфейса, устраняющее критические баги UX и
        уязвимости безопасности.</p>
    </section>

    <!-- Основной скриншот (инъекция из bash) -->
    <img src="data:image/png;base64,{{FULL_SCREENSHOT}}" class="main-screenshot" alt="Full Preview">

    <div class="gallery-title">Ключевые блоки интерфейса</div>

    <!-- Галерея секций (инъекция из bash) -->
    <div class="section-gallery">
      {{SECTION_GALLERY}}
    </div>

    <div class="audit-grid">
      <div class="audit-card">
        <h3>🛡 Безопасность</h3>
        <p style="font-size: 13px; color: var(--gray); margin: 0;">Внедрена защита от XSS и строгая политика CSP v3.</p>
      </div>
      <div class="audit-card">
        <h3>⚡ Производительность</h3>
        <p style="font-size: 13px; color: var(--gray); margin: 0;">LCP < 1.2s. Оптимизация шрифтов и WebP
            изображений.</p>
      </div>
      <div class="audit-card">
        <h3>📱 Адаптивность</h3>
        <p style="font-size: 13px; color: var(--gray); margin: 0;">100% Mobile Friendly. Пройден тест Google Lighthouse.
        </p>
      </div>
    </div>

    <footer>
      <div class="footer-info">
        <strong>Цифровое агентство Rovno.dev</strong><br>
        Разработка сложных систем и дизайна.
      </div>
      <div style="font-weight: 700; font-size: 14px;">
        t.me/niyaz_gimadiev
      </div>
    </footer>
  </div>

</body>

</html>
PRES_EOF

node <<'NODE_INJECT'
const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = process.env.OUTPUT_DIR;

const presPath = path.join(OUTPUT_DIR, 'presentation.html');
let html = fs.readFileSync(presPath, 'utf8');

// Inject Full Screenshot
const fullB64Path = path.join(OUTPUT_DIR, 'full.base64');
if (fs.existsSync(fullB64Path)) {
    const fullB64 = fs.readFileSync(fullB64Path, 'utf8').trim();
    html = html.replace('{{FULL_SCREENSHOT}}', fullB64);
}

// Inject Section Gallery
let galleryHtml = '';
const files = fs.readdirSync(OUTPUT_DIR);
files.filter(f => f.startsWith('section-') && f.endsWith('.base64')).forEach(f => {
    const b64 = fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf8').trim();
    const label = f.replace('section-', '').replace('.base64', '');
    galleryHtml += `<div class="gallery-item"><img src="data:image/png;base64,${b64}"><div class="gallery-label">${label}</div></div>`;
});

html = html.replace('{{SECTION_GALLERY}}', galleryHtml);
fs.writeFileSync(presPath, html);
NODE_INJECT

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