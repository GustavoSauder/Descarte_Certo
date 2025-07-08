const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotificationService = require('../services/notificationService');

// POST /api/feedback - Criar novo feedback
router.post('/', async (req, res) => {
  try {
    const { userId, userEmail, rating, satisfaction, comment, timestamp } = req.body;

    // Validar dados obrigatórios
    if (!rating || !satisfaction) {
      return res.status(400).json({
        success: false,
        message: 'Rating e satisfaction são obrigatórios'
      });
    }

    // Salvar feedback no banco de dados
    const feedback = await prisma.feedback.create({
      data: {
        userId: userId || null,
        userEmail: userEmail || 'anonymous@example.com',
        rating: parseInt(rating),
        satisfaction,
        comment: comment || '',
        createdAt: timestamp ? new Date(timestamp) : new Date()
      }
    });

    let ganhouPontos = false;
    // Se o feedback for de um usuário cadastrado, verificar se é o primeiro
    if (userId) {
      const feedbackCount = await prisma.feedback.count({ where: { userId } });
      if (feedbackCount === 1) {
        // Primeiro feedback: dar 50 pontos
        await prisma.user.update({
          where: { id: userId },
          data: { points: { increment: 50 } }
        });
        ganhouPontos = true;
      }
    }

    // Enviar e-mail de agradecimento
    if (userEmail) {
      let mensagem = `<p>Olá!</p><p>Recebemos seu feedback e agradecemos muito por sua participação.</p>`;
      if (ganhouPontos) {
        mensagem += `<p><strong>Parabéns! Você ganhou 50 pontos por enviar seu primeiro feedback.</strong></p>`;
      }
      mensagem += `<p>Continue contribuindo para melhorarmos juntos!</p><p>Equipe Descarte Certo</p>`;
      await NotificationService.sendEmail(
        userEmail,
        'Agradecemos seu feedback! 💚',
        NotificationService.generateEmailHTML('Agradecemos seu feedback! 💚', mensagem),
        'Recebemos seu feedback e agradecemos muito por sua participação.' + (ganhouPontos ? ' Parabéns! Você ganhou 50 pontos por enviar seu primeiro feedback.' : '') + '\nEquipe Descarte Certo',
        userId
      );
    }

    res.status(201).json({
      success: true,
      message: 'Feedback enviado com sucesso',
      data: feedback
    });

  } catch (error) {
    console.error('Erro ao criar feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/feedback - Listar todos os feedbacks (admin)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: feedbacks
    });

  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/feedback/stats - Estatísticas de feedback
router.get('/stats', async (req, res) => {
  try {
    const totalFeedbacks = await prisma.feedback.count();
    
    // Calcular média de rating
    const avgRating = await prisma.feedback.aggregate({
      _avg: {
        rating: true
      }
    });

    // Distribuição de satisfação
    const satisfactionDistribution = await prisma.feedback.groupBy({
      by: ['satisfaction'],
      _count: {
        satisfaction: true
      }
    });

    // Calcular porcentagem de satisfação
    let satisfactionRate = 0;
    if (totalFeedbacks > 0) {
      const totalSatisfaction = await prisma.feedback.aggregate({
        _avg: {
          rating: true
        }
      });

      const avgRatingValue = totalSatisfaction._avg.rating || 0;
      satisfactionRate = Math.round((avgRatingValue / 5) * 100);
    }

    res.json({
      success: true,
      data: {
        totalFeedbacks,
        avgRating: avgRating._avg.rating || 0,
        satisfactionRate,
        satisfactionDistribution
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// DELETE /api/feedback/:id - Deletar feedback (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.feedback.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: 'Feedback deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router; 