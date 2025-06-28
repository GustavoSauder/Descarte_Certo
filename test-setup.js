#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testando configuração do projeto Descarte Certo...\n');

// Verificar estrutura de pastas
const requiredFolders = [
  'client',
  'client/src',
  'client/src/components',
  'client/src/pages',
  'server',
  'server/routes',
  'server/prisma',
  'server/docs'
];

console.log('📁 Verificando estrutura de pastas...');
let foldersOk = true;
requiredFolders.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`✅ ${folder}`);
  } else {
    console.log(`❌ ${folder} - FALTANDO`);
    foldersOk = false;
  }
});

// Verificar arquivos essenciais
const requiredFiles = [
  'package.json',
  'client/package.json',
  'server/package.json',
  'client/src/App.jsx',
  'client/src/main.jsx',
  'server/index.js',
  'server/prisma/schema.prisma',
  'README.md',
  'SETUP.md'
];

console.log('\n📄 Verificando arquivos essenciais...');
let filesOk = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
    filesOk = false;
  }
});

// Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (rootPackage.scripts && rootPackage.scripts['install-all']) {
    console.log('✅ Script install-all encontrado');
  } else {
    console.log('❌ Script install-all não encontrado');
  }
} catch (error) {
  console.log('❌ Erro ao ler package.json');
}

// Verificar se .env existe
console.log('\n🔐 Verificando configuração de ambiente...');
if (fs.existsSync('server/.env')) {
  console.log('✅ Arquivo .env encontrado');
} else if (fs.existsSync('server/env.example')) {
  console.log('⚠️  Arquivo .env não encontrado, mas env.example existe');
  console.log('   Execute: cp server/env.example server/.env');
} else {
  console.log('❌ Arquivo .env e env.example não encontrados');
}

// Resumo
console.log('\n📊 RESUMO:');
console.log(`Pastas: ${foldersOk ? '✅ OK' : '❌ PROBLEMAS'}`);
console.log(`Arquivos: ${filesOk ? '✅ OK' : '❌ PROBLEMAS'}`);

if (foldersOk && filesOk) {
  console.log('\n🎉 Projeto configurado corretamente!');
  console.log('\n📋 Próximos passos:');
  console.log('1. npm run install-all');
  console.log('2. cp server/env.example server/.env');
  console.log('3. cd server && npm run db:generate && npm run db:migrate && npm run db:seed');
  console.log('4. cd .. && npm run dev');
} else {
  console.log('\n⚠️  Alguns problemas foram encontrados. Verifique os arquivos faltantes.');
}

console.log('\n🌱 Descarte Certo - Pronto para um mundo mais sustentável!'); 