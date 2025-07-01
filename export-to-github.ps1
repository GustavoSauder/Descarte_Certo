# Script para Exportar Projeto para GitHub
# Descarte Certo - Site Responsivo

Write-Host "🚀 Iniciando exportação para GitHub..." -ForegroundColor Green

# 1. Verificar se Git está instalado
Write-Host "📋 Verificando Git..." -ForegroundColor Yellow
try {
    git --version
    Write-Host "✅ Git encontrado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado. Instale o Git primeiro." -ForegroundColor Red
    exit 1
}

# 2. Criar .gitignore se não existir
Write-Host "📋 Criando .gitignore..." -ForegroundColor Yellow
if (!(Test-Path ".gitignore")) {
    @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.db
*.sqlite
*.sqlite3

# Backup files
*.bak
*.backup

# Security
security-backup.json
.env.example

# Prisma
prisma/migrations/
prisma/seed.js

# Vite
.vite/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore criado!" -ForegroundColor Green
} else {
    Write-Host "✅ .gitignore já existe!" -ForegroundColor Green
}

# 3. Inicializar Git (se não estiver inicializado)
Write-Host "📋 Inicializando Git..." -ForegroundColor Yellow
if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Git inicializado!" -ForegroundColor Green
} else {
    Write-Host "✅ Git já inicializado!" -ForegroundColor Green
}

# 4. Adicionar arquivos
Write-Host "📋 Adicionando arquivos..." -ForegroundColor Yellow
git add .

# 5. Fazer commit inicial
Write-Host "📋 Fazendo commit inicial..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Descarte Certo v2.0 - Site responsivo com banco PostgreSQL

✨ Melhorias implementadas:
- Responsividade completa para todos os dispositivos
- Conexão com banco PostgreSQL via Supabase
- Componentes UI otimizados
- Documentação completa
- Performance otimizada

📱 Compatibilidade:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

🗄️ Banco de Dados:
- PostgreSQL via Supabase
- Prisma ORM
- Schema sincronizado

🎨 Design:
- Tailwind CSS responsivo
- Animações suaves
- Dark mode
- Acessibilidade melhorada"

git commit -m $commitMessage

# 6. Verificar status
Write-Host "📋 Status do repositório:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "🎉 Preparação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um repositório no GitHub" -ForegroundColor White
Write-Host "2. Execute: git remote add origin https://github.com/seu-usuario/descarte-certo-site.git" -ForegroundColor White
Write-Host "3. Execute: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URLs úteis:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Backend: http://localhost:3002" -ForegroundColor White
Write-Host "- API Health: http://localhost:3002/api/health" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentação criada:" -ForegroundColor Cyan
Write-Host "- RESPONSIVIDADE-MELHORIAS.md" -ForegroundColor White
Write-Host "- TESTE-RESPONSIVIDADE.md" -ForegroundColor White
Write-Host ""
Write-Host "⏱️ Tempo estimado restante: 10-15 minutos" -ForegroundColor Yellow 