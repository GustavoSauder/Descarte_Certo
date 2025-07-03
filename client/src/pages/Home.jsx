import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaRecycle, FaUsers, FaChartLine, FaMobile, FaQrcode, FaTrophy, FaGift, FaSchool, FaHandshake, FaGlobe, FaHeart } from 'react-icons/fa';
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

  const { activeUsers, ecoPoints, plasticRecycled, loading } = useMetrics();

  const stats = [
    { icon: FaUsers, value: loading ? 'Carregando...' : activeUsers.toLocaleString('pt-BR'), label: 'Usuários Ativos', color: 'blue' },
    { icon: FaSchool, value: loading ? 'Carregando...' : '—', label: 'Escolas Parceiras', color: 'green' },
    { icon: FaRecycle, value: loading ? 'Carregando...' : (plasticRecycled ? plasticRecycled.toLocaleString('pt-BR') + ' kg' : '0 kg'), label: 'Material Reciclado', color: 'purple' },
    { icon: FaGlobe, value: loading ? 'Carregando...' : '—', label: 'Cidades Atendidas', color: 'orange' }
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
        className="scroll-animation slide-up relative overflow-hidden py-12 sm:py-20 px-2 sm:px-4"
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <FaLeaf className="text-5xl sm:text-6xl text-green-600 dark:text-green-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Descarte Certo
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-xl sm:max-w-3xl mx-auto">
              Transforme o descarte em pontos, conquistas e impacto ambiental real
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="text-lg px-8 py-4">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/app">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <FaMobile className="mr-2" />
                  Baixar App
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="scroll-animation slide-up py-8 sm:py-16 px-2 sm:px-4 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  data-stagger-animation
                  data-stagger-index={index}
                  className="scroll-animation slide-up text-center"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4`}>
                    <Icon className={`text-xl sm:text-2xl text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <h3 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
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
        className="scroll-animation slide-up py-10 sm:py-20 px-2 sm:px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Como Funciona
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md sm:max-w-2xl mx-auto">
              Nossa plataforma torna a reciclagem divertida e recompensadora
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  data-stagger-animation
                  data-stagger-index={index}
                  className="scroll-animation scale-in text-center p-5 sm:p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6`}>
                    <Icon className={`text-xl sm:text-2xl text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
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
        className="scroll-animation slide-up py-10 sm:py-20 px-2 sm:px-4 bg-green-600 dark:bg-green-800 text-white"
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FaHeart className="text-4xl sm:text-5xl mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Nosso Impacto Ambiental
            </h2>
            <p className="text-base sm:text-xl mb-6 sm:mb-8 max-w-md sm:max-w-3xl mx-auto">
              Juntos, já reciclamos mais de 542 toneladas de material, 
              economizando recursos naturais e reduzindo a poluição
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-6 sm:mt-12">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">2.5k</div>
                <div className="text-base sm:text-lg">Árvores Salvas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">15.2k</div>
                <div className="text-base sm:text-lg">Litros de Água Economizados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">8.7k</div>
                <div className="text-base sm:text-lg">kg de CO₂ Reduzidos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="scroll-animation slide-up py-8 sm:py-16 px-2 sm:px-4"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pronto para transformar o mundo?
          </h2>
          <Link to="/cadastro">
            <Button size="lg" className="text-lg px-8 py-4">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 