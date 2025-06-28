const express = require('express');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const router = express.Router();
const prisma = new PrismaClient();

// Configurações de segurança
router.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

router.use(limiter);

// Middleware para verificar API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      error: 'API key inválida ou não fornecida',
      message: 'Forneça uma API key válida no header X-API-Key ou query parameter apiKey'
    });
  }
  
  next();
};

// Documentação da API
router.get('/', (req, res) => {
  res.json({
    name: 'Descarte Certo API',
    version: '1.0.0',
    description: 'API pública para dados de impacto ambiental e estatísticas',
    endpoints: {
      '/impact': {
        method: 'GET',
        description: 'Dados gerais de impacto ambiental',
        requiresAuth: false,
        parameters: {
          format: 'string (json, csv) - Formato de resposta'
        }
      },
      '/stats': {
        method: 'GET',
        description: 'Estatísticas gerais da plataforma',
        requiresAuth: false
      },
      '/leaderboard': {
        method: 'GET',
        description: 'Ranking dos usuários',
        requiresAuth: false,
        parameters: {
          limit: 'number - Número de usuários (padrão: 10)',
          city: 'string - Filtrar por cidade',
          state: 'string - Filtrar por estado'
        }
      },
      '/materials': {
        method: 'GET',
        description: 'Estatísticas por tipo de material',
        requiresAuth: false
      },
      '/schools': {
        method: 'GET',
        description: 'Ranking das escolas',
        requiresAuth: false,
        parameters: {
          limit: 'number - Número de escolas (padrão: 10)',
          state: 'string - Filtrar por estado'
        }
      },
      '/collection-points': {
        method: 'GET',
        description: 'Pontos de coleta',
        requiresAuth: false,
        parameters: {
          city: 'string - Filtrar por cidade',
          state: 'string - Filtrar por estado',
          materials: 'string - Filtrar por materiais (separados por vírgula)'
        }
      }
    },
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      query: 'apiKey'
    },
    rateLimit: '100 requests por 15 minutos',
    contact: {
      email: 'api@descarte-certo.com',
      documentation: 'https://docs.descarte-certo.com/api'
    }
  });
});

// Dados de impacto ambiental
router.get('/impact', async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const impactData = await prisma.impactData.findFirst();
    const totalUsers = await prisma.user.count();
    const totalDisposals = await prisma.disposal.count();
    const totalWeight = await prisma.disposal.aggregate({
      _sum: { weight: true }
    });

    const data = {
      timestamp: new Date().toISOString(),
      totalUsers,
      totalDisposals,
      totalWeight: totalWeight._sum.weight || 0,
      impact: {
        co2Reduction: impactData?.co2Reduction || 0,
        treesEquivalent: impactData?.treesEquivalent || 0,
        waterSaved: impactData?.waterSaved || 0,
        energySaved: impactData?.energySaved || 0,
        decompositionTime: impactData?.decompositionTime || 0
      },
      environmentalImpact: {
        co2ReductionKg: (totalWeight._sum.weight || 0) * 2.5, // Estimativa
        treesEquivalent: Math.floor((totalWeight._sum.weight || 0) / 10), // 1 árvore a cada 10kg
        waterSavedLiters: (totalWeight._sum.weight || 0) * 100, // Estimativa
        energySavedKwh: (totalWeight._sum.weight || 0) * 5 // Estimativa
      }
    };

    if (format === 'csv') {
      const csv = `timestamp,totalUsers,totalDisposals,totalWeight,co2Reduction,treesEquivalent,waterSaved,energySaved\n${data.timestamp},${data.totalUsers},${data.totalDisposals},${data.totalWeight},${data.environmentalImpact.co2ReductionKg},${data.environmentalImpact.treesEquivalent},${data.environmentalImpact.waterSavedLiters},${data.environmentalImpact.energySavedKwh}`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=impact-data.csv');
      return res.send(csv);
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar dados de impacto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalDisposals = await prisma.disposal.count();
    const totalWeight = await prisma.disposal.aggregate({
      _sum: { weight: true }
    });
    const totalPoints = await prisma.disposal.aggregate({
      _sum: { points: true }
    });

    const materialStats = await prisma.disposal.groupBy({
      by: ['materialType'],
      _sum: { weight: true },
      _count: { id: true }
    });

    const topCities = await prisma.disposal.groupBy({
      by: ['city'],
      _sum: { weight: true },
      _count: { id: true },
      orderBy: { _sum: { weight: 'desc' } },
      take: 10
    });

    const stats = {
      timestamp: new Date().toISOString(),
      overview: {
        totalUsers,
        totalDisposals,
        totalWeight: totalWeight._sum.weight || 0,
        totalPoints: totalPoints._sum.points || 0,
        averageWeightPerDisposal: totalDisposals > 0 ? (totalWeight._sum.weight || 0) / totalDisposals : 0,
        averagePointsPerUser: totalUsers > 0 ? (totalPoints._sum.points || 0) / totalUsers : 0
      },
      materials: materialStats.map(stat => ({
        material: stat.materialType,
        weight: stat._sum.weight || 0,
        count: stat._count.id,
        percentage: totalWeight._sum.weight > 0 ? ((stat._sum.weight || 0) / totalWeight._sum.weight * 100).toFixed(2) : 0
      })),
      topCities: topCities.map(city => ({
        city: city.city || 'Não informado',
        weight: city._sum.weight || 0,
        disposals: city._count.id
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Ranking dos usuários
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, city, state } = req.query;
    
    const where = {};
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };

    const users = await prisma.user.findMany({
      where,
      select: {
        name: true,
        points: true,
        level: true,
        city: true,
        state: true,
        disposals: {
          select: { weight: true }
        }
      },
      orderBy: { points: 'desc' },
      take: parseInt(limit)
    });

    const leaderboard = users.map(user => ({
      name: user.name,
      points: user.points,
      level: user.level,
      city: user.city,
      state: user.state,
      totalWeight: user.disposals.reduce((sum, disposal) => sum + disposal.weight, 0)
    }));

    res.json({
      timestamp: new Date().toISOString(),
      leaderboard
    });
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas por material
router.get('/materials', async (req, res) => {
  try {
    const materialStats = await prisma.disposal.groupBy({
      by: ['materialType'],
      _sum: { weight: true, points: true },
      _count: { id: true }
    });

    const totalWeight = await prisma.disposal.aggregate({
      _sum: { weight: true }
    });

    const materials = materialStats.map(stat => ({
      material: stat.materialType,
      weight: stat._sum.weight || 0,
      points: stat._sum.points || 0,
      count: stat._count.id,
      percentage: totalWeight._sum.weight > 0 ? ((stat._sum.weight || 0) / totalWeight._sum.weight * 100).toFixed(2) : 0,
      environmentalImpact: {
        decompositionTime: getDecompositionTime(stat.materialType),
        recyclable: isRecyclable(stat.materialType),
        impact: getEnvironmentalImpact(stat.materialType, stat._sum.weight || 0)
      }
    }));

    res.json({
      timestamp: new Date().toISOString(),
      materials
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas por material:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Ranking das escolas
router.get('/schools', async (req, res) => {
  try {
    const { limit = 10, state } = req.query;
    
    const where = {};
    if (state) where.state = { contains: state, mode: 'insensitive' };

    const schools = await prisma.school.findMany({
      where,
      include: {
        users: {
          include: {
            disposals: true
          }
        }
      },
      orderBy: { totalPoints: 'desc' },
      take: parseInt(limit)
    });

    const schoolRanking = schools.map(school => {
      const totalWeight = school.users.reduce((sum, user) => {
        return sum + user.disposals.reduce((userSum, disposal) => userSum + disposal.weight, 0);
      }, 0);

      const totalPoints = school.users.reduce((sum, user) => {
        return sum + user.disposals.reduce((userSum, disposal) => userSum + disposal.points, 0);
      }, 0);

      return {
        name: school.name,
        city: school.city,
        state: school.state,
        totalStudents: school.users.length,
        totalWeight,
        totalPoints,
        level: school.level,
        averagePointsPerStudent: school.users.length > 0 ? totalPoints / school.users.length : 0
      };
    });

    res.json({
      timestamp: new Date().toISOString(),
      schools: schoolRanking
    });
  } catch (error) {
    console.error('Erro ao buscar ranking das escolas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Pontos de coleta
router.get('/collection-points', async (req, res) => {
  try {
    const { city, state, materials } = req.query;
    
    const where = { active: true };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (materials) {
      const materialArray = materials.split(',').map(m => m.trim());
      where.materials = { contains: materialArray[0] }; // Busca por primeiro material
    }

    const collectionPoints = await prisma.collectionPoint.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    const points = collectionPoints.map(point => ({
      name: point.name,
      address: point.address,
      city: point.city,
      state: point.state,
      coordinates: {
        latitude: point.latitude,
        longitude: point.longitude
      },
      materials: JSON.parse(point.materials),
      contact: {
        phone: point.phone,
        email: point.email,
        website: point.website
      }
    }));

    res.json({
      timestamp: new Date().toISOString(),
      total: points.length,
      points
    });
  } catch (error) {
    console.error('Erro ao buscar pontos de coleta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Funções auxiliares
function getDecompositionTime(materialType) {
  const times = {
    PLASTIC: '450 anos',
    GLASS: 'Indefinido',
    PAPER: '2-4 semanas',
    METAL: '50-500 anos',
    ORGANIC: '2-6 semanas',
    ELECTRONIC: '1000+ anos'
  };
  return times[materialType] || 'Desconhecido';
}

function isRecyclable(materialType) {
  const recyclable = {
    PLASTIC: true,
    GLASS: true,
    PAPER: true,
    METAL: true,
    ORGANIC: false,
    ELECTRONIC: true
  };
  return recyclable[materialType] || false;
}

function getEnvironmentalImpact(materialType, weight) {
  const impacts = {
    PLASTIC: {
      co2Reduction: weight * 2.5,
      waterSaved: weight * 100,
      energySaved: weight * 5
    },
    GLASS: {
      co2Reduction: weight * 1.2,
      waterSaved: weight * 50,
      energySaved: weight * 3
    },
    PAPER: {
      co2Reduction: weight * 1.8,
      waterSaved: weight * 80,
      energySaved: weight * 4
    },
    METAL: {
      co2Reduction: weight * 3.0,
      waterSaved: weight * 120,
      energySaved: weight * 6
    },
    ORGANIC: {
      co2Reduction: weight * 0.5,
      waterSaved: weight * 20,
      energySaved: weight * 1
    },
    ELECTRONIC: {
      co2Reduction: weight * 4.0,
      waterSaved: weight * 150,
      energySaved: weight * 8
    }
  };
  return impacts[materialType] || { co2Reduction: 0, waterSaved: 0, energySaved: 0 };
}

module.exports = router; 