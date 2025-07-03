const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedRewardsAndAchievements() {
  try {
    console.log('🌱 Iniciando seed de recompensas e conquistas...');

    // Limpar dados existentes
    await prisma.rewardCatalog.deleteMany();
    await prisma.achievement.deleteMany();

    // Criar recompensas no catálogo
    const rewards = [
      {
        title: 'Cupom 10% Off',
        description: 'Desconto de 10% em produtos sustentáveis',
        pointsCost: 500,
        type: 'COUPON',
        partner: 'EcoStore',
        partnerLogo: 'https://via.placeholder.com/100x100/4ade80/ffffff?text=Eco',
        available: true,
        stock: 100,
        imageUrl: 'https://via.placeholder.com/300x200/4ade80/ffffff?text=Cupom'
      },
      {
        title: 'Plantinha Suculenta',
        description: 'Suculenta em vaso biodegradável',
        pointsCost: 800,
        type: 'PHYSICAL',
        partner: 'Garden Center',
        partnerLogo: 'https://via.placeholder.com/100x100/22c55e/ffffff?text=Garden',
        available: true,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Planta'
      },
      {
        title: 'Camiseta Ecológica',
        description: 'Camiseta feita com algodão orgânico',
        pointsCost: 1200,
        type: 'PHYSICAL',
        partner: 'GreenWear',
        partnerLogo: 'https://via.placeholder.com/100x100/16a34a/ffffff?text=Green',
        available: true,
        stock: 30,
        imageUrl: 'https://via.placeholder.com/300x200/16a34a/ffffff?text=Camiseta'
      },
      {
        title: 'Livro Sustentabilidade',
        description: 'Livro sobre práticas sustentáveis',
        pointsCost: 1500,
        type: 'PHYSICAL',
        partner: 'EcoBooks',
        partnerLogo: 'https://via.placeholder.com/100x100/15803d/ffffff?text=Books',
        available: true,
        stock: 25,
        imageUrl: 'https://via.placeholder.com/300x200/15803d/ffffff?text=Livro'
      },
      {
        title: 'Kit de Reciclagem',
        description: 'Kit completo para reciclagem doméstica',
        pointsCost: 2000,
        type: 'PHYSICAL',
        partner: 'EcoTools',
        partnerLogo: 'https://via.placeholder.com/100x100/166534/ffffff?text=Tools',
        available: true,
        stock: 20,
        imageUrl: 'https://via.placeholder.com/300x200/166534/ffffff?text=Kit'
      },
      {
        title: 'Experiência em Viveiro',
        description: 'Visita guiada em viveiro de mudas',
        pointsCost: 2500,
        type: 'EXPERIENCE',
        partner: 'Nature Center',
        partnerLogo: 'https://via.placeholder.com/100x100/14532d/ffffff?text=Nature',
        available: true,
        stock: 15,
        imageUrl: 'https://via.placeholder.com/300x200/14532d/ffffff?text=Experiência'
      }
    ];

    // Inserir recompensas
    for (const reward of rewards) {
      await prisma.rewardCatalog.create({
        data: reward
      });
    }

    console.log('✅ Recompensas criadas com sucesso!');

    // Criar conquistas padrão (serão desbloqueadas automaticamente quando os usuários cumprirem os critérios)
    const achievements = [
      {
        title: 'Primeiro Descarte',
        description: 'Realizou o primeiro descarte no sistema',
        points: 50,
        icon: 'FaLeaf',
        badgeType: 'BRONZE'
      },
      {
        title: 'Reciclador Bronze',
        description: 'Descarte 10 itens no sistema',
        points: 100,
        icon: 'FaTrophy',
        badgeType: 'BRONZE'
      },
      {
        title: 'Reciclador Prata',
        description: 'Descarte 50 itens no sistema',
        points: 250,
        icon: 'FaTrophy',
        badgeType: 'SILVER'
      },
      {
        title: 'Reciclador Ouro',
        description: 'Descarte 100 itens no sistema',
        points: 500,
        icon: 'FaTrophy',
        badgeType: 'GOLD'
      },
      {
        title: 'Mestre da Reciclagem',
        description: 'Descarte 500 itens no sistema',
        points: 1000,
        icon: 'FaCrown',
        badgeType: 'PLATINUM'
      },
      {
        title: 'Diversidade de Materiais',
        description: 'Recicle 5 tipos diferentes de materiais',
        points: 200,
        icon: 'FaRecycle',
        badgeType: 'SILVER'
      },
      {
        title: 'Consistência',
        description: 'Recicle por 7 dias consecutivos',
        points: 150,
        icon: 'FaCalendar',
        badgeType: 'BRONZE'
      },
      {
        title: 'Mensal',
        description: 'Recicle por 30 dias consecutivos',
        points: 300,
        icon: 'FaCalendar',
        badgeType: 'SILVER'
      },
      {
        title: 'Primeira Recompensa',
        description: 'Resgate sua primeira recompensa',
        points: 75,
        icon: 'FaGift',
        badgeType: 'BRONZE'
      },
      {
        title: 'Colecionador',
        description: 'Resgate 5 recompensas diferentes',
        points: 200,
        icon: 'FaGift',
        badgeType: 'SILVER'
      }
    ];

    console.log('✅ Conquistas definidas! (serão desbloqueadas automaticamente)');

    console.log('🎉 Seed concluído com sucesso!');
    console.log(`📊 ${rewards.length} recompensas criadas`);
    console.log(`🏆 ${achievements.length} tipos de conquistas definidos`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o seed
seedRewardsAndAchievements(); 