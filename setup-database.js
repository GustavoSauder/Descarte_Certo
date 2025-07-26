#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando banco de dados para deploy...\n');

// Configurações do Supabase
const config = {
  DATABASE_URL: 'postgresql://postgres:FcfeAvOw42KEvYCG@db.asspyvbdwpkegwvrjqvv.supabase.co:5432/postgres',
  SUPABASE_URL: 'https://asspyvbdwpkegwvrjqvv.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzc3B5dmJkd3BrZWd3dnJqcXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NjM0NzksImV4cCI6MjA2OTEzOTQ3OX0.C4ON_YCen_NePOC1egd3WeCg7AQVs7f5k2p-cWwFg8c'
};

// Criar arquivo .env temporário
const envContent = `DATABASE_URL=${config.DATABASE_URL}
SUPABASE_URL=${config.SUPABASE_URL}
SUPABASE_ANON_KEY=${config.SUPABASE_ANON_KEY}
JWT_SECRET=descarte_certo_jwt_secret_2024_producao_super_seguro
NODE_ENV=development
`;

const envPath = path.join(__dirname, 'server', '.env');
fs.writeFileSync(envPath, envContent);

console.log('✅ Arquivo .env criado com as credenciais do Supabase');

try {
  console.log('\n🔍 Testando conexão com o banco de dados...');
  
  // Mudar para o diretório server
  process.chdir('server');
  
  // Testar conexão
  console.log('   📡 Verificando conectividade...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  console.log('\n✅ Conexão com banco de dados estabelecida!');
  console.log('✅ Schema do banco sincronizado!');
  
  // Gerar cliente Prisma
  console.log('\n🔧 Gerando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n🎉 Banco de dados configurado com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Encontre a Service Role Key no Supabase');
  console.log('2. Configure as variáveis no Vercel');
  console.log('3. Faça o deploy!');
  
} catch (error) {
  console.error('\n❌ Erro ao configurar banco de dados:');
  console.error(error.message);
  
  console.log('\n🔧 Soluções possíveis:');
  console.log('1. Verifique se o projeto Supabase está ativo');
  console.log('2. Confirme se as credenciais estão corretas');
  console.log('3. Verifique a conectividade de rede');
  
  process.exit(1);
} 