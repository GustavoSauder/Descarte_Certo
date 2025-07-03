import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaQrcode, 
  FaCoins, 
  FaTrophy, 
  FaChartBar, 
  FaGift, 
  FaHistory, 
  FaBell, 
  FaLeaf,
  FaRecycle,
  FaTree,
  FaWater,
  FaFire,
  FaUsers,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks';
import Card from '../components/ui/Card';
import Charts from '../components/ui/Charts';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useUserMetrics } from '../hooks/useUserMetrics';
import { supabase } from '../lib/supabase';

function usePointsHistory(userId) {
  const [pointsHistory, setPointsHistory] = useState([]);
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:4000/api/user/${userId}/points-history`)
      .then(res => res.json())
      .then(setPointsHistory);
  }, [userId]);
  return pointsHistory;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [history, setHistory] = useState([]);
  
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useAppState();
  // Buscar métricas em tempo real do Supabase
  const metrics = useUserMetrics(user);
  const pointsHistory = usePointsHistory(user?.id);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from('disposals') // ajuste para o nome real da tabela de histórico
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      setHistory(data || []);
    };
    fetchHistory();
    // Realtime subscription
    const channel = supabase
      .channel('public:disposals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disposals', filter: `user_id=eq.${user.id}` }, fetchHistory)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const achievements = [
    { id: 1, title: 'Primeiro Descarte', description: 'Realizou o primeiro descarte', iconName: 'FaLeaf', unlocked: true, progress: 100 },
    { id: 2, title: 'Reciclador Bronze', description: 'Descarte 10 itens', iconName: 'FaTrophy', unlocked: true, progress: 100 },
    { id: 3, title: 'Reciclador Prata', description: 'Descarte 50 itens', iconName: 'FaTrophy', unlocked: false, progress: 60 },
    { id: 4, title: 'Reciclador Ouro', description: 'Descarte 100 itens', iconName: 'FaTrophy', unlocked: false, progress: 30 }
  ];

  const rewards = [
    { id: 1, title: 'Cupom 10% Off', partner: 'EcoStore', points: 500, claimed: false },
    { id: 2, title: 'Plantinha Suculenta', partner: 'Garden Center', points: 800, claimed: true },
    { id: 3, title: 'Camiseta Ecológica', partner: 'GreenWear', points: 1200, claimed: false },
    { id: 4, title: 'Livro Sustentabilidade', partner: 'EcoBooks', points: 1500, claimed: false }
  ];

  const handleCollectPoints = () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'info',
        title: 'Login Necessário',
        message: 'Faça login para coletar pontos e participar da gamificação!'
      });
      return;
    }
    setShowQRModal(true);
  };

  const handleScanQR = () => {
    setIsScanning(true);
    // Simular escaneamento
    setTimeout(() => {
      setQrCode('QR123456');
      setIsScanning(false);
      addNotification({
        type: 'success',
        title: 'QR Code Detectado!',
        message: 'Código QR123456 escaneado com sucesso.'
      });
    }, 2000);
  };

  const handleManualCode = () => {
    const code = prompt('Digite o código da lixeira:');
    if (code) {
      setQrCode(code);
      addNotification({
        type: 'success',
        title: 'Código Registrado!',
        message: `Código ${code} registrado com sucesso.`
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FaChartBar },
    { id: 'points', label: 'Meus Pontos', icon: FaCoins },
    { id: 'achievements', label: 'Conquistas', icon: FaTrophy },
    { id: 'rewards', label: 'Recompensas', icon: FaGift },
    { id: 'history', label: 'Histórico', icon: FaHistory },
    { id: 'about', label: 'Sobre', icon: FaInfoCircle }
  ];

  // Gerar dados do gráfico de pontos a partir do histórico real
  const pointsByMonth = history.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString('pt-BR', { month: 'short' });
    acc[month] = (acc[month] || 0) + item.points;
    return acc;
  }, {});
  const labels = Object.keys(pointsByMonth);
  const data = Object.values(pointsByMonth);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <FaCoins className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pontos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.points ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FaTrophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nível</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.level ?? 1}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FaRecycle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Descartes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.totalDisposals ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FaGift className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recompensas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.rewards ?? 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos de Impacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Impacto Ambiental</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaTree className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">CO₂ Reduzido</span>
              </div>
              <span className="font-semibold">{metrics?.co2Reduced ?? 0} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaLeaf className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Árvores Equivalentes</span>
              </div>
              <span className="font-semibold">{metrics?.treesEquivalent ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaWater className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Água Economizada</span>
              </div>
              <span className="font-semibold">{metrics?.waterSaved ?? 0}L</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Progresso do Nível</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nível {metrics?.level ?? 1}</span>
                <span>{metrics?.experience ?? 0}/{metrics?.nextLevel ?? 1000} XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(metrics?.experience ?? 0 / metrics?.nextLevel ?? 1000) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metrics?.nextLevel ?? 1000 - metrics?.experience ?? 0} XP para o próximo nível
            </p>
          </div>
        </Card>
      </div>

      {/* Descarte Recente */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Descarte Mais Recente</h3>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">
                {history[0]?.material}
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                {history[0]?.weight}kg • {history[0]?.points} pontos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 dark:text-green-300">
                {history[0]?.date}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPoints = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Histórico de Pontos</h3>
        <Charts
          type="line"
          data={{
            labels: pointsHistory.map(item =>
              new Date(item.month).toLocaleString('pt-BR', { month: 'short', year: '2-digit' })
            ),
            datasets: [{
              label: 'Pontos Acumulados',
              data: pointsHistory.map(item => Number(item.total_points)),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Evolução dos Pontos' }
            }
          }}
        />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Como Ganhar Pontos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm">Descarte de Plástico</span>
              <span className="font-semibold text-green-600">+10 pts/kg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm">Descarte de Vidro</span>
              <span className="font-semibold text-blue-600">+15 pts/kg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm">Descarte de Papel</span>
              <span className="font-semibold text-yellow-600">+5 pts/kg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm">Descarte de Metal</span>
              <span className="font-semibold text-red-600">+20 pts/kg</span>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Próximas Metas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">{metrics?.nextLevel ?? 1000} pontos</span>
              <span className="text-xs text-gray-500">Nível {metrics?.level ? metrics.level + 1 : 2}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${((metrics?.points ?? 0) / (metrics?.nextLevel ?? 1000)) * 100}%` }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Conquistas Desbloqueadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  achievement.unlocked
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {achievement.iconName === 'FaLeaf' && (
                    <FaLeaf className={`w-6 h-6 ${
                      achievement.unlocked
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  )}
                  {achievement.iconName === 'FaTrophy' && (
                    <FaTrophy className={`w-6 h-6 ${
                      achievement.unlocked
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  )}
                </div>
                <h4 className={`font-semibold mb-1 ${
                  achievement.unlocked
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${
                  achievement.unlocked
                    ? 'text-green-600 dark:text-green-300'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-green-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{achievement.progress}%</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recompensas Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                reward.claimed
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGift className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{reward.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Parceiro: {reward.partner}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <FaCoins className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-bold text-lg">{reward.points} pontos</span>
                </div>
                <Button
                  variant={reward.claimed ? 'outline' : 'primary'}
                  disabled={reward.claimed}
                  className="w-full"
                >
                  {reward.claimed ? 'Resgatado' : 'Resgatar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Histórico Completo</h3>
        <Table
          data={history}
          columns={[
            { key: 'material', label: 'Material' },
            { key: 'weight', label: 'Peso (kg)' },
            { key: 'points', label: 'Pontos' },
            { key: 'date', label: 'Data' }
          ]}
        />
      </Card>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Sobre o Projeto</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          O Descarte Certo é uma iniciativa inovadora que une tecnologia, educação e sustentabilidade para promover o descarte consciente e o engajamento social em escolas e comunidades.
        </p>
        <Link 
          to="/sobre-projeto" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaInfoCircle className="mr-2" />
          Ver mais sobre o projeto
        </Link>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Sobre a Equipe</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Nossa equipe multidisciplinar é apaixonada por educação ambiental, tecnologia e impacto social. Juntos, desenvolvemos soluções inovadoras para transformar o mundo através da sustentabilidade.
        </p>
        <Link 
          to="/sobre-nos" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <FaUsers className="mr-2" />
          Conhecer a equipe
        </Link>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Informações do Sistema</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Versão do Sistema</span>
            <span className="font-semibold">2.0.0</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Última Atualização</span>
            <span className="font-semibold">Junho 2025</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <span className="font-semibold text-green-600">Online</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'points':
        return renderPoints();
      case 'achievements':
        return renderAchievements();
      case 'rewards':
        return renderRewards();
      case 'history':
        return renderHistory();
      case 'about':
        return renderAbout();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {isAuthenticated 
                    ? `Bem-vindo de volta, ${user?.name || 'Usuário'}!`
                    : 'Visualizando dados de exemplo - Faça login para personalizar!'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <Button onClick={handleCollectPoints} variant="primary" size="sm" className="w-full sm:w-auto text-xs sm:text-base px-2 sm:px-4 py-2">
                  <FaQrcode className="mr-2" />
                  Coletar Pontos
                </Button>
                <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <FaBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-1 sm:px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-green-900">
            <nav className="flex sm:space-x-8 gap-1 sm:gap-0 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-green-500 text-green-600 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="mr-1 sm:mr-2" size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Coletar Pontos"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Escaneie o QR Code da lixeira ou digite o código manualmente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleScanQR}
              disabled={isScanning}
              className="w-full"
              variant="primary"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Escaneando...
                </>
              ) : (
                <>
                  <FaQrcode className="mr-2" />
                  Escanear QR Code
                </>
              )}
            </Button>

            <Button
              onClick={handleManualCode}
              className="w-full"
              variant="outline"
            >
              Digitar Código
            </Button>
          </div>

          {qrCode && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Código detectado:</p>
              <p className="text-lg font-mono font-bold text-green-600 dark:text-green-400">
                {qrCode}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboard; 