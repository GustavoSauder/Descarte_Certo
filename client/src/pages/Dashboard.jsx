import React, { useEffect, useState } from 'react';
import { FaLeaf, FaTrophy, FaRecycle, FaGift, FaChartLine, FaUsers, FaMedal } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useUserMetrics } from '../hooks/useUserMetrics.js';
import { useAppState } from '../hooks';
import { disposalService } from '../services';
import { marketplaceService } from '../services';
import { motion } from 'framer-motion';
import { Loading } from '../components/ui/Loading';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const userMetrics = useUserMetrics(user);
  const { addNotification } = useAppState();
  const [recentDisposals, setRecentDisposals] = useState([]);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      
      setLoading(true);
      try {
        // Buscar histórico recente de descartes
        const disposalsResponse = await disposalService.listDisposals();
        if (disposalsResponse.data) {
          setRecentDisposals(disposalsResponse.data.slice(0, 3)); // Últimos 3
        }

        // Buscar recompensas disponíveis
        const rewardsResponse = await marketplaceService.listRewards();
        if (rewardsResponse.data) {
          setAvailableRewards(rewardsResponse.data.slice(0, 3)); // Primeiras 3
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Não foi possível carregar alguns dados do dashboard'
        });
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, addNotification]);

  const userPoints = userMetrics?.points ?? 0;
  const userRanking = userMetrics?.ranking ?? 'N/A';
  const totalDisposals = userMetrics?.total_disposals ?? 0;
  const totalImpact = userMetrics?.total_impact ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meu Painel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Acompanhe seu progresso e impacto ambiental
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FaLeaf className="text-xl sm:text-2xl text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Meus Pontos</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{userPoints.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <FaTrophy className="text-xl sm:text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Ranking</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{userRanking}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaRecycle className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Descarte Realizados</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{totalDisposals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FaChartLine className="text-xl sm:text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Impacto Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{totalImpact}kg</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Histórico de Descartes */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Histórico de Descartes
              </h3>
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Carregando...</p>
                </div>
              ) : recentDisposals.length > 0 ? (
                recentDisposals.map((disposal, index) => (
                  <div key={disposal.id || index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{disposal.material_type}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{disposal.weight}kg reciclado</p>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="text-green-600 font-semibold text-sm">+{disposal.points_earned} pts</p>
                      <p className="text-xs text-gray-500">{new Date(disposal.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Nenhum descarte registrado ainda</p>
                </div>
              )}
            </div>
          </Card>

          {/* Loja de Recompensas */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Loja de Recompensas
              </h3>
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Carregando...</p>
                </div>
              ) : availableRewards.length > 0 ? (
                availableRewards.map((reward, index) => (
                  <div key={reward.id || index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-2 sm:mr-3">
                        <FaGift className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{reward.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{reward.description}</p>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="text-green-600 font-semibold text-sm">{reward.points} pts</p>
                      <Button 
                        size="sm" 
                        className="mt-1"
                        disabled={userPoints < reward.points}
                        onClick={() => {
                          addNotification({
                            type: 'info',
                            title: 'Resgate',
                            message: 'Redirecionando para a página de recompensas...'
                          });
                        }}
                      >
                        Resgatar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Nenhuma recompensa disponível no momento</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Conquistas Recentes */}
        <Card className="mt-6 sm:mt-8 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Conquistas Recentes
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userMetrics?.recent_achievements?.length > 0 ? (
              userMetrics.recent_achievements.map((achievement, index) => (
                <div key={achievement.id || index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-3">
                    <FaMedal className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">+{achievement.points} pontos</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <FaTrophy className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>Continue reciclando para desbloquear conquistas!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 