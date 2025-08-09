#!/bin/bash
set -e
echo "[HOOK] Installing dependencies..."
npm install --include=dev

echo "[HOOK] Running build..."
npm run build
