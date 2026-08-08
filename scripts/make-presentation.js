const fs = require('fs');
const path = require('path');

const TARGET_DIR = process.argv[2];
const JSON_DATA = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

// Templates are always relative to PROJECT_DIR (where script lives)
const scriptDir = path.dirname(__dirname);
const template = fs.readFileSync(path.join(scriptDir, 'templates/presentation.html'), 'utf8');
const style = fs.readFileSync(path.join(scriptDir, 'templates/style.css'), 'utf8');

let html = template.replace('<link rel="stylesheet" href="style.css">', `<style>${style}</style>`);
html = html.replace('{{hero_title}}', JSON_DATA.hero_title)
  .replace('{{hero_subtitle}}', JSON_DATA.hero_subtitle)
  .replace('{{hero_description}}', JSON_DATA.hero_description);

const fullB64 = fs.readFileSync(path.join(TARGET_DIR, 'full.base64'), 'utf8');
html = html.replace('{{FULL_SCREENSHOT}}', fullB64);

let galleryHtml = '';
JSON_DATA.updates.forEach(item => {
  const file = path.join(TARGET_DIR, `section-${item.id}.base64`);
  if (fs.existsSync(file)) {
    const b64 = fs.readFileSync(file, 'utf8');
    galleryHtml += `<div class="gallery-item"><img src="data:image/png;base64,${b64}"><div class="gallery-desc"><strong>${item.title}:</strong> ${item.description}</div></div>`;
  }
});

html = html.replace('{{SECTION_GALLERY}}', galleryHtml);
fs.writeFileSync(path.join(TARGET_DIR, 'presentation.html'), html);