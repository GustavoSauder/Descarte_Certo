const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Buscar feed de atividades
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;

    const where = { public: true };
    if (type) {
      where.type = type;
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: { name: true, avatar: true, city: true, state: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.activity.count({ where });

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar atividades do usuário
router.get('/my-activities', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await prisma.activity.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.activity.count({
      where: { userId: req.user.id }
    });

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar atividade
async function createActivity(userId, type, description, data = null, public = true) {
  try {
    const activity = await prisma.activity.create({
      data: {
        userId,
        type,
        description,
        data: data ? JSON.stringify(data) : null,
        public
      },
      include: {
        user: {
          select: { name: true, avatar: true, city: true, state: true }
        }
      }
    });

    return activity;
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
  }
}

// Atividades por cidade/estado
router.get('/location/:city/:state', authenticateToken, async (req, res) => {
  try {
    const { city, state } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await prisma.activity.findMany({
      where: {
        public: true,
        user: {
          city: { contains: city, mode: 'insensitive' },
          state: { contains: state, mode: 'insensitive' }
        }
      },
      include: {
        user: {
          select: { name: true, avatar: true, city: true, state: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.activity.count({
      where: {
        public: true,
        user: {
          city: { contains: city, mode: 'insensitive' },
          state: { contains: state, mode: 'insensitive' }
        }
      }
    });

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades por localização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de atividades
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await prisma.activity.groupBy({
      by: ['type'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    });

    const totalActivities = await prisma.activity.count({
      where: {
        createdAt: { gte: startDate }
      }
    });

    const userStats = await prisma.activity.groupBy({
      by: ['type'],
      where: {
        userId: req.user.id,
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    });

    res.json({
      global: {
        total: totalActivities,
        byType: stats
      },
      user: {
        byType: userStats
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar atividade (apenas do próprio usuário)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await prisma.activity.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!activity) {
      return res.status(404).json({ error: 'Atividade não encontrada' });
    }

    if (activity.userId !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await prisma.activity.delete({
      where: { id }
    });

    res.json({ message: 'Atividade deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar atividade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar atividades de amigos (usuários da mesma cidade/estado)
router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { city: true, state: true }
    });

    if (!user.city || !user.state) {
      return res.json({ activities: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const activities = await prisma.activity.findMany({
      where: {
        public: true,
        userId: { not: req.user.id },
        user: {
          city: { contains: user.city, mode: 'insensitive' },
          state: { contains: user.state, mode: 'insensitive' }
        }
      },
      include: {
        user: {
          select: { name: true, avatar: true, city: true, state: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.activity.count({
      where: {
        public: true,
        userId: { not: req.user.id },
        user: {
          city: { contains: user.city, mode: 'insensitive' },
          state: { contains: user.state, mode: 'insensitive' }
        }
      }
    });

    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades de amigos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exportar funções para uso em outros módulos
module.exports = router;

// Exportar função createActivity para uso em outros módulos
module.exports.createActivity = createActivity; 