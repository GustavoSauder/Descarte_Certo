import React, { useState } from 'react';
import { 
  FaRecycle, FaLeaf, FaTint, FaTree, FaLightbulb, FaUsers, 
  FaCheckCircle, FaTimesCircle, FaInfoCircle, FaPlay, FaBook,
  FaMobile, FaLaptop, FaNewspaper, FaBox, FaCog,
  FaShoppingCart, FaBolt, FaHome, FaBriefcase, FaGraduationCap
} from 'react-icons/fa';
import EnvironmentalImpact from '../components/EnvironmentalImpact';
import Button from '../components/ui/Button';

export default function EducacaoAmbientalPage() {
  const [activeTab, setActiveTab] = useState('reciclagem');

  const tabs = [
    { id: 'reciclagem', label: 'Reciclagem', icon: FaRecycle },
    { id: 'sustentabilidade', label: 'Sustentabilidade', icon: FaLeaf },
    { id: 'dicas', label: 'Dicas Práticas', icon: FaLightbulb },
    { id: 'impacto', label: 'Nosso Impacto', icon: FaTree }
  ];

  const recyclingTips = [
    {
      title: 'Separação Correta',
      description: 'Separe os resíduos por tipo: plástico, papel, vidro, metal e orgânicos.',
      icon: FaCheckCircle,
      color: 'text-green-600',
      tips: [
        'Use lixeiras coloridas para facilitar a separação',
        'Lave embalagens antes de reciclar',
        'Compacte materiais para economizar espaço'
      ]
    },
    {
      title: 'O que Pode Reciclar',
      description: 'Conheça os materiais que podem ser reciclados.',
      icon: FaRecycle,
      color: 'text-blue-600',
      items: [
        { material: 'Plástico', examples: 'Garrafas, embalagens, sacolas' },
        { material: 'Papel', examples: 'Jornais, revistas, caixas' },
        { material: 'Vidro', examples: 'Garrafas, potes, frascos' },
        { material: 'Metal', examples: 'Latas, tampas, arames' }
      ]
    },
    {
      title: 'O que NÃO Reciclar',
      description: 'Materiais que devem ser descartados de forma especial.',
      icon: FaTimesCircle,
      color: 'text-red-600',
      items: [
        { material: 'Papel Higiênico', reason: 'Contaminado' },
        { material: 'Fraldas', reason: 'Resíduo sanitário' },
        { material: 'Espelhos', reason: 'Composição diferente' },
        { material: 'Pilhas', reason: 'Descarte especial' }
      ]
    }
  ];

  const sustainabilityTopics = [
    {
      title: 'Consumo Consciente',
      icon: FaShoppingCart,
      description: 'Como fazer escolhas mais sustentáveis no dia a dia.',
      tips: [
        'Prefira produtos com embalagens recicláveis',
        'Evite produtos descartáveis',
        'Compre apenas o necessário',
        'Escolha produtos locais'
      ]
    },
    {
      title: 'Economia de Energia',
      icon: FaBolt,
      description: 'Dicas para reduzir o consumo de energia.',
      tips: [
        'Use lâmpadas LED',
        'Desligue aparelhos da tomada',
        'Aproveite a luz natural',
        'Mantenha equipamentos limpos'
      ]
    },
    {
      title: 'Economia de Água',
      icon: FaTint,
      description: 'Como preservar este recurso vital.',
      tips: [
        'Feche a torneira ao escovar os dentes',
        'Conserte vazamentos',
        'Use a máquina de lavar com carga cheia',
        'Reutilize água da chuva'
      ]
    }
  ];

  const practicalTips = [
    {
      category: 'Em Casa',
      icon: FaHome,
      tips: [
        'Composte resíduos orgânicos',
        'Use produtos de limpeza naturais',
        'Plante uma horta',
        'Reduza o uso de plástico'
      ]
    },
    {
      category: 'No Trabalho',
      icon: FaBriefcase,
      tips: [
        'Use copos reutilizáveis',
        'Imprima apenas quando necessário',
        'Compartilhe caronas',
        'Use escadas em vez do elevador'
      ]
    },
    {
      category: 'Na Escola',
      icon: FaGraduationCap,
      tips: [
        'Participe de projetos ambientais',
        'Use materiais reciclados',
        'Organize campanhas de conscientização',
        'Crie um jardim escolar'
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reciclagem':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Guia Completo de Reciclagem
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Aprenda como reciclar corretamente e fazer a diferença no meio ambiente. 
                Cada pequena ação conta para um futuro mais sustentável.
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {recyclingTips.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`text-2xl ${section.color}`} />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {section.description}
                    </p>
                    
                    {section.tips && (
                      <ul className="space-y-2">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.items && (
                      <div className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-4 border-green-500 pl-3">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {item.material}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {item.examples || item.reason}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'sustentabilidade':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Práticas Sustentáveis
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Descubra como adotar um estilo de vida mais sustentável e 
                contribuir para a preservação do meio ambiente.
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {sustainabilityTopics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="text-2xl text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {topic.description}
                    </p>
                    <ul className="space-y-2">
                      {topic.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <FaLeaf className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'dicas':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Dicas Práticas para o Dia a Dia
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Pequenas mudanças que fazem grande diferença. 
                Aprenda como ser mais sustentável em diferentes ambientes.
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {practicalTips.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="text-2xl text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {category.category}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <FaLightbulb className="text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'impacto':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Nosso Impacto Real
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Veja em tempo real o impacto que estamos causando através da reciclagem 
                e das práticas sustentáveis implementadas.
              </p>
            </div>
            <EnvironmentalImpact />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Educação Ambiental
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Aprenda tudo sobre cuidados com o meio ambiente, reciclagem e práticas sustentáveis. 
            Conhecimento é o primeiro passo para a mudança.
          </p>
        </div>

        {/* Tabs de Navegação */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {renderContent()}
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quer fazer mais pela sustentabilidade?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Junte-se ao Descarte Certo e faça parte da mudança. 
            Cada ação conta para um futuro mais verde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              className="px-8 py-3"
              onClick={() => window.location.href = '/collect-points'}
            >
              Começar a Reciclar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 