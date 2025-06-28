# Script de Inicialização - Descarte Certo
# Execute este script para iniciar o projeto completo

Write-Host "🚀 Iniciando Descarte Certo - Plataforma Completa" -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado. Instale o npm primeiro." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Verificando dependências..." -ForegroundColor Yellow

# Verificar se as dependências estão instaladas
if (-not (Test-Path "server/node_modules")) {
    Write-Host "📦 Instalando dependências do servidor..." -ForegroundColor Yellow
    Set-Location "server"
    npm install
    Set-Location ".."
}

if (-not (Test-Path "client/node_modules")) {
    Write-Host "📦 Instalando dependências do cliente..." -ForegroundColor Yellow
    Set-Location "client"
    npm install
    Set-Location ".."
}

Write-Host ""
Write-Host "🔧 Iniciando servidor backend..." -ForegroundColor Cyan
Write-Host "   Aguarde alguns segundos..." -ForegroundColor Gray

# Iniciar servidor em background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm start"

# Aguardar um pouco para o servidor inicializar
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Iniciando frontend..." -ForegroundColor Cyan
Write-Host "   Aguarde alguns segundos..." -ForegroundColor Gray

# Iniciar cliente em background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; npm run dev"

# Aguardar um pouco para o cliente inicializar
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎉 Projeto iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:3000" -ForegroundColor White
Write-Host "📚 API Docs: http://localhost:3000/api/docs" -ForegroundColor White
Write-Host "🏥 Health Check: http://localhost:3000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor Yellow
Write-Host "   • Use Ctrl+C para parar os servidores" -ForegroundColor Gray
Write-Host "   • Verifique a documentação da API em /api/docs" -ForegroundColor Gray
Write-Host "   • Configure as variáveis de ambiente em server/.env" -ForegroundColor Gray
Write-Host ""
Write-Host "🌱 Descarte Certo - Transformando o futuro através da educação ambiental!" -ForegroundColor Green 