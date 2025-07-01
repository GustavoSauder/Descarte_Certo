import api from './api';

// Serviço para gerenciar dados da equipe em tempo real
export const equipeService = {
  // Buscar dados da equipe
  async getEquipe() {
    try {
      const response = await api.get('/equipe');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados da equipe:', error);
      throw error;
    }
  },

  // Sincronizar dados da equipe
  async syncEquipe(equipeData) {
    try {
      const response = await api.post('/equipe/sync', { equipe: equipeData });
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar dados da equipe:', error);
      throw error;
    }
  },

  // Atualizar dados da equipe
  async updateEquipe(equipeData) {
    try {
      const response = await api.put('/equipe', { equipe: equipeData });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar dados da equipe:', error);
      throw error;
    }
  },

  // Adicionar novo membro
  async addMembro(membroData) {
    try {
      const response = await api.post('/equipe/membros', membroData);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  },

  // Atualizar membro específico
  async updateMembro(nome, membroData) {
    try {
      const response = await api.put(`/equipe/membros/${encodeURIComponent(nome)}`, membroData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
  },

  // Remover membro
  async removeMembro(nome) {
    try {
      const response = await api.delete(`/equipe/membros/${encodeURIComponent(nome)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
  },

  // Buscar histórico de alterações
  async getHistorico() {
    try {
      const response = await api.get('/equipe/historico');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  },

  // Exportar dados da equipe
  async exportEquipe(format = 'json') {
    try {
      const response = await api.get(`/equipe/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar dados da equipe:', error);
      throw error;
    }
  },

  // Importar dados da equipe
  async importEquipe(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/equipe/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao importar dados da equipe:', error);
      throw error;
    }
  },

  // Verificar conectividade
  async checkConnectivity() {
    try {
      const response = await api.get('/equipe/health');
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar conectividade:', error);
      return { online: false, error: error.message };
    }
  },

  // Obter estatísticas da equipe
  async getEstatisticas() {
    try {
      const response = await api.get('/equipe/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
};

// Hook para usar o serviço da equipe
export const useEquipeService = () => {
  return equipeService;
};

// Função para configurar WebSocket
export const setupEquipeWebSocket = (onMessage, onError) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws/equipe`;
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket da equipe conectado');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Erro ao processar mensagem WebSocket:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('Erro no WebSocket da equipe:', error);
    onError?.(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket da equipe desconectado');
  };
  
  return ws;
};

// Função para enviar atualização via WebSocket
export const sendEquipeUpdate = (ws, equipeData) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'equipe_update',
      equipe: equipeData,
      timestamp: new Date().toISOString()
    }));
  }
};

// Função para configurar Server-Sent Events
export const setupEquipeSSE = (onMessage, onError) => {
  const eventSource = new EventSource('/api/equipe/events');
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Erro ao processar SSE:', error);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('Erro no SSE da equipe:', error);
    onError?.(error);
  };
  
  return eventSource;
};

export default equipeService; 