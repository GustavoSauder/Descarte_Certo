import React from 'react';
import { FaPlay, FaUsers, FaHeart, FaGithub, FaLinkedin, FaEnvelope, FaSync } from 'react-icons/fa';
import { useEquipe } from '../hooks/useEquipe';
import { Loading } from '../components/ui/Loading';
import RealTimeMetrics from '../components/RealTimeMetrics';
import { useMetrics } from '../hooks/useMetrics';

export default function SobreEquipe() {
  const { 
    equipe, 
    loading, 
    isOnline, 
    lastUpdate, 
    resetarEquipe 
  } = useEquipe();

  const { onlineUsers, schoolsCount, citiesCount, totalWeight, loading: metricsLoading } = useMetrics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" text="Carregando informações da equipe..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto space-y-16 px-4">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sobre a Equipe
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Nossa equipe multidisciplinar é apaixonada por educação ambiental, tecnologia e impacto social. 
            Juntos, desenvolvemos soluções inovadoras para transformar o mundo através da sustentabilidade e da colaboração.
          </p>
          <div className="flex justify-center items-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaUsers className="text-2xl text-green-600 dark:text-green-400" />
              <span className="font-semibold">{equipe.length} Especialistas</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-2xl text-red-500" />
              <span className="font-semibold">100% Comprometidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-semibold">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          {/* Botão de Reset */}
          <div className="flex justify-center">
            <button
              onClick={resetarEquipe}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <FaSync className="text-sm" />
              Restaurar Dados Padrão
            </button>
          </div>
        </div>

        {/* Missão e Valores */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossa Missão</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Transformar a educação ambiental através da tecnologia, criando uma geração consciente 
              e engajada com a sustentabilidade. Queremos democratizar o acesso à educação ambiental 
              de qualidade, tornando-a acessível e envolvente para todos.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nossos Valores</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sustentabilidade e responsabilidade ambiental</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Inovação e criatividade tecnológica</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Educação de qualidade para todos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Colaboração e trabalho em equipe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Equipe */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Conheça o Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipe.map((membro) => (
              <div key={membro.nome} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg mb-4 mx-auto bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <img 
                    src={membro.foto} 
                    alt={membro.nome} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-gray-500 dark:text-gray-400">
                    <FaUsers size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {membro.nome}
                </h3>
                <p className="text-green-600 dark:text-green-400 font-semibold mb-3">
                  {membro.cargo}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {membro.descricao}
                </p>
                <div className="flex justify-center gap-3">
                  {membro.github && (
                  <a 
                    href={membro.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <FaGithub size={20} />
                  </a>
                  )}
                  {membro.linkedin && (
                  <a 
                    href={membro.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  )}
                  {membro.email && (
                  <a 
                    href={`mailto:${membro.email}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    <FaEnvelope size={20} />
                  </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-8">
            <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">{metricsLoading ? '...' : schoolsCount}</div>
            <div className="text-green-100">Escolas Parceiras</div>
            </div>
            <div>
            <div className="text-3xl md:text-4xl font-bold mb-2">{metricsLoading ? '...' : totalWeight + ' kg'}</div>
              <div className="text-green-100">Kg de Resíduos Coletados</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quer fazer parte da nossa missão?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Entre em contato conosco e descubra como podemos trabalhar juntos para criar um futuro mais sustentável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contato" 
              className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Entre em Contato
            </a>
            <a 
              href="/sobre-projeto" 
              className="border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Conheça o Projeto
            </a>
          </div>
        </div>

        <div>
          <div>Usuários Ativos: {metricsLoading ? '...' : onlineUsers}</div>
          <div>Cidades Atendidas: {metricsLoading ? '...' : citiesCount}</div>
        </div>
      </div>
    </div>
  );
} 