import React from 'react';
import { FaTree, FaTint, FaCloud, FaRecycle, FaLeaf, FaIndustry } from 'react-icons/fa';
import { useMetrics } from '../hooks/useMetrics';
import { Loading } from './ui/Loading';

export default function EnvironmentalImpact() {
  const { metrics, loading, error } = useMetrics();
  const { onlineUsers, schoolsCount, citiesCount, totalWeight } = useMetrics();

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-center">
          <Loading size="md" text="Carregando impacto ambiental..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 rounded-xl shadow-lg p-8 text-white">
        <div className="text-center">
          <p className="text-blue-100">Erro ao carregar dados ambientais</p>
          <p className="text-blue-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatWeight = (weight) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} ton`;
    }
    return `${weight.toFixed(1)} kg`;
  };

  // Fallback para dados quando não há conexão com banco
  const fallbackData = {
    totalWeight: 542000, // 542 toneladas
    treesSaved: 2500,
    waterSaved: 15200,
    co2Reduced: 8700,
    plasticWeight: 200000,
    paperWeight: 150000,
    glassWeight: 100000,
    metalWeight: 92000
  };

  // Usar dados reais ou fallback
  const displayMetrics = error ? fallbackData : metrics;

  const impactData = [
    {
      icon: FaTree,
      value: formatNumber(displayMetrics.treesSaved),
      label: 'Árvores Salvas',
      color: 'text-green-200',
      description: 'Equivalente a uma pequena floresta'
    },
    {
      icon: FaTint,
      value: formatNumber(displayMetrics.waterSaved),
      label: 'Litros de Água Economizados',
      color: 'text-blue-200',
      description: 'Água preservada através da reciclagem'
    },
    {
      icon: FaCloud,
      value: formatNumber(displayMetrics.co2Reduced),
      label: 'kg de CO₂ Reduzidos',
      color: 'text-purple-200',
      description: 'Gases de efeito estufa evitados'
    }
  ];

  const materialData = [
    {
      icon: FaRecycle,
      value: formatWeight(displayMetrics.plasticWeight),
      label: 'Plástico Reciclado',
      color: 'text-blue-300',
      percentage: displayMetrics.totalWeight > 0 ? Math.round((displayMetrics.plasticWeight / displayMetrics.totalWeight) * 100) : 0
    },
    {
      icon: FaLeaf,
      value: formatWeight(displayMetrics.paperWeight),
      label: 'Papel Reciclado',
      color: 'text-green-300',
      percentage: displayMetrics.totalWeight > 0 ? Math.round((displayMetrics.paperWeight / displayMetrics.totalWeight) * 100) : 0
    },
    {
      icon: FaIndustry,
      value: formatWeight(displayMetrics.glassWeight),
      label: 'Vidro Reciclado',
      color: 'text-purple-300',
      percentage: displayMetrics.totalWeight > 0 ? Math.round((displayMetrics.glassWeight / displayMetrics.totalWeight) * 100) : 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Impacto Principal */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Nosso Impacto Ambiental</h2>
        <p className="text-center text-blue-100 mb-8 text-lg">
          Juntos, já reciclamos mais de {formatWeight(displayMetrics.totalWeight)} de material, 
          economizando recursos naturais e reduzindo a poluição
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {impactData.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <Icon className="text-4xl mb-3 text-blue-200" />
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {impact.value}
                </div>
                <div className={impact.color}>{impact.label}</div>
                <p className="text-blue-200 text-sm mt-2">{impact.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribuição de Materiais */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Distribuição de Materiais Reciclados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {materialData.map((material, index) => {
            const Icon = material.icon;
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                <Icon className="text-3xl mb-3 mx-auto text-green-600 dark:text-green-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {material.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 mb-2">{material.label}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${material.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {material.percentage}% do total
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status de Atualização */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>{error ? 'Dados simulados (sem conexão com banco)' : 'Dados atualizados em tempo real'}</p>
        <p>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
      </div>

      <div>
        <div>Usuários Ativos: {loading ? '...' : onlineUsers}</div>
        <div>Escolas Parceiras: {loading ? '...' : schoolsCount}</div>
        <div>Material Reciclado: {loading ? '...' : totalWeight + ' kg'}</div>
        <div>Cidades Atendidas: {loading ? '...' : citiesCount}</div>
      </div>
    </div>
  );
} 