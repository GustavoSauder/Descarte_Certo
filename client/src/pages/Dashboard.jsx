import React from 'react';
import { FaLeaf, FaTrophy, FaRecycle, FaGift, FaChartLine, FaUsers, FaMedal } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meu Painel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe seu progresso e impacto ambiental
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FaLeaf className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Meus Pontos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <FaTrophy className="text-2xl text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ranking</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">#5</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaRecycle className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Descarte Realizados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FaChartLine className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Impacto Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">45kg</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Histórico de Descartes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Histórico de Descartes
              </h3>
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Papel</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">2kg reciclado</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+10 pts</p>
                  <p className="text-xs text-gray-500">há 2 dias</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Plástico</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">1kg reciclado</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+10 pts</p>
                  <p className="text-xs text-gray-500">há 5 dias</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Metal</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">0.5kg reciclado</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+10 pts</p>
                  <p className="text-xs text-gray-500">há 1 semana</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Loja de Recompensas */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Loja de Recompensas
              </h3>
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-3">
                    <FaGift className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Squeeze Ecológica</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Garrafa reutilizável</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">500 pts</p>
                  <Button size="sm" className="mt-1">
                    Resgatar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-3">
                    <FaMedal className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cupom Loja Verde</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">20% de desconto</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">300 pts</p>
                  <Button size="sm" className="mt-1">
                    Resgatar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg mr-3">
                    <FaUsers className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Workshop Compostagem</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aprenda em casa</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-purple-600 font-semibold">600 pts</p>
                  <Button size="sm" className="mt-1">
                    Resgatar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conquistas Recentes */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Conquistas Recentes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <FaTrophy className="text-3xl text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Primeiro Descarte</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Você começou sua jornada!</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FaLeaf className="text-3xl text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">100 Pontos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Primeira centena alcançada!</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FaRecycle className="text-3xl text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white">10 Descartes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Décimo descarte realizado!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 