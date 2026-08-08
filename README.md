# Shap-yasa

Tool that:

* Find websites with problems.
* Clone website by provided link
* Make ready-to-use .html file with offer about website

## Getting started

### Using npx skills

```bash
npx skills@latest add unidoka/shap-yasa
```

### Using Docker

```bash
docker build -t shap-yasa .
```

Then just run container as bash

```bash
docker run --rm -it --entrypoint bash shap-yasa
```

And execute commands inside container

### Using setup script

Run this script in terminal (use WSL on Windows):

```bash
#!/bin/bash

set -euo pipefail

echo "🚀 Starting environment setup..."

sudo apt update -y
sudo apt install -y curl wget unzip software-properties-common apt-transport-https ca-certificates gnupg

if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js LTS from NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "✅ Node.js already installed: $(node -v)"
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
    echo "📦 Installing Chromium..."
    sudo apt install -y chromium-browser || sudo apt install -y chromium
    CHROME_PATH=$(which chromium-browser || which chromium)
fi

echo "✅ Chrome/Chromium found at: $CHROME_PATH"

if ! npm list -g puppeteer-core &> /dev/null; then
    echo "📦 Installing puppeteer-core globally..."
    sudo npm install -g puppeteer-core
else
    echo "✅ puppeteer-core already installed globally."
fi

if ! grep -q "PUPPETEER_EXECUTABLE_PATH" ~/.bashrc; then
    echo "export PUPPETEER_EXECUTABLE_PATH=\"$CHROME_PATH\"" >> ~/.bashrc
    echo "✅ Added PUPPETEER_EXECUTABLE_PATH to ~/.bashrc"
else
    echo "ℹ️  PUPPETEER_EXECUTABLE_PATH already set in ~/.bashrc"
fi

export PUPPETEER_EXECUTABLE_PATH="$CHROME_PATH"

echo ""
echo "✅ All dependencies installed!"
echo "   Node: $(node -v)"
echo "   npm:  $(npm -v)"
echo "   Chrome: $CHROME_PATH"
echo ""
echo "You can now run the demo generation script."
echo "To apply the environment variable in this terminal, run:"
echo "  source ~/.bashrc"
```

## Usage

1. **Capture Screenshots:**
  `node scripts/1-capture.js "client-name" "path/to/mockup/index.html"`
2. **Generate Presentation:**
  `node scripts/2-present.js "client-name" "path/to/content.json"`
  *Note: content.json should define hero_title, hero_description, and an array of 'updates' with section IDs.*
3. **Generate Email & Messenger Text:**
  `node scripts/3-email.js "client-name" "path/to/content.json"`
  `node scripts/4-messenger.js "client-name" "path/to/content.json"`