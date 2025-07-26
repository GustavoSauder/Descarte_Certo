#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando se o projeto está pronto para deploy no Vercel...\n');

const checks = [
  {
    name: 'Verificar estrutura do projeto',
    check: () => {
      const requiredFiles = [
        'package.json',
        'vercel.json',
        'client/package.json',
        'server/package.json',
        'server/index.js',
        'client/vite.config.js'
      ];
      
      const missing = requiredFiles.filter(file => !fs.existsSync(file));
      if (missing.length > 0) {
        throw new Error(`Arquivos faltando: ${missing.join(', ')}`);
      }
      return '✅ Estrutura do projeto OK';
    }
  },
  {
    name: 'Verificar configuração do Vercel',
    check: () => {
      const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      
      if (!vercelConfig.builds || !vercelConfig.routes) {
        throw new Error('Configuração do Vercel incompleta');
      }
      
      return '✅ Configuração do Vercel OK';
    }
  },
  {
    name: 'Verificar scripts de build',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (!packageJson.scripts['vercel-build']) {
        throw new Error('Script vercel-build não encontrado');
      }
      
      return '✅ Scripts de build OK';
    }
  },
  {
    name: 'Verificar configuração do Vite',
    check: () => {
      const viteConfig = fs.readFileSync('client/vite.config.js', 'utf8');
      
      if (viteConfig.includes("base: '/Descarte-Certo/'")) {
        throw new Error('Base path do Vite ainda configurado para GitHub Pages');
      }
      
      return '✅ Configuração do Vite OK';
    }
  },
  {
    name: 'Verificar dependências do cliente',
    check: () => {
      const clientPackage = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
      
      if (!clientPackage.dependencies.react || !clientPackage.dependencies['react-dom']) {
        throw new Error('Dependências React não encontradas');
      }
      
      return '✅ Dependências do cliente OK';
    }
  },
  {
    name: 'Verificar dependências do servidor',
    check: () => {
      const serverPackage = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
      
      if (!serverPackage.dependencies.express || !serverPackage.dependencies['@prisma/client']) {
        throw new Error('Dependências do servidor não encontradas');
      }
      
      return '✅ Dependências do servidor OK';
    }
  },
  {
    name: 'Verificar configuração do Prisma',
    check: () => {
      if (!fs.existsSync('server/prisma/schema.prisma')) {
        throw new Error('Schema do Prisma não encontrado');
      }
      
      return '✅ Configuração do Prisma OK';
    }
  },
  {
    name: 'Testar build do cliente',
    check: () => {
      try {
        console.log('   📦 Executando build do cliente...');
        execSync('cd client && npm run build', { stdio: 'pipe' });
        return '✅ Build do cliente OK';
      } catch (error) {
        throw new Error(`Erro no build do cliente: ${error.message}`);
      }
    }
  }
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  try {
    console.log(`🔍 ${check.name}...`);
    const result = check.check();
    console.log(`   ${result}\n`);
    passed++;
  } catch (error) {
    console.log(`   ❌ ${error.message}\n`);
    failed++;
  }
}

console.log('📊 Resultado dos testes:');
console.log(`✅ Passou: ${passed}`);
console.log(`❌ Falhou: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 Projeto está pronto para deploy no Vercel!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure o Supabase (banco de dados)');
  console.log('2. Acesse vercel.com e conecte o repositório');
  console.log('3. Configure as variáveis de ambiente');
  console.log('4. Faça o deploy!');
  console.log('\n📖 Consulte o arquivo VERCEL-DEPLOY-GUIDE.md para instruções detalhadas');
} else {
  console.log('\n⚠️  Corrija os problemas acima antes de fazer o deploy');
  process.exit(1);
} 