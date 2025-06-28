const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Obter dados de impacto em tempo real
router.get('/data', async (req, res) => {
  try {
    let impactData = await prisma.impactData.findUnique({
      where: { id: 'global' }
    });

    // Se não existir, criar dados iniciais
    if (!impactData) {
      impactData = await prisma.impactData.create({
        data: {
          id: 'global',
          totalPlastic: 0,
          totalGlass: 0,
          totalPaper: 0,
          totalMetal: 0,
          totalOrganic: 0,
          totalElectronic: 0,
          co2Reduction: 0,
          decompositionTime: 0,
          activeUsers: 0,
          totalPoints: 0
        }
      });
    }

    // Calcular estatísticas adicionais
    const totalWeight = impactData.totalPlastic + impactData.totalGlass + 
                       impactData.totalPaper + impactData.totalMetal + 
                       impactData.totalOrganic + impactData.totalElectronic;

    const totalDisposals = await prisma.disposal.count();
    const totalSchools = await prisma.user.groupBy({
      by: ['school'],
      where: { school: { not: null } }
    });

    const recentDisposals = await prisma.disposal.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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
      impactData,
      statistics: {
        totalWeight,
        totalDisposals,
        totalSchools: totalSchools.length,
        recentDisposals
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados de impacto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter dados de impacto por período
router.get('/data/period', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const disposals = await prisma.disposal.groupBy({
      by: ['materialType', 'createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        weight: true,
        points: true
      }
    });

    // Agrupar por material
    const materialStats = {};
    disposals.forEach(disposal => {
      if (!materialStats[disposal.materialType]) {
        materialStats[disposal.materialType] = {
          weight: 0,
          points: 0,
          count: 0
        };
      }
      materialStats[disposal.materialType].weight += disposal._sum.weight || 0;
      materialStats[disposal.materialType].points += disposal._sum.points || 0;
      materialStats[disposal.materialType].count++;
    });

    res.json({
      period,
      startDate,
      endDate: now,
      materialStats
    });

  } catch (error) {
    console.error('Erro ao buscar dados por período:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter ranking de escolas por impacto
router.get('/schools', async (req, res) => {
  try {
    const schools = await prisma.user.groupBy({
      by: ['school'],
      where: {
        school: { not: null }
      },
      _sum: {
        points: true
      },
      _count: {
        id: true
      }
    });

    const schoolStats = await Promise.all(
      schools.map(async (school) => {
        const disposals = await prisma.disposal.findMany({
          where: {
            user: {
              school: school.school
            }
          },
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        });

        const totalWeight = disposals.reduce((sum, disposal) => sum + disposal.weight, 0);
        const materialBreakdown = disposals.reduce((acc, disposal) => {
          acc[disposal.materialType] = (acc[disposal.materialType] || 0) + disposal.weight;
          return acc;
        }, {});

        return {
          school: school.school,
          totalPoints: school._sum.points || 0,
          totalUsers: school._count.id,
          totalWeight,
          materialBreakdown,
          totalDisposals: disposals.length
        };
      })
    );

    // Ordenar por pontos
    schoolStats.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json({ schools: schoolStats });

  } catch (error) {
    console.error('Erro ao buscar ranking de escolas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de materiais
router.get('/materials', async (req, res) => {
  try {
    const materialStats = await prisma.disposal.groupBy({
      by: ['materialType'],
      _sum: {
        weight: true,
        points: true
      },
      _count: {
        id: true
      }
    });

    const totalWeight = materialStats.reduce((sum, stat) => sum + (stat._sum.weight || 0), 0);
    const totalPoints = materialStats.reduce((sum, stat) => sum + (stat._sum.points || 0), 0);

    const materials = materialStats.map(stat => ({
      material: stat.materialType,
      weight: stat._sum.weight || 0,
      points: stat._sum.points || 0,
      count: stat._count.id,
      percentage: totalWeight > 0 ? ((stat._sum.weight || 0) / totalWeight * 100).toFixed(2) : 0
    }));

    res.json({
      materials,
      totalWeight,
      totalPoints,
      totalDisposals: materialStats.reduce((sum, stat) => sum + stat._count.id, 0)
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de materiais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter impacto ambiental calculado
router.get('/environmental', async (req, res) => {
  try {
    const impactData = await prisma.impactData.findUnique({
      where: { id: 'global' }
    });

    if (!impactData) {
      return res.status(404).json({ error: 'Dados de impacto não encontrados' });
    }

    const totalWeight = impactData.totalPlastic + impactData.totalGlass + 
                       impactData.totalPaper + impactData.totalMetal + 
                       impactData.totalOrganic + impactData.totalElectronic;

    // Cálculos de impacto ambiental
    const environmentalImpact = {
      co2Reduction: impactData.co2Reduction, // kg de CO2 evitados
      treesEquivalent: Math.round(impactData.co2Reduction / 22), // 1 árvore absorve ~22kg CO2/ano
      waterSaved: totalWeight * 1000, // litros de água economizados
      energySaved: totalWeight * 5000, // kWh economizados
      landfillSpace: totalWeight * 0.5, // m³ de espaço em aterro economizado
      decompositionTimeSaved: calculateDecompositionTimeSaved(impactData)
    };

    res.json({
      impactData,
      environmentalImpact
    });

  } catch (error) {
    console.error('Erro ao calcular impacto ambiental:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para calcular tempo de decomposição economizado
function calculateDecompositionTimeSaved(impactData) {
  const decompositionTimes = {
    PLASTIC: 450 * 365 * 24 * 60 * 60 * 1000, // anos em milissegundos
    GLASS: 4000 * 365 * 24 * 60 * 60 * 1000,
    PAPER: 3 * 30 * 24 * 60 * 60 * 1000, // meses em milissegundos
    METAL: 100 * 365 * 24 * 60 * 60 * 1000,
    ORGANIC: 1 * 30 * 24 * 60 * 60 * 1000, // mês em milissegundos
    ELECTRONIC: 1000 * 365 * 24 * 60 * 60 * 1000
  };

  let totalTimeSaved = 0;
  
  totalTimeSaved += impactData.totalPlastic * decompositionTimes.PLASTIC;
  totalTimeSaved += impactData.totalGlass * decompositionTimes.GLASS;
  totalTimeSaved += impactData.totalPaper * decompositionTimes.PAPER;
  totalTimeSaved += impactData.totalMetal * decompositionTimes.METAL;
  totalTimeSaved += impactData.totalOrganic * decompositionTimes.ORGANIC;
  totalTimeSaved += impactData.totalElectronic * decompositionTimes.ELECTRONIC;

  // Converter para anos
  const yearsSaved = totalTimeSaved / (365 * 24 * 60 * 60 * 1000);
  
  return {
    milliseconds: totalTimeSaved,
    years: Math.round(yearsSaved),
    days: Math.round(yearsSaved * 365),
    hours: Math.round(yearsSaved * 365 * 24)
  };
}

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.count();
    const disposals = await prisma.disposal.aggregate({ _sum: { weight: true } });
    res.json({
      activeUsers: users,
      plasticRecycled: disposals._sum.weight || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

module.exports = router; 