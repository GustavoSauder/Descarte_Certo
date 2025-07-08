require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testando conexão com o banco de dados...');
  
  // Verificar variáveis de ambiente
  console.log('\n📋 Variáveis de ambiente:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definida' : '❌ Não definida');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Não definido');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está definida!');
    return;
  }
  
  // Mostrar parte da URL (sem senha)
  const urlParts = process.env.DATABASE_URL.split('@');
  if (urlParts.length > 1) {
    const hostPart = urlParts[1];
    console.log('Host:', hostPart.split('/')[0]);
  }
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    console.log('\n🔌 Tentando conectar...');
    
    // Testar conexão básica
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    console.log('\n📊 Testando query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Query executada com sucesso! Usuários no banco: ${userCount}`);
    
    // Testar query mais complexa
    console.log('\n🔍 Testando query com join...');
    const disposals = await prisma.disposal.findMany({
      take: 1,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    console.log(`✅ Query com join executada! Descarte encontrado: ${disposals.length > 0 ? 'Sim' : 'Não'}`);
    
  } catch (error) {
    console.error('\n❌ Erro na conexão:');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Possível solução:');
      console.error('- Verifique se o host do banco está correto');
      console.error('- Verifique se a porta 5432 está aberta');
      console.error('- Verifique se o firewall não está bloqueando');
    } else if (error.code === 'P1002') {
      console.error('\n💡 Possível solução:');
      console.error('- Verifique se as credenciais estão corretas');
      console.error('- Verifique se o usuário tem permissões');
    } else if (error.code === 'P1003') {
      console.error('\n💡 Possível solução:');
      console.error('- Verifique se o banco de dados existe');
      console.error('- Verifique se o nome do banco está correto');
    } else if (error.code === 'P1008') {
      console.error('\n💡 Possível solução:');
      console.error('- Verifique se o timeout está adequado');
      console.error('- Verifique a latência da conexão');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexão fechada.');
  }
}

// Executar o teste
testDatabaseConnection().catch(console.error); 