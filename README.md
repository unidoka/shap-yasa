# Shap-yasa

Tool that:

* Find websites with problems.
* Clone website by provided link
* Make ready-to-use .html file with offer about website

## Getting started

### Using Docker

```bash
docker build -t shap-yasa .
```

Then just run container and execute code inside of it

### Using setup script

Run this script in terminal (use WSL on Windows):

```bash
#!/bin/bash
# setup.sh – Install dependencies for WSL/Linux (Ubuntu/Debian)

set -euo pipefail

echo "🚀 Starting environment setup..."

# ----------------------------------------------------------
# 1. System update & basic tools
# ----------------------------------------------------------
sudo apt update -y
sudo apt install -y curl wget unzip software-properties-common apt-transport-https ca-certificates gnupg

# ----------------------------------------------------------
# 2. Install Node.js & npm (if missing)
# ----------------------------------------------------------
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js LTS from NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "✅ Node.js already installed: $(node -v)"
fi

# ----------------------------------------------------------
# 3. Install Chromium (for Puppeteer)
# ----------------------------------------------------------
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

# ----------------------------------------------------------
# 4. Install puppeteer-core globally
# ----------------------------------------------------------
if ! npm list -g puppeteer-core &> /dev/null; then
    echo "📦 Installing puppeteer-core globally..."
    sudo npm install -g puppeteer-core
else
    echo "✅ puppeteer-core already installed globally."
fi

# ----------------------------------------------------------
# 5. Set environment variable for Puppeteer (persistent)
# ----------------------------------------------------------
if ! grep -q "PUPPETEER_EXECUTABLE_PATH" ~/.bashrc; then
    echo "export PUPPETEER_EXECUTABLE_PATH=\"$CHROME_PATH\"" >> ~/.bashrc
    echo "✅ Added PUPPETEER_EXECUTABLE_PATH to ~/.bashrc"
else
    echo "ℹ️  PUPPETEER_EXECUTABLE_PATH already set in ~/.bashrc"
fi

# Source to apply now
export PUPPETEER_EXECUTABLE_PATH="$CHROME_PATH"

# ----------------------------------------------------------
# 6. Verify everything works
# ----------------------------------------------------------
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