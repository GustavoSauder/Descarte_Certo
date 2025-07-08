import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '../services/collectionService';

export const useCollectionService = () => {
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [cache, setCache] = useState({});

  // Função para buscar pontos próximos
  const fetchNearbyPoints = useCallback(async (lat, lng, radius = 10) => {
    const cacheKey = `nearby_${lat}_${lng}_${radius}`;
    
    // Verificar cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 5 * 60 * 1000) {
      setCollectionPoints(cache[cacheKey].data || []);
      setLastUpdate(cache[cacheKey].timestamp);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getNearbyPoints(lat, lng, radius);
      
      // Verificar se a resposta é válida
      const data = response?.data || [];
      
      // Atualizar cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: data,
          timestamp: Date.now()
        }
      }));

      setCollectionPoints(data);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message || 'Erro ao buscar pontos próximos');
      setCollectionPoints([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Função para buscar todos os pontos
  const fetchAllPoints = useCallback(async (filters = {}) => {
    const cacheKey = `all_${JSON.stringify(filters)}`;
    
    // Verificar cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 10 * 60 * 1000) {
      setCollectionPoints(cache[cacheKey].data || []);
      setLastUpdate(cache[cacheKey].timestamp);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getAllPoints(filters);
      
      // Verificar se a resposta é válida
      const data = response?.data || [];
      
      // Atualizar cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: data,
          timestamp: Date.now()
        }
      }));

      setCollectionPoints(data);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message || 'Erro ao buscar pontos de coleta');
      setCollectionPoints([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Função para buscar ponto por ID
  const fetchPointById = useCallback(async (id) => {
    const cacheKey = `point_${id}`;
    
    // Verificar cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 30 * 60 * 1000) {
      return cache[cacheKey].data || null;
    }

    try {
      const response = await collectionService.getPointById(id);
      
      // Verificar se a resposta é válida
      const data = response?.data || null;
      
      // Atualizar cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: data,
          timestamp: Date.now()
        }
      }));

      return data;
    } catch (err) {
      setError(err.message || 'Erro ao buscar ponto de coleta');
      return null;
    }
  }, [cache]);

  // Função para buscar pontos por material
  const fetchPointsByMaterial = useCallback(async (material) => {
    const cacheKey = `material_${material}`;
    
    // Verificar cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 5 * 60 * 1000) {
      setCollectionPoints(cache[cacheKey].data || []);
      setLastUpdate(cache[cacheKey].timestamp);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.getPointsByMaterial(material);
      
      // Verificar se a resposta é válida
      const data = response?.data || [];
      
      // Atualizar cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: data,
          timestamp: Date.now()
        }
      }));

      setCollectionPoints(data);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message || 'Erro ao buscar pontos por material');
      setCollectionPoints([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Função para limpar cache
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  // Função para atualizar dados
  const refreshData = useCallback(() => {
    clearCache();
    if (collectionPoints.length > 0) {
      fetchAllPoints();
    }
  }, [clearCache, fetchAllPoints, collectionPoints.length]);

  // Sincronização automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (collectionPoints.length > 0) {
        refreshData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshData, collectionPoints.length]);

  return {
    collectionPoints,
    loading,
    error,
    lastUpdate,
    fetchNearbyPoints,
    fetchAllPoints,
    fetchPointById,
    fetchPointsByMaterial,
    clearCache,
    refreshData
  };
}; 