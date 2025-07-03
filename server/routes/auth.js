const express = require('express');
const { authenticateToken } = require('../middleware/auth.js');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const NotificationService = require('../services/notificationService.js');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { validateEmail } = require('../utils/emailValidation');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter informações do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.success({ user: req.user });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               school:
 *                 type: string
 *                 description: Escola do usuário
 *               grade:
 *                 type: string
 *                 description: Série do usuário
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, school, grade } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        school: school || undefined,
        grade: grade || undefined
      },
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
        updatedAt: true
      }
    });

    res.success({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.fail('Erro interno do servidor', 500);
  }
});

// Cadastro de usuário com confirmação de e-mail
router.post('/register', [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Verificar se já existe usuário
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    // Validar domínio do e-mail
    try {
      const validDomain = await validateEmail(email);
      if (!validDomain) {
        return res.status(400).json({ error: 'Domínio de e-mail inválido ou inexistente.' });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    // Gerar token de confirmação
    const emailConfirmationToken = crypto.randomBytes(32).toString('hex');
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailConfirmed: false,
        emailConfirmationToken
      }
    });
    // Associar conquistas do catálogo ao novo usuário
    const catalog = await prisma.achievementCatalog.findMany();
    await Promise.all(
      catalog.map(c =>
        prisma.achievement.create({
          data: {
            userId: user.id,
            title: c.title,
            description: c.description,
            points: c.points,
            icon: c.icon,
            badgeType: c.badgeType,
          }
        })
      )
    );
    // Enviar e-mail de confirmação
    const confirmUrl = `${process.env.FRONTEND_URL}/confirmar-email?token=${emailConfirmationToken}`;
    await NotificationService.sendEmail(
      email,
      'Confirme seu e-mail - Descarte Certo',
      `<h2>Bem-vindo ao Descarte Certo!</h2><p>Olá, ${name}!</p><p>Para ativar sua conta, confirme seu e-mail clicando no link abaixo:</p><a href="${confirmUrl}">Confirmar e-mail</a><p>Se não foi você, ignore este e-mail.</p>`,
      `Bem-vindo ao Descarte Certo! Para ativar sua conta, acesse: ${confirmUrl}`,
      null // Não salvar no banco para emails de confirmação
    );
    res.status(201).json({ message: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Confirmação de e-mail
router.get('/confirm-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Token ausente.' });
    }
    const user = await prisma.user.findFirst({ where: { emailConfirmationToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Token inválido.' });
    }
    if (user.emailConfirmed) {
      return res.status(400).json({ error: 'E-mail já confirmado.' });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailConfirmed: true, emailConfirmationToken: null }
    });
    res.json({ message: 'E-mail confirmado com sucesso! Agora você pode acessar sua conta.' });
  } catch (error) {
    console.error('Erro ao confirmar e-mail:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login com geração de token JWT
router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Usuário ou senha inválidos.' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Usuário ou senha inválidos.' });
    }
    
    if (!user.emailConfirmed) {
      return res.status(403).json({ error: 'Confirme seu e-mail antes de acessar.' });
    }
    
    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '7d' }
    );
    
    // Retornar dados do usuário sem a senha
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      school: user.school,
      grade: user.grade,
      points: user.points,
      level: user.level,
      experience: user.experience,
      city: user.city,
      state: user.state,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json({ 
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificação de token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // Se chegou até aqui, o token é válido
    res.json({ 
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ 
      success: false,
      error: 'Token inválido' 
    });
  }
});

module.exports = router; 