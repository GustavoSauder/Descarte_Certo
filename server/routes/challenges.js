const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createNotification } = require('./notifications');

const router = express.Router();
const prisma = new PrismaClient();

// Buscar todos os desafios ativos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { active: true },
      include: {
        participants: {
          where: { userId: req.user.id },
          select: { progress: true, completed: true, completedAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(challenges);
  } catch (error) {
    console.error('Erro ao buscar desafios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar desafios do usuário
router.get('/my-challenges', authenticateToken, async (req, res) => {
  try {
    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId: req.user.id },
      include: {
        challenge: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(userChallenges);
  } catch (error) {
    console.error('Erro ao buscar desafios do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Participar de um desafio
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o desafio existe e está ativo
    const challenge = await prisma.challenge.findUnique({
      where: { id, active: true }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Desafio não encontrado' });
    }

    // Verificar se já participa
    const existingParticipation = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: req.user.id,
          challengeId: id
        }
      }
    });

    if (existingParticipation) {
      return res.status(400).json({ error: 'Você já participa deste desafio' });
    }

    // Criar participação
    const userChallenge = await prisma.userChallenge.create({
      data: {
        userId: req.user.id,
        challengeId: id
      },
      include: {
        challenge: true
      }
    });

    // Criar notificação
    await createNotification(
      req.user.id,
      'Novo Desafio Aceito!',
      `Você começou o desafio "${challenge.title}". Boa sorte!`,
      'CHALLENGE',
      { challengeId: id }
    );

    res.json(userChallenge);
  } catch (error) {
    console.error('Erro ao participar do desafio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar progresso do desafio
router.patch('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (typeof progress !== 'number' || progress < 0) {
      return res.status(400).json({ error: 'Progresso inválido' });
    }

    const userChallenge = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: req.user.id,
          challengeId: id
        }
      },
      include: {
        challenge: true
      }
    });

    if (!userChallenge) {
      return res.status(404).json({ error: 'Participação não encontrada' });
    }

    const challenge = userChallenge.challenge;
    const isCompleted = progress >= challenge.target && !userChallenge.completed;

    // Atualizar progresso
    const updatedUserChallenge = await prisma.userChallenge.update({
      where: {
        userId_challengeId: {
          userId: req.user.id,
          challengeId: id
        }
      },
      data: {
        progress,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null
      },
      include: {
        challenge: true
      }
    });

    // Se completou o desafio
    if (isCompleted) {
      // Adicionar pontos ao usuário
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          points: { increment: challenge.points },
          experience: { increment: challenge.points * 10 }
        }
      });

      // Criar notificação
      await createNotification(
        req.user.id,
        '🎉 Desafio Concluído!',
        `Parabéns! Você completou "${challenge.title}" e ganhou ${challenge.points} pontos!`,
        'CHALLENGE',
        { challengeId: id, points: challenge.points }
      );

      // Verificar se subiu de nível
      await checkLevelUp(req.user.id);
    }

    res.json(updatedUserChallenge);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar se usuário subiu de nível
async function checkLevelUp(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true, name: true }
    });

    const newLevel = Math.floor(user.experience / 1000) + 1;
    
    if (newLevel > user.level) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel }
      });

      await createNotification(
        userId,
        '🌟 Novo Nível!',
        `Parabéns! Você alcançou o nível ${newLevel}! Continue assim!`,
        'ACHIEVEMENT',
        { level: newLevel }
      );
    }
  } catch (error) {
    console.error('Erro ao verificar level up:', error);
  }
}

// Criar novo desafio (admin)
router.post('/', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { title, description, type, target, points, startDate, endDate } = req.body;

    if (!title || !description || !type || !target || !points || !startDate || !endDate) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        type,
        target: parseInt(target),
        points: parseInt(points),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error('Erro ao criar desafio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar desafio (admin)
router.put('/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, target, points, startDate, endDate, active } = req.body;

    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        title,
        description,
        type,
        target: target ? parseInt(target) : undefined,
        points: points ? parseInt(points) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        active
      }
    });

    res.json(challenge);
  } catch (error) {
    console.error('Erro ao atualizar desafio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar desafio (admin)
router.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.challenge.delete({
      where: { id }
    });

    res.json({ message: 'Desafio deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar desafio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Ranking de desafios
router.get('/:id/ranking', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const ranking = await prisma.userChallenge.findMany({
      where: { challengeId: id },
      include: {
        user: {
          select: { name: true, avatar: true, city: true, state: true }
        }
      },
      orderBy: [
        { completed: 'desc' },
        { progress: 'desc' },
        { completedAt: 'asc' }
      ],
      take: 50
    });

    res.json(ranking);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de desafios
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await prisma.userChallenge.aggregate({
      where: { userId: req.user.id },
      _count: { id: true },
      _sum: { progress: true }
    });

    const completedChallenges = await prisma.userChallenge.count({
      where: { 
        userId: req.user.id,
        completed: true 
      }
    });

    const totalPoints = await prisma.userChallenge.aggregate({
      where: { 
        userId: req.user.id,
        completed: true 
      },
      _sum: {
        challenge: {
          select: { points: true }
        }
      }
    });

    res.json({
      totalChallenges: stats._count.id,
      totalProgress: stats._sum.progress || 0,
      completedChallenges,
      totalPoints: totalPoints._sum.challenge?.points || 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 