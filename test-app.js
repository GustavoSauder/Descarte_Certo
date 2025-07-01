const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando diagnóstico da aplicação...\n');

// Verificar se os diretórios existem
const clientPath = path.join(__dirname, 'client');
const serverPath = path.join(__dirname, 'server');

console.log('📁 Verificando estrutura de diretórios...');
console.log(`Cliente: ${fs.existsSync(clientPath) ? '✅' : '❌'} ${clientPath}`);
console.log(`Servidor: ${fs.existsSync(serverPath) ? '✅' : '❌'} ${serverPath}\n`);

// Verificar package.json dos projetos
const clientPackage = path.join(clientPath, 'package.json');
const serverPackage = path.join(serverPath, 'package.json');

console.log('📦 Verificando package.json...');
console.log(`Cliente: ${fs.existsSync(clientPackage) ? '✅' : '❌'} ${clientPackage}`);
console.log(`Servidor: ${fs.existsSync(serverPackage) ? '✅' : '❌'} ${serverPackage}\n`);

// Verificar dependências instaladas
console.log('🔧 Verificando node_modules...');
console.log(`Cliente: ${fs.existsSync(path.join(clientPath, 'node_modules')) ? '✅' : '❌'} node_modules`);
console.log(`Servidor: ${fs.existsSync(path.join(serverPath, 'node_modules')) ? '✅' : '❌'} node_modules\n`);

// Verificar arquivos principais
console.log('📄 Verificando arquivos principais...');
const mainFiles = [
  'client/src/App.jsx',
  'client/src/pages/Home.jsx',
  'client/src/components/Layout.jsx',
  'client/src/hooks/useAuth.jsx',
  'client/src/hooks/useAppState.jsx',
  'server/index.js'
];

mainFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  console.log(`${file}: ${fs.existsSync(fullPath) ? '✅' : '❌'}`);
});

console.log('\n🚀 Iniciando servidores...\n');

// Iniciar servidor backend
console.log('🔧 Iniciando servidor backend...');
const serverProcess = exec('cd server && npm start', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro no servidor backend:', error);
    return;
  }
  console.log('✅ Servidor backend iniciado');
});

// Aguardar um pouco e iniciar cliente
setTimeout(() => {
  console.log('🌐 Iniciando cliente...');
  const clientProcess = exec('cd client && npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erro no cliente:', error);
      return;
    }
    console.log('✅ Cliente iniciado');
  });
  
  clientProcess.stdout.on('data', (data) => {
    console.log('Cliente:', data.toString());
  });
  
  clientProcess.stderr.on('data', (data) => {
    console.error('Erro Cliente:', data.toString());
  });
}, 3000);

serverProcess.stdout.on('data', (data) => {
  console.log('Servidor:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('Erro Servidor:', data.toString());
});

console.log('✅ Diagnóstico concluído! Verifique os logs acima para identificar problemas.'); 