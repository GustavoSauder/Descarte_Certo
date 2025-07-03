import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward, FaCrown, FaStar, FaChartLine, FaUsers, FaMapMarkerAlt, FaRecycle, FaSchool, FaCity, FaLeaf, FaHandshake, FaLock } from 'react-icons/fa';
import Table from '../components/ui/Table';
import { Loading } from '../components/ui/Loading';
import Card from '../components/ui/Card';
import { useScrollAnimation, useStaggerAnimation } from '../hooks';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const RankingPage = () => {
  const { isAuthenticated } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recycling');

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_metrics')
        .select('user_id, points, level')
        .order('points', { ascending: false });
      if (error) setError(error.message);
      else setRanking(data || []);
      setLoading(false);
    }
    fetchRanking();
    // Realtime subscription
    const channel = supabase
      .channel('public:user_metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_metrics' }, fetchRanking)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return <FaCrown className="text-yellow-500 text-2xl" />;
      case 2: return <FaMedal className="text-gray-400 text-xl" />;
      case 3: return <FaAward className="text-amber-600 text-xl" />;
      default: return <FaStar className="text-blue-500 text-lg" />;
    }
  };

  const getPositionBadge = (position) => {
    switch (position) {
      case 1: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 3: return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const tabs = [
    { id: 'recycling', label: 'Reciclagem Individual', icon: FaRecycle, color: 'green' },
    { id: 'collection', label: 'Coleta Escolar', icon: FaSchool, color: 'blue' },
    { id: 'schools', label: 'Ranking de Escolas', icon: FaHandshake, color: 'purple' },
    { id: 'cities', label: 'Ranking de Cidades', icon: FaCity, color: 'orange' },
    { id: 'impact', label: 'Impacto Geral', icon: FaLeaf, color: 'teal' }
  ];

  const getTabData = () => {
    const data = ranking.slice(0, 3); // Top 3 para o podium
    return data;
  };

  const getTableData = () => {
    return ranking.map((item, index) => ({
      position: index + 1,
      name: item.user_id,
      points: item.points,
      level: item.level
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full flex items-center justify-center">
      <Loading text="Carregando rankings..." />
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full flex items-center justify-center">
      <div className="text-red-500 text-center">{error}</div>
    </div>
  );

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ranking
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Veja quem está liderando a transformação ambiental
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 w-full">
          {/* Aviso de funcionalidades limitadas para usuários não logados */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <FaLock className="text-yellow-600 text-xl" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Modo de Visualização</h3>
                  <p className="text-yellow-700 text-sm">
                    Você está visualizando o ranking em modo limitado. Faça login para ver sua posição e acessar funcionalidades completas.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="w-full">
            {/* Estatísticas Gerais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="text-center p-6">
                <FaUsers className="text-3xl text-blue-500 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Participantes</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">12,847</p>
              </Card>
              <Card className="text-center p-6">
                <FaSchool className="text-3xl text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Escolas</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">168</p>
              </Card>
              <Card className="text-center p-6">
                <FaMapMarkerAlt className="text-3xl text-purple-500 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cidades</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">156</p>
              </Card>
              <Card className="text-center p-6">
                <FaLeaf className="text-3xl text-teal-500 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Impacto Total</h3>
                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">542t</p>
              </Card>
            </motion.div>

            {/* Tabs de Categorias */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 justify-center mb-8"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? `bg-${tab.color}-600 text-white shadow-lg`
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="text-lg" />
                    {tab.label}
                  </button>
                );
              })}
            </motion.div>

            {/* Top 3 Podium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {getTabData().map((item, index) => {
                const position = index + 1;
                const isFirst = position === 1;
                
                return (
                  <div key={item.user_id} className={`order-${position} ${isFirst ? 'md:order-2' : position === 2 ? 'md:order-1' : 'md:order-3'}`}>
                    <Card className={`text-center p-6 relative ${isFirst ? 'bg-gradient-to-b from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800' : ''}`}>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        {getPositionIcon(position)}
                      </div>
                      <div className="mt-4">
                        <div className={`w-${isFirst ? '24' : '20'} h-${isFirst ? '24' : '20'} ${
                          isFirst ? 'bg-yellow-500' : position === 2 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-amber-200 dark:bg-amber-800'
                        } rounded-full mx-auto mb-4 flex items-center justify-center text-${isFirst ? '3xl' : '2xl'} font-bold ${
                          isFirst ? 'text-white' : position === 2 ? 'text-gray-600 dark:text-gray-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {position}
                        </div>
                        <h3 className={`text-${isFirst ? 'xl' : 'lg'} font-semibold text-gray-900 dark:text-white mb-2`}>
                          {item.user_id}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{item.level}</p>
                        <p className={`text-${isFirst ? '3xl' : '2xl'} font-bold ${
                          isFirst ? 'text-yellow-600 dark:text-yellow-400' : 
                          position === 2 ? 'text-gray-500 dark:text-gray-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {item.points} pts
                        </p>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </motion.div>

            {/* Tabela Completa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ranking Completo - {activeTabConfig?.label}
                </h2>
              </div>
              <Table
                columns={[
                  { key: 'position', label: 'Posição', width: 'w-20' },
                  { key: 'name', label: 'Nome', width: 'flex-1' },
                  { key: 'points', label: 'Pontos', width: 'w-32' },
                  { key: 'level', label: 'Nível', width: 'w-32' }
                ]}
                data={getTableData()}
              />
            </motion.div>

            {/* Como Funciona */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Como Funciona o Ranking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <ul className="space-y-2">
                  <li>• Ranking é atualizado em tempo real</li>
                  <li>• Pontos baseados em ações sustentáveis</li>
                  <li>• Impacto medido em toneladas recicladas</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Escolas ganham pontos por participação</li>
                  <li>• Cidades são ranqueadas por engajamento</li>
                  <li>• Prêmios semanais para os melhores</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RankingPage; 