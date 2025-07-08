import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaMedal, 
  FaStar, 
  FaLeaf, 
  FaRecycle, 
  FaTree, 
  FaSeedling, 
  FaGlobe,
  FaAward,
  FaCrown,
  FaGem,
  FaFire,
  FaHeart,
  FaLightbulb,
  FaHandshake,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaPercentage,
  FaInfinity,
  FaRocket,
  FaFilter,
  FaSearch,
  FaSort,
  FaEye,
  FaShare,
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCog,
  FaPalette,
  FaHome,
  FaGamepad,
  FaBook,
  FaPencilAlt,
  FaCar,
  FaBicycle,
  FaUmbrella,
  FaMugHot,
  FaKey,
  FaGift
} from 'react-icons/fa';
import { achievementService } from '../services/achievementService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import Sidebar from '../components/ui/Sidebar';
import ScrollAnimation from '../components/ui/ScrollAnimation';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks/useAppState.jsx';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { addNotification } = useAppState();

  useEffect(() => {
    async function fetchAchievements() {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await achievementService.listAchievements();
        if (response.data) {
          setAchievements(response.data);
        } else {
          setAchievements([]);
        }
      } catch (err) {
        console.error('Erro ao buscar conquistas:', err);
        setError('Erro ao carregar conquistas');
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Não foi possível carregar as conquistas'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [user, addNotification]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'uncommon': return 'text-green-600 dark:text-green-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRarityBg = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-700';
      case 'uncommon': return 'bg-green-100 dark:bg-green-900/20';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getIconColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 dark:text-gray-400';
      case 'uncommon': return 'text-green-500 dark:text-green-400';
      case 'rare': return 'text-blue-500 dark:text-blue-400';
      case 'epic': return 'text-purple-500 dark:text-purple-400';
      case 'legendary': return 'text-yellow-500 dark:text-yellow-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  if (loading) return <Loading text="Carregando conquistas..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <FaTrophy className="text-4xl text-yellow-500" />
              Minhas Conquistas
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Celebre suas conquistas na reciclagem e inspire outros a fazer a diferença
            </p>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaAward className="text-3xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{unlockedCount}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conquistas Desbloqueadas</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {Math.round((unlockedCount / achievements.length) * 100)}% completo
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaStar className="text-3xl text-blue-500" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalPoints}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pontos Ganhos</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Continue reciclando para ganhar mais pontos!
              </div>
            </Card>

            <Card className="text-center p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaChartLine className="text-3xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {achievements.filter(a => !a.unlocked && a.progress > 0).length}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Em Progresso</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Você está próximo de novas conquistas!
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todas ({achievements.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'unlocked'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Desbloqueadas ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'locked'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Bloqueadas ({achievements.length - unlockedCount})
            </button>
          </div>

          {/* Lista de Conquistas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    achievement.unlocked ? 'ring-2 ring-yellow-500' : ''
                  }`}>
                    {/* Status de Desbloqueio */}
                    <div className="absolute top-4 right-4">
                      {achievement.unlocked ? (
                        <FaUnlock className="text-green-500 text-xl" />
                      ) : (
                        <FaLock className="text-gray-400 text-xl" />
                      )}
                    </div>

                    {/* Ícone */}
                    <div className="text-center mb-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getRarityBg(achievement.rarity)}`}>
                        <Icon className={`text-2xl ${getIconColor(achievement.rarity)}`} />
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {achievement.description}
                      </p>

                      {/* Badge */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}`}>
                        {achievement.badgeType}
                      </span>

                      {/* Progresso */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progresso</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              achievement.unlocked ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Pontos */}
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <FaStar className="text-yellow-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {achievement.points} pontos
                        </span>
                      </div>

                      {/* Data de Desbloqueio */}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Mensagem quando não há conquistas */}
          {filteredAchievements.length === 0 && (
          <Card className="text-center py-12">
              <FaTrophy className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {filter === 'unlocked' 
                  ? 'Você ainda não desbloqueou nenhuma conquista. Continue reciclando!'
                  : 'Nenhuma conquista encontrada com este filtro.'
                }
              </p>
          </Card>
        )}
        </motion.div>
      </div>
    </div>
  );
};

export default AchievementsPage; 