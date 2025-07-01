const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fatores de impacto ambiental por kg de material
const IMPACT_FACTORS = {
  PLASTIC: {
    co2Reduction: 2.5, // kg CO2 evitados por kg de plástico reciclado
    waterSaved: 100, // litros de água economizados
    energySaved: 5.5, // kWh economizados
    treesEquivalent: 0.1, // árvores equivalentes
    decompositionTime: 450 // anos
  },
  GLASS: {
    co2Reduction: 0.3, // kg CO2 evitados por kg de vidro reciclado
    waterSaved: 50, // litros de água economizados
    energySaved: 0.3, // kWh economizados
    treesEquivalent: 0.05, // árvores equivalentes
    decompositionTime: 4000 // anos
  },
  PAPER: {
    co2Reduction: 0.8, // kg CO2 evitados por kg de papel reciclado
    waterSaved: 200, // litros de água economizados
    energySaved: 4.0, // kWh economizados
    treesEquivalent: 0.2, // árvores equivalentes
    decompositionTime: 0.25 // anos (3 meses)
  },
  METAL: {
    co2Reduction: 4.0, // kg CO2 evitados por kg de metal reciclado
    waterSaved: 150, // litros de água economizados
    energySaved: 8.0, // kWh economizados
    treesEquivalent: 0.15, // árvores equivalentes
    decompositionTime: 100 // anos
  },
  ORGANIC: {
    co2Reduction: 0.5, // kg CO2 evitados por kg de orgânico compostado
    waterSaved: 30, // litros de água economizados
    energySaved: 1.0, // kWh economizados
    treesEquivalent: 0.02, // árvores equivalentes
    decompositionTime: 0.08 // anos (1 mês)
  },
  ELECTRONIC: {
    co2Reduction: 6.0, // kg CO2 evitados por kg de eletrônico reciclado
    waterSaved: 300, // litros de água economizados
    energySaved: 12.0, // kWh economizados
    treesEquivalent: 0.3, // árvores equivalentes
    decompositionTime: 1000 // anos
  }
};

// Calcular impacto de um descarte específico
function calculateDisposalImpact(materialType, weight) {
  const factors = IMPACT_FACTORS[materialType] || IMPACT_FACTORS.PLASTIC;
  
  return {
    co2Reduction: factors.co2Reduction * weight,
    waterSaved: factors.waterSaved * weight,
    energySaved: factors.energySaved * weight,
    treesEquivalent: factors.treesEquivalent * weight,
    decompositionTime: factors.decompositionTime * weight
  };
}

// Calcular impacto total do sistema
async function calculateTotalImpact() {
  try {
    // Buscar todos os descartes
    const disposals = await prisma.disposal.findMany({
      select: {
        materialType: true,
        weight: true
      }
    });

    // Calcular totais por material
    const totals = {
      PLASTIC: 0,
      GLASS: 0,
      PAPER: 0,
      METAL: 0,
      ORGANIC: 0,
      ELECTRONIC: 0
    };

    let totalCo2Reduction = 0;
    let totalWaterSaved = 0;
    let totalEnergySaved = 0;
    let totalTreesEquivalent = 0;
    let totalDecompositionTime = 0;

    // Processar cada descarte
    disposals.forEach(disposal => {
      const material = disposal.materialType;
      const weight = disposal.weight;
      
      if (totals[material] !== undefined) {
        totals[material] += weight;
      }

      const impact = calculateDisposalImpact(material, weight);
      totalCo2Reduction += impact.co2Reduction;
      totalWaterSaved += impact.waterSaved;
      totalEnergySaved += impact.energySaved;
      totalTreesEquivalent += impact.treesEquivalent;
      totalDecompositionTime += impact.decompositionTime;
    });

    // Buscar estatísticas de usuários
    const userStats = await prisma.user.aggregate({
      _count: { id: true },
      _sum: { points: true }
    });

    // Atualizar ou criar dados de impacto
    const impactData = await prisma.impactData.upsert({
      where: { id: 'global' },
      update: {
        totalPlastic: totals.PLASTIC,
        totalGlass: totals.GLASS,
        totalPaper: totals.PAPER,
        totalMetal: totals.METAL,
        totalOrganic: totals.ORGANIC,
        totalElectronic: totals.ELECTRONIC,
        co2Reduction: totalCo2Reduction,
        decompositionTime: Math.round(totalDecompositionTime),
        activeUsers: userStats._count.id,
        totalPoints: userStats._sum.points || 0,
        treesEquivalent: Math.round(totalTreesEquivalent),
        waterSaved: totalWaterSaved,
        energySaved: totalEnergySaved
      },
      create: {
        id: 'global',
        totalPlastic: totals.PLASTIC,
        totalGlass: totals.GLASS,
        totalPaper: totals.PAPER,
        totalMetal: totals.METAL,
        totalOrganic: totals.ORGANIC,
        totalElectronic: totals.ELECTRONIC,
        co2Reduction: totalCo2Reduction,
        decompositionTime: Math.round(totalDecompositionTime),
        activeUsers: userStats._count.id,
        totalPoints: userStats._sum.points || 0,
        treesEquivalent: Math.round(totalTreesEquivalent),
        waterSaved: totalWaterSaved,
        energySaved: totalEnergySaved
      }
    });

    return impactData;
  } catch (error) {
    console.error('Erro ao calcular impacto total:', error);
    throw error;
  }
}

// Calcular impacto de um usuário específico
async function calculateUserImpact(userId) {
  try {
    const disposals = await prisma.disposal.findMany({
      where: { userId },
      select: {
        materialType: true,
        weight: true
      }
    });

    let totalCo2Reduction = 0;
    let totalWaterSaved = 0;
    let totalEnergySaved = 0;
    let totalTreesEquivalent = 0;
    let totalDecompositionTime = 0;

    disposals.forEach(disposal => {
      const impact = calculateDisposalImpact(disposal.materialType, disposal.weight);
      totalCo2Reduction += impact.co2Reduction;
      totalWaterSaved += impact.waterSaved;
      totalEnergySaved += impact.energySaved;
      totalTreesEquivalent += impact.treesEquivalent;
      totalDecompositionTime += impact.decompositionTime;
    });

    return {
      co2Reduction: totalCo2Reduction,
      waterSaved: totalWaterSaved,
      energySaved: totalEnergySaved,
      treesEquivalent: Math.round(totalTreesEquivalent),
      decompositionTime: Math.round(totalDecompositionTime),
      totalDisposals: disposals.length,
      totalWeight: disposals.reduce((sum, d) => sum + d.weight, 0)
    };
  } catch (error) {
    console.error('Erro ao calcular impacto do usuário:', error);
    throw error;
  }
}

// Obter estatísticas de impacto
async function getImpactStats() {
  try {
    const impactData = await prisma.impactData.findFirst({
      where: { id: 'global' }
    });

    if (!impactData) {
      return await calculateTotalImpact();
    }

    return impactData;
  } catch (error) {
    console.error('Erro ao obter estatísticas de impacto:', error);
    throw error;
  }
}

// Obter ranking de impacto por usuário
async function getImpactRanking(limit = 10) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        school: true,
        points: true,
        disposals: {
          select: {
            materialType: true,
            weight: true
          }
        }
      },
      orderBy: { points: 'desc' },
      take: limit
    });

    return users.map(user => {
      let totalCo2Reduction = 0;
      let totalWaterSaved = 0;
      let totalTreesEquivalent = 0;

      user.disposals.forEach(disposal => {
        const impact = calculateDisposalImpact(disposal.materialType, disposal.weight);
        totalCo2Reduction += impact.co2Reduction;
        totalWaterSaved += impact.waterSaved;
        totalTreesEquivalent += impact.treesEquivalent;
      });

      return {
        id: user.id,
        name: user.name,
        school: user.school,
        points: user.points,
        totalDisposals: user.disposals.length,
        totalWeight: user.disposals.reduce((sum, d) => sum + d.weight, 0),
        co2Reduction: totalCo2Reduction,
        waterSaved: totalWaterSaved,
        treesEquivalent: Math.round(totalTreesEquivalent)
      };
    });
  } catch (error) {
    console.error('Erro ao obter ranking de impacto:', error);
    throw error;
  }
}

// Atualizar impacto após novo descarte
async function updateImpactAfterDisposal(userId, materialType, weight) {
  try {
    // Calcular impacto do descarte
    const impact = calculateDisposalImpact(materialType, weight);
    
    // Atualizar dados globais
    await prisma.impactData.update({
      where: { id: 'global' },
      data: {
        co2Reduction: { increment: impact.co2Reduction },
        waterSaved: { increment: impact.waterSaved },
        energySaved: { increment: impact.energySaved },
        treesEquivalent: { increment: impact.treesEquivalent },
        decompositionTime: { increment: impact.decompositionTime }
      }
    });

    // Atualizar totais por material
    const materialField = `total${materialType.charAt(0) + materialType.slice(1).toLowerCase()}`;
    await prisma.impactData.update({
      where: { id: 'global' },
      data: {
        [materialField]: { increment: weight }
      }
    });

    return impact;
  } catch (error) {
    console.error('Erro ao atualizar impacto após descarte:', error);
    throw error;
  }
}

module.exports = {
  calculateDisposalImpact,
  calculateTotalImpact,
  calculateUserImpact,
  getImpactStats,
  getImpactRanking,
  updateImpactAfterDisposal,
  IMPACT_FACTORS
};

