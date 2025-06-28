const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { validateEmail } = require('../utils/emailValidation');

const router = express.Router();
const prisma = new PrismaClient();

// Buscar comentários aprovados
router.get('/', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        approved: true
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Criar novo comentário
router.post('/', async (req, res) => {
  try {
    const { name, email, content } = req.body;

    // Validações
    if (!name || !email || !content) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e conteúdo são obrigatórios'
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Nome deve ter pelo menos 2 caracteres'
      });
    }

    if (content.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comentário deve ter pelo menos 10 caracteres'
      });
    }

    // Validar email
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Verificar se o usuário está logado
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Token inválido, mas permite comentário anônimo
      }
    }

    const comment = await prisma.comment.create({
      data: {
        name,
        email,
        content,
        userId,
        approved: false // Comentários precisam ser aprovados
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comentário enviado com sucesso! Aguardando aprovação.',
      data: comment
    });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Aprovar comentário (admin)
router.put('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.update({
      where: { id },
      data: { approved: true }
    });

    res.json({
      success: true,
      message: 'Comentário aprovado com sucesso',
      data: comment
    });
  } catch (error) {
    console.error('Erro ao aprovar comentário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Deletar comentário (admin ou autor)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentário não encontrado'
      });
    }

    // Verificar se é admin ou autor do comentário
    if (req.user.role !== 'ADMIN' && comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para deletar este comentário'
      });
    }

    await prisma.comment.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Comentário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar comentários pendentes (admin)
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        approved: false
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Erro ao buscar comentários pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Editar comentário (autor ou admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentário não encontrado' });
    }
    if (req.user.role !== 'ADMIN' && comment.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Sem permissão para editar este comentário' });
    }
    const updated = await prisma.comment.update({ where: { id }, data: { content } });
    res.json({ success: true, message: 'Comentário editado com sucesso', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Responder comentário (threaded)
router.post('/reply', authenticateToken, async (req, res) => {
  try {
    const { parentId, content } = req.body;
    const userId = req.user.id;
    if (!parentId || !content) {
      return res.status(400).json({ success: false, message: 'parentId e content são obrigatórios' });
    }
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Comentário pai não encontrado' });
    }
    const reply = await prisma.comment.create({
      data: {
        userId,
        name: req.user.name,
        email: req.user.email,
        content,
        parentId,
        approved: true // Respostas de usuários logados são aprovadas automaticamente
      }
    });
    res.status(201).json({ success: true, message: 'Resposta enviada', data: reply });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Like/Dislike comentário
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ success: false, message: 'Comentário não encontrado' });
    // Upsert reaction
    await prisma.commentReaction.upsert({
      where: { userId_commentId: { userId, commentId: id } },
      update: { type: 'LIKE' },
      create: { userId, commentId: id, type: 'LIKE' }
    });
    // Atualizar contagem
    const likes = await prisma.commentReaction.count({ where: { commentId: id, type: 'LIKE' } });
    const dislikes = await prisma.commentReaction.count({ where: { commentId: id, type: 'DISLIKE' } });
    await prisma.comment.update({ where: { id }, data: { likes, dislikes } });
    res.json({ success: true, likes, dislikes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

router.post('/:id/dislike', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ success: false, message: 'Comentário não encontrado' });
    // Upsert reaction
    await prisma.commentReaction.upsert({
      where: { userId_commentId: { userId, commentId: id } },
      update: { type: 'DISLIKE' },
      create: { userId, commentId: id, type: 'DISLIKE' }
    });
    // Atualizar contagem
    const likes = await prisma.commentReaction.count({ where: { commentId: id, type: 'LIKE' } });
    const dislikes = await prisma.commentReaction.count({ where: { commentId: id, type: 'DISLIKE' } });
    await prisma.comment.update({ where: { id }, data: { likes, dislikes } });
    res.json({ success: true, likes, dislikes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Listar comentários em árvore
router.get('/tree', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { approved: true, parentId: null },
      include: {
        user: { select: { name: true, avatar: true } },
        replies: {
          include: {
            user: { select: { name: true, avatar: true } },
            replies: true // 2 níveis
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router; 