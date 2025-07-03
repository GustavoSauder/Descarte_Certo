import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGift, FaCoins, FaShoppingCart, FaStar, FaLeaf, FaRecycle, FaTrophy, FaHeart, FaShieldAlt, FaRocket, FaHistory, FaFilter, FaSearch, FaSort, FaEye, FaShare, FaDownload, FaPrint, FaEnvelope, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaMedal, FaCrown, FaGem, FaFire, FaHandshake, FaGlobe, FaUsers, FaChartLine, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope as FaEnvelopeIcon, FaCube, FaCog, FaPalette, FaHome, FaGamepad, FaBook, FaPencilAlt, FaLightbulb, FaSeedling, FaTree, FaCar, FaBicycle, FaUmbrella, FaMugHot, FaKey, FaGift as FaGiftIcon } from 'react-icons/fa';
import { marketplaceService } from '../services';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import Sidebar from '../components/ui/Sidebar';
import ScrollAnimation from '../components/ui/ScrollAnimation';
import { useRewards } from '../hooks/useRewards.js';
import { useAuth } from '../hooks/useAuth';
import { useUserMetrics } from '../hooks/useUserMetrics.js';
import { useAppState } from '../hooks';
import { useTranslation } from 'react-i18next';

// Removido dados mockados - agora usa apenas dados reais do backend

const RewardsPage = () => {
  const rewards = useRewards();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redeeming, setRedeeming] = useState(null);
  const [filter, setFilter] = useState('all'); // all, product, coupon, experience
  const { user } = useAuth();
  const userMetrics = useUserMetrics(user);
  const { addNotification } = useAppState();
  const userPoints = userMetrics?.points ?? 0;

  const handleRedeem = async (id) => {
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Você precisa estar logado para resgatar recompensas'
      });
      return;
    }

    setRedeeming(id);
    try {
      await marketplaceService.redeemReward(id);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Recompensa resgatada com sucesso!'
      });
      
      // Atualizar pontos do usuário (o hook useUserMetrics deve detectar a mudança)
      // Se necessário, forçar refresh dos dados
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao resgatar recompensa: ' + err.message
      });
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) return <Loading text="Carregando recompensas..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Produtos Sustentáveis': return <FaLeaf className="text-green-500" />;
      case 'Cupons de Desconto': return <FaShoppingCart className="text-blue-500" />;
      case 'Experiências': return <FaRocket className="text-purple-500" />;
      case 'Certificados': return <FaShieldAlt className="text-yellow-500" />;
      case 'Impressão 3D': return <FaCube className="text-orange-500" />;
      default: return <FaGift className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'product': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'coupon': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'experience': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'certificate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case '3d_printing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (filter === 'all') return true;
    return reward.type === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full px-1 sm:px-2 py-2 flex flex-col items-center">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-green-800 dark:text-green-200 mb-2 sm:mb-4 text-center drop-shadow w-full">Recompensas</h1>
      <div className="flex flex-col items-center mb-3 w-full">
        <div className="w-full flex justify-center px-1">
          <Card className="flex flex-row items-center gap-2 xs:gap-3 px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 bg-gradient-to-r from-green-200 to-green-400 dark:from-green-900 dark:to-green-700 shadow-lg border-0 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-2xl w-full">
            <FaCoins className="text-yellow-400 text-xl xs:text-2xl sm:text-3xl drop-shadow" />
            <div>
              <div className="text-xs xs:text-sm text-green-900 dark:text-green-100 font-semibold">Seus pontos</div>
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100">{userPoints.toLocaleString()} pts</div>
            </div>
          </Card>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 xs:gap-2 justify-center mb-3 w-full">
        <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" className="text-xs px-2 xs:px-3 py-1.5 rounded-full" onClick={() => setFilter('all')}>Todas</Button>
        <Button variant={filter === 'product' ? 'primary' : 'outline'} size="sm" className="text-xs px-2 xs:px-3 py-1.5 rounded-full" onClick={() => setFilter('product')}>Produtos</Button>
        <Button variant={filter === 'coupon' ? 'primary' : 'outline'} size="sm" className="text-xs px-2 xs:px-3 py-1.5 rounded-full" onClick={() => setFilter('coupon')}>Cupons</Button>
        <Button variant={filter === 'experience' ? 'primary' : 'outline'} size="sm" className="text-xs px-2 xs:px-3 py-1.5 rounded-full" onClick={() => setFilter('experience')}>Experiências</Button>
          </div>
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4">
        {filteredRewards.map((reward) => (
            <Card key={reward.id} hover className="flex flex-col h-full p-1 xs:p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-0 transition-all w-full max-w-xs mx-auto">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full flex justify-center mb-1 xs:mb-2">
              <img
                src={reward.image}
                alt={reward.title}
                    className="w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl border-2 border-green-100 dark:border-green-900 shadow"
                loading="lazy"
              />
                </div>
                <h2 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white text-center mb-1 drop-shadow line-clamp-2">{reward.title}</h2>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-1 xs:mb-2 line-clamp-2">{reward.description}</p>
                <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2 flex-wrap justify-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] xs:text-xs font-semibold ${getTypeColor(reward.type)}`}>{reward.type === 'product' ? 'Produto' : reward.type === 'coupon' ? 'Cupom' : reward.type === 'experience' ? 'Experiência' : reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}</span>
                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-300 font-bold text-xs xs:text-sm"><FaCoins /> {reward.points}</span>
                  </div>
                  <Button 
                variant="primary"
                  size="sm"
                  className="w-full mt-auto text-[10px] xs:text-xs py-1 xs:py-2 rounded-lg shadow-md"
                    onClick={() => handleRedeem(reward.id)} 
                    disabled={redeeming === reward.id || reward.stock === 0} 
                  loading={redeeming === reward.id}
                  >
                    {redeeming === reward.id ? 'Resgatando...' : reward.stock === 0 ? 'Esgotado' : 'Resgatar'}
                  </Button>
              </div>
            </Card>
        ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage; 