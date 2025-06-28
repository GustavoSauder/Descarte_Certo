import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaRecycle, FaChartLine, FaCalendarAlt, FaMapMarkerAlt, FaLeaf, FaTrophy, FaClock, FaFilter } from 'react-icons/fa';
import Table from '../components/ui/Table';
import { Loading } from '../components/ui/Loading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { disposalService } from '../services';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, week, month, year
  const [materialFilter, setMaterialFilter] = useState('all');

  useEffect(() => {
    disposalService.listDisposals()
      .then(res => setHistory(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Carregando histórico..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Dados de exemplo para demonstração
  const mockHistory = [
    { id: 1, createdAt: '2024-01-15', materialType: 'Plástico', weight: 2.5, points: 25, location: 'São Paulo, SP' },
    { id: 2, createdAt: '2024-01-14', materialType: 'Papel', weight: 1.8, points: 14, location: 'São Paulo, SP' },
    { id: 3, createdAt: '2024-01-13', materialType: 'Vidro', weight: 3.2, points: 48, location: 'São Paulo, SP' },
    { id: 4, createdAt: '2024-01-12', materialType: 'Metal', weight: 1.5, points: 18, location: 'São Paulo, SP' },
    { id: 5, createdAt: '2024-01-11', materialType: 'Plástico', weight: 2.0, points: 20, location: 'São Paulo, SP' },
    { id: 6, createdAt: '2024-01-10', materialType: 'Papel', weight: 2.2, points: 18, location: 'São Paulo, SP' },
  ];

  const getMaterialIcon = (material) => {
    switch (material.toLowerCase()) {
      case 'plástico': return <FaRecycle className="text-blue-500" />;
      case 'papel': return <FaLeaf className="text-green-500" />;
      case 'vidro': return <FaRecycle className="text-green-600" />;
      case 'metal': return <FaRecycle className="text-gray-600" />;
      default: return <FaRecycle className="text-gray-500" />;
    }
  };

  const getMaterialColor = (material) => {
    switch (material.toLowerCase()) {
      case 'plástico': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'papel': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'vidro': return 'bg-green-600 text-white dark:bg-green-700';
      case 'metal': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const totalWeight = mockHistory.reduce((sum, item) => sum + item.weight, 0);
  const totalPoints = mockHistory.reduce((sum, item) => sum + item.points, 0);
  const totalDisposals = mockHistory.length;

  const materialStats = mockHistory.reduce((acc, item) => {
    const material = item.materialType;
    if (!acc[material]) {
      acc[material] = { weight: 0, count: 0, points: 0 };
    }
    acc[material].weight += item.weight;
    acc[material].count += 1;
    acc[material].points += item.points;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaHistory className="text-4xl text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Histórico de Descartes</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Acompanhe todas as suas contribuições para o meio ambiente e veja seu impacto crescer
          </p>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="text-center p-6">
            <FaRecycle className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total de Descartes</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalDisposals}</p>
          </Card>
          <Card className="text-center p-6">
            <FaChartLine className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Peso Total</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalWeight.toFixed(1)} kg</p>
          </Card>
          <Card className="text-center p-6">
            <FaTrophy className="text-3xl text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pontos Ganhos</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalPoints}</p>
          </Card>
          <Card className="text-center p-6">
            <FaCalendarAlt className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dias Ativos</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">6</p>
          </Card>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</span>
          </div>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setFilter('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Este Ano
          </button>
        </motion.div>

        {/* Estatísticas por Material */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {Object.entries(materialStats).map(([material, stats]) => (
            <Card key={material} className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getMaterialIcon(material)}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{material}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.weight.toFixed(1)} kg • {stats.count} descartes
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.points} pts
              </p>
            </Card>
          ))}
        </motion.div>

        {/* Tabela de Histórico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Histórico Detalhado</h2>
          </div>
          <Table
            columns={[
              { key: 'date', label: 'Data', sortable: true },
              { key: 'material', label: 'Material', sortable: true },
              { key: 'weight', label: 'Peso (kg)', sortable: true },
              { key: 'points', label: 'Pontos', sortable: true },
              { key: 'location', label: 'Localização', sortable: false }
            ]}
            data={mockHistory.map(item => ({
              ...item,
              date: new Date(item.createdAt).toLocaleDateString('pt-BR'),
              material: (
                <div className="flex items-center gap-2">
                  {getMaterialIcon(item.materialType)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaterialColor(item.materialType)}`}>
                    {item.materialType}
                  </span>
                </div>
              ),
              weight: `${item.weight} kg`,
              points: `${item.points} pts`,
              location: (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <FaMapMarkerAlt className="text-sm" />
                  {item.location}
                </div>
              )
            }))}
          />
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaLeaf className="text-green-500" />
              Seu Impacto Ambiental
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• {totalWeight.toFixed(1)} kg de resíduos reciclados</li>
              <li>• {(totalWeight * 0.5).toFixed(1)} kg de CO₂ evitados</li>
              <li>• {(totalWeight * 0.3).toFixed(1)} árvores equivalentes</li>
              <li>• {(totalWeight * 100).toFixed(0)} litros de água economizados</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Próximos Objetivos
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• 10 kg em uma semana (meta semanal)</li>
              <li>• 50 kg em um mês (meta mensal)</li>
              <li>• 100 descartes (conquista especial)</li>
              <li>• Todos os tipos de material (diversidade)</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage; 