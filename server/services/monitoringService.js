const { PrismaClient } = require('@prisma/client');
const os = require('os');

const prisma = new PrismaClient();

class MonitoringService {
  // Coletar métricas do sistema
  static async getSystemMetrics() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;

    const cpuUsage = os.loadavg();
    const uptime = os.uptime();

    return {
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
        usagePercentage: memoryUsage.toFixed(2)
      },
      cpu: {
        load1: cpuUsage[0],
        load5: cpuUsage[1],
        load15: cpuUsage[2]
      },
      uptime: uptime,
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version
    };
  }

  // Coletar métricas da aplicação
  static async getApplicationMetrics() {
    try {
      const [
        totalUsers,
        totalDisposals,
        activeUsers,
        totalPoints,
        recentActivity
      ] = await Promise.all([
        prisma.user.count(),
        prisma.disposal.count(),
        prisma.user.count({
          where: {
            updatedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
            }
          }
        }),
        prisma.user.aggregate({
          _sum: { points: true }
        }),
        prisma.disposal.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24h
            }
          }
        })
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          activePercentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
        },
        disposals: {
          total: totalDisposals,
          recent: recentActivity
        },
        points: {
          total: totalPoints._sum.points || 0
        },
        performance: {
          responseTime: process.hrtime(),
          memoryUsage: process.memoryUsage()
        }
      };
    } catch (error) {
      console.error('Erro ao coletar métricas da aplicação:', error);
      throw error;
    }
  }

  // Registrar log de atividade (simplificado - apenas console)
  static async logActivity(userId, action, details = {}) {
    console.log(`[ACTIVITY] User ${userId}: ${action}`, details);
  }

  // Registrar erro (simplificado - apenas console)
  static async logError(error, context = {}) {
    console.error(`[ERROR] ${error.message}`, { stack: error.stack, context });
  }

  // Registrar métrica de performance (simplificado - apenas console)
  static async logPerformanceMetric(endpoint, method, duration, statusCode) {
    console.log(`[PERFORMANCE] ${method} ${endpoint} - ${duration}ms - ${statusCode}`);
  }

  // Buscar logs de atividade (retorna dados básicos)
  static async getActivityLogs(page = 1, limit = 50, filters = {}) {
    // Como não temos tabela de logs, retornamos dados básicos
    const total = 0;
    const logs = [];

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: 0
      }
    };
  }

  // Buscar logs de erro (retorna dados básicos)
  static async getErrorLogs(page = 1, limit = 50, filters = {}) {
    // Como não temos tabela de logs, retornamos dados básicos
    const total = 0;
    const logs = [];

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: 0
      }
    };
  }

  // Buscar métricas de performance (retorna dados básicos)
  static async getPerformanceMetrics(startDate, endDate, endpoint = null) {
    // Como não temos tabela de logs, retornamos dados básicos
    return {
      metrics: [],
      summary: {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0
      }
    };
  }

  // Gerar relatório de saúde
  static async getHealthReport() {
    try {
      const systemMetrics = await this.getSystemMetrics();
      const appMetrics = await this.getApplicationMetrics();

      // Verificar conectividade do banco
      let dbStatus = 'healthy';
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (error) {
        dbStatus = 'unhealthy';
      }

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: dbStatus,
          api: 'healthy'
        },
        metrics: {
          system: systemMetrics,
          application: appMetrics
        },
        uptime: process.uptime()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        uptime: process.uptime()
      };
    }
  }

  // Limpar logs antigos (não aplicável sem tabelas)
  static async cleanupOldLogs(daysToKeep = 30) {
    console.log(`[CLEANUP] Limpeza de logs não aplicável - tabelas não existem`);
  }
}

module.exports = MonitoringService; 