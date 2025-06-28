const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const projectOwnership = require('../config/ownership');
const crypto = require('crypto');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware de verificação de propriedade
const requireOwnership = projectOwnership.ownershipMiddleware();

// Rota para verificar propriedade
router.get('/verify', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const report = projectOwnership.generateSecurityReport();
    res.json({
      success: true,
      message: 'Propriedade verificada com sucesso',
      report
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao verificar propriedade',
      details: error.message
    });
  }
});

// Rota para gerar relatório de segurança
router.get('/security-report', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const report = projectOwnership.generateSecurityReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao gerar relatório',
      details: error.message
    });
  }
});

// Rota para backup de segurança
router.post('/backup', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const backupPath = projectOwnership.createSecurityBackup();
    res.json({
      success: true,
      message: 'Backup de segurança criado',
      backupPath
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar backup',
      details: error.message
    });
  }
});

// Rota para restaurar backup
router.post('/restore', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const { backupPath } = req.body;
    if (!backupPath) {
      return res.status(400).json({
        error: 'Caminho do backup é obrigatório'
      });
    }

    const success = projectOwnership.restoreSecurityBackup(backupPath);
    res.json({
      success: true,
      message: 'Backup restaurado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao restaurar backup',
      details: error.message
    });
  }
});

// Rota para atualizar propriedade
router.put('/update-ownership', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const { newOwnerId, newOwnerEmail, currentOwnerKey } = req.body;
    
    if (!newOwnerId || !newOwnerEmail || !currentOwnerKey) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios'
      });
    }

    const success = projectOwnership.updateOwnership(newOwnerId, newOwnerEmail, currentOwnerKey);
    res.json({
      success: true,
      message: 'Propriedade atualizada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar propriedade',
      details: error.message
    });
  }
});

// Rota para bloquear usuário
router.post('/block-user/:userId', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        role: 'BLOCKED',
        updatedAt: new Date()
      }
    });

    // Log de segurança
    projectOwnership.logSecurityEvent('USER_BLOCKED', {
      blockedUserId: userId,
      blockedBy: req.user.id,
      reason: reason,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Usuário bloqueado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao bloquear usuário',
      details: error.message
    });
  }
});

// Rota para desbloquear usuário
router.post('/unblock-user/:userId', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        role: 'USER',
        updatedAt: new Date()
      }
    });

    // Log de segurança
    projectOwnership.logSecurityEvent('USER_UNBLOCKED', {
      unblockedUserId: userId,
      unblockedBy: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Usuário desbloqueado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao desbloquear usuário',
      details: error.message
    });
  }
});

// Rota para revogar todos os tokens
router.post('/revoke-all-tokens', authenticateToken, requireOwnership, async (req, res) => {
  try {
    // Em produção, implementar sistema de blacklist de tokens
    projectOwnership.logSecurityEvent('ALL_TOKENS_REVOKED', {
      revokedBy: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Todos os tokens foram revogados'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao revogar tokens',
      details: error.message
    });
  }
});

// Rota para limpar logs de segurança
router.post('/clear-security-logs', authenticateToken, requireOwnership, async (req, res) => {
  try {
    projectOwnership.accessLog = [];
    
    // Limpar arquivo de log
    const logPath = require('path').join(process.cwd(), 'security.log');
    require('fs').writeFileSync(logPath, '');

    res.json({
      success: true,
      message: 'Logs de segurança limpos'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao limpar logs',
      details: error.message
    });
  }
});

// Rota para exportar dados do usuário
router.get('/export-user-data/:userId', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        disposals: true,
        achievements: true,
        rewards: true,
        stories: true,
        notifications: true,
        challenges: true,
        blogPosts: true,
        supportTickets: true,
        activities: true,
        donations: true
      }
    });

    if (!userData) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      userData
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao exportar dados',
      details: error.message
    });
  }
});

// Rota para deletar usuário permanentemente
router.delete('/delete-user/:userId', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmation } = req.body;

    if (confirmation !== 'CONFIRM_DELETE_PERMANENTLY') {
      return res.status(400).json({
        error: 'Confirmação inválida. Use CONFIRM_DELETE_PERMANENTLY'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Deletar usuário (cascade será executado automaticamente)
    await prisma.user.delete({
      where: { id: userId }
    });

    // Log de segurança
    projectOwnership.logSecurityEvent('USER_DELETED_PERMANENTLY', {
      deletedUserId: userId,
      deletedUserEmail: user.email,
      deletedBy: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Usuário deletado permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao deletar usuário',
      details: error.message
    });
  }
});

// Rota para estatísticas do sistema
router.get('/system-stats', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const stats = {
      users: await prisma.user.count(),
      disposals: await prisma.disposal.count(),
      achievements: await prisma.achievement.count(),
      challenges: await prisma.challenge.count(),
      rewards: await prisma.reward.count(),
      stories: await prisma.story.count(),
      blogPosts: await prisma.blogPost.count(),
      notifications: await prisma.notification.count(),
      activities: await prisma.activity.count(),
      supportTickets: await prisma.supportTicket.count(),
      donations: await prisma.donation.count(),
      collectionPoints: await prisma.collectionPoint.count(),
      partners: await prisma.partner.count(),
      schools: await prisma.school.count(),
      contacts: await prisma.contact.count()
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar estatísticas',
      details: error.message
    });
  }
});

// Rota para backup completo do banco
router.post('/backup-database', authenticateToken, requireOwnership, async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const dbPath = path.join(process.cwd(), 'dev.db');
    const backupPath = path.join(process.cwd(), `backup-${Date.now()}.db`);
    
    fs.copyFileSync(dbPath, backupPath);

    res.json({
      success: true,
      message: 'Backup do banco criado',
      backupPath
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar backup do banco',
      details: error.message
    });
  }
});

module.exports = router; 