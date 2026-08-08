const fs = require('fs');
const path = require('path');
const TARGET_DIR = process.argv[2];
const JSON_DATA = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

const text = `
Добрый день!

Мы подготовили для вас обновлённый концепт главной страницы вашего сайта 
Основной фокус мы сделали на ${JSON_DATA.hero_description}.
Можете ознакомиться в прекреплённом файле с презентацией.

Буду рад обсудить детали

Наши проекты: https://rovno.dev/projects
`;

fs.writeFileSync(path.join(TARGET_DIR, 'messenger.txt'), text);
console.log(`📱 Messenger text generated: ./messenger.txt`);