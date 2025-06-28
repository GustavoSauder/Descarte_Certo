const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Buscar posts do blog
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search } = req.query;
    const skip = (page - 1) * limit;

    const where = { published: true };
    
    if (tag) {
      where.tags = { contains: tag };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.blogPost.count({ where });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar post específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Incrementar visualizações
    await prisma.blogPost.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar posts do usuário (autenticado)
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await prisma.blogPost.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.blogPost.count({
      where: { userId: req.user.id }
    });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, tags, imageUrl, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }

    const post = await prisma.blogPost.create({
      data: {
        userId: req.user.id,
        title,
        content,
        excerpt,
        tags: tags ? JSON.stringify(tags) : null,
        imageUrl,
        published: published || false
      },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, tags, imageUrl, published } = req.body;

    // Verificar se o post pertence ao usuário
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    if (existingPost.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        tags: tags ? JSON.stringify(tags) : null,
        imageUrl,
        published
      },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o post pertence ao usuário
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    if (existingPost.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Curtir/descurtir post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { likes: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Incrementar curtidas
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });

    res.json({ likes: updatedPost.likes });
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar tags populares
router.get('/tags/popular', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { tags: true }
    });

    const tagCounts = {};
    
    posts.forEach(post => {
      if (post.tags) {
        const tags = JSON.parse(post.tags);
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const popularTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));

    res.json(popularTags);
  } catch (error) {
    console.error('Erro ao buscar tags populares:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar posts relacionados
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { tags: true }
    });

    if (!currentPost || !currentPost.tags) {
      return res.json({ posts: [] });
    }

    const currentTags = JSON.parse(currentPost.tags);
    
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        id: { not: id },
        published: true,
        tags: {
          contains: currentTags[0] // Buscar por primeira tag
        }
      },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({ posts: relatedPosts });
  } catch (error) {
    console.error('Erro ao buscar posts relacionados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Admin: Aprovar/rejeitar post
router.patch('/:id/approve', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    const post = await prisma.blogPost.update({
      where: { id },
      data: { published },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Erro ao aprovar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas do blog
router.get('/stats/overview', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const totalPosts = await prisma.blogPost.count();
    const publishedPosts = await prisma.blogPost.count({
      where: { published: true }
    });
    const totalViews = await prisma.blogPost.aggregate({
      _sum: { views: true }
    });
    const totalLikes = await prisma.blogPost.aggregate({
      _sum: { likes: true }
    });

    const recentPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { title: true, views: true, likes: true, createdAt: true }
    });

    res.json({
      totalPosts,
      publishedPosts,
      totalViews: totalViews._sum.views || 0,
      totalLikes: totalLikes._sum.likes || 0,
      recentPosts
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 