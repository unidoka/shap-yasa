const fs = require('fs');
const path = require('path');
const SITE_NAME = process.argv[2] || 'demo';
const JSON_DATA = JSON.parse(fs.readFileSync(process.argv[3] || 'content.json', 'utf8'));
const OUTPUT_DIR = path.join(process.cwd(), 'dist', SITE_NAME);

const text = `
👋 Привет! Это Нияз из Rovno.dev.

Для проекта ${JSON_DATA.hero_title} мы подготовили концепт обновления. 
Основной фокус: ${JSON_DATA.hero_description}

Посмотреть презентацию: [ССЫЛКА]

Буду рад обсудить запуск!
Заказать аудит: https://rovno.dev/order
Личка: https://t.me/niyaz_gimadiev
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'messenger.txt'), text);
console.log(`📱 Messenger text generated: ${OUTPUT_DIR}/messenger.txt`);
