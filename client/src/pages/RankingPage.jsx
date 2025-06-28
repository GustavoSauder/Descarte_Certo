import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward, FaCrown, FaStar, FaChartLine, FaUsers, FaMapMarkerAlt, FaRecycle, FaSchool, FaCity, FaLeaf, FaHandshake, FaLock } from 'react-icons/fa';
import Table from '../components/ui/Table';
import { Loading } from '../components/ui/Loading';
import Card from '../components/ui/Card';
import { useScrollAnimation, useStaggerAnimation, useAuth } from '../hooks';

const RankingPage = () => {
  const { isAuthenticated } = useAuth();
  const [rankings, setRankings] = useState({
    recycling: [],
    collection: [],
    schools: [],
    cities: [],
    impact: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recycling');

  useEffect(() => {
    loadAllRankings();
  }, []);

  const loadAllRankings = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados reais do backend
      const mockData = {
        recycling: [
          { id: 1, name: 'João Silva', points: 12500, city: 'São Paulo', school: 'Escola Verde', level: 15, disposals: 45, impact: '2.5 toneladas' },
          { id: 2, name: 'Maria Santos', points: 11800, city: 'Rio de Janeiro', school: 'Colégio Sustentável', level: 14, disposals: 42, impact: '2.1 toneladas' },
          { id: 3, name: 'Pedro Costa', points: 11200, city: 'Belo Horizonte', school: 'Instituto Ecológico', level: 13, disposals: 38, impact: '1.8 toneladas' },
          { id: 4, name: 'Ana Oliveira', points: 10500, city: 'Curitiba', school: 'Escola Verde', level: 12, disposals: 35, impact: '1.6 toneladas' },
          { id: 5, name: 'Carlos Lima', points: 9800, city: 'Porto Alegre', school: 'Colégio Sustentável', level: 11, disposals: 32, impact: '1.4 toneladas' },
        ],
        collection: [
          { id: 1, name: 'Escola Verde', city: 'São Paulo', collections: 156, students: 1200, impact: '15.2 toneladas' },
          { id: 2, name: 'Colégio Sustentável', city: 'Rio de Janeiro', collections: 142, students: 980, impact: '12.8 toneladas' },
          { id: 3, name: 'Instituto Ecológico', city: 'Belo Horizonte', collections: 128, students: 850, impact: '10.5 toneladas' },
          { id: 4, name: 'Escola Futuro', city: 'Curitiba', collections: 115, students: 720, impact: '8.9 toneladas' },
          { id: 5, name: 'Colégio Inovação', city: 'Porto Alegre', collections: 98, students: 650, impact: '7.2 toneladas' },
        ],
        schools: [
          { id: 1, name: 'Escola Verde', city: 'São Paulo', students: 1200, impact: '15.2 toneladas', projects: 8, rating: 4.8 },
          { id: 2, name: 'Colégio Sustentável', city: 'Rio de Janeiro', students: 980, impact: '12.8 toneladas', projects: 6, rating: 4.6 },
          { id: 3, name: 'Instituto Ecológico', city: 'Belo Horizonte', students: 850, impact: '10.5 toneladas', projects: 5, rating: 4.4 },
          { id: 4, name: 'Escola Futuro', city: 'Curitiba', students: 720, impact: '8.9 toneladas', projects: 4, rating: 4.2 },
          { id: 5, name: 'Colégio Inovação', city: 'Porto Alegre', students: 650, impact: '7.2 toneladas', projects: 3, rating: 4.0 },
        ],
        cities: [
          { id: 1, name: 'São Paulo', schools: 45, students: 12500, impact: '156.8 toneladas', participation: 89 },
          { id: 2, name: 'Rio de Janeiro', schools: 38, students: 9800, impact: '128.5 toneladas', participation: 76 },
          { id: 3, name: 'Belo Horizonte', schools: 32, students: 8200, impact: '98.2 toneladas', participation: 68 },
          { id: 4, name: 'Curitiba', schools: 28, students: 7200, impact: '85.4 toneladas', participation: 72 },
          { id: 5, name: 'Porto Alegre', schools: 25, students: 6500, impact: '72.1 toneladas', participation: 65 },
        ],
        impact: [
          { id: 1, name: 'João Silva', totalImpact: '2.5 toneladas', projects: 12, hours: 180, innovation: 8 },
          { id: 2, name: 'Maria Santos', totalImpact: '2.1 toneladas', projects: 10, hours: 165, innovation: 7 },
          { id: 3, name: 'Pedro Costa', totalImpact: '1.8 toneladas', projects: 8, hours: 142, innovation: 6 },
          { id: 4, name: 'Ana Oliveira', totalImpact: '1.6 toneladas', projects: 7, hours: 128, innovation: 5 },
          { id: 5, name: 'Carlos Lima', totalImpact: '1.4 toneladas', projects: 6, hours: 115, innovation: 4 },
        ]
      };
      
      setRankings(mockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    const data = rankings[activeTab] || [];
    return data.slice(0, 3); // Top 3 para o podium
  };

  const getTableData = () => {
    const data = rankings[activeTab] || [];
    return data.map((item, index) => ({
      position: index + 1,
      name: item.name,
      points: item.points || item.collections || item.students || item.totalImpact,
      city: item.city,
      school: item.school,
      impact: item.impact || item.projects || item.participation || item.hours,
      level: item.level || item.rating || item.innovation
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
                  <div key={item.id} className={`order-${position} ${isFirst ? 'md:order-2' : position === 2 ? 'md:order-1' : 'md:order-3'}`}>
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
                          {item.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{item.city}</p>
                        <p className={`text-${isFirst ? '3xl' : '2xl'} font-bold ${
                          isFirst ? 'text-yellow-600 dark:text-yellow-400' : 
                          position === 2 ? 'text-gray-500 dark:text-gray-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {activeTab === 'recycling' ? `${item.points} pts` :
                           activeTab === 'collection' ? `${item.collections} coletas` :
                           activeTab === 'schools' ? `${item.students} alunos` :
                           activeTab === 'cities' ? `${item.schools} escolas` :
                           `${item.totalImpact}`}
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
                  { key: 'points', label: activeTab === 'recycling' ? 'Pontos' : 
                                         activeTab === 'collection' ? 'Coletas' :
                                         activeTab === 'schools' ? 'Alunos' :
                                         activeTab === 'cities' ? 'Escolas' : 'Impacto', width: 'w-32' },
                  { key: 'city', label: 'Cidade', width: 'w-32' },
                  { key: 'impact', label: activeTab === 'recycling' ? 'Impacto' :
                                         activeTab === 'collection' ? 'Estudantes' :
                                         activeTab === 'schools' ? 'Projetos' :
                                         activeTab === 'cities' ? 'Participação' : 'Horas', width: 'w-32' },
                  { key: 'level', label: activeTab === 'recycling' ? 'Nível' :
                                       activeTab === 'collection' ? 'Impacto' :
                                       activeTab === 'schools' ? 'Avaliação' :
                                       activeTab === 'cities' ? 'Estudantes' : 'Inovação', width: 'w-32' }
                ]}
                data={getTableData().map((item, index) => ({
                  ...item,
                  position: (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionBadge(item.position)}`}>
                        {item.position}º
                      </span>
                      {getPositionIcon(item.position)}
                    </div>
                  )
                }))}
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