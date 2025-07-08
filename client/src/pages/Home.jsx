import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaRecycle, FaUsers, FaChartLine, FaMobile, FaQrcode, FaTrophy, FaGift, FaSchool, FaHandshake, FaGlobe, FaHeart, FaMapMarkerAlt, FaCity } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useScrollAnimation, useStaggerAnimation } from '../hooks';
import { useMetrics } from '../hooks/useMetrics';

const Home = () => {
  // Refs para animações de scroll
  const heroRef = useScrollAnimation({ animationClass: 'animate-fade-in', delay: 0.2 });
  const statsRef = useScrollAnimation({ animationClass: 'animate-fade-in', delay: 0.4 });
  const featuresRef = useScrollAnimation({ animationClass: 'animate-fade-in', delay: 0.6 });
  const impactRef = useScrollAnimation({ animationClass: 'animate-fade-in', delay: 0.8 });
  const ctaRef = useScrollAnimation({ animationClass: 'animate-fade-in', delay: 1.0 });

  // Animação stagger para cards
  useStaggerAnimation([1, 2, 3, 4], { staggerDelay: 0.1 });

  const { onlineUsers, schoolsCount, citiesCount, totalWeight, loading, treesSaved = 0, waterSaved = 0, co2Reduced = 0 } = useMetrics();

  const stats = [
    { icon: FaUsers, value: loading ? 'Carregando...' : onlineUsers, label: 'Usuários Ativos', color: 'blue' },
    { icon: FaSchool, value: loading ? 'Carregando...' : schoolsCount, label: 'Escolas Parceiras', color: 'green' },
    { icon: FaRecycle, value: loading ? 'Carregando...' : `${totalWeight} kg`, label: 'Material Reciclado', color: 'yellow' },
    { icon: FaCity, value: loading ? 'Carregando...' : citiesCount, label: 'Cidades Atendidas', color: 'purple' },
  ];

  const features = [
    {
      icon: FaQrcode,
      title: 'Coleta Inteligente',
      description: 'Escaneie QR codes das lixeiras para ganhar pontos instantaneamente',
      color: 'green'
    },
    {
      icon: FaTrophy,
      title: 'Gamificação',
      description: 'Complete desafios, desbloqueie conquistas e suba no ranking',
      color: 'yellow'
    },
    {
      icon: FaGift,
      title: 'Recompensas Reais',
      description: 'Troque seus pontos por prêmios e descontos em parceiros',
      color: 'purple'
    },
    {
      icon: FaChartLine,
      title: 'Impacto Mensurável',
      description: 'Acompanhe seu impacto ambiental em tempo real',
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="scroll-animation slide-up relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8"
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <FaLeaf className="text-6xl sm:text-7xl md:text-8xl text-green-600 dark:text-green-400 mx-auto mb-6 sm:mb-8" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
              Descarte Certo
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl sm:max-w-4xl mx-auto leading-relaxed">
              Transforme o descarte em pontos, conquistas e impacto ambiental real
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-2xl mx-auto mt-8 sm:mt-12 mb-8">
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="scroll-animation slide-up py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  data-stagger-animation
                  data-stagger-index={index}
                  className="scroll-animation slide-up text-center"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                    <Icon className={`text-2xl sm:text-3xl md:text-4xl text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {stat.value}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="scroll-animation slide-up py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Como Funciona
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed">
              Nossa plataforma torna a reciclagem divertida e recompensadora
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  data-stagger-animation
                  data-stagger-index={index}
                  className="scroll-animation scale-in text-center p-6 sm:p-8 md:p-10 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8`}>
                    <Icon className={`text-2xl sm:text-3xl md:text-4xl text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section 
        ref={impactRef}
        className="scroll-animation slide-up py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-green-600 dark:bg-green-800 text-white"
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FaHeart className="text-5xl sm:text-6xl md:text-7xl mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              Nosso Impacto Ambiental
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12 md:mt-16">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">{loading ? '...' : (treesSaved ?? 0).toLocaleString('pt-BR')}</div>
                <div className="text-base sm:text-lg md:text-xl">Árvores Salvas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">{loading ? '...' : (waterSaved ?? 0).toLocaleString('pt-BR')}</div>
                <div className="text-base sm:text-lg md:text-xl">Litros de Água Economizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">{loading ? '...' : (co2Reduced ?? 0).toLocaleString('pt-BR')}</div>
                <div className="text-base sm:text-lg md:text-xl">kg de CO₂ Reduzidos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Links Section */}
      <section 
        ref={ctaRef}
        className="scroll-animation slide-up py-10 sm:py-20 px-2 sm:px-4 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Conheça Mais Sobre Nós
          </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md sm:max-w-2xl mx-auto">
              Explore nossa plataforma e descubra como podemos ajudar você
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link to="/sobre-nos" className="block">
                <Card className="h-full p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                  <FaUsers className="text-3xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nossa Equipe</h3>
                  <p className="text-gray-600 dark:text-gray-400">Conheça os desenvolvedores por trás do projeto</p>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link to="/sobre-projeto" className="block">
                <Card className="h-full p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                  <FaLeaf className="text-3xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sobre o Projeto</h3>
                  <p className="text-gray-600 dark:text-gray-400">Entenda nossa missão e objetivos</p>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link to="/contato" className="block">
                <Card className="h-full p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                  <FaHandshake className="text-3xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Entre em Contato</h3>
                  <p className="text-gray-600 dark:text-gray-400">Fale conosco e tire suas dúvidas</p>
                </Card>
          </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 