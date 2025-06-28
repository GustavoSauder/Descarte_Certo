import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaRecycle, 
  FaTrophy, 
  FaChartLine,
  FaBan,
  FaCrown,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { useAuth } from '../hooks';
import api from '../services/api';
import { Loading } from '../components/ui/Loading';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDisposals: 0,
    totalPoints: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      loadDashboardData();
    } else {
      // Se não está autenticado ou não é admin, usar dados de exemplo
      loadExampleData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Carregar estatísticas
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data.data);

      // Carregar usuários
      const usersResponse = await api.get('/admin/users');
      setUsers(usersResponse.data.data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExampleData = () => {
    // Dados de exemplo para demonstração
    setStats({
      totalUsers: 1250,
      totalDisposals: 8500,
      totalPoints: 125000,
      activeUsers: 890
    });

    setUsers([
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@escola.com',
        school: 'Escola Municipal',
        points: 1250,
        role: 'USER'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@escola.com',
        school: 'Escola Estadual',
        points: 980,
        role: 'USER'
      },
      {
        id: 3,
        name: 'Pedro Costa',
        email: 'pedro@escola.com',
        school: 'Escola Particular',
        points: 2100,
        role: 'ADMIN'
      }
    ]);

    setLoading(false);
  };

  const handleUserAction = async (userId, action) => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      alert('Faça login como administrador para executar esta ação!');
      return;
    }
    try {
      switch (action) {
        case 'ban':
          await api.patch(`/admin/users/${userId}/ban`);
          break;
        case 'promote':
          await api.patch(`/admin/users/${userId}/promote`);
          break;
        case 'delete':
          if (confirm('Tem certeza que deseja deletar este usuário?')) {
            await api.delete(`/admin/users/${userId}`);
          }
          break;
        default:
          break;
      }
      loadDashboardData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Carregando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isAuthenticated && user?.role === 'ADMIN'
              ? 'Gerencie usuários, monitore estatísticas e controle a plataforma'
              : 'Visualizando dados de exemplo - Faça login como administrador para gerenciar!'
            }
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <FaUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Usuários
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <FaRecycle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Descartas
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalDisposals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <FaTrophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Pontos
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalPoints.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <FaChartLine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Usuários Ativos
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.activeUsers}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gestão de Usuários
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Escola
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pontos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.school || 'Não informado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleUserAction(user.id, 'promote')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Promover para Admin"
                          >
                            <FaCrown className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Banir usuário"
                        >
                          <FaBan className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Deletar usuário"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detalhes do Usuário
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nome:</label>
                <p className="text-gray-900 dark:text-white">{selectedUser.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</label>
                <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Escola:</label>
                <p className="text-gray-900 dark:text-white">{selectedUser.school || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Série:</label>
                <p className="text-gray-900 dark:text-white">{selectedUser.grade || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pontos:</label>
                <p className="text-gray-900 dark:text-white">{selectedUser.points.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nível:</label>
                <p className="text-gray-900 dark:text-white">{selectedUser.level}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Membro desde:</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 