const fs = require('fs');
const path = require('path');
const SITE_NAME = process.argv[2] || 'demo';
const JSON_DATA = JSON.parse(fs.readFileSync(process.argv[3] || 'content.json', 'utf8'));
const OUTPUT_DIR = path.join(process.cwd(), 'dist', SITE_NAME);

let html = fs.readFileSync('templates/email-offer.html', 'utf8');
html = html.replace(/{{hero_title}}/g, JSON_DATA.hero_title)
  .replace(/{{hero_description}}/g, JSON_DATA.hero_description);

fs.writeFileSync(path.join(OUTPUT_DIR, 'email-offer.html'), html);
console.log(`📧 Email offer generated: ${OUTPUT_DIR}/email-offer.html`);
