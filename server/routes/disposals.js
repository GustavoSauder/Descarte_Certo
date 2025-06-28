const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

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
  
  // Criar diretório se não existir
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  const processedFilename = `disposal_${Date.now()}_${filename}`;
  const filepath = path.join(uploadsDir, processedFilename);

  // Processar e salvar imagem
  await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(filepath);

  return `/uploads/${processedFilename}`;
}

// Função para reconhecimento de material (simulada)
async function recognizeMaterial(imageBuffer) {
  // Aqui você integraria com uma API de IA real como Google Cloud Vision
  // Por enquanto, retornamos um material aleatório para demonstração
  const materials = ['PLASTIC', 'GLASS', 'PAPER', 'METAL', 'ORGANIC', 'ELECTRONIC'];
  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  
  // Simular tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    materialType: randomMaterial,
    confidence: Math.random() * 0.3 + 0.7, // 70-100% de confiança
    decompositionTime: getDecompositionTime(randomMaterial)
  };
}

// Função para calcular tempo de decomposição
function getDecompositionTime(materialType) {
  const decompositionTimes = {
    PLASTIC: 450, // anos
    GLASS: 4000, // anos
    PAPER: 3, // meses
    METAL: 100, // anos
    ORGANIC: 1, // mês
    ELECTRONIC: 1000 // anos
  };
  
  return decompositionTimes[materialType] || 100;
}

// Função para calcular pontos baseado no material e peso
function calculatePoints(materialType, weight) {
  const basePoints = {
    PLASTIC: 10,
    GLASS: 15,
    PAPER: 5,
    METAL: 20,
    ORGANIC: 3,
    ELECTRONIC: 25
  };
  
  const basePoint = basePoints[materialType] || 5;
  return Math.round(basePoint * weight);
}

// Registrar novo descarte
router.post('/', authenticateToken, upload.single('image'), [
  body('materialType').isIn(['PLASTIC', 'GLASS', 'PAPER', 'METAL', 'ORGANIC', 'ELECTRONIC']),
  body('weight').isFloat({ min: 0.1, max: 1000 }),
  body('location').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { materialType, weight, location } = req.body;
    let imageUrl = null;
    let recognizedMaterial = materialType;

    // Processar imagem se fornecida
    if (req.file) {
      imageUrl = await processImage(req.file.buffer, req.file.originalname);
      
      // Reconhecimento de IA
      const recognition = await recognizeMaterial(req.file.buffer);
      recognizedMaterial = recognition.materialType;
    }

    // Calcular pontos
    const points = calculatePoints(recognizedMaterial, parseFloat(weight));

    // Criar descarte
    const disposal = await prisma.disposal.create({
      data: {
        userId: req.user.userId,
        materialType: recognizedMaterial,
        weight: parseFloat(weight),
        imageUrl,
        location,
        points
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

    // Atualizar pontos do usuário
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        points: {
          increment: points
        }
      }
    });

    // Verificar conquistas
    await checkAchievements(req.user.userId);

    // Atualizar dados de impacto
    await updateImpactData();

    res.status(201).json({
      message: 'Descarte registrado com sucesso',
      disposal,
      pointsEarned: points,
      materialRecognized: recognizedMaterial
    });

  } catch (error) {
    console.error('Erro ao registrar descarte:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter descartes do usuário
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, materialType } = req.query;
    const skip = (page - 1) * limit;

    const where = { userId: req.user.userId };
    if (materialType) {
      where.materialType = materialType;
    }

    const disposals = await prisma.disposal.findMany({
      where,
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

    const total = await prisma.disposal.count({ where });

    res.json({
      disposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar descartes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas do usuário
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await prisma.disposal.groupBy({
      by: ['materialType'],
      where: { userId: req.user.userId },
      _sum: {
        weight: true,
        points: true
      },
      _count: {
        id: true
      }
    });

    const totalStats = await prisma.disposal.aggregate({
      where: { userId: req.user.userId },
      _sum: {
        weight: true,
        points: true
      },
      _count: {
        id: true
      }
    });

    res.json({
      byMaterial: stats,
      total: {
        weight: totalStats._sum.weight || 0,
        points: totalStats._sum.points || 0,
        count: totalStats._count.id || 0
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para verificar conquistas
async function checkAchievements(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      disposals: true,
      achievements: true
    }
  });

  const achievements = [];

  // Conquista: Primeiro descarte
  if (user.disposals.length === 1) {
    achievements.push({
      title: 'Primeiro Passo',
      description: 'Realizou seu primeiro descarte consciente',
      points: 50,
      icon: '🌱'
    });
  }

  // Conquista: 10 descartes
  if (user.disposals.length === 10) {
    achievements.push({
      title: 'Dedicado',
      description: 'Realizou 10 descartes conscientes',
      points: 100,
      icon: '🏆'
    });
  }

  // Conquista: 100 pontos
  if (user.points >= 100 && user.points < 200) {
    achievements.push({
      title: 'Centenário',
      description: 'Atingiu 100 pontos ecológicos',
      points: 75,
      icon: '💯'
    });
  }

  // Criar conquistas não existentes
  for (const achievement of achievements) {
    const exists = user.achievements.some(a => a.title === achievement.title);
    if (!exists) {
      await prisma.achievement.create({
        data: {
          userId,
          ...achievement
        }
      });

      // Adicionar pontos da conquista
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: achievement.points
          }
        }
      });
    }
  }
}

// Função para atualizar dados de impacto
async function updateImpactData() {
  const stats = await prisma.disposal.groupBy({
    by: ['materialType'],
    _sum: {
      weight: true
    }
  });

  const impactData = {
    totalPlastic: 0,
    totalGlass: 0,
    totalPaper: 0,
    totalMetal: 0,
    totalOrganic: 0,
    totalElectronic: 0
  };

  stats.forEach(stat => {
    const weight = stat._sum.weight || 0;
    switch (stat.materialType) {
      case 'PLASTIC':
        impactData.totalPlastic = weight;
        break;
      case 'GLASS':
        impactData.totalGlass = weight;
        break;
      case 'PAPER':
        impactData.totalPaper = weight;
        break;
      case 'METAL':
        impactData.totalMetal = weight;
        break;
      case 'ORGANIC':
        impactData.totalOrganic = weight;
        break;
      case 'ELECTRONIC':
        impactData.totalElectronic = weight;
        break;
    }
  });

  const totalWeight = Object.values(impactData).reduce((sum, weight) => sum + weight, 0);
  const co2Reduction = totalWeight * 2.5; // Estimativa: 2.5kg CO2 por kg reciclado
  const activeUsers = await prisma.user.count();
  const totalPoints = await prisma.user.aggregate({
    _sum: { points: true }
  });

  // Atualizar ou criar dados de impacto
  await prisma.impactData.upsert({
    where: { id: 'global' },
    update: {
      ...impactData,
      co2Reduction,
      activeUsers,
      totalPoints: totalPoints._sum.points || 0,
      updatedAt: new Date()
    },
    create: {
      id: 'global',
      ...impactData,
      co2Reduction,
      activeUsers,
      totalPoints: totalPoints._sum.points || 0
    }
  });
}

module.exports = router; 