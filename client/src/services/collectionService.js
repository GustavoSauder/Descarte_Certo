import { api } from './api';

class CollectionService {
  // Buscar todos os pontos de coleta
  async getAllPoints(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.materials && filters.materials.length > 0) {
        params.append('materials', filters.materials.join(','));
      }
      
      if (filters.openNow) {
        params.append('openNow', 'true');
      }
      
      if (filters.radius) {
        params.append('radius', filters.radius);
      }

      const response = await api.get(`/collection?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar pontos de coleta: ' + error.message);
    }
  }

  // Buscar pontos próximos
  async getNearbyPoints(lat, lng, radius = 10) {
    try {
      const response = await api.get(`/collection/nearby/${lat}/${lng}?radius=${radius}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar pontos próximos: ' + error.message);
    }
  }

  // Buscar ponto por ID
  async getPointById(id) {
    try {
      const response = await api.get(`/collection/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar ponto de coleta: ' + error.message);
    }
  }

  // Buscar pontos por material
  async getPointsByMaterial(material) {
    try {
      const response = await api.get(`/collection/material/${material}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar pontos por material: ' + error.message);
    }
  }

  // Buscar pontos por cidade
  async getPointsByCity(city) {
    try {
      const response = await api.get(`/collection/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar pontos por cidade: ' + error.message);
    }
  }

  // Calcular distância entre dois pontos
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Filtrar pontos por critérios
  filterPoints(points, filters = {}) {
    let filteredPoints = [...points];

    // Filtrar por materiais
    if (filters.materials && filters.materials.length > 0) {
      filteredPoints = filteredPoints.filter(point => 
        point.materials.some(material => 
          filters.materials.includes(material)
        )
      );
    }

    // Filtrar por raio (se tiver localização do usuário)
    if (filters.userLocation && filters.radius) {
      filteredPoints = filteredPoints.filter(point => {
        const distance = this.calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          point.latitude,
          point.longitude
        );
        return distance <= filters.radius;
      });
    }

    // Filtrar por horário de funcionamento
    if (filters.openNow) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      filteredPoints = filteredPoints.filter(point => {
        if (!point.schedule) return true;
        
        // Lógica simples para verificar se está aberto
        // Assumindo que o schedule está no formato "08:00-18:00"
        const schedule = point.schedule.split('-');
        if (schedule.length === 2) {
          const openTime = this.timeToMinutes(schedule[0].trim());
          const closeTime = this.timeToMinutes(schedule[1].trim());
          
          return currentTime >= openTime && currentTime <= closeTime;
        }
        
        return true;
      });
    }

    // Ordenar por distância se tiver localização do usuário
    if (filters.userLocation) {
      filteredPoints.sort((a, b) => {
        const distanceA = this.calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          a.latitude,
          a.longitude
        );
        const distanceB = this.calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          b.latitude,
          b.longitude
        );
        return distanceA - distanceB;
      });
    }

    return filteredPoints;
  }

  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Obter estatísticas dos pontos
  async getStatistics() {
    try {
      const response = await api.get('/collection/statistics');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar estatísticas: ' + error.message);
    }
  }

  // Buscar pontos populares
  async getPopularPoints(limit = 10) {
    try {
      const response = await api.get(`/collection/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar pontos populares: ' + error.message);
    }
  }

  // Sugerir pontos baseado na localização
  async suggestPoints(lat, lng, preferences = {}) {
    try {
      const response = await api.post('/collection/suggest', {
        latitude: lat,
        longitude: lng,
        preferences
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao sugerir pontos: ' + error.message);
    }
  }

  // Reportar problema com ponto
  async reportIssue(pointId, issue) {
    try {
      const response = await api.post(`/collection/${pointId}/report`, issue);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao reportar problema: ' + error.message);
    }
  }

  // Avaliar ponto
  async ratePoint(pointId, rating, comment = '') {
    try {
      const response = await api.post(`/collection/${pointId}/rate`, {
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao avaliar ponto: ' + error.message);
    }
  }

  // Obter avaliações de um ponto
  async getPointRatings(pointId) {
    try {
      const response = await api.get(`/collection/${pointId}/ratings`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar avaliações: ' + error.message);
    }
  }

  // Marcar ponto como favorito
  async toggleFavorite(pointId) {
    try {
      const response = await api.post(`/collection/${pointId}/favorite`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao marcar favorito: ' + error.message);
    }
  }

  // Obter pontos favoritos
  async getFavorites() {
    try {
      const response = await api.get('/collection/favorites');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar favoritos: ' + error.message);
    }
  }

  // Compartilhar ponto
  async sharePoint(pointId, platform = 'whatsapp') {
    try {
      const response = await api.post(`/collection/${pointId}/share`, { platform });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao compartilhar ponto: ' + error.message);
    }
  }

  // Obter histórico de visitas
  async getVisitHistory() {
    try {
      const response = await api.get('/collection/visits');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar histórico: ' + error.message);
    }
  }

  // Registrar visita
  async registerVisit(pointId) {
    try {
      const response = await api.post(`/collection/${pointId}/visit`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao registrar visita: ' + error.message);
    }
  }

  // Coletar pontos via QR code
  async collectPointsByQrCode(code) {
    try {
      const response = await api.post('/disposals/qr-collect', { code });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Erro ao coletar pontos via QR code.');
    }
  }
}

export const collectionService = new CollectionService(); 