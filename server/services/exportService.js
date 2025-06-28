const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

class ExportService {
  // Exportar relatório de usuário em PDF
  static async exportUserReportPDF(userId, startDate, endDate) {
    const doc = new PDFDocument();
    const filename = `user-report-${userId}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../temp', filename);

    // Criar diretório temp se não existir
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    try {
      // Buscar dados do usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          disposals: {
            where: {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          achievements: {
            include: { achievement: true }
          },
          rewards: {
            include: { reward: true }
          }
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Cabeçalho
      doc.fontSize(24)
        .fill('#10B981')
        .text('Descarte Certo', { align: 'center' });

      doc.fontSize(16)
        .fill('#374151')
        .text('Relatório de Usuário', { align: 'center' });

      doc.moveDown();

      // Informações do usuário
      doc.fontSize(14)
        .fill('#1F2937')
        .text('Informações do Usuário:');

      doc.fontSize(12)
        .fill('#6B7280')
        .text(`Nome: ${user.name}`)
        .text(`Email: ${user.email}`)
        .text(`Escola: ${user.school || 'Não informado'}`)
        .text(`Série: ${user.grade || 'Não informado'}`)
        .text(`Pontos: ${user.points.toLocaleString()}`)
        .text(`Nível: ${user.level}`)
        .text(`Membro desde: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}`);

      doc.moveDown();

      // Estatísticas de descarte
      const totalWeight = user.disposals.reduce((sum, d) => sum + d.weight, 0);
      const materialStats = user.disposals.reduce((acc, d) => {
        acc[d.materialType] = (acc[d.materialType] || 0) + d.weight;
        return acc;
      }, {});

      doc.fontSize(14)
        .fill('#1F2937')
        .text('Estatísticas de Descarte:');

      doc.fontSize(12)
        .fill('#6B7280')
        .text(`Total de descartes: ${user.disposals.length}`)
        .text(`Peso total: ${totalWeight.toFixed(2)}kg`)
        .text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`);

      doc.moveDown();

      // Detalhamento por material
      doc.fontSize(14)
        .fill('#1F2937')
        .text('Descarte por Material:');

      Object.entries(materialStats).forEach(([material, weight]) => {
        doc.fontSize(12)
          .fill('#6B7280')
          .text(`${material}: ${weight.toFixed(2)}kg`);
      });

      doc.moveDown();

      // Conquistas
      if (user.achievements.length > 0) {
        doc.fontSize(14)
          .fill('#1F2937')
          .text('Conquistas Desbloqueadas:');

        user.achievements.forEach(achievement => {
          doc.fontSize(12)
            .fill('#6B7280')
            .text(`🏆 ${achievement.achievement.name} - ${new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}`);
        });

        doc.moveDown();
      }

      // Recompensas
      if (user.rewards.length > 0) {
        doc.fontSize(14)
          .fill('#1F2937')
          .text('Recompensas Resgatadas:');

        user.rewards.forEach(reward => {
          doc.fontSize(12)
            .fill('#6B7280')
            .text(`🎁 ${reward.reward.name} - ${new Date(reward.claimedAt).toLocaleDateString('pt-BR')}`);
        });

        doc.moveDown();
      }

      // Histórico de descartes
      if (user.disposals.length > 0) {
        doc.fontSize(14)
          .fill('#1F2937')
          .text('Histórico de Descartas:');

        user.disposals.slice(0, 20).forEach((disposal, index) => {
          doc.fontSize(10)
            .fill('#6B7280')
            .text(`${index + 1}. ${disposal.materialType} - ${disposal.weight}kg - ${new Date(disposal.createdAt).toLocaleDateString('pt-BR')} - ${disposal.points} pontos`);
        });

        if (user.disposals.length > 20) {
          doc.fontSize(10)
            .fill('#6B7280')
            .text(`... e mais ${user.disposals.length - 20} descartes`);
        }
      }

      // Rodapé
      doc.moveDown(2);
      doc.fontSize(10)
        .fill('#9CA3AF')
        .text(`Relatório gerado em ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filepath));
        stream.on('error', reject);
      });

    } catch (error) {
      doc.end();
      throw error;
    }
  }

  // Exportar relatório administrativo em Excel
  static async exportAdminReportExcel(startDate, endDate) {
    const workbook = new ExcelJS.Workbook();
    const filename = `admin-report-${Date.now()}.xlsx`;
    const filepath = path.join(__dirname, '../temp', filename);

    // Criar diretório temp se não existir
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    try {
      // Buscar dados
      const [
        users,
        disposals,
        materialStats,
        schoolStats
      ] = await Promise.all([
        prisma.user.findMany({
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          },
          include: {
            _count: {
              select: {
                disposals: true,
                achievements: true,
                rewards: true
              }
            }
          }
        }),
        prisma.disposal.findMany({
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
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
        }),
        prisma.disposal.groupBy({
          by: ['materialType'],
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          },
          _sum: { weight: true },
          _count: { id: true }
        }),
        prisma.user.groupBy({
          by: ['school'],
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          },
          _sum: { points: true },
          _count: { id: true }
        })
      ]);

      // Planilha 1: Resumo Geral
      const summarySheet = workbook.addWorksheet('Resumo Geral');
      summarySheet.columns = [
        { header: 'Métrica', key: 'metric', width: 30 },
        { header: 'Valor', key: 'value', width: 20 }
      ];

      const totalUsers = users.length;
      const totalDisposals = disposals.length;
      const totalWeight = disposals.reduce((sum, d) => sum + d.weight, 0);
      const totalPoints = users.reduce((sum, u) => sum + u.points, 0);

      summarySheet.addRows([
        { metric: 'Total de Usuários', value: totalUsers },
        { metric: 'Total de Descartas', value: totalDisposals },
        { metric: 'Peso Total (kg)', value: totalWeight.toFixed(2) },
        { metric: 'Pontos Totais', value: totalPoints.toLocaleString() },
        { metric: 'Período', value: `${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}` }
      ]);

      // Planilha 2: Usuários
      const usersSheet = workbook.addWorksheet('Usuários');
      usersSheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nome', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 40 },
        { header: 'Escola', key: 'school', width: 30 },
        { header: 'Série', key: 'grade', width: 15 },
        { header: 'Pontos', key: 'points', width: 15 },
        { header: 'Nível', key: 'level', width: 10 },
        { header: 'Descartas', key: 'disposals', width: 15 },
        { header: 'Conquistas', key: 'achievements', width: 15 },
        { header: 'Recompensas', key: 'rewards', width: 15 },
        { header: 'Data de Cadastro', key: 'createdAt', width: 20 }
      ];

      users.forEach(user => {
        usersSheet.addRow({
          id: user.id,
          name: user.name,
          email: user.email,
          school: user.school || 'Não informado',
          grade: user.grade || 'Não informado',
          points: user.points,
          level: user.level,
          disposals: user._count.disposals,
          achievements: user._count.achievements,
          rewards: user._count.rewards,
          createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR')
        });
      });

      // Planilha 3: Descartas
      const disposalsSheet = workbook.addWorksheet('Descartas');
      disposalsSheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Usuário', key: 'userName', width: 30 },
        { header: 'Email', key: 'userEmail', width: 40 },
        { header: 'Escola', key: 'userSchool', width: 30 },
        { header: 'Material', key: 'materialType', width: 20 },
        { header: 'Peso (kg)', key: 'weight', width: 15 },
        { header: 'Pontos', key: 'points', width: 15 },
        { header: 'Localização', key: 'location', width: 30 },
        { header: 'Data', key: 'createdAt', width: 20 }
      ];

      disposals.forEach(disposal => {
        disposalsSheet.addRow({
          id: disposal.id,
          userName: disposal.user.name,
          userEmail: disposal.user.email,
          userSchool: disposal.user.school || 'Não informado',
          materialType: disposal.materialType,
          weight: disposal.weight,
          points: disposal.points,
          location: disposal.location || 'Não informado',
          createdAt: new Date(disposal.createdAt).toLocaleDateString('pt-BR')
        });
      });

      // Planilha 4: Estatísticas por Material
      const materialSheet = workbook.addWorksheet('Estatísticas por Material');
      materialSheet.columns = [
        { header: 'Material', key: 'material', width: 20 },
        { header: 'Quantidade', key: 'count', width: 15 },
        { header: 'Peso Total (kg)', key: 'weight', width: 20 },
        { header: 'Peso Médio (kg)', key: 'avgWeight', width: 20 }
      ];

      materialStats.forEach(stat => {
        materialSheet.addRow({
          material: stat.materialType,
          count: stat._count.id,
          weight: stat._sum.weight.toFixed(2),
          avgWeight: (stat._sum.weight / stat._count.id).toFixed(2)
        });
      });

      // Planilha 5: Ranking de Escolas
      const schoolSheet = workbook.addWorksheet('Ranking de Escolas');
      schoolSheet.columns = [
        { header: 'Posição', key: 'position', width: 15 },
        { header: 'Escola', key: 'school', width: 40 },
        { header: 'Usuários', key: 'users', width: 15 },
        { header: 'Pontos Totais', key: 'points', width: 20 },
        { header: 'Pontos por Usuário', key: 'avgPoints', width: 20 }
      ];

      schoolStats
        .sort((a, b) => (b._sum.points || 0) - (a._sum.points || 0))
        .forEach((stat, index) => {
          schoolSheet.addRow({
            position: index + 1,
            school: stat.school || 'Não informado',
            users: stat._count.id,
            points: stat._sum.points || 0,
            avgPoints: Math.round((stat._sum.points || 0) / stat._count.id)
          });
        });

      // Salvar arquivo
      await workbook.xlsx.writeFile(filepath);
      return filepath;

    } catch (error) {
      throw error;
    }
  }

  // Exportar dados em CSV
  static async exportDataCSV(data, filename) {
    const filepath = path.join(__dirname, '../temp', filename);

    // Criar diretório temp se não existir
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }

    try {
      let csvContent = '';

      // Cabeçalhos
      if (data.length > 0) {
        csvContent += Object.keys(data[0]).join(',') + '\n';
      }

      // Dados
      data.forEach(row => {
        csvContent += Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',') + '\n';
      });

      fs.writeFileSync(filepath, csvContent, 'utf8');
      return filepath;

    } catch (error) {
      throw error;
    }
  }

  // Limpar arquivos temporários
  static async cleanupTempFiles() {
    const tempDir = path.join(__dirname, '../temp');
    
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas

      files.forEach(file => {
        const filepath = path.join(tempDir, file);
        const stats = fs.statSync(filepath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filepath);
        }
      });
    }
  }
}

module.exports = ExportService; 