const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
  const TARGET_DIR = path.resolve(process.argv[2]);
  const HTML_FILE = path.join(TARGET_DIR, 'presentation.html');
  const PDF_OUTPUT = path.join(TARGET_DIR, 'presentation.pdf');

  if (!fs.existsSync(HTML_FILE)) {
    console.error(`❌ HTML file not found: ${HTML_FILE}`);
    process.exit(1);
  }

  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors']
  });

  try {
    const page = await browser.newPage();

    await page.goto('file://' + HTML_FILE, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.pdf({
      path: PDF_OUTPUT,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    console.log(`✅ PDF Presentation generated: ${PDF_OUTPUT}`);
  } catch (err) {
    console.error("❌ PDF Generation Error:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();