import { useState, useEffect, useCallback } from 'react';

// Classe para gerenciar cache
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos
  }

  // Adicionar item ao cache
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
    
    // Salvar no localStorage para persistência
    try {
      const serialized = JSON.stringify({ value, expiresAt });
      localStorage.setItem(`cache_${key}`, serialized);
    } catch (error) {
      console.warn('Erro ao salvar no cache:', error);
    }
  }

  // Obter item do cache
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      // Tentar carregar do localStorage
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.expiresAt > Date.now()) {
            this.cache.set(key, parsed);
            return parsed.value;
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar do cache:', error);
      }
      return null;
    }

    if (item.expiresAt <= Date.now()) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  // Verificar se item existe e não expirou
  has(key) {
    return this.get(key) !== null;
  }

  // Remover item do cache
  delete(key) {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Erro ao remover do cache:', error);
    }
  }

  // Limpar todo o cache
  clear() {
    this.cache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }

  // Limpar itens expirados
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt <= now) {
        this.delete(key);
      }
    }
  }

  // Obter estatísticas do cache
  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const item of this.cache.values()) {
      if (item.expiresAt > now) {
        valid++;
      } else {
        expired++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
    };
  }
}

// Instância global do cache
const cacheManager = new CacheManager();

// Hook para usar cache
export const useCache = (key, fetcher, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutos
    enabled = true,
    staleWhileRevalidate = true,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar dados
  const fetchData = useCallback(async (force = false) => {
    if (!enabled || !key) return;

    // Verificar cache primeiro
    if (!force && cacheManager.has(key)) {
      const cachedData = cacheManager.get(key);
      setData(cachedData);
      
      // Se staleWhileRevalidate está ativo, buscar dados frescos em background
      if (staleWhileRevalidate) {
        fetchData(true);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // Salvar no cache
      cacheManager.set(key, result, ttl);
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, enabled, staleWhileRevalidate, onSuccess, onError]);

  // Função para invalidar cache
  const invalidate = useCallback(() => {
    cacheManager.delete(key);
    setData(null);
  }, [key]);

  // Função para atualizar dados
  const update = useCallback((newData) => {
    cacheManager.set(key, newData, ttl);
    setData(newData);
  }, [key, ttl]);

  // Função para revalidar dados
  const revalidate = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Carregar dados iniciais
  useEffect(() => {
    if (enabled && key) {
      fetchData();
    }
  }, [enabled, key, fetchData]);

  return {
    data,
    loading,
    error,
    invalidate,
    update,
    revalidate,
    refetch: () => fetchData(true),
  };
};

// Hook para cache de múltiplas chaves
export const useMultiCache = (keys, fetcher, options = {}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchKey = useCallback(async (key, force = false) => {
    if (!cacheManager.has(key) || force) {
      setLoading(prev => ({ ...prev, [key]: true }));
      setError(prev => ({ ...prev, [key]: null }));

      try {
        const result = await fetcher(key);
        cacheManager.set(key, result, options.ttl);
        setData(prev => ({ ...prev, [key]: result }));
      } catch (err) {
        setError(prev => ({ ...prev, [key]: err }));
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    } else {
      const cachedData = cacheManager.get(key);
      setData(prev => ({ ...prev, [key]: cachedData }));
    }
  }, [fetcher, options.ttl]);

  const invalidateKey = useCallback((key) => {
    cacheManager.delete(key);
    setData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  }, []);

  const invalidateAll = useCallback(() => {
    keys.forEach(key => cacheManager.delete(key));
    setData({});
  }, [keys]);

  useEffect(() => {
    keys.forEach(key => fetchKey(key));
  }, [keys, fetchKey]);

  return {
    data,
    loading,
    error,
    invalidateKey,
    invalidateAll,
    refetchKey: (key) => fetchKey(key, true),
  };
};

// Funções utilitárias para cache
export const cacheUtils = {
  // Obter dados do cache
  get: (key) => cacheManager.get(key),
  
  // Definir dados no cache
  set: (key, value, ttl) => cacheManager.set(key, value, ttl),
  
  // Verificar se existe
  has: (key) => cacheManager.has(key),
  
  // Remover do cache
  delete: (key) => cacheManager.delete(key),
  
  // Limpar todo o cache
  clear: () => cacheManager.clear(),
  
  // Limpar itens expirados
  cleanup: () => cacheManager.cleanup(),
  
  // Obter estatísticas
  getStats: () => cacheManager.getStats(),
};

export default useCache; 