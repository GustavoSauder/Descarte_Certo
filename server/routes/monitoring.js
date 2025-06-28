const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const MonitoringService = require('../services/monitoringService');

const router = express.Router();

/**
 * @swagger
 * /monitoring/health:
 *   get:
 *     summary: Verificar saúde do sistema
 *     tags: [Monitoramento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório de saúde do sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/health', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const healthReport = await MonitoringService.getHealthReport();
    res.success(healthReport);
  } catch (error) {
    console.error('Erro ao gerar relatório de saúde:', error);
    res.fail('Erro ao gerar relatório de saúde', 500);
  }
});

/**
 * @swagger
 * /monitoring/metrics:
 *   get:
 *     summary: Obter métricas do sistema
 *     tags: [Monitoramento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas do sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/metrics', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const [systemMetrics, appMetrics] = await Promise.all([
      MonitoringService.getSystemMetrics(),
      MonitoringService.getApplicationMetrics()
    ]);

    res.success({
      system: systemMetrics,
      application: appMetrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erro ao obter métricas:', error);
    res.fail('Erro ao obter métricas', 500);
  }
});

/**
 * @swagger
 * /monitoring/activity-logs:
 *   get:
 *     summary: Buscar logs de atividade
 *     tags: [Monitoramento]
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
 *           default: 50
 *         description: Itens por página
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrar por usuário
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filtrar por ação
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim
 *     responses:
 *       200:
 *         description: Logs de atividade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/activity-logs', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, action, startDate, endDate } = req.query;
    
    const filters = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const result = await MonitoringService.getActivityLogs(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.success(result);
  } catch (error) {
    console.error('Erro ao buscar logs de atividade:', error);
    res.fail('Erro ao buscar logs de atividade', 500);
  }
});

/**
 * @swagger
 * /monitoring/error-logs:
 *   get:
 *     summary: Buscar logs de erro
 *     tags: [Monitoramento]
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
 *           default: 50
 *         description: Itens por página
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *         description: Filtrar por mensagem
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim
 *     responses:
 *       200:
 *         description: Logs de erro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/error-logs', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 50, message, startDate, endDate } = req.query;
    
    const filters = {};
    if (message) filters.message = message;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const result = await MonitoringService.getErrorLogs(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.success(result);
  } catch (error) {
    console.error('Erro ao buscar logs de erro:', error);
    res.fail('Erro ao buscar logs de erro', 500);
  }
});

/**
 * @swagger
 * /monitoring/performance:
 *   get:
 *     summary: Buscar métricas de performance
 *     tags: [Monitoramento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim
 *       - in: query
 *         name: endpoint
 *         schema:
 *           type: string
 *         description: Filtrar por endpoint
 *     responses:
 *       200:
 *         description: Métricas de performance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/performance', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { startDate, endDate, endpoint } = req.query;

    if (!startDate || !endDate) {
      return res.fail('Data de início e fim são obrigatórias', 400);
    }

    const metrics = await MonitoringService.getPerformanceMetrics(
      startDate,
      endDate,
      endpoint
    );

    res.success(metrics);
  } catch (error) {
    console.error('Erro ao buscar métricas de performance:', error);
    res.fail('Erro ao buscar métricas de performance', 500);
  }
});

/**
 * @swagger
 * /monitoring/cleanup-logs:
 *   post:
 *     summary: Limpar logs antigos
 *     tags: [Monitoramento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               daysToKeep:
 *                 type: integer
 *                 default: 30
 *                 description: Número de dias para manter os logs
 *     responses:
 *       200:
 *         description: Logs limpos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/cleanup-logs', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { daysToKeep = 30 } = req.body;
    
    const result = await MonitoringService.cleanupOldLogs(daysToKeep);
    
    res.success({
      message: 'Logs antigos limpos com sucesso',
      deleted: result
    });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    res.fail('Erro ao limpar logs', 500);
  }
});

module.exports = router; 