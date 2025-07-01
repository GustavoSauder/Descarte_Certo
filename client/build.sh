#!/bin/bash
set -e

echo "🧹 Limpando cache..."
rm -rf node_modules package-lock.json

echo "📦 Instalando dependências..."
npm install --legacy-peer-deps --force

echo "🔨 Fazendo build..."
npm run build

echo "✅ Build concluído!" 