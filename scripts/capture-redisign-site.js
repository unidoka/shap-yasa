const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
  // Use absolute paths to prevent ENOENT
  const TARGET_DIR = path.resolve(process.argv[2]);
  const MOCKUP_FILE = path.resolve(process.argv[3]);

  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log(`📸 Capturing: ${MOCKUP_FILE}`);
    await page.goto('file://' + MOCKUP_FILE, { waitUntil: 'networkidle0', timeout: 30000 });

    // 1. Capture Full Page
    const full = await page.screenshot({ encoding: 'base64', fullPage: true });
    fs.writeFileSync(path.join(TARGET_DIR, 'full.base64'), full);
    console.log(`✅ Saved full.base64 to ${TARGET_DIR}`);

    // 2. Capture Individual Sections
    const sections = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[id]')).map(el => el.id)
    );

    for (const id of sections) {
      const el = await page.$(`#${id}`);
      if (el) {
        const b64 = await el.screenshot({ encoding: 'base64' });
        fs.writeFileSync(path.join(TARGET_DIR, `section-${id}.base64`), b64);
        console.log(`  - Saved section-${id}.base64`);
      }
    }
  } catch (err) {
    console.error("❌ Capture Error:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}
run();