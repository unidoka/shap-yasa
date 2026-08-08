const fs = require('fs');
const path = require('path');

function run() {
    const SITE_NAME = process.argv[2] || 'demo';
    const JSON_DATA = JSON.parse(fs.readFileSync(process.argv[3] || 'content.json', 'utf8'));
    const OUTPUT_DIR = path.join(process.cwd(), 'dist', SITE_NAME);

    const template = fs.readFileSync('templates/presentation.html', 'utf8');
    const style = fs.readFileSync('templates/style.css', 'utf8');

    let html = template.replace('<link rel="stylesheet" href="style.css">', `<style>${style}</style>`);
    
    // Replace text
    html = html.replace('{{hero_title}}', JSON_DATA.hero_title)
               .replace('{{hero_subtitle}}', JSON_DATA.hero_subtitle)
               .replace('{{hero_description}}', JSON_DATA.hero_description);

    // Replace Full
    const fullB64 = fs.readFileSync(path.join(OUTPUT_DIR, 'full.base64'), 'utf8');
    html = html.replace('{{FULL_SCREENSHOT}}', fullB64);

    // Build Gallery with descriptions from JSON
    let galleryHtml = '';
    JSON_DATA.updates.forEach(item => {
        const file = path.join(OUTPUT_DIR, `section-${item.id}.base64`);
        if (fs.existsSync(file)) {
            const b64 = fs.readFileSync(file, 'utf8');
            galleryHtml += `
            <div class="gallery-item">
                <img src="data:image/png;base64,${b64}">
                <div class="gallery-desc">
                    <strong>${item.title}:</strong> ${item.description}
                </div>
            </div>`;
        }
    });

    html = html.replace('{{SECTION_GALLERY}}', galleryHtml);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'presentation.html'), html);
    console.log(`📄 Presentation generated: ${OUTPUT_DIR}/presentation.html`);
}
run();
