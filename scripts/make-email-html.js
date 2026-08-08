const fs = require('fs');
const path = require('path');
const TARGET_DIR = process.argv[2];
const JSON_DATA = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const scriptDir = path.dirname(__dirname);

let html = fs.readFileSync(path.join(scriptDir, 'templates/email-offer.html'), 'utf8');
html = html.replace(/{{hero_title}}/g, JSON_DATA.hero_title)
  .replace(/{{hero_description}}/g, JSON_DATA.hero_description);

fs.writeFileSync(path.join(TARGET_DIR, 'email-offer.html'), html);