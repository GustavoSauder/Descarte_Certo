const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Obter estatísticas gerais da plataforma
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Token inválido ou expirado
 *       403:
 *         description: Acesso negado - apenas admins
 */
router.get('/stats', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const [
      totalUsers,
      totalDisposals,
      totalPoints,
      onlineUsers,
      schools,
      cities,
      totalWeight
    ] = await Promise.all([
      prisma.user.count(),
      prisma.disposal.count(),
      prisma.user.aggregate({ _sum: { points: true } }),
      prisma.user.count({ where: { lastOnline: { gte: twoMinutesAgo } } }),
      prisma.user.findMany({ distinct: ['school'], where: { school: { not: null } }, select: { school: true } }),
      prisma.user.findMany({ distinct: ['city'], where: { city: { not: null } }, select: { city: true } }),
      prisma.disposal.aggregate({ _sum: { weight: true } })
    ]);

    res.success({
      totalUsers,
      totalDisposals,
      totalPoints: totalPoints._sum.points || 0,
      onlineUsers,
      schoolsCount: schools.length,
      citiesCount: cities.length,
      totalWeight: totalWeight._sum.weight || 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/users', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          school: true,
          grade: true,
          points: true,
          level: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              disposals: true,
              achievements: true,
              rewards: true
            }
          }
        }
      }),
      prisma.user.count()
    ]);

    res.success({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /admin/users/{id}/ban:
 *   patch:
 *     summary: Banir usuário
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário banido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/users/:id/ban', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.fail('Usuário não encontrado', 404);
    }

    if (user.role === 'ADMIN') {
      return res.fail('Não é possível banir um administrador', 403);
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role: 'BANNED' }
    });

    res.success({ message: 'Usuário banido com sucesso' });
  } catch (error) {
    console.error('Erro ao banir usuário:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /admin/users/{id}/promote:
 *   patch:
 *     summary: Promover usuário para admin
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário promovido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/users/:id/promote', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.fail('Usuário não encontrado', 404);
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role: 'ADMIN' }
    });

    res.success({ message: 'Usuário promovido para administrador com sucesso' });
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/users/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.fail('Usuário não encontrado', 404);
    }

    if (user.role === 'ADMIN') {
      return res.fail('Não é possível deletar um administrador', 403);
    }

    // Deletar dados relacionados
    await prisma.$transaction([
      prisma.disposal.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.achievement.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.reward.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.story.deleteMany({ where: { userId: parseInt(id) } }),
      prisma.user.delete({ where: { id: parseInt(id) } })
    ]);

    res.success({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

// CRUD de dados de reciclagem (ImpactData)
router.get('/impact', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const impact = await prisma.impactData.findMany();
    res.success({ impact });
  } catch (error) {
    res.fail('Erro ao buscar dados de impacto', 500);
  }
});

router.put('/impact/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const impact = await prisma.impactData.update({ where: { id }, data: update });
    res.success({ impact });
  } catch (error) {
    res.fail('Erro ao atualizar dados de impacto', 500);
  }
});

// CRUD de histórias
router.get('/stories', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const stories = await prisma.story.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.success({ stories });
  } catch (error) {
    res.fail('Erro ao buscar histórias', 500);
  }
});

router.delete('/stories/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.story.delete({ where: { id } });
    res.success({ message: 'História deletada' });
  } catch (error) {
    res.fail('Erro ao deletar história', 500);
  }
});

// CRUD de recompensas
router.get('/rewards', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany({ 
      orderBy: { claimedAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.success({ rewards });
  } catch (error) {
    res.fail('Erro ao buscar recompensas', 500);
  }
});

router.post('/rewards', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const reward = await prisma.reward.create({ data: req.body });
    res.success({ reward });
  } catch (error) {
    res.fail('Erro ao criar recompensa', 500);
  }
});

router.delete('/rewards/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.reward.delete({ where: { id } });
    res.success({ message: 'Recompensa deletada' });
  } catch (error) {
    res.fail('Erro ao deletar recompensa', 500);
  }
});

module.exports = router; 