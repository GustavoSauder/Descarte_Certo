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

const RewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeeming, setRedeeming] = useState(null);
  const [filter, setFilter] = useState('all'); // all, products, coupons, experiences

  useEffect(() => {
    // Usar dados mockados em vez de chamar a API
    setRewards(mockRewards);
    setLoading(false);
  }, []);

  const handleRedeem = async (id) => {
    setRedeeming(id);
    try {
      await marketplaceService.redeemReward(id);
      alert('Recompensa resgatada com sucesso!');
    } catch (err) {
      alert('Erro ao resgatar recompensa: ' + err.message);
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) return <Loading text="Carregando recompensas..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Dados de exemplo para demonstração
  const mockRewards = [
    {
      id: 1,
      title: 'Squeeze Ecológica',
      description: 'Garrafa reutilizável feita de material reciclado',
      points: 500,
      type: 'product',
      category: 'Produtos Sustentáveis',
      image: '/images/squeeze.jpg',
      stock: 15,
      popular: true
    },
    {
      id: 2,
      title: 'Cupom Loja Verde',
      description: '20% de desconto em produtos sustentáveis',
      points: 300,
      type: 'coupon',
      category: 'Cupons de Desconto',
      image: '/images/coupon.jpg',
      stock: 50,
      popular: false
    },
    {
      id: 3,
      title: 'Visita ao Centro de Reciclagem',
      description: 'Tour guiado por um centro de reciclagem',
      points: 800,
      type: 'experience',
      category: 'Experiências',
      image: '/images/tour.jpg',
      stock: 10,
      popular: true
    },
    {
      id: 4,
      title: 'Camiseta Orgânica',
      description: 'Camiseta feita de algodão orgânico',
      points: 400,
      type: 'product',
      category: 'Produtos Sustentáveis',
      image: '/images/tshirt.jpg',
      stock: 25,
      popular: false
    },
    {
      id: 5,
      title: 'Certificado de Impacto',
      description: 'Certificado personalizado do seu impacto ambiental',
      points: 200,
      type: 'certificate',
      category: 'Certificados',
      image: '/images/certificate.jpg',
      stock: 100,
      popular: false
    },
    {
      id: 6,
      title: 'Workshop de Compostagem',
      description: 'Aprenda a fazer compostagem em casa',
      points: 600,
      type: 'experience',
      category: 'Experiências',
      image: '/images/workshop.jpg',
      stock: 20,
      popular: true
    },
    // Novas recompensas de impressão 3D
    {
      id: 7,
      title: 'Vaso para Plantas 3D',
      description: 'Vaso decorativo impresso em 3D com PLA reciclado. Perfeito para suas plantas!',
      points: 750,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-vase.jpg',
      stock: 8,
      popular: true,
      materials: ['PLA Reciclado'],
      printTime: '4-6 horas',
      difficulty: 'Fácil'
    },
    {
      id: 8,
      title: 'Organizador de Mesa',
      description: 'Organizador modular para sua mesa de trabalho, feito com PET reciclado',
      points: 1200,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-organizer.jpg',
      stock: 5,
      popular: true,
      materials: ['PET Reciclado'],
      printTime: '8-12 horas',
      difficulty: 'Médio'
    },
    {
      id: 9,
      title: 'Porta-chaves Personalizado',
      description: 'Porta-chaves com seu nome, impresso em ABS reciclado colorido',
      points: 300,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-keychain.jpg',
      stock: 25,
      popular: false,
      materials: ['ABS Reciclado'],
      printTime: '1-2 horas',
      difficulty: 'Fácil'
    },
    {
      id: 10,
      title: 'Suporte para Celular',
      description: 'Suporte ergonômico para celular, impresso em PLA biodegradável',
      points: 450,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-phone-stand.jpg',
      stock: 15,
      popular: false,
      materials: ['PLA Biodegradável'],
      printTime: '3-4 horas',
      difficulty: 'Fácil'
    },
    {
      id: 11,
      title: 'Quebra-cabeça 3D',
      description: 'Quebra-cabeça geométrico impresso em PLA reciclado colorido',
      points: 900,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-puzzle.jpg',
      stock: 12,
      popular: true,
      materials: ['PLA Reciclado Colorido'],
      printTime: '6-8 horas',
      difficulty: 'Médio'
    },
    {
      id: 12,
      title: 'Luminária de Mesa',
      description: 'Luminária decorativa com design sustentável, impressa em PET transparente',
      points: 1500,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-lamp.jpg',
      stock: 6,
      popular: true,
      materials: ['PET Transparente Reciclado'],
      printTime: '10-15 horas',
      difficulty: 'Avançado'
    },
    {
      id: 13,
      title: 'Porta-canetas Ecológico',
      description: 'Porta-canetas com design de árvore, impresso em PLA verde reciclado',
      points: 600,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-pen-holder.jpg',
      stock: 18,
      popular: false,
      materials: ['PLA Verde Reciclado'],
      printTime: '3-5 horas',
      difficulty: 'Fácil'
    },
    {
      id: 14,
      title: 'Mini Jardim Vertical',
      description: 'Sistema de mini jardim vertical com 5 vasos, impresso em PLA reciclado',
      points: 1800,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-garden.jpg',
      stock: 4,
      popular: true,
      materials: ['PLA Reciclado'],
      printTime: '12-18 horas',
      difficulty: 'Avançado'
    },
    {
      id: 15,
      title: 'Copo Reutilizável',
      description: 'Copo com isolamento térmico, impresso em PET reciclado resistente',
      points: 800,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-cup.jpg',
      stock: 10,
      popular: false,
      materials: ['PET Reciclado Resistente'],
      printTime: '5-7 horas',
      difficulty: 'Médio'
    },
    {
      id: 16,
      title: 'Jogo da Velha 3D',
      description: 'Jogo da velha com peças temáticas de reciclagem, impresso em PLA colorido',
      points: 550,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-tic-tac-toe.jpg',
      stock: 20,
      popular: false,
      materials: ['PLA Colorido Reciclado'],
      printTime: '4-6 horas',
      difficulty: 'Fácil'
    },
    {
      id: 17,
      title: 'Suporte para Livros',
      description: 'Suporte elegante para livros, impresso em ABS reciclado resistente',
      points: 1000,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-book-stand.jpg',
      stock: 8,
      popular: true,
      materials: ['ABS Reciclado'],
      printTime: '7-10 horas',
      difficulty: 'Médio'
    },
    {
      id: 18,
      title: 'Mini Compostador',
      description: 'Compostador doméstico pequeno, impresso em PLA biodegradável',
      points: 2200,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-composter.jpg',
      stock: 3,
      popular: true,
      materials: ['PLA Biodegradável'],
      printTime: '15-20 horas',
      difficulty: 'Avançado'
    },
    {
      id: 19,
      title: 'Porta-retratos Sustentável',
      description: 'Porta-retratos com design de folhas, impresso em PLA reciclado',
      points: 700,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-photo-frame.jpg',
      stock: 12,
      popular: false,
      materials: ['PLA Reciclado'],
      printTime: '4-6 horas',
      difficulty: 'Fácil'
    },
    {
      id: 20,
      title: 'Mini Turbina Eólica',
      description: 'Turbina eólica decorativa funcional, impressa em PET reciclado',
      points: 2500,
      type: '3d_printing',
      category: 'Impressão 3D',
      image: '/images/3d-wind-turbine.jpg',
      stock: 2,
      popular: true,
      materials: ['PET Reciclado'],
      printTime: '20-25 horas',
      difficulty: 'Avançado'
    }
  ];

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

  const filteredRewards = mockRewards.filter(reward => {
    if (filter === 'all') return true;
    return reward.type === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="scroll-animation slide-up text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGift className="text-4xl text-green-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Loja de Recompensas</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Troque seus pontos por recompensas incríveis e continue fazendo a diferença no meio ambiente
          </p>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="scroll-animation slide-up grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center p-6">
            <FaCoins className="text-3xl text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Seus Pontos</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2,450</p>
          </Card>
          <Card className="text-center p-6">
            <FaGift className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recompensas Disponíveis</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">20</p>
          </Card>
          <Card className="text-center p-6">
            <FaTrophy className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Resgatadas</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</p>
          </Card>
          <Card className="text-center p-6">
            <FaHeart className="text-3xl text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Favoritas</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">3</p>
          </Card>
        </motion.div>

        {/* Filtros */}
        <ScrollAnimation animationType="slide-up" delay={0.6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('product')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'product'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setFilter('coupon')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'coupon'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Cupons
            </button>
            <button
              onClick={() => setFilter('experience')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'experience'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Experiências
            </button>
            <button
              onClick={() => setFilter('3d_printing')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === '3d_printing'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FaCube className="inline mr-2" />
              Impressão 3D
            </button>
          </motion.div>
        </ScrollAnimation>

        {/* Grid de Recompensas */}
        <ScrollAnimation animationType="slide-up" delay={0.8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`h-full flex flex-col justify-between p-6 relative ${
                  reward.popular ? 'ring-2 ring-yellow-400' : ''
                }`}>
                  {reward.popular && (
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <FaStar className="inline mr-1" />
                      Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {getCategoryIcon(reward.category)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{reward.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{reward.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(reward.type)}`}>
                        {reward.category}
                      </span>
                    </div>
                    
                    {/* Informações específicas para itens 3D */}
                    {reward.type === '3d_printing' && (
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <FaCog className="text-orange-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            <strong>Material:</strong> {reward.materials?.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <FaClock className="text-orange-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            <strong>Tempo:</strong> {reward.printTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <FaPalette className="text-orange-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            <strong>Dificuldade:</strong> {reward.difficulty}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <FaCoins className="text-yellow-500" />
                      <span className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">{reward.points}</span>
                      <span className="text-gray-500 dark:text-gray-400">pontos</span>
                    </div>
                    
                    {reward.stock < 20 && (
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        Apenas {reward.stock} unidades restantes!
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handleRedeem(reward.id)} 
                    disabled={redeeming === reward.id || reward.stock === 0} 
                    className="w-full"
                  >
                    {redeeming === reward.id ? 'Resgatando...' : reward.stock === 0 ? 'Esgotado' : 'Resgatar'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </ScrollAnimation>

        {/* Informações Adicionais */}
        <ScrollAnimation animationType="slide-up" delay={1.0}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaRecycle className="text-green-500" />
                Como Funciona
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Acumule pontos fazendo descartes corretos</li>
                <li>• Troque pontos por recompensas exclusivas</li>
                <li>• Recompensas são enviadas para seu endereço</li>
                <li>• Cupons são enviados por email</li>
                <li>• Itens 3D são impressos com materiais reciclados</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaCube className="text-orange-500" />
                Impressão 3D Sustentável
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Todos os itens usam materiais reciclados</li>
                <li>• PLA biodegradável e PET reciclado</li>
                <li>• Impressão personalizada com seu nome</li>
                <li>• Entrega em 5-7 dias úteis</li>
              </ul>
            </Card>
          </motion.div>
        </ScrollAnimation>

        {/* Seção de Materiais Reciclados */}
        <ScrollAnimation animationType="slide-up" delay={1.2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaLeaf className="text-green-500" />
                Materiais Reciclados Utilizados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FaRecycle className="text-green-600 text-xl" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">PLA Reciclado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ácido polilático biodegradável feito de resíduos de milho e cana-de-açúcar
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FaRecycle className="text-blue-600 text-xl" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">PET Reciclado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Polietileno tereftalato reciclado de garrafas plásticas pós-consumo
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FaRecycle className="text-purple-600 text-xl" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">ABS Reciclado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acrilonitrila butadieno estireno reciclado de eletrônicos descartados
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default RewardsPage; 