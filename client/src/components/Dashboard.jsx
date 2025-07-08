import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  StatCard,
  BarChart, 
  PieChart, 
  LineChart,
  Table,
  Pagination,
  usePagination,
  Loading,
  CardSkeleton
} from './ui';
import { useTranslation } from 'react-i18next';
import { 
  FaRecycle, 
  FaLeaf, 
  FaTrophy, 
  FaChartLine,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Dashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  // Todos os dados devem ser buscados do Supabase em tempo real

  // Dados de exemplo para gráficos
  const disposalData = [
    { label: 'Plástico', value: 45 },
    { label: 'Papel', value: 30 },
    { label: 'Vidro', value: 15 },
    { label: 'Metal', value: 10 },
  ];

  const weeklyProgress = [
    { label: 'Seg', value: 12 },
    { label: 'Ter', value: 18 },
    { label: 'Qua', value: 15 },
    { label: 'Qui', value: 22 },
    { label: 'Sex', value: 28 },
    { label: 'Sáb', value: 35 },
    { label: 'Dom', value: 20 },
  ];

  const monthlyTrend = [
    { label: 'Jan', value: 120 },
    { label: 'Fev', value: 150 },
    { label: 'Mar', value: 180 },
    { label: 'Abr', value: 200 },
    { label: 'Mai', value: 220 },
    { label: 'Jun', value: 250 },
  ];

  // Dados para tabela de atividades recentes
  const activityColumns = [
    { key: 'date', label: 'Data', sortable: true },
    { key: 'type', label: 'Tipo', sortable: true },
    { key: 'amount', label: 'Quantidade', sortable: true },
    { key: 'points', label: 'Pontos', sortable: true },
    { key: 'location', label: 'Localização', sortable: false },
  ];

  const activityData = [
    {
              date: '2025-01-15',
      type: 'Plástico',
      amount: '2.5 kg',
      points: 25,
      location: 'São Paulo, SP',
    },
    {
              date: '2025-01-14',
      type: 'Papel',
      amount: '1.8 kg',
      points: 18,
      location: 'São Paulo, SP',
    },
    {
              date: '2025-01-13',
      type: 'Vidro',
      amount: '3.2 kg',
      points: 32,
      location: 'São Paulo, SP',
    },
  ];

  // Simular carregamento de dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalDisposals: 1250,
        totalPoints: 12500,
        currentLevel: 8,
        rankPosition: 15,
      });
      
      setRecentActivity(activityData);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full space-y-6 p-6" role="main">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe seu progresso e impacto ambiental
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <FaTrophy className="w-4 h-4 mr-2" />
            Nível {stats?.currentLevel}
          </span>
        </div>
      </motion.div>

      {/* Cards de Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total de Descarte"
          value={`${stats?.totalDisposals?.toLocaleString() || 0}`}
          change="+12% este mês"
          changeType="positive"
          icon={<FaRecycle className="w-6 h-6 text-green-600" />}
        />
        <StatCard
          title="Pontos Acumulados"
          value={`${stats?.totalPoints?.toLocaleString() || 0}`}
          change="+8% esta semana"
          changeType="positive"
          icon={<FaTrophy className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Nível Atual"
          value={stats?.currentLevel || 0}
          change="Próximo nível em 500 pontos"
          changeType="neutral"
          icon={<FaChartLine className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Ranking"
          value={`#${stats?.rankPosition || 0}`}
          change="+3 posições"
          changeType="positive"
          icon={<FaLeaf className="w-6 h-6 text-green-600" />}
        />
      </motion.div>

      {/* Gráficos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Material</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={disposalData} width={300} height={250} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={weeklyProgress} width={400} height={250} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de linha */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={monthlyTrend} width={800} height={300} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabela de Atividades Recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              data={recentActivity}
              columns={activityColumns}
              sortable
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Cards de Informações Adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaCalendarAlt className="w-5 h-5 mr-2 text-blue-600" />
              Próximos Desafios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Desafio Semanal
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Recicle 10kg de plástico
                  </p>
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-300">
                  3 dias restantes
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Meta Mensal
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    50kg de material reciclado
                  </p>
                </div>
                <span className="text-sm text-green-600 dark:text-green-300">
                  75% completo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaMapMarkerAlt className="w-5 h-5 mr-2 text-green-600" />
              Pontos de Coleta Próximos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Ecoponto Central
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rua das Flores, 123
                  </p>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">
                  0.5 km
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Cooperativa Verde
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Av. Principal, 456
                  </p>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">
                  1.2 km
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard; 