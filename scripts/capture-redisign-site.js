const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
    const SITE_NAME = process.argv[2] || 'demo';
    const MOCKUP_FILE = process.argv[3] || 'index.html';
    const OUTPUT_DIR = path.join(process.cwd(), 'dist', SITE_NAME);
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    let executablePath = '/usr/bin/google-chrome'; // Default WSL/Linux
    if (process.platform === 'win32') executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    if (!fs.existsSync(executablePath)) {
        // Search Windows Chrome from WSL
        const wslPath = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';
        if (fs.existsSync(wslPath)) executablePath = wslPath;
    }

    const browser = await puppeteer.launch({ headless: true, executablePath });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    const filePath = 'file://' + path.resolve(MOCKUP_FILE);
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // 1. Full Screenshot
    const full = await page.screenshot({ encoding: 'base64', fullPage: true });
    fs.writeFileSync(path.join(OUTPUT_DIR, 'full.base64'), full);

    // 2. Section Screenshots
    const sections = await page.evaluate(() => 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id)
    );

    for (const id of sections) {
        const el = await page.$(`#${id}`);
        if (el) {
            const b64 = await el.screenshot({ encoding: 'base64' });
            fs.writeFileSync(path.join(OUTPUT_DIR, `section-${id}.base64`), b64);
        }
    }
    await browser.close();
    console.log(`📸 Screenshots saved to ${OUTPUT_DIR}`);
}
run();
