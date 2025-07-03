import { useEffect, useState } from 'react';
import { marketplaceService } from '../services';

// Hook para buscar recompensas reais do backend
export function useRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRewards() {
      setLoading(true);
      setError(null);
      try {
        const response = await marketplaceService.listRewards();
        if (response.data) {
          setRewards(response.data);
        } else {
          setRewards([]);
        }
      } catch (err) {
        console.error('Erro ao buscar recompensas:', err);
        setError(err.message);
        setRewards([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRewards();
  }, []);

  // Retorna apenas o array de recompensas (RewardsPage já trata loading/erro)
  return rewards;
} 