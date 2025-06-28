const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createNotification } = require('./notifications');

const router = express.Router();
const prisma = new PrismaClient();

// Buscar catálogo de recompensas
router.get('/catalog', authenticateToken, async (req, res) => {
  try {
    const { category, partner, minPoints, maxPoints } = req.query;
    
    const where = { available: true };
    
    if (category) where.type = category;
    if (partner) where.partner = { contains: partner, mode: 'insensitive' };
    if (minPoints) where.pointsCost = { gte: parseInt(minPoints) };
    if (maxPoints) where.pointsCost = { ...where.pointsCost, lte: parseInt(maxPoints) };

    const rewards = await prisma.rewardCatalog.findMany({
      where,
      orderBy: { pointsCost: 'asc' }
    });

    res.json(rewards);
  } catch (error) {
    console.error('Erro ao buscar catálogo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar recompensas do usuário
router.get('/my-rewards', authenticateToken, async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { userId: req.user.id },
      orderBy: { claimedAt: 'desc' }
    });

    res.json(rewards);
  } catch (error) {
    console.error('Erro ao buscar recompensas do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Resgatar recompensa
router.post('/redeem/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar recompensa no catálogo
    const rewardItem = await prisma.rewardCatalog.findUnique({
      where: { id, available: true }
    });

    if (!rewardItem) {
      return res.status(404).json({ error: 'Recompensa não encontrada ou indisponível' });
    }

    // Verificar se tem estoque
    if (rewardItem.stock !== null && rewardItem.stock <= 0) {
      return res.status(400).json({ error: 'Recompensa sem estoque' });
    }

    // Buscar usuário e verificar pontos
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true, name: true }
    });

    if (user.points < rewardItem.pointsCost) {
      return res.status(400).json({ 
        error: 'Pontos insuficientes',
        required: rewardItem.pointsCost,
        available: user.points
      });
    }

    // Gerar código único para cupom/produto
    const code = generateRewardCode(rewardItem.type);

    // Criar recompensa do usuário
    const reward = await prisma.reward.create({
      data: {
        userId: req.user.id,
        title: rewardItem.title,
        description: rewardItem.description,
        pointsCost: rewardItem.pointsCost,
        type: rewardItem.type,
        partner: rewardItem.partner,
        code
      }
    });

    // Deduzir pontos do usuário
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { decrement: rewardItem.pointsCost } }
    });

    // Atualizar estoque se necessário
    if (rewardItem.stock !== null) {
      await prisma.rewardCatalog.update({
        where: { id },
        data: { stock: { decrement: 1 } }
      });
    }

    // Criar notificação
    await createNotification(
      req.user.id,
      '🎁 Recompensa Resgatada!',
      `Você resgatou "${rewardItem.title}" por ${rewardItem.pointsCost} pontos!`,
      'REWARD',
      { rewardId: reward.id, code }
    );

    res.json({
      ...reward,
      remainingPoints: user.points - rewardItem.pointsCost
    });
  } catch (error) {
    console.error('Erro ao resgatar recompensa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Gerar código único para recompensa
function generateRewardCode(type) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  
  switch (type) {
    case 'COUPON':
      return `CUP-${timestamp}-${random}`.toUpperCase();
    case 'PRODUCT':
      return `PROD-${timestamp}-${random}`.toUpperCase();
    case 'DONATION':
      return `DON-${timestamp}-${random}`.toUpperCase();
    default:
      return `REW-${timestamp}-${random}`.toUpperCase();
  }
}

// Buscar parceiros
router.get('/partners', authenticateToken, async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });

    res.json(partners);
  } catch (error) {
    console.error('Erro ao buscar parceiros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Fazer doação
router.post('/donate', authenticateToken, async (req, res) => {
  try {
    const { points, cause, message, anonymous } = req.body;

    if (!points || !cause) {
      return res.status(400).json({ error: 'Pontos e causa são obrigatórios' });
    }

    if (points <= 0) {
      return res.status(400).json({ error: 'Quantidade de pontos deve ser maior que zero' });
    }

    // Verificar se tem pontos suficientes
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true, name: true }
    });

    if (user.points < points) {
      return res.status(400).json({ 
        error: 'Pontos insuficientes',
        required: points,
        available: user.points
      });
    }

    // Criar doação
    const donation = await prisma.donation.create({
      data: {
        userId: req.user.id,
        points: parseInt(points),
        cause,
        message,
        anonymous: anonymous || false
      }
    });

    // Deduzir pontos do usuário
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { decrement: points } }
    });

    // Criar notificação
    await createNotification(
      req.user.id,
      '❤️ Doação Realizada!',
      `Você doou ${points} pontos para "${cause}". Obrigado por fazer a diferença!`,
      'REWARD',
      { donationId: donation.id, cause }
    );

    res.json({
      ...donation,
      remainingPoints: user.points - points
    });
  } catch (error) {
    console.error('Erro ao fazer doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar doações
router.get('/donations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const donations = await prisma.donation.findMany({
      where: { anonymous: false },
      include: {
        user: {
          select: { name: true, avatar: true, city: true, state: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.donation.count({
      where: { anonymous: false }
    });

    res.json({
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas do marketplace
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalRewards = await prisma.reward.count({
      where: { userId: req.user.id }
    });

    const totalPointsSpent = await prisma.reward.aggregate({
      where: { userId: req.user.id },
      _sum: { pointsCost: true }
    });

    const totalDonations = await prisma.donation.count({
      where: { userId: req.user.id }
    });

    const totalPointsDonated = await prisma.donation.aggregate({
      where: { userId: req.user.id },
      _sum: { points: true }
    });

    const availableRewards = await prisma.rewardCatalog.count({
      where: { available: true }
    });

    res.json({
      user: {
        totalRewards,
        totalPointsSpent: totalPointsSpent._sum.pointsCost || 0,
        totalDonations,
        totalPointsDonated: totalPointsDonated._sum.points || 0
      },
      marketplace: {
        availableRewards
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Criar recompensa no catálogo
router.post('/catalog', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { title, description, pointsCost, type, partner, partnerLogo, stock, imageUrl } = req.body;

    if (!title || !description || !pointsCost || !type || !partner) {
      return res.status(400).json({ error: 'Campos obrigatórios: title, description, pointsCost, type, partner' });
    }

    const reward = await prisma.rewardCatalog.create({
      data: {
        title,
        description,
        pointsCost: parseInt(pointsCost),
        type,
        partner,
        partnerLogo,
        stock: stock ? parseInt(stock) : null,
        imageUrl
      }
    });

    res.status(201).json(reward);
  } catch (error) {
    console.error('Erro ao criar recompensa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Atualizar recompensa no catálogo
router.put('/catalog/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, pointsCost, type, partner, partnerLogo, stock, imageUrl, available } = req.body;

    const reward = await prisma.rewardCatalog.update({
      where: { id },
      data: {
        title,
        description,
        pointsCost: pointsCost ? parseInt(pointsCost) : undefined,
        type,
        partner,
        partnerLogo,
        stock: stock ? parseInt(stock) : undefined,
        imageUrl,
        available
      }
    });

    res.json(reward);
  } catch (error) {
    console.error('Erro ao atualizar recompensa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Deletar recompensa do catálogo
router.delete('/catalog/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.rewardCatalog.delete({
      where: { id }
    });

    res.json({ message: 'Recompensa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar recompensa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 