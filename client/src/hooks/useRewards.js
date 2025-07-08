import { useEffect, useState } from 'react';
import { marketplaceService } from '../services';
import { useAuth } from './useAuth';

// Dados fictícios de recompensas
const mockRewards = [
  {
    id: 3,
    title: 'Camiseta Ecológica',
    description: 'Camiseta feita com algodão orgânico',
    points: 1200,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    stock: 15,
    category: 'Produtos Sustentáveis',
    partner: 'GreenWear'
  },
  {
    id: 4,
    title: 'Livro Sustentabilidade',
    description: 'Guia completo sobre vida sustentável',
    points: 1500,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop',
    stock: 30,
    category: 'Produtos Sustentáveis',
    partner: 'EcoBooks'
  },
  {
    id: 6,
    title: 'Cupom 15% Off Bicicletas',
    description: 'Desconto em bicicletas sustentáveis',
    points: 1000,
    type: 'coupon',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&h=200&fit=crop',
    stock: 20,
    category: 'Cupons de Desconto',
    partner: 'BikeStore'
  },
  {
    id: 9,
    title: 'Cupom 30% Off Energia Solar',
    description: 'Desconto em instalação de painéis solares',
    points: 5000,
    type: 'coupon',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop',
    stock: 5,
    category: 'Cupons de Desconto',
    partner: 'SolarTech'
  },
  {
    id: 10,
    title: 'Kit de Sementes Orgânicas',
    description: 'Kit completo para cultivar sua horta',
    points: 600,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop',
    stock: 40,
    category: 'Produtos Sustentáveis',
    partner: 'OrganicGarden'
  },
  {
    id: 11,
    title: 'Passeio de Bicicleta Guiado',
    description: 'Passeio ecológico pela cidade',
    points: 800,
    type: 'experience',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200&h=200&fit=crop',
    stock: 15,
    category: 'Experiências',
    partner: 'EcoTours'
  },
  {
    id: 12,
    title: 'Vaso 3D Personalizado',
    description: 'Vaso para plantas impresso em 3D',
    points: 400,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop',
    stock: 50,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 13,
    title: 'Cupom 25% Off Produtos Orgânicos',
    description: 'Desconto em produtos orgânicos e naturais',
    points: 750,
    type: 'coupon',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    stock: 30,
    category: 'Cupons de Desconto',
    partner: 'OrganicMarket'
  },
  {
    id: 14,
    title: 'Caneca Ecológica Personalizada',
    description: 'Caneca feita com material reciclado',
    points: 350,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    stock: 60,
    category: 'Produtos Sustentáveis',
    partner: 'EcoCups'
  },
  {
    id: 15,
    title: 'Curso Online de Sustentabilidade',
    description: 'Curso completo sobre práticas sustentáveis',
    points: 1800,
    type: 'experience',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
    stock: 25,
    category: 'Experiências',
    partner: 'EcoLearn'
  },
  {
    id: 16,
    title: 'Suporte para Celular 3D',
    description: 'Suporte personalizado impresso em 3D',
    points: 250,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 80,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 17,
    title: 'Cupom 40% Off Transporte Sustentável',
    description: 'Desconto em serviços de transporte ecológico',
    points: 1200,
    type: 'coupon',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&h=200&fit=crop',
    stock: 12,
    category: 'Cupons de Desconto',
    partner: 'GreenTransport'
  },
  {
    id: 18,
    title: 'Kit de Limpeza Ecológica',
    description: 'Kit completo com produtos de limpeza sustentáveis',
    points: 900,
    type: 'product',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
    stock: 35,
    category: 'Produtos Sustentáveis',
    partner: 'EcoClean'
  },
  {
    id: 19,
    title: 'Porta-chaves Ecológico 3D',
    description: 'Porta-chaves personalizado com design sustentável',
    points: 180,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 120,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 20,
    title: 'Organizador de Mesa 3D',
    description: 'Organizador para canetas e objetos de escritório',
    points: 320,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 45,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 21,
    title: 'Suporte para Plantas 3D',
    description: 'Suporte decorativo para vasos de plantas',
    points: 280,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop',
    stock: 60,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 22,
    title: 'Copo Reutilizável 3D',
    description: 'Copo personalizado impresso em 3D',
    points: 220,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 90,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 23,
    title: 'Suporte para Livros 3D',
    description: 'Suporte elegante para livros e documentos',
    points: 350,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 40,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 24,
    title: 'Porta-lápis Personalizado 3D',
    description: 'Porta-lápis com design único e sustentável',
    points: 150,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 100,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 25,
    title: 'Suporte para Fones 3D',
    description: 'Suporte para fones de ouvido personalizado',
    points: 200,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 75,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 26,
    title: 'Vaso Decorativo 3D',
    description: 'Vaso com design geométrico impresso em 3D',
    points: 380,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop',
    stock: 30,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 27,
    title: 'Organizador de Joias 3D',
    description: 'Organizador para anéis e colares personalizado',
    points: 260,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 55,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 28,
    title: 'Suporte para Carregador 3D',
    description: 'Suporte para carregador de celular personalizado',
    points: 190,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 85,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 29,
    title: 'Copo para Plantas 3D',
    description: 'Copo decorativo para pequenas plantas',
    points: 240,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop',
    stock: 70,
    category: 'Impressão 3D',
    partner: '3D Lab'
  },
  {
    id: 30,
    title: 'Suporte para Tablet 3D',
    description: 'Suporte ajustável para tablet personalizado',
    points: 420,
    type: '3d_printing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
    stock: 25,
    category: 'Impressão 3D',
    partner: '3D Lab'
  }
];

// Dados fictícios de histórico de recompensas resgatadas
const mockRedeemedHistory = [];

// Hook para buscar recompensas reais do backend
export function useRewards() {
  const [rewards, setRewards] = useState([]);
  const [redeemedHistory, setRedeemedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchRewards() {
      setLoading(true);
      setError(null);
      try {
        // Se o usuário não estiver autenticado, usar dados fictícios
        if (!isAuthenticated) {
          console.log('useRewards: Usuário não autenticado, usando dados fictícios');
          setRewards(mockRewards);
          setRedeemedHistory(mockRedeemedHistory);
          setLoading(false);
          return;
        }

        // Tentar buscar do backend primeiro
        const response = await marketplaceService.listRewards();
        if (response.data && response.data.length > 0) {
          setRewards(response.data);
        } else {
          // Se não houver dados do backend, usar dados fictícios
          setRewards(mockRewards);
        }
        
        // Buscar histórico de recompensas resgatadas
        try {
          const historyResponse = await marketplaceService.getRewardHistory();
          if (historyResponse.data && historyResponse.data.length > 0) {
            setRedeemedHistory(historyResponse.data);
          } else {
            // Se não houver dados do backend, usar dados fictícios
            setRedeemedHistory(mockRedeemedHistory);
          }
        } catch (historyError) {
          console.warn('Erro ao buscar histórico, usando dados fictícios:', historyError);
          setRedeemedHistory(mockRedeemedHistory);
        }
      } catch (err) {
        console.warn('Erro ao buscar recompensas do backend, usando dados fictícios:', err);
        setError(err.message);
        setRewards(mockRewards);
        setRedeemedHistory(mockRedeemedHistory);
      } finally {
        setLoading(false);
      }
    }
    fetchRewards();
  }, [isAuthenticated]);

  // Função para resgatar recompensa
  const redeemReward = async (rewardId) => {
    try {
      // Se o usuário não estiver autenticado, simular resgate local
      if (!isAuthenticated) {
        console.log('useRewards: Usuário não autenticado, simulando resgate local');
        const reward = rewards.find(r => r.id === rewardId);
        if (reward) {
          const newRedeemedItem = {
            id: Date.now(),
            rewardId: rewardId,
            title: reward.title,
            points: reward.points,
            redeemedAt: new Date().toISOString(),
            status: 'redeemed',
            image: reward.image,
            partner: reward.partner
          };
          setRedeemedHistory(prev => [newRedeemedItem, ...prev]);
          return { success: true };
        }
        throw new Error('Recompensa não encontrada');
      }

      // Tentar resgatar no backend
      await marketplaceService.redeemReward(rewardId);
      
      // Adicionar ao histórico local
      const reward = rewards.find(r => r.id === rewardId);
      if (reward) {
        const newRedeemedItem = {
          id: Date.now(),
          rewardId: rewardId,
          title: reward.title,
          points: reward.points,
          redeemedAt: new Date().toISOString(),
          status: 'redeemed',
          image: reward.image,
          partner: reward.partner
        };
        setRedeemedHistory(prev => [newRedeemedItem, ...prev]);
      }
      
      return { success: true };
    } catch (err) {
      console.warn('Erro ao resgatar no backend, simulando resgate local:', err);
      
      // Simular resgate local
      const reward = rewards.find(r => r.id === rewardId);
      if (reward) {
        const newRedeemedItem = {
          id: Date.now(),
          rewardId: rewardId,
          title: reward.title,
          points: reward.points,
          redeemedAt: new Date().toISOString(),
          status: 'redeemed',
          image: reward.image,
          partner: reward.partner
        };
        setRedeemedHistory(prev => [newRedeemedItem, ...prev]);
        return { success: true };
      }
      throw err;
    }
  };

  // Retorna recompensas, histórico e função de resgate
  return {
    rewards,
    redeemedHistory,
    redeemReward,
    loading,
    error
  };
} 