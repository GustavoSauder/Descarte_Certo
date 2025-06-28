const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuração do transporter de email
let transporter = null;

// Inicializar transporter apenas se as variáveis estiverem configuradas
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true
  });
} else {
  console.log('Email não configurado corretamente. Variáveis EMAIL_USER e EMAIL_PASS ausentes.');
}

class NotificationService {
  // Enviar email (sem salvar no banco para emails de confirmação)
  static async sendEmail(to, subject, html, text, userId = null) {
    if (!transporter) {
      throw new Error('Serviço de e-mail não configurado. Contate o administrador.');
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
      };

      const result = await transporter.sendMail(mailOptions);
      
      // Salvar no banco de dados apenas se userId for fornecido
      if (userId) {
        await prisma.notification.create({
          data: {
            userId,
            type: 'EMAIL',
            title: subject,
            message: text,
            data: JSON.stringify({ emailResult: result })
          }
        });
      }

      return result;
    } catch (error) {
      console.error('Erro ao enviar email:', error.message, error.stack);
      
      // Salvar erro no banco apenas se userId for fornecido
      if (userId) {
        const notificationData = {
          userId,
          type: 'EMAIL',
          title: subject,
          message: text,
          data: JSON.stringify({ error: error.message, stack: error.stack })
        };
        await prisma.notification.create({ data: notificationData });
      }
      
      throw error;
    }
  }

  // Enviar notificação para usuário específico
  static async sendUserNotification(userId, type, title, message, metadata = {}) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: JSON.stringify(metadata)
        }
      });

      // Se for email, enviar imediatamente
      if (type === 'EMAIL') {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (user && user.email) {
          await this.sendEmail(
            user.email,
            title,
            this.generateEmailHTML(title, message),
            message,
            userId
          );
        }
      }

      return notification;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  // Notificação de novo descarte
  static async notifyNewDisposal(userId, disposalData) {
    const title = 'Novo Descarte Registrado! 🌱';
    const message = `Parabéns! Você registrou ${disposalData.weight}kg de ${disposalData.materialType.toLowerCase()} e ganhou ${disposalData.points} pontos!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      disposalId: disposalData.id,
      points: disposalData.points
    });
  }

  // Notificação de conquista
  static async notifyAchievement(userId, achievementData) {
    const title = 'Nova Conquista Desbloqueada! 🏆';
    const message = `Você desbloqueou a conquista "${achievementData.name}"! Continue assim!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      achievementId: achievementData.id,
      achievementName: achievementData.name
    });
  }

  // Notificação de nível
  static async notifyLevelUp(userId, newLevel) {
    const title = 'Subiu de Nível! ⬆️';
    const message = `Parabéns! Você alcançou o nível ${newLevel}! Continue reciclando!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      newLevel
    });
  }

  // Notificação de ranking
  static async notifyRankingUpdate(userId, position, totalUsers) {
    const title = 'Atualização do Ranking! 📊';
    const message = `Você está na ${position}ª posição de ${totalUsers} usuários!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      position,
      totalUsers
    });
  }

  // Notificação de recompensa disponível
  static async notifyRewardAvailable(userId, rewardData) {
    const title = 'Nova Recompensa Disponível! 🎁';
    const message = `Uma nova recompensa "${rewardData.name}" está disponível por ${rewardData.pointsRequired} pontos!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      rewardId: rewardData.id,
      rewardName: rewardData.name,
      pointsRequired: rewardData.pointsRequired
    });
  }

  // Notificação de desafio
  static async notifyChallenge(userId, challengeData) {
    const title = 'Novo Desafio Disponível! 🎯';
    const message = `Novo desafio: "${challengeData.title}". Complete e ganhe ${challengeData.points} pontos!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      challengeId: challengeData.id,
      challengeTitle: challengeData.title,
      points: challengeData.points
    });
  }

  // Notificação de lembrete
  static async sendReminder(userId, daysInactive) {
    const title = 'Vamos Reciclar! ♻️';
    const message = `Faz ${daysInactive} dias que você não registra um descarte. Que tal reciclar hoje?`;
    
    await this.sendUserNotification(userId, 'EMAIL', title, message, {
      daysInactive
    });
  }

  // Notificação de boas-vindas
  static async sendWelcome(userId) {
    const title = 'Bem-vindo ao Descarte Certo! 🌍';
    const message = 'Obrigado por se juntar à nossa comunidade de reciclagem! Vamos juntos fazer a diferença!';
    
    await this.sendUserNotification(userId, 'EMAIL', title, message);
  }

  // Notificação de aniversário
  static async sendBirthdayWish(userId) {
    const title = 'Feliz Aniversário! 🎉';
    const message = 'Parabéns pelo seu dia! Que tal celebrar fazendo algo especial pelo meio ambiente?';
    
    await this.sendUserNotification(userId, 'IN_APP', title, message);
  }

  // Notificação de meta semanal
  static async notifyWeeklyGoal(userId, goalProgress, goalTarget) {
    const percentage = Math.round((goalProgress / goalTarget) * 100);
    const title = 'Meta Semanal! 📈';
    const message = `Você completou ${percentage}% da sua meta semanal (${goalProgress}/${goalTarget}kg)!`;
    
    await this.sendUserNotification(userId, 'IN_APP', title, message, {
      goalProgress,
      goalTarget,
      percentage
    });
  }

  // Gerar HTML para emails
  static generateEmailHTML(title, message) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 Descarte Certo</h1>
            <p>${title}</p>
          </div>
          <div class="content">
            <p>${message}</p>
            <a href="${process.env.FRONTEND_URL}" class="button">Acessar Plataforma</a>
            <p>Continue fazendo a diferença no meio ambiente!</p>
          </div>
          <div class="footer">
            <p>© 2024 Descarte Certo. Todos os direitos reservados.</p>
            <p>Se você não quiser receber mais emails, <a href="#">clique aqui</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Buscar notificações do usuário
  static async getUserNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({
        where: { userId }
      })
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Marcar notificação como lida
  static async markAsRead(notificationId, userId) {
    return await prisma.notification.update({
      where: {
        id: notificationId,
        userId // Garantir que a notificação pertence ao usuário
      },
      data: { readAt: new Date() }
    });
  }

  // Marcar todas como lidas
  static async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null
      },
      data: { readAt: new Date() }
    });
  }

  // Deletar notificação
  static async deleteNotification(notificationId, userId) {
    return await prisma.notification.delete({
      where: {
        id: notificationId,
        userId
      }
    });
  }

  // Contar notificações não lidas
  static async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: {
        userId,
        readAt: null
      }
    });
  }
}

module.exports = NotificationService; 