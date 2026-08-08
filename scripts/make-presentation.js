const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(process.argv[2]);
const CONTENT_PATH = path.resolve(process.argv[3]);

if (!fs.existsSync(CONTENT_PATH)) {
  console.error(`❌ Missing content.json at ${CONTENT_PATH}`);
  process.exit(1);
}

const JSON_DATA = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
const scriptDir = path.dirname(__dirname);

const templatePath = path.join(scriptDir, 'templates/presentation.html');
const stylePath = path.join(scriptDir, 'templates/style.css');

let html = fs.readFileSync(templatePath, 'utf8');
const style = fs.readFileSync(stylePath, 'utf8');

html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${style}</style>`);
html = html.replace('{{hero_title}}', JSON_DATA.hero_title || '')
  .replace('{{hero_subtitle}}', JSON_DATA.hero_subtitle || '')

const fullPath = path.join(TARGET_DIR, 'full.base64');
if (fs.existsSync(fullPath)) {
  const fullB64 = fs.readFileSync(fullPath, 'utf8');
  html = html.replace('{{FULL_SCREENSHOT}}', fullB64);
}

// Logic to split into 2 items per page
let gallerySlidesHtml = '';
const updates = JSON_DATA.updates;

for (let i = 0; i < updates.length; i += 2) {
  const chunk = updates.slice(i, i + 2);
  let itemsInSlide = '';

  chunk.forEach(item => {
    const sectionFile = path.join(TARGET_DIR, `section-${item.id}.base64`);
    if (fs.existsSync(sectionFile)) {
      const b64 = fs.readFileSync(sectionFile, 'utf8');
      itemsInSlide += `
        <div class="gallery-item">
          <img src="data:image/png;base64,${b64}">
          <div class="gallery-desc"><strong>${item.title}:</strong> ${item.description}</div>
        </div>`;
    }
  });

  // Wrap the 2 items in a slide container
  gallerySlidesHtml += `
    <section class="slide">
      <span class="label">Deep Dive — Лист ${Math.floor(i / 2) + 1}</span>
      <h2 class="t-large">Что мы<br /><span class="accent">Изменили</span></h2>
      ${itemsInSlide}
    </section>`;
}

html = html.replace('{{SECTION_GALLERY}}', gallerySlidesHtml);
fs.writeFileSync(path.join(TARGET_DIR, 'presentation.html'), html);
console.log(`✅ Presentation generated with split slides: ${TARGET_DIR}/presentation.html`);