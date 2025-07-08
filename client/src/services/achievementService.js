// Serviço de Conquistas
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const listAchievements = async () => {
  // Chamada real à API
  const response = await fetch(`${API_BASE_URL}/users/me/achievements`);
  const data = await response.json();
  return data;
};

class AchievementService {
  async unlockAchievement(achievementId) {
    try {
      // Simular desbloqueio
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await fetch(`${API_BASE_URL}/users/me/achievements/${achievementId}/unlock`, {
        method: 'POST'
      });
      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Conquista desbloqueada!'
      };
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
      throw new Error('Falha ao desbloquear conquista');
    }
  }

  async getUserProgress() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/achievements/progress`);
      const data = await response.json();
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Erro ao buscar progresso:', error);
      throw new Error('Falha ao carregar progresso');
    }
  }

  async checkForNewAchievements(userMetrics) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/achievements/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userMetrics)
      });
      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: data.length > 0 ? 'Novas conquistas desbloqueadas!' : 'Nenhuma nova conquista'
      };
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
      throw new Error('Falha ao verificar conquistas');
    }
  }
}

export const achievementService = new AchievementService(); 