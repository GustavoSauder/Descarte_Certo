const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const NotificationService = require('../services/notificationService.js');

const router = express.Router();
const prisma = new PrismaClient();

// Configurar transporter de email
let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    console.warn('Email não configurado corretamente. Variáveis EMAIL_USER e EMAIL_PASS ausentes.');
  }
} catch (e) {
  console.warn('Nodemailer não inicializado: erro de configuração.');
}

// Enviar formulário de contato
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Assunto deve ter pelo menos 5 caracteres'),
  body('phone').optional().trim(),
  body('school').optional().trim(),
  body('message').trim().isLength({ min: 10 }).withMessage('Mensagem deve ter pelo menos 10 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, phone, school, message } = req.body;

    // Salvar contato no banco
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        phone,
        school,
        message
      }
    });

    // Enviar email de confirmação
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Contato Recebido - Descarte Certo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">🌱 Obrigado pelo seu contato!</h2>
          <p>Olá <strong>${name}</strong>,</p>
          <p>Recebemos sua mensagem e agradecemos seu interesse no projeto <strong>Descarte Certo</strong>.</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Sua mensagem:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${message}
          </div>
          <p>Nossa equipe entrará em contato em breve para responder suas dúvidas.</p>
          <p>Enquanto isso, que tal conhecer mais sobre nosso projeto?</p>
          <ul>
            <li>📱 <a href="${process.env.FRONTEND_URL}/app">Conheça nosso App</a></li>
            <li>📚 <a href="${process.env.FRONTEND_URL}/kit">Kit Educacional</a></li>
            <li>📊 <a href="${process.env.FRONTEND_URL}/impacto">Veja nosso Impacto</a></li>
          </ul>
          <p>Atenciosamente,<br>Equipe Descarte Certo</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Este é um email automático. Por favor, não responda a este email.
          </p>
        </div>
      `
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Serviço de e-mail não configurado. Contate o administrador.' });
    }
    await NotificationService.sendEmail(
      email,
      'Contato Recebido - Descarte Certo',
      mailOptions.html,
      'Recebemos sua mensagem.'
    );

    // Enviar notificação para administradores
    const adminNotification = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'Novo Contato - Descarte Certo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D32F2F;">📧 Novo Contato Recebido</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
          ${school ? `<p><strong>Escola:</strong> ${school}</p>` : ''}
          <p><strong>Mensagem:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${message}
          </div>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      `
    };

    await NotificationService.sendEmail(
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      'Novo Contato - Descarte Certo',
      adminNotification.html,
      'Novo contato recebido.'
    );

    res.status(201).json({
      message: 'Mensagem enviada com sucesso! Em breve entraremos em contato.',
      contactId: contact.id
    });

  } catch (error) {
    console.error('Erro ao enviar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter todos os contatos (apenas admin)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let where = {};
    if (status) {
      where.status = status;
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.contact.count({ where });

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter contato por ID (apenas admin)
router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    res.json({ contact });

  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do contato (apenas admin)
router.patch('/:id/status', authenticateToken, requireRole('admin'), [
  body('status').isIn(['PENDING', 'RESPONDED', 'CLOSED']).withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const contact = await prisma.contact.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Status atualizado com sucesso',
      contact
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Responder contato (apenas admin)
router.post('/:id/respond', authenticateToken, requireRole('admin'), [
  body('response').trim().isLength({ min: 10 }).withMessage('Resposta deve ter pelo menos 10 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { response } = req.body;

    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    // Enviar resposta por email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: 'Resposta - Descarte Certo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">🌱 Resposta - Descarte Certo</h2>
          <p>Olá <strong>${contact.name}</strong>,</p>
          <p>Obrigado por entrar em contato conosco. Aqui está nossa resposta:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${response}
          </div>
          <p>Se você tiver mais dúvidas, não hesite em nos contatar novamente.</p>
          <p>Atenciosamente,<br>Equipe Descarte Certo</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Mensagem original: ${contact.message}
          </p>
        </div>
      `
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Serviço de e-mail não configurado. Contate o administrador.' });
    }
    await NotificationService.sendEmail(
      contact.email,
      'Resposta - Descarte Certo',
      mailOptions.html,
      'Recebemos sua resposta.'
    );

    // Atualizar status do contato
    await prisma.contact.update({
      where: { id },
      data: { status: 'RESPONDED' }
    });

    res.json({
      message: 'Resposta enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao responder contato:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de contatos
router.get('/stats/overview', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const totalContacts = await prisma.contact.count();
    const pendingContacts = await prisma.contact.count({
      where: { status: 'PENDING' }
    });
    const respondedContacts = await prisma.contact.count({
      where: { status: 'RESPONDED' }
    });
    const closedContacts = await prisma.contact.count({
      where: { status: 'CLOSED' }
    });

    // Contatos por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyContacts = await prisma.contact.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      }
    });

    res.json({
      totalContacts,
      pendingContacts,
      respondedContacts,
      closedContacts,
      monthlyContacts
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 