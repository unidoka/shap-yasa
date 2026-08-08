const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(process.argv[2]);
const CONTENT_PATH = path.resolve(process.argv[3]);

if (!fs.existsSync(CONTENT_PATH)) {
  console.error(`❌ Missing content.json at ${CONTENT_PATH}`);
  process.exit(1);
}

const JSON_DATA = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
const scriptDir = path.dirname(__dirname); // Absolute path to project root

const templatePath = path.join(scriptDir, 'templates/presentation.html');
const stylePath = path.join(scriptDir, 'templates/style.css');

let html = fs.readFileSync(templatePath, 'utf8');
const style = fs.readFileSync(stylePath, 'utf8');

html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${style}</style>`);
html = html.replace('{{hero_title}}', JSON_DATA.hero_title || '')
  .replace('{{hero_subtitle}}', JSON_DATA.hero_subtitle || '')
  .replace('{{hero_description}}', JSON_DATA.hero_description || '');

// Full Screenshot
const fullPath = path.join(TARGET_DIR, 'full.base64');
if (fs.existsSync(fullPath)) {
  const fullB64 = fs.readFileSync(fullPath, 'utf8');
  html = html.replace('{{FULL_SCREENSHOT}}', fullB64);
} else {
  console.warn(`⚠️ Warning: full.base64 not found in ${TARGET_DIR}`);
}

// Sections
let galleryHtml = '';
JSON_DATA.updates.forEach(item => {
  const sectionFile = path.join(TARGET_DIR, `section-${item.id}.base64`);
  if (fs.existsSync(sectionFile)) {
    const b64 = fs.readFileSync(sectionFile, 'utf8');
    galleryHtml += `
      <div class="gallery-item">
        <img src="data:image/png;base64,${b64}">
        <div class="gallery-desc"><strong>${item.title}:</strong> ${item.description}</div>
      </div>`;
  }
});

html = html.replace('{{SECTION_GALLERY}}', galleryHtml);
fs.writeFileSync(path.join(TARGET_DIR, 'presentation.html'), html);
console.log(`✅ Presentation generated at ${TARGET_DIR}/presentation.html`);