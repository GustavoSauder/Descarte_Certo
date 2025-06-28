const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const NotificationService = require('../services/notificationService.js');

const router = express.Router();
const prisma = new PrismaClient();

// Configuração do Multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Função para processar imagem com Sharp
async function processImage(buffer, filename) {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  const processedFilename = `story_${Date.now()}_${filename}`;
  const filepath = path.join(uploadsDir, processedFilename);

  await sharp(buffer)
    .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(filepath);

  return `/uploads/${processedFilename}`;
}

// Notificações push desabilitadas - usando apenas Supabase
console.log('Notificações push desabilitadas - usando apenas Supabase');

// Criar nova história
router.post('/', authenticateToken, upload.single('image'), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Título deve ter entre 5 e 100 caracteres'),
  body('content').trim().isLength({ min: 20 }).withMessage('Conteúdo deve ter pelo menos 20 caracteres'),
  body('impact').trim().isLength({ min: 10 }).withMessage('Impacto deve ter pelo menos 10 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, impact } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await processImage(req.file.buffer, req.file.originalname);
    }

    const story = await prisma.story.create({
      data: {
        userId: req.user.userId,
        title,
        content,
        impact,
        imageUrl,
        approved: req.user.role === 'ADMIN' // Auto-aprovar se for admin
      },
      include: {
        user: {
          select: {
            name: true,
            school: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'História criada com sucesso! Aguardando aprovação.',
      story
    });

  } catch (error) {
    console.error('Erro ao criar história:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter histórias aprovadas (público)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const stories = await prisma.story.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: {
            name: true,
            school: true
          }
        }
      }
    });

    const total = await prisma.story.count({
      where: { approved: true }
    });

    res.json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter história por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findFirst({
      where: { 
        id,
        approved: true
      },
      include: {
        user: {
          select: {
            name: true,
            school: true
          }
        }
      }
    });

    if (!story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    res.json({ story });

  } catch (error) {
    console.error('Erro ao buscar história:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter histórias do usuário
router.get('/user/my', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const stories = await prisma.story.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: {
            name: true,
            school: true
          }
        }
      }
    });

    const total = await prisma.story.count({
      where: { userId: req.user.userId }
    });

    res.json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórias do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter histórias pendentes (apenas admin)
router.get('/admin/pending', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const stories = await prisma.story.findMany({
      where: { approved: false },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        user: {
          select: {
            name: true,
            email: true,
            school: true
          }
        }
      }
    });

    const total = await prisma.story.count({
      where: { approved: false }
    });

    res.json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórias pendentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Aprovar/rejeitar história (apenas admin)
router.patch('/:id/approve', authenticateToken, requireRole('ADMIN'), [
  body('approved').isBoolean().withMessage('Aprovação deve ser um valor booleano'),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { approved, feedback } = req.body;

    const story = await prisma.story.update({
      where: { id },
      data: { 
        approved,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            school: true
          }
        }
      }
    });

    // Enviar notificação por email se houver feedback
    if (feedback && story.user.email) {
      await NotificationService.sendEmail(
        story.user.email,
        approved ? 'História Aprovada - Descarte Certo' : 'História Revisada - Descarte Certo',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${approved ? '#2E7D32' : '#D32F2F'};">
            ${approved ? '✅ História Aprovada!' : '📝 História Revisada'}
          </h2>
          <p>Olá <strong>${story.user.name}</strong>,</p>
          <p>Sua história "<strong>${story.title}</strong>" foi ${approved ? 'aprovada' : 'revisada'}.</p>
          ${feedback ? `<p><strong>Feedback da equipe:</strong></p><div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">${feedback}</div>` : ''}
          ${approved ? `<p>Sua história agora está visível na seção de impacto social do nosso site!</p><p>Parabéns por compartilhar sua experiência e inspirar outras pessoas!</p>` : `<p>Você pode fazer as alterações sugeridas e enviar novamente.</p>`}
          <p>Atenciosamente,<br>Equipe Descarte Certo</p>
        </div>`,
        feedback
      );
    }

    res.json({
      message: `História ${approved ? 'aprovada' : 'rejeitada'} com sucesso`,
      story
    });

  } catch (error) {
    console.error('Erro ao aprovar história:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar história (apenas o autor ou admin)
router.put('/:id', authenticateToken, upload.single('image'), [
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('content').optional().trim().isLength({ min: 20 }),
  body('impact').optional().trim().isLength({ min: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, impact } = req.body;

    // Verificar se o usuário pode editar a história
    const existingStory = await prisma.story.findUnique({
      where: { id }
    });

    if (!existingStory) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    if (existingStory.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    let imageUrl = existingStory.imageUrl;
    if (req.file) {
      imageUrl = await processImage(req.file.buffer, req.file.originalname);
    }

    const story = await prisma.story.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(impact && { impact }),
        ...(req.file && { imageUrl }),
        approved: false, // Reverter para pendente após edição
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            school: true
          }
        }
      }
    });

    res.json({
      message: 'História atualizada com sucesso! Aguardando nova aprovação.',
      story
    });

  } catch (error) {
    console.error('Erro ao atualizar história:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar história (apenas o autor ou admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ error: 'História não encontrada' });
    }

    if (story.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await prisma.story.delete({
      where: { id }
    });

    res.json({ message: 'História deletada com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar história:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de histórias
router.get('/stats/overview', async (req, res) => {
  try {
    const totalStories = await prisma.story.count();
    const approvedStories = await prisma.story.count({
      where: { approved: true }
    });
    const pendingStories = await prisma.story.count({
      where: { approved: false }
    });

    // Histórias por escola
    const storiesBySchool = await prisma.story.groupBy({
      by: ['user'],
      where: { approved: true },
      _count: {
        id: true
      }
    });

    res.json({
      totalStories,
      approvedStories,
      pendingStories,
      storiesBySchool
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 