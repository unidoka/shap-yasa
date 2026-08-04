---
name: clone-present
description: "Clones a reference style or report into a premium redesign and generates a 3-file presentation package (index, offer, pdf)."
argument-hint: "<url or report content>"
user-invocable: true
---

# Clone and Present (Premium Redesign)

You are a senior frontend engineer and conversion specialist. Given a reference (URL, HTML file, or audit report), you must transform it into a modern, high-converting "Premium" version.

### 1. Visual Design System (MANDATORY)
*   **Palette:** Background: Off-white (`#F9FAFB`), Text: Zinc-950 (`#18181B`), Secondary: Zinc-500 (`#71717A`), Accent: One bold color (e.g., `#336DFF`). Ban generic AI gradients and saturated purples.
*   **Typography:** Use `Outfit`, `Geist`, or `Cabinet Grotesk` via Google Fonts. **Never use Inter.**
*   **Header:** Sticky glassmorphism navigation (`backdrop-filter: blur(12px)`).
*   **Layout:** Bento Grids with varied cell sizes. Large cells (`col-span-2`) **must** contain a real image or high-density content.
*   **Images:** Use `https://picsum.photos/seed/[descriptive-seed]/width/height`. Seeds must match the business context (e.g., `seed=hiring` for job sites).
*   **Icons:** Use **Emojis ONLY** (SVG/Icon-fonts fail in email clients). Monochromatic emoji usage preferred.

### 2. File Requirements
1.  **index.html**: A complete, single-file responsive website. Every major section **MUST** have a unique ID (`id="hero"`, `id="features"`, `id="cta"`, etc.).
2.  **offer.html**: An email-ready presentation with inline CSS. It must include:
    *   Embedded Base64 screenshots of `index.html`.
    *   A 2×2 "Короткие возможности" (Short Opportunities) table.
    *   A detailed "Анализ безопасности и фронтенд-исправления" section.
    *   Telegram (📱) and Form (📝) CTA buttons.
3.  **redesign-proposal.pdf**: A PDF version of `offer.html` generated via Puppeteer with additional human-like short description of all important information.

### 3. Implementation Script (Bash)
Output the complete HTML for `index.html` first. Then, provide a single bash script that the user can copy-paste to generate the full package.

```bash
#!/bin/bash

SITE_NAME=${1:-"redesign"}
OUTPUT_DIR="./${SITE_NAME}-demo"

mkdir -p "$OUTPUT_DIR"

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
      .container { width: 100% !important; border-radius: 0 !important; }
      .stack { display: block !important; width: 100% !important; padding-right: 0 !important; padding-left: 0 !important; }
      .button-full { width: 100% !important; display: block !important; margin-left: 0 !important; margin-right: 0 !important; }
      .mobile-padding { padding: 20px !important; }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; background-color: #F4F7F9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F7F9; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 28px; overflow: hidden; border: 1px solid #e2e8f0; border-collapse: collapse;">

          <!-- Header Image -->
          <tr>
            <td style="padding: 30px 30px 0 30px;">
              <img src="https://i.rovno.dev/images/mail/rovno.dev/header-default.png" width="540" style="display: block; width: 100%; max-width: 540px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: 0;" alt="Rovno.dev Branding">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="mobile-padding" style="padding: 40px;">

              <h1 style="font-size: 32px; line-height: 38px; color: #18181B; margin: 0 0 16px 0; font-weight: 800; letter-spacing: -1px;">
                Обновленная концепция<br>
                <span style="color: #0070FF;">вашего продукта</span>
              </h1>
              
              <p style="font-size: 16px; line-height: 24px; color: #52525B; margin: 0 0 35px 0;">
                Мы провели глубокий аудит с помощью автоматизированной системы конфиденциального анализа 
                <a href="https://github.com/unidoka/shap-yasa" style="color: #0070FF; text-decoration: underline;" target="_blank">Shap-yasa</a> 
                вашего текущего решения и подготовили список критических исправлений безопасности и UX/UI сайта.
              </p>

              <!-- Security Section -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 15px; font-size: 13px; font-weight: 800; color: #0070FF; text-transform: uppercase; letter-spacing: 1px;">
                    Исправления Безопасности
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <tr>
                        <!-- XSS Card -->
                        <td class="stack" width="250" valign="top" style="padding-right: 10px; padding-bottom: 15px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 0 16px 16px 0; border-left: 4px solid #0070FF; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="font-size: 15px; font-weight: 700; color: #18181B; margin-bottom: 4px;">Защита XSS</div>
                                <div style="font-size: 12px; line-height: 18px; color: #71717A;">Внедрена строгая CSP политика для блокировки сторонних скриптов.</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- HSTS Card -->
                        <td class="stack" width="250" valign="top" style="padding-left: 10px; padding-bottom: 15px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 0 16px 16px 0; border-left: 4px solid #0070FF; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="font-size: 15px; font-weight: 700; color: #18181B; margin-bottom: 4px;">HSTS & SSL</div>
                                <div style="font-size: 12px; line-height: 18px; color: #71717A;">Принудительное TLS-шифрование и защита от downgrade атак.</div>
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
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 35px; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 15px; font-size: 13px; font-weight: 800; color: #18181B; text-transform: uppercase; letter-spacing: 1px;">
                    Оптимизация Интерфейса
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F4F9; border-radius: 20px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 25px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                            <tr>
                              <td valign="top" style="padding-bottom: 20px; border-bottom: 1px solid #D1D5DB;">
                                <div style="font-size: 16px; font-weight: 700; color: #18181B; margin-bottom: 5px;">⚡ Быстрая загрузка</div>
                                <div style="font-size: 13px; color: #4B5563;">Оптимизация критического пути рендеринга и WebP-форматы.</div>
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" style="padding-top: 20px;">
                                <div style="font-size: 16px; font-weight: 700; color: #18181B; margin-bottom: 5px;">📱 100% адаптивность (CLS)</div>
                                <div style="font-size: 13px; color: #4B5563;">Устранены сдвиги макета. Адаптивность под таргеты 44x44pt.</div>
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
                    <a href="https://t.me/niyaz_gimadiev" class="button-full" target="_blank" style="background-color:#0070FF; border-radius:12px; color:#ffffff; display:inline-block; font-size:15px; font-weight:bold; line-height:50px; text-align:center; text-decoration:none; width:240px; -webkit-text-size-adjust:none; mso-hide:all;">Обсудить проект с CTO</a>

                    <span style="display:inline-block; width:15px; height:15px;"></span>

                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:office" href="https://forms.yandex.com/cloud/6936a4b1d0468820623c548e" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="24%" stroke="f" fillcolor="#18181B">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Заполнить бриф</center>
                    </v:roundrect>
                    <![endif]-->
                    <a href="https://forms.yandex.com/cloud/6936a4b1d0468820623c548e" class="button-full" target="_blank" style="background-color:#18181B; border-radius:12px; color:#ffffff; display:inline-block; font-size:15px; font-weight:bold; line-height:50px; text-align:center; text-decoration:none; width:240px; -webkit-text-size-adjust:none; mso-hide:all;">Заполнить бриф</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #18181B; padding: 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <td style="color: #ffffff; font-size: 14px; font-weight: 700; padding-bottom: 20px;">Следите за нами в соц. сетях</td>
                </tr>
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding-right: 15px;"><a href="https://t.me/rovno_dev" target="_blank"><img src="https://i.rovno.dev/images/mail/rovno.dev/tg-white.png" width="22" height="22" style="display: block; border: 0;"></a></td>
                        <td style="padding-right: 15px;"><a href="https://vk.com/rovno_dev" target="_blank"><img src="https://i.rovno.dev/images/mail/rovno.dev/vk-white.png" width="22" height="22" style="display: block; border: 0;"></a></td>
                        <td style="padding-right: 15px;"><a href="https://pinterest.com/rovno_dev" target="_blank"><img src="https://i.rovno.dev/images/mail/rovno.dev/pinterest-white.png" width="22" height="22" style="display: block; border: 0;"></a></td>
                        <td style="padding-right: 15px;"><a href="https://dprofile.ru/rovno_dev" target="_blank"><img src="https://i.rovno.dev/images/mail/rovno.dev/dprofile-white.png" width="22" height="22" style="display: block; border: 0;"></a></td>
                        <td><a href="https://github.com/rovno-dev" target="_blank"><img src="https://i.rovno.dev/images/mail/rovno.dev/github-white.png" width="22" height="22" style="display: block; border: 0;"></a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; font-size: 11px; line-height: 18px; color: #A1A1AA;">
                    &copy; 2024-2026 Цифровое aгентство <a href="https://rovno.dev" style="color: #A1A1AA; text-decoration: none;" target="_blank"><strong>Rovno.dev</strong></a>. Все права защищены.<br>
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
              Письмо отправлено автоматически конфиденциальной системой анализа Shap-Yasa. Все временные данные удаляются сразу после отправки письма. Файлы хранятся исключительно внутри переписки по электронной почте. 
              <a href="https://github.com/unidoka/shap-yasa" style="color: #0070FF; text-decoration: underline;" target="_blank">Техническая документация</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>

</html>
OFFER_EOF

perl -i -pe '
  BEGIN { open(F, "'"${OUTPUT_DIR}/screenshot.base64"'"); $b = do { local $/; <F> }; chomp $b; close F; }
  s/{{FULL_SCREENSHOT}}/$b/g;
' "${OUTPUT_DIR}/offer.html"

GALLERY_HTML=""
for f in "${OUTPUT_DIR}"/section-*.base64; do
  id=$(basename "$f" .base64 | sed 's/section-//')
  b64=$(cat "$f" | tr -d '\r\n')
  GALLERY_HTML="${GALLERY_HTML}<div style=\"border:1px solid #eee; border-radius:8px; overflow:hidden; margin-bottom:10px;\"><img src=\"data:image/png;base64,${b64}\" width=\"100%\"><div style=\"padding:5px; font-size:12px; text-align:center; background:#fff;\">${id}</div></div>"
done

perl -i -e '
  open(F, "'"${OUTPUT_DIR}/offer.html"'"); $h = do { local $/; <F> }; close F;
  $g = "'"$GALLERY_HTML"'"; $h =~ s/{{SECTION_GALLERY}}/$g/;
  open(O, ">", "'"${OUTPUT_DIR}/offer.html"'"); print O $h; close O;
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

  const bodyHeight = await page.evaluate(() => {
    return document.documentElement.scrollHeight;
  });

  await page.pdf({
    path: path.join(OUTPUT_DIR, 'redesign-proposal.pdf'),
    width: '210mm',
    height: bodyHeight + 'px',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 } 
  });
  await browser.close();
})();
NODE_PDF

rm "${OUTPUT_DIR}"/*.base64
echo "✅ Redesign Package Created in ${OUTPUT_DIR}"
```