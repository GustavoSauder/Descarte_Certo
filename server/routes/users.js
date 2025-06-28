const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        grade: true,
        points: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            disposals: true,
            achievements: true,
            rewards: true,
            stories: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar perfil
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('school').optional().trim(),
  body('grade').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, school, grade } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(school && { school }),
        ...(grade && { grade })
      },
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        grade: true,
        points: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter histórico de descartes
router.get('/disposals', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const disposals = await prisma.disposal.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: {
            name: true,
            school: true
          }
        }
      }
    });

    const total = await prisma.disposal.count({
      where: { userId: req.user.userId }
    });

    res.json({
      disposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar descartes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter conquistas
router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: req.user.userId },
      orderBy: { unlockedAt: 'desc' }
    });

    res.json({ achievements });

  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter recompensas
router.get('/rewards', authenticateToken, async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { userId: req.user.userId },
      orderBy: { claimedAt: 'desc' }
    });

    res.json({ rewards });

  } catch (error) {
    console.error('Erro ao buscar recompensas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter ranking de usuários
router.get('/ranking', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const ranking = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        school: true,
        points: true,
        _count: {
          select: {
            disposals: true
          }
        }
      },
      orderBy: { points: 'desc' },
      take: parseInt(limit)
    });

    res.json({ ranking });

  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter ranking por escola
router.get('/ranking/schools', async (req, res) => {
  try {
    const schools = await prisma.user.groupBy({
      by: ['school'],
      where: {
        school: { not: null }
      },
      _sum: {
        points: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          points: 'desc'
        }
      }
    });

    const ranking = schools.map(school => ({
      school: school.school,
      totalPoints: school._sum.points || 0,
      totalUsers: school._count.id
    }));

    res.json({ ranking });

  } catch (error) {
    console.error('Erro ao buscar ranking de escolas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 