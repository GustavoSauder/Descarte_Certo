import { useState, useEffect } from 'react';

export function useMetrics() {
  const [metrics, setMetrics] = useState({
    plasticRecycled: 0,
    products3D: 0,
    activeUsers: 0,
    ecoPoints: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchMetrics();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      setMetrics(prev => ({ ...prev, loading: true, error: null }));
      const res = await fetch('http://localhost:3002/api/impact');
      if (!res.ok) throw new Error('Erro ao buscar métricas');
      const result = await res.json();
      const data = result.data || result;
      setMetrics({
        plasticRecycled: data.impact?.co2Reduction || 0,
        products3D: Math.floor((data.impact?.co2Reduction || 0) / 10),
        activeUsers: data.totalUsers || 0,
        ecoPoints: data.impact?.totalPoints || 0,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar métricas'
      }));
    }
  };

  return metrics;
} 