require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const dns = require('dns').promises;
const net = require('net');

async function debugConnection() {
  console.log('🔍 DEBUG: Testando conexão com o banco de dados...');
  
  // 1. Verificar variáveis de ambiente
  console.log('\n📋 1. Variáveis de ambiente:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definida' : '❌ Não definida');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Não definido');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está definida!');
    return;
  }
  
  // 2. Parsear a URL do banco
  console.log('\n🔗 2. Analisando DATABASE_URL:');
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Protocolo:', url.protocol);
    console.log('Hostname:', url.hostname);
    console.log('Porta:', url.port);
    console.log('Database:', url.pathname.slice(1));
    console.log('Usuário:', url.username);
    console.log('Senha:', url.password ? '***' : 'Não definida');
  } catch (error) {
    console.error('❌ Erro ao parsear DATABASE_URL:', error.message);
    return;
  }
  
  // 3. Testar resolução DNS
  console.log('\n🌐 3. Testando resolução DNS:');
  try {
    const url = new URL(process.env.DATABASE_URL);
    const addresses = await dns.resolve4(url.hostname);
    console.log('✅ DNS resolvido:', addresses);
  } catch (error) {
    console.error('❌ Erro DNS:', error.message);
  }
  
  // 4. Testar conectividade de rede
  console.log('\n🌍 4. Testando conectividade de rede:');
  try {
    const url = new URL(process.env.DATABASE_URL);
    const socket = new net.Socket();
    
    const connectPromise = new Promise((resolve, reject) => {
      socket.setTimeout(10000); // 10 segundos
      
      socket.on('connect', () => {
        console.log('✅ Conexão TCP estabelecida');
        socket.destroy();
        resolve();
      });
      
      socket.on('timeout', () => {
        console.error('❌ Timeout na conexão TCP');
        socket.destroy();
        reject(new Error('Timeout'));
      });
      
      socket.on('error', (error) => {
        console.error('❌ Erro na conexão TCP:', error.message);
        reject(error);
      });
    });
    
    socket.connect(parseInt(url.port), url.hostname);
    await connectPromise;
  } catch (error) {
    console.error('❌ Falha na conectividade de rede:', error.message);
  }
  
  // 5. Testar Prisma
  console.log('\n🔌 5. Testando Prisma:');
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  try {
    console.log('Tentando conectar com Prisma...');
    await prisma.$connect();
    console.log('✅ Prisma conectado com sucesso!');
    
    // Testar query simples
    console.log('Testando query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Query executada! Usuários: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Erro no Prisma:');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    
    // Sugestões baseadas no erro
    if (error.code === 'P1001') {
      console.error('\n💡 SUGESTÕES para P1001:');
      console.error('- Verifique se o host está correto');
      console.error('- Verifique se a porta 5432 está aberta');
      console.error('- Verifique se o Supabase está online');
      console.error('- Verifique se há firewall bloqueando');
    } else if (error.code === 'P1002') {
      console.error('\n💡 SUGESTÕES para P1002:');
      console.error('- Verifique se as credenciais estão corretas');
      console.error('- Verifique se o usuário tem permissões');
      console.error('- Verifique se a senha está correta');
    } else if (error.code === 'P1003') {
      console.error('\n💡 SUGESTÕES para P1003:');
      console.error('- Verifique se o banco de dados existe');
      console.error('- Verifique se o nome do banco está correto');
    } else if (error.code === 'P1008') {
      console.error('\n💡 SUGESTÕES para P1008:');
      console.error('- Aumente o timeout da conexão');
      console.error('- Verifique a latência da rede');
    } else {
      console.error('\n💡 SUGESTÕES gerais:');
      console.error('- Verifique se a DATABASE_URL está correta');
      console.error('- Verifique se o Supabase permite conexões externas');
      console.error('- Tente reiniciar o serviço no Render');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexão fechada.');
  }
  
  // 6. Informações adicionais
  console.log('\n📊 6. Informações do ambiente:');
  console.log('Plataforma:', process.platform);
  console.log('Node.js:', process.version);
  console.log('Arquitetura:', process.arch);
  console.log('Memória:', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB');
}

// Executar o debug
debugConnection().catch(console.error); 