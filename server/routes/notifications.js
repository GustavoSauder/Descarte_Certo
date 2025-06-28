const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');

const router = express.Router();
const prisma = new PrismaClient();

// Notificações push desabilitadas - usando apenas Supabase
console.log('Notificações push desabilitadas - usando apenas Supabase');

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Buscar notificações do usuário
 *     tags: [Notificações]
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
 *         description: Notificações obtidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await NotificationService.getUserNotifications(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );

    res.success(result);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Contar notificações não lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);
    res.success({ count });
  } catch (error) {
    console.error('Erro ao contar notificações não lidas:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marcar notificação como lida
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *       404:
 *         description: Notificação não encontrada
 */
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.markAsRead(
      parseInt(id),
      req.user.id
    );

    res.success({ notification });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /notifications/mark-all-read:
 *   patch:
 *     summary: Marcar todas as notificações como lidas
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas as notificações marcadas como lidas
 */
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user.id);
    res.success({ 
      message: 'Todas as notificações foram marcadas como lidas',
      updatedCount: result.count 
    });
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Deletar notificação
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação deletada com sucesso
 *       404:
 *         description: Notificação não encontrada
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationService.deleteNotification(
      parseInt(id),
      req.user.id
    );

    res.success({ message: 'Notificação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /notifications/settings:
 *   get:
 *     summary: Obter configurações de notificação do usuário
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações obtidas com sucesso
 */
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    // Buscar configurações do usuário (implementar conforme necessário)
    const settings = {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReminders: true,
      achievementNotifications: true,
      rankingNotifications: true,
      rewardNotifications: true
    };

    res.success({ settings });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /notifications/settings:
 *   put:
 *     summary: Atualizar configurações de notificação
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               weeklyReminders:
 *                 type: boolean
 *               achievementNotifications:
 *                 type: boolean
 *               rankingNotifications:
 *                 type: boolean
 *               rewardNotifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso
 */
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const {
      emailNotifications,
      pushNotifications,
      weeklyReminders,
      achievementNotifications,
      rankingNotifications,
      rewardNotifications
    } = req.body;

    // Atualizar configurações do usuário (implementar conforme necessário)
    const settings = {
      emailNotifications: emailNotifications ?? true,
      pushNotifications: pushNotifications ?? true,
      weeklyReminders: weeklyReminders ?? true,
      achievementNotifications: achievementNotifications ?? true,
      rankingNotifications: rankingNotifications ?? true,
      rewardNotifications: rewardNotifications ?? true
    };

    res.success({ 
      message: 'Configurações atualizadas com sucesso',
      settings 
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

module.exports = router; 