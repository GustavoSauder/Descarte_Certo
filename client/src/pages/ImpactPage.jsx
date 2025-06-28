import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaLeaf, FaRecycle, FaSchool, FaCity, FaTrophy, FaMedal, FaAward, FaClock, FaTrendingUp, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';

export default function ImpactPage() {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('week');

  useEffect(() => {
    loadImpactData();
  }, [activePeriod]);

  const loadImpactData = async () => {
    try {
      setLoading(true);
      // Remover mockData e simulações, e buscar dados reais do backend/Supabase.
      // ... existing code ...
    } catch (error) {
      console.error('Erro ao carregar dados de impacto:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Carregando dados de impacto..." />;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaGlobe className="text-4xl text-green-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Impacto Social e Ambiental em Tempo Real
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Acompanhe o impacto real do nosso projeto na transformação ambiental e social
        </p>
      </motion.div>

      {/* Métricas Principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <FaChartBar className="text-3xl text-green-600 dark:text-green-400 mx-auto mb-3" />
          <span className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200">
            {impactData.general.totalPoints.toLocaleString('pt-BR')}
          </span>
          <span className="text-sm text-green-700 dark:text-green-300 block">Pontos Ecológicos</span>
        </Card>
        <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <FaUsers className="text-3xl text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <span className="text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-200">
            {impactData.general.activeUsers.toLocaleString('pt-BR')}
          </span>
          <span className="text-sm text-blue-700 dark:text-blue-300 block">Usuários Ativos</span>
        </Card>
        <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <FaLeaf className="text-3xl text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <span className="text-2xl md:text-3xl font-bold text-purple-800 dark:text-purple-200">
            {impactData.general.recycledWaste.toLocaleString('pt-BR')} kg
          </span>
          <span className="text-sm text-purple-700 dark:text-purple-300 block">Plástico Reciclado</span>
        </Card>
      </motion.div>

      {/* Métricas em Tempo Real */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 rounded-xl p-8 shadow-lg border border-teal-200 dark:border-teal-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200 flex items-center gap-2">
            <FaClock className="text-xl" />
            Atividade em Tempo Real
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-teal-700 dark:text-teal-300">Ao vivo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-800 dark:text-teal-200 mb-2">
              {impactData.realTime.currentUsers}
            </div>
            <div className="text-sm text-teal-700 dark:text-teal-300">Usuários Online</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-800 dark:text-teal-200 mb-2">
              {impactData.realTime.todayRecycled} kg
            </div>
            <div className="text-sm text-teal-700 dark:text-teal-300">Reciclado Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-800 dark:text-teal-200 mb-2">
              {impactData.realTime.thisWeekRecycled} kg
            </div>
            <div className="text-sm text-teal-700 dark:text-teal-300">Esta Semana</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-800 dark:text-teal-200 mb-2">
              {impactData.realTime.thisMonthRecycled} kg
            </div>
            <div className="text-sm text-teal-700 dark:text-teal-300">Este Mês</div>
          </div>
        </div>
      </motion.div>

      {/* Rankings por Categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Top Recicladores */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaRecycle className="text-xl text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Recicladores</h3>
          </div>
          <div className="space-y-3">
            {impactData.rankings.topRecyclers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600 dark:text-green-400">{user.impact}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Escolas */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaSchool className="text-xl text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Escolas</h3>
          </div>
          <div className="space-y-3">
            {impactData.rankings.topSchools.map((school, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{school.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{school.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">{school.impact}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{school.students} alunos</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Cidades */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCity className="text-xl text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Cidades</h3>
          </div>
          <div className="space-y-3">
            {impactData.rankings.topCities.map((city, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{city.schools} escolas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">{city.impact}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{city.participation}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tendências e Crescimento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800">
          <div className="flex items-center gap-2 mb-4">
            <FaTrendingUp className="text-xl text-orange-600 dark:text-orange-400" />
            <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-200">Crescimento Semanal</h3>
          </div>
          <div className="text-3xl font-bold text-orange-800 dark:text-orange-200 mb-2">
            +{impactData.trends.weeklyGrowth}%
          </div>
          <p className="text-orange-700 dark:text-orange-300">
            Aumento na participação e reciclagem comparado à semana anterior
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="text-xl text-pink-600 dark:text-pink-400" />
            <h3 className="text-xl font-semibold text-pink-800 dark:text-pink-200">Engajamento</h3>
          </div>
          <div className="text-3xl font-bold text-pink-800 dark:text-pink-200 mb-2">
            {impactData.trends.userEngagement}%
          </div>
          <p className="text-pink-700 dark:text-pink-300">
            Taxa de engajamento ativo dos usuários na plataforma
          </p>
        </Card>
      </motion.div>

      {/* Histórias de Impacto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left text-gray-900 dark:text-white">
          Histórias de Impacto Real
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <FaSchool className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="mb-3 font-semibold text-lg text-gray-900 dark:text-white">
                  "O projeto mudou a realidade da minha escola! Os alunos estão mais engajados e conscientes."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">- Prof. Ana, Escola Verde</span>
                  <span className="text-xs text-green-600 dark:text-green-400">2.5 toneladas recicladas</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FaRecycle className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="mb-3 font-semibold text-lg text-gray-900 dark:text-white">
                  "Conseguimos imprimir brinquedos 3D para doação usando plástico reciclado!"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">- João, Aluno</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">45 brinquedos criados</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
} 