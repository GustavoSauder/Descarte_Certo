const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { createNotification } = require('./notifications');

const router = express.Router();
const prisma = new PrismaClient();

// Buscar tickets do usuário
router.get('/my-tickets', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.supportTicket.count({ where });

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar ticket específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Verificar se o usuário pode ver o ticket
    if (ticket.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { subject, message, priority, category } = req.body;

    if (!subject || !message || !category) {
      return res.status(400).json({ error: 'Assunto, mensagem e categoria são obrigatórios' });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user.id,
        subject,
        message,
        priority: priority || 'MEDIUM',
        category
      }
    });

    // Notificar admins sobre novo ticket
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    for (const admin of admins) {
      await createNotification(
        admin.id,
        '🎫 Novo Ticket de Suporte',
        `Novo ticket criado: ${subject}`,
        'SYSTEM',
        { ticketId: ticket.id, category }
      );
    }

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar ticket
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message, priority, category } = req.body;

    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id },
      select: { userId: true, status: true }
    });

    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Apenas o criador pode editar tickets abertos
    if (existingTicket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    if (existingTicket.status !== 'OPEN') {
      return res.status(400).json({ error: 'Não é possível editar tickets fechados' });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        subject,
        message,
        priority,
        category
      }
    });

    res.json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Fechar ticket (usuário)
router.patch('/:id/close', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      select: { userId: true, status: true }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    if (ticket.userId !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: { 
        status: 'CLOSED',
        resolvedAt: new Date()
      }
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error('Erro ao fechar ticket:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Buscar todos os tickets
router.get('/admin/all', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.supportTicket.count({ where });

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Atualizar status do ticket
router.patch('/:id/status', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status,
        assignedTo,
        resolvedAt: status === 'RESOLVED' ? new Date() : null
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Notificar usuário sobre mudança de status
    await createNotification(
      ticket.userId,
      '📋 Status do Ticket Atualizado',
      `Seu ticket "${ticket.subject}" foi ${status.toLowerCase()}.`,
      'SYSTEM',
      { ticketId: id, status }
    );

    res.json(updatedTicket);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Responder ticket
router.post('/:id/reply', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    // Atualizar status para em progresso
    await prisma.supportTicket.update({
      where: { id },
      data: { status: 'IN_PROGRESS' }
    });

    // Notificar usuário sobre resposta
    await createNotification(
      ticket.userId,
      '💬 Resposta ao Seu Ticket',
      `Você recebeu uma resposta para "${ticket.subject}".`,
      'SYSTEM',
      { ticketId: id, message }
    );

    res.json({ message: 'Resposta enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao responder ticket:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de suporte
router.get('/stats/overview', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const totalTickets = await prisma.supportTicket.count();
    const openTickets = await prisma.supportTicket.count({
      where: { status: 'OPEN' }
    });
    const inProgressTickets = await prisma.supportTicket.count({
      where: { status: 'IN_PROGRESS' }
    });
    const resolvedTickets = await prisma.supportTicket.count({
      where: { status: 'RESOLVED' }
    });

    const ticketsByCategory = await prisma.supportTicket.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    const ticketsByPriority = await prisma.supportTicket.groupBy({
      by: ['priority'],
      _count: { id: true }
    });

    const recentTickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    res.json({
      overview: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets
      },
      byCategory: ticketsByCategory,
      byPriority: ticketsByPriority,
      recent: recentTickets
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Categorias de suporte
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'technical', name: 'Problemas Técnicos', icon: '🔧' },
      { id: 'account', name: 'Conta e Login', icon: '👤' },
      { id: 'points', name: 'Sistema de Pontos', icon: '⭐' },
      { id: 'rewards', name: 'Recompensas', icon: '🎁' },
      { id: 'app', name: 'Aplicativo', icon: '📱' },
      { id: 'content', name: 'Conteúdo Educativo', icon: '📚' },
      { id: 'bug', name: 'Bug/Erro', icon: '🐛' },
      { id: 'suggestion', name: 'Sugestão', icon: '💡' },
      { id: 'other', name: 'Outros', icon: '❓' }
    ];

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 