const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'teste@descarte.com' }
    });

    if (existingUser) {
      console.log('Usuário de teste já existe!');
      console.log('Email: teste@descarte.com');
      console.log('Senha: 123456');
      return;
    }

    const passwordHash = await bcrypt.hash('123456', 10);
    
    const testUser = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@descarte.com',
        password: passwordHash,
        emailConfirmed: true, // Já confirmado para facilitar os testes
        emailConfirmationToken: null,
        role: 'USER',
        points: 0,
        level: 1,
        experience: 0
      }
    });

    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('📧 Email: teste@descarte.com');
    console.log('🔑 Senha: 123456');
    console.log('🆔 ID do usuário:', testUser.id);
    console.log('✅ Email já confirmado para facilitar os testes');

  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  }); 