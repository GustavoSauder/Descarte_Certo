import { useState, useEffect } from 'react';

export function useSchoolMetrics() {
  const [metrics, setMetrics] = useState({
    participatingSchools: 0,
    totalRecycledWaste: 0,
    products3D: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchSchoolMetrics();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchSchoolMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSchoolMetrics = async () => {
    try {
      setMetrics(prev => ({ ...prev, loading: true, error: null }));
      const res = await fetch('http://localhost:3002/api/impact/schools');
      if (!res.ok) throw new Error('Erro ao buscar métricas escolares');
      const result = await res.json();
      const schools = result.schools || [];
      const participatingSchools = schools.length;
      const totalRecycledWaste = schools.reduce((sum, s) => sum + (s.totalWeight || 0), 0);
      setMetrics({
        participatingSchools,
        totalRecycledWaste: Math.round(totalRecycledWaste * 100) / 100,
        products3D: 0, // Ajuste se houver dado real
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Erro ao buscar métricas escolares:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar métricas escolares'
      }));
    }
  };

  return metrics;
} 