import { useState, useEffect } from 'react';
import metricsService from '../services/metricsService';
import { supabase } from '../lib/supabase';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState({
    onlineUsers: 0,
    schoolsCount: 0,
    citiesCount: 0,
    totalWeight: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      if (data && data.data) setMetrics(data.data);
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disposals' }, fetchMetrics)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshMetrics = () => {
    fetchMetrics();
  };

  return {
    ...metrics,
    loading,
    error,
    refreshMetrics
  };
};

export const useDetailedStats = () => {
  const [stats, setStats] = useState({
    totalDisposals: 0,
    totalUsers: 0,
    totalFeedback: 0,
    totalWeight: 0,
    avgPointsPerUser: 0,
    materialDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsService.getDetailedStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao buscar estatísticas detalhadas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refreshStats = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}; 