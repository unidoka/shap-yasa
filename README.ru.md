# Shap-yasa

Инструмент, который:

* Находит сайты с проблемами.
* Клонирует сайт по предоставленной ссылке.
* Создает готовый к использованию .html-файл с предложением по сайту.

## Приступая к работе

### Использование npx skills

```bash
npx skills@latest add unidoka/shap-yasa
```

### Использование Docker

```bash
docker build -t shap-yasa .
```

Затем просто запустите контейнер в режиме bash:

```bash
docker run --rm -it --entrypoint bash shap-yasa
```

И выполняйте команды внутри контейнера.

### Использование локального окружения (Linux, MacOS, WSL)

1. Запустите этот скрипт настройки в терминале (используйте WSL в Windows):
```bash
#!/bin/bash

set -euo pipefail

echo "🚀 Запуск настройки окружения..."

sudo apt update -y
sudo apt install -y curl wget unzip software-properties-common apt-transport-https ca-certificates gnupg

if ! command -v node &> /dev/null; then
    echo "📦 Установка Node.js LTS из NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "✅ Node.js уже установлен: $(node -v)"
fi

CHROME_PATH=""
if command -v chromium-browser &> /dev/null; then
    CHROME_PATH=$(which chromium-browser)
elif command -v chromium &> /dev/null; then
    CHROME_PATH=$(which chromium)
elif command -v google-chrome &> /dev/null; then
    CHROME_PATH=$(which google-chrome)
fi

if [ -z "$CHROME_PATH" ]; then
    echo "📦 Установка Chromium..."
    sudo apt install -y chromium-browser || sudo apt install -y chromium
    CHROME_PATH=$(which chromium-browser || which chromium)
fi

echo "✅ Chrome/Chromium найден по адресу: $CHROME_PATH"

if ! npm list -g puppeteer-core &> /dev/null; then
    echo "📦 Установка puppeteer-core глобально..."
    sudo npm install -g puppeteer-core
else
    echo "✅ puppeteer-core уже установлен глобально."
fi

if ! grep -q "PUPPETEER_EXECUTABLE_PATH" ~/.bashrc; then
    echo "export PUPPETEER_EXECUTABLE_PATH=\"$CHROME_PATH\"" >> ~/.bashrc
    echo "✅ Переменная PUPPETEER_EXECUTABLE_PATH добавлена в ~/.bashrc"
else
    echo "ℹ️  PUPPETEER_EXECUTABLE_PATH уже установлена в ~/.bashrc"
fi

export PUPPETEER_EXECUTABLE_PATH="$CHROME_PATH"

echo ""
echo "✅ Все зависимости установлены!"
echo "   Node: $(node -v)"
echo "   npm:  $(npm -v)"
echo "   Chrome: $CHROME_PATH"
echo ""
echo "Теперь вы можете запустить скрипт генерации демо."
echo "Чтобы применить переменные окружения в текущем терминале, выполните:"
echo "  source ~/.bashrc"
```
2. Добавьте SHAP_YASA_DIR, чтобы сделать скрипты доступными для выполнения глобально:
> ⚠️ Измените путь перед выполнением
```bash
echo 'export SHAP_YASA_DIR=ВАШ_ПУТЬ_ЗДЕСЬ' >> ~/.bashrc && source ~/.bashrc
```

## Использование

### ИИ-чаты

1. Получите весь контекст и содержимое файлов с помощью repomix:
```bash
repomix .
```
2. Добавьте полученный файл в чат.
3. Введите:
  - Find websites — чтобы найти сайты.
  - Bash mode. Clone URL or JSON report — чтобы выполнить редизайн конкретного сайта.