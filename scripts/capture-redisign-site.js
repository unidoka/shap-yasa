const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
  const TARGET_DIR = process.argv[2];
  const MOCKUP_FILE = process.argv[3];

  let executablePath = '/usr/bin/google-chrome';
  if (process.platform === 'win32') executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({ headless: true, executablePath });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('file://' + path.resolve(MOCKUP_FILE), { waitUntil: 'networkidle0' });

  // Save directly to TARGET_DIR
  const full = await page.screenshot({ encoding: 'base64', fullPage: true });
  fs.writeFileSync(path.join(TARGET_DIR, 'full.base64'), full);

  const sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[id]')).map(el => el.id)
  );

  for (const id of sections) {
    const el = await page.$(`#${id}`);
    if (el) {
      const b64 = await el.screenshot({ encoding: 'base64' });
      fs.writeFileSync(path.join(TARGET_DIR, `section-${id}.base64`), b64);
    }
  }
  await browser.close();
}
run();