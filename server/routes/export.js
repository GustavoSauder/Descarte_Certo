const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const ExportService = require('../services/exportService');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /export/user-report/{userId}:
 *   get:
 *     summary: Exportar relatório de usuário em PDF
 *     tags: [Exportação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/user-report/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Verificar se o usuário pode acessar este relatório
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(userId)) {
      return res.fail('Acesso negado', 403);
    }

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    const filepath = await ExportService.exportUserReportPDF(
      parseInt(userId),
      start,
      end
    );

    res.download(filepath, `relatorio-usuario-${userId}.pdf`, (err) => {
      // Deletar arquivo após download
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.fail('Erro ao gerar relatório', 500);
  }
});

/**
 * @swagger
 * /export/admin-report:
 *   get:
 *     summary: Exportar relatório administrativo em Excel
 *     tags: [Exportação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Excel gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/admin-report', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    const filepath = await ExportService.exportAdminReportExcel(start, end);

    res.download(filepath, `relatorio-admin-${start}-${end}.xlsx`, (err) => {
      // Deletar arquivo após download
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

  } catch (error) {
    console.error('Erro ao gerar relatório Excel:', error);
    res.fail('Erro ao gerar relatório', 500);
  }
});

/**
 * @swagger
 * /export/disposals-csv:
 *   get:
 *     summary: Exportar descartas em CSV
 *     tags: [Exportação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrar por usuário específico
 *     responses:
 *       200:
 *         description: CSV gerado com sucesso
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/disposals-csv', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    // Verificar permissões
    if (req.user.role !== 'ADMIN' && userId && req.user.id !== parseInt(userId)) {
      return res.fail('Acesso negado', 403);
    }

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    // Buscar dados
    const where = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(end)
      }
    };

    if (userId && req.user.role !== 'ADMIN') {
      where.userId = parseInt(userId);
    }

    const disposals = await prisma.disposal.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            school: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Formatar dados para CSV
    const csvData = disposals.map(disposal => ({
      id: disposal.id,
      usuario: disposal.user.name,
      email: disposal.user.email,
      escola: disposal.user.school || 'Não informado',
      material: disposal.materialType,
      peso: disposal.weight,
      pontos: disposal.points,
      localizacao: disposal.location || 'Não informado',
      data: new Date(disposal.createdAt).toLocaleDateString('pt-BR')
    }));

    const filename = `descartas-${start}-${end}.csv`;
    const filepath = await ExportService.exportDataCSV(csvData, filename);

    res.download(filepath, filename, (err) => {
      // Deletar arquivo após download
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

  } catch (error) {
    console.error('Erro ao gerar CSV:', error);
    res.fail('Erro ao gerar CSV', 500);
  }
});

/**
 * @swagger
 * /export/users-csv:
 *   get:
 *     summary: Exportar usuários em CSV
 *     tags: [Exportação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV gerado com sucesso
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/users-csv', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        grade: true,
        points: true,
        level: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            disposals: true,
            achievements: true,
            rewards: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Formatar dados para CSV
    const csvData = users.map(user => ({
      id: user.id,
      nome: user.name,
      email: user.email,
      escola: user.school || 'Não informado',
      serie: user.grade || 'Não informado',
      pontos: user.points,
      nivel: user.level,
      role: user.role,
      descartes: user._count.disposals,
      conquistas: user._count.achievements,
      recompensas: user._count.rewards,
      data_cadastro: new Date(user.createdAt).toLocaleDateString('pt-BR')
    }));

    const filename = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
    const filepath = await ExportService.exportDataCSV(csvData, filename);

    res.download(filepath, filename, (err) => {
      // Deletar arquivo após download
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

  } catch (error) {
    console.error('Erro ao gerar CSV:', error);
    res.fail('Erro ao gerar CSV', 500);
  }
});

/**
 * @swagger
 * /export/cleanup:
 *   post:
 *     summary: Limpar arquivos temporários
 *     tags: [Exportação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arquivos limpos com sucesso
 */
router.post('/cleanup', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    await ExportService.cleanupTempFiles();
    res.success({ message: 'Arquivos temporários limpos com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar arquivos:', error);
    res.fail('Erro ao limpar arquivos', 500);
  }
});

module.exports = router; 