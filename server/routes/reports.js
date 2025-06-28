const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const prisma = new PrismaClient();

// Gerar relatório pessoal do usuário
router.get('/personal', authenticateToken, async (req, res) => {
  try {
    const { format = 'pdf' } = req.query;
    
    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        disposals: {
          orderBy: { createdAt: 'desc' },
          take: 100
        },
        achievements: {
          orderBy: { unlockedAt: 'desc' }
        },
        rewards: {
          orderBy: { claimedAt: 'desc' }
        },
        donations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Calcular estatísticas
    const totalWeight = user.disposals.reduce((sum, disposal) => sum + disposal.weight, 0);
    const totalPoints = user.disposals.reduce((sum, disposal) => sum + disposal.points, 0);
    const materialStats = user.disposals.reduce((stats, disposal) => {
      stats[disposal.materialType] = (stats[disposal.materialType] || 0) + disposal.weight;
      return stats;
    }, {});

    const reportData = {
      user: {
        name: user.name,
        email: user.email,
        school: user.school,
        grade: user.grade,
        city: user.city,
        state: user.state,
        level: user.level,
        experience: user.experience
      },
      stats: {
        totalDisposals: user.disposals.length,
        totalWeight,
        totalPoints,
        achievements: user.achievements.length,
        rewards: user.rewards.length,
        donations: user.donations.length,
        materialStats
      },
      disposals: user.disposals,
      achievements: user.achievements,
      rewards: user.rewards,
      donations: user.donations
    };

    if (format === 'json') {
      return res.json(reportData);
    }

    // Gerar PDF
    const doc = new PDFDocument();
    const filename = `relatorio-${user.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../temp', filename);

    // Garantir que o diretório temp existe
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(24)
       .fill('#10b981')
       .text('Descarte Certo', { align: 'center' });
    
    doc.fontSize(16)
       .fill('#374151')
       .text('Relatório Pessoal de Impacto', { align: 'center' });
    
    doc.moveDown();

    // Informações do usuário
    doc.fontSize(14)
       .fill('#1f2937')
       .text('Informações Pessoais');
    
    doc.fontSize(12)
       .fill('#6b7280')
       .text(`Nome: ${user.name}`)
       .text(`Email: ${user.email}`)
       .text(`Escola: ${user.school || 'Não informado'}`)
       .text(`Série: ${user.grade || 'Não informado'}`)
       .text(`Cidade: ${user.city || 'Não informado'}`)
       .text(`Estado: ${user.state || 'Não informado'}`)
       .text(`Nível: ${user.level}`)
       .text(`Experiência: ${user.experience} XP`);
    
    doc.moveDown();

    // Estatísticas gerais
    doc.fontSize(14)
       .fill('#1f2937')
       .text('Estatísticas Gerais');
    
    doc.fontSize(12)
       .fill('#6b7280')
       .text(`Total de Descarte: ${user.disposals.length}`)
       .text(`Peso Total: ${totalWeight.toFixed(2)} kg`)
       .text(`Pontos Totais: ${totalPoints}`)
       .text(`Conquistas: ${user.achievements.length}`)
       .text(`Recompensas: ${user.rewards.length}`)
       .text(`Doações: ${user.donations.length}`);
    
    doc.moveDown();

    // Estatísticas por material
    doc.fontSize(14)
       .fill('#1f2937')
       .text('Descarte por Material');
    
    Object.entries(materialStats).forEach(([material, weight]) => {
      doc.fontSize(12)
         .fill('#6b7280')
         .text(`${material}: ${weight.toFixed(2)} kg`);
    });
    
    doc.moveDown();

    // Conquistas recentes
    if (user.achievements.length > 0) {
      doc.fontSize(14)
         .fill('#1f2937')
         .text('Conquistas Recentes');
      
      user.achievements.slice(0, 5).forEach(achievement => {
        doc.fontSize(12)
           .fill('#6b7280')
           .text(`• ${achievement.title} - ${achievement.points} pontos`);
      });
      
      doc.moveDown();
    }

    // Recompensas recentes
    if (user.rewards.length > 0) {
      doc.fontSize(14)
         .fill('#1f2937')
         .text('Recompensas Recentes');
      
      user.rewards.slice(0, 5).forEach(reward => {
        doc.fontSize(12)
           .fill('#6b7280')
           .text(`• ${reward.title} - ${reward.pointsCost} pontos`);
      });
      
      doc.moveDown();
    }

    // Rodapé
    doc.fontSize(10)
       .fill('#9ca3af')
       .text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        // Limpar arquivo temporário
        fs.unlink(filepath, () => {});
      });
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Gerar certificado de participação
router.get('/certificate', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        disposals: true,
        achievements: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const totalWeight = user.disposals.reduce((sum, disposal) => sum + disposal.weight, 0);
    const totalPoints = user.disposals.reduce((sum, disposal) => sum + disposal.points, 0);

    // Gerar PDF do certificado
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    const filename = `certificado-${user.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../temp', filename);

    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Fundo decorativo
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill('#f0fdf4');

    // Borda decorativa
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#10b981');

    // Título principal
    doc.fontSize(36)
       .fill('#10b981')
       .text('CERTIFICADO DE PARTICIPAÇÃO', { align: 'center' });
    
    doc.moveDown(0.5);
    
    doc.fontSize(24)
       .fill('#1f2937')
       .text('Descarte Certo', { align: 'center' });
    
    doc.moveDown(2);

    // Conteúdo do certificado
    doc.fontSize(18)
       .fill('#374151')
       .text('Certificamos que', { align: 'center' });
    
    doc.moveDown(0.5);
    
    doc.fontSize(24)
       .fill('#10b981')
       .text(user.name, { align: 'center' });
    
    doc.moveDown(1);
    
    doc.fontSize(16)
       .fill('#6b7280')
       .text('participou ativamente do programa de conscientização ambiental', { align: 'center' })
       .text('contribuindo significativamente para a preservação do meio ambiente.', { align: 'center' });
    
    doc.moveDown(1);

    // Estatísticas
    doc.fontSize(14)
       .fill('#374151')
       .text(`Total de descarte: ${user.disposals.length}`, { align: 'center' })
       .text(`Peso total: ${totalWeight.toFixed(2)} kg`, { align: 'center' })
       .text(`Pontos acumulados: ${totalPoints}`, { align: 'center' })
       .text(`Conquistas: ${user.achievements.length}`, { align: 'center' });
    
    doc.moveDown(2);

    // Data e assinatura
    doc.fontSize(14)
       .fill('#6b7280')
       .text(`Emitido em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    
    doc.moveDown(1);
    
    doc.fontSize(12)
       .fill('#9ca3af')
       .text('Descarte Certo - Transformando o futuro através da educação ambiental', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        fs.unlink(filepath, () => {});
      });
    });

  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Relatório de impacto geral (admin)
router.get('/impact', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { format = 'pdf' } = req.query;

    // Buscar dados de impacto
    const impactData = await prisma.impactData.findFirst();
    const totalUsers = await prisma.user.count();
    const totalDisposals = await prisma.disposal.count();
    const totalWeight = await prisma.disposal.aggregate({
      _sum: { weight: true }
    });

    const materialStats = await prisma.disposal.groupBy({
      by: ['materialType'],
      _sum: { weight: true },
      _count: { id: true }
    });

    const topUsers = await prisma.user.findMany({
      select: {
        name: true,
        points: true,
        level: true,
        disposals: {
          select: { weight: true }
        }
      },
      orderBy: { points: 'desc' },
      take: 10
    });

    const reportData = {
      overview: {
        totalUsers,
        totalDisposals,
        totalWeight: totalWeight._sum.weight || 0,
        impactData
      },
      materialStats,
      topUsers: topUsers.map(user => ({
        ...user,
        totalWeight: user.disposals.reduce((sum, d) => sum + d.weight, 0)
      }))
    };

    if (format === 'json') {
      return res.json(reportData);
    }

    // Gerar PDF do relatório de impacto
    const doc = new PDFDocument();
    const filename = `relatorio-impacto-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../temp', filename);

    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(24)
       .fill('#10b981')
       .text('Descarte Certo', { align: 'center' });
    
    doc.fontSize(18)
       .fill('#374151')
       .text('Relatório de Impacto Geral', { align: 'center' });
    
    doc.moveDown();

    // Visão geral
    doc.fontSize(16)
       .fill('#1f2937')
       .text('Visão Geral');
    
    doc.fontSize(12)
       .fill('#6b7280')
       .text(`Total de Usuários: ${totalUsers}`)
       .text(`Total de Descarte: ${totalDisposals}`)
       .text(`Peso Total: ${(totalWeight._sum.weight || 0).toFixed(2)} kg`)
       .text(`CO2 Reduzido: ${(impactData?.co2Reduction || 0).toFixed(2)} kg`)
       .text(`Árvores Equivalentes: ${impactData?.treesEquivalent || 0}`)
       .text(`Água Economizada: ${(impactData?.waterSaved || 0).toFixed(2)} L`)
       .text(`Energia Economizada: ${(impactData?.energySaved || 0).toFixed(2)} kWh`);
    
    doc.moveDown();

    // Estatísticas por material
    doc.fontSize(16)
       .fill('#1f2937')
       .text('Descarte por Material');
    
    materialStats.forEach(stat => {
      doc.fontSize(12)
         .fill('#6b7280')
         .text(`${stat.materialType}: ${(stat._sum.weight || 0).toFixed(2)} kg (${stat._count.id} descartes)`);
    });
    
    doc.moveDown();

    // Top usuários
    doc.fontSize(16)
       .fill('#1f2937')
       .text('Top 10 Usuários');
    
    topUsers.forEach((user, index) => {
      doc.fontSize(12)
         .fill('#6b7280')
         .text(`${index + 1}. ${user.name} - ${user.points} pontos (Nível ${user.level})`);
    });

    doc.end();

    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        fs.unlink(filepath, () => {});
      });
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de impacto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Relatório de escola (admin)
router.get('/school/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'pdf' } = req.query;

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            disposals: true,
            achievements: true
          }
        }
      }
    });

    if (!school) {
      return res.status(404).json({ error: 'Escola não encontrada' });
    }

    const totalWeight = school.users.reduce((sum, user) => {
      return sum + user.disposals.reduce((userSum, disposal) => userSum + disposal.weight, 0);
    }, 0);

    const totalPoints = school.users.reduce((sum, user) => {
      return sum + user.disposals.reduce((userSum, disposal) => userSum + disposal.points, 0);
    }, 0);

    const reportData = {
      school,
      stats: {
        totalUsers: school.users.length,
        totalWeight,
        totalPoints,
        totalAchievements: school.users.reduce((sum, user) => sum + user.achievements.length, 0)
      }
    };

    if (format === 'json') {
      return res.json(reportData);
    }

    // Gerar PDF do relatório da escola
    const doc = new PDFDocument();
    const filename = `relatorio-escola-${school.name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../temp', filename);

    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(24)
       .fill('#10b981')
       .text('Descarte Certo', { align: 'center' });
    
    doc.fontSize(18)
       .fill('#374151')
       .text('Relatório de Escola', { align: 'center' });
    
    doc.moveDown();

    // Informações da escola
    doc.fontSize(16)
       .fill('#1f2937')
       .text('Informações da Escola');
    
    doc.fontSize(12)
       .fill('#6b7280')
       .text(`Nome: ${school.name}`)
       .text(`Endereço: ${school.address}`)
       .text(`Cidade: ${school.city}`)
       .text(`Estado: ${school.state}`)
       .text(`Contato: ${school.contact}`)
       .text(`Email: ${school.email}`);
    
    doc.moveDown();

    // Estatísticas
    doc.fontSize(16)
       .fill('#1f2937')
       .text('Estatísticas');
    
    doc.fontSize(12)
       .fill('#6b7280')
       .text(`Total de Alunos: ${school.users.length}`)
       .text(`Peso Total: ${totalWeight.toFixed(2)} kg`)
       .text(`Pontos Totais: ${totalPoints}`)
       .text(`Conquistas: ${reportData.stats.totalAchievements}`)
       .text(`Nível da Escola: ${school.level}`);
    
    doc.moveDown();

    // Top alunos
    doc.fontSize(16)
       .fill('#1f2937')
       .text('Top 10 Alunos');
    
    const topStudents = school.users
      .map(user => ({
        ...user,
        totalWeight: user.disposals.reduce((sum, d) => sum + d.weight, 0),
        totalPoints: user.disposals.reduce((sum, d) => sum + d.points, 0)
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10);

    topStudents.forEach((student, index) => {
      doc.fontSize(12)
         .fill('#6b7280')
         .text(`${index + 1}. ${student.name} - ${student.totalPoints} pontos (${student.totalWeight.toFixed(2)} kg)`);
    });

    doc.end();

    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        fs.unlink(filepath, () => {});
      });
    });

  } catch (error) {
    console.error('Erro ao gerar relatório da escola:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 