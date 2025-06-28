import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeadset, 
  FaTicketAlt, 
  FaPlus, 
  FaTimes, 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
  FaBug,
  FaCog,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaComments,
  FaBook,
  FaVideo,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaEdit,
  FaTrash,
  FaReply,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaCalendarAlt,
  FaUserTie,
  FaRobot,
  FaLightbulb,
  FaShieldAlt,
  FaLock,
  FaUnlock,
  FaBell,
  FaRocket,
  FaLeaf,
  FaRecycle,
  FaChartLine,
  FaTrophy,
  FaGift,
  FaUsers,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaTablet
} from 'react-icons/fa';
import { supportService } from '../services';
import { Loading } from '../components/ui/Loading';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '', category: '', priority: 'medium' });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dados mockados para demonstração
  const mockTickets = [
    {
      id: 1,
      subject: 'Problema com login no aplicativo',
      message: 'Não consigo fazer login no aplicativo móvel. Aparece erro de conexão.',
      category: 'technical',
      priority: 'high',
      status: 'open',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      responses: [
        {
          id: 1,
          message: 'Olá! Vamos verificar seu problema. Pode tentar desinstalar e reinstalar o app?',
          isStaff: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60)
        }
      ]
    },
    {
      id: 2,
      subject: 'Dúvida sobre pontuação',
      message: 'Como funciona o sistema de pontuação? Não entendi como ganhar mais pontos.',
      category: 'general',
      priority: 'medium',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 horas atrás
      responses: [
        {
          id: 1,
          message: 'Obrigado pela pergunta! Você ganha pontos reciclando diferentes tipos de materiais.',
          isStaff: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        {
          id: 2,
          message: 'Entendi! Obrigado pela explicação.',
          isStaff: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      ]
    },
    {
      id: 3,
      subject: 'Sugestão de melhoria',
      message: 'Seria legal ter mais opções de recompensas na loja.',
      category: 'suggestion',
      priority: 'low',
      status: 'closed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      responses: [
        {
          id: 1,
          message: 'Excelente sugestão! Estamos trabalhando em novas recompensas.',
          isStaff: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
      ]
    }
  ];

  const categories = [
    { value: 'technical', label: 'Problema Técnico', icon: FaBug },
    { value: 'general', label: 'Dúvida Geral', icon: FaQuestionCircle },
    { value: 'account', label: 'Conta e Perfil', icon: FaUser },
    { value: 'points', label: 'Pontos e Recompensas', icon: FaStar },
    { value: 'app', label: 'Aplicativo Móvel', icon: FaMobile },
    { value: 'suggestion', label: 'Sugestão', icon: FaLightbulb },
    { value: 'bug', label: 'Reportar Bug', icon: FaExclamationTriangle },
    { value: 'other', label: 'Outro', icon: FaInfoCircle }
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'text-green-600 dark:text-green-400' },
    { value: 'medium', label: 'Média', color: 'text-yellow-600 dark:text-yellow-400' },
    { value: 'high', label: 'Alta', color: 'text-red-600 dark:text-red-400' }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simular criação de ticket
    const newTicket = {
      id: tickets.length + 1,
      ...form,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: []
    };
    setTickets([newTicket, ...tickets]);
    setShowForm(false);
    setForm({ subject: '', message: '', category: '', priority: 'medium' });
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'in_progress': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'closed': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Andamento';
      case 'closed': return 'Fechado';
      default: return 'Desconhecido';
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : FaInfoCircle;
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : 'Outro';
  };

  const getPriorityColor = (priority) => {
    const pri = priorities.find(p => p.value === priority);
    return pri ? pri.color : 'text-gray-600 dark:text-gray-400';
  };

  const getPriorityLabel = (priority) => {
    const pri = priorities.find(p => p.value === priority);
    return pri ? pri.label : 'Média';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days} dias atrás`;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Loading text="Carregando tickets..." />
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-red-500 text-center">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <FaHeadset className="text-4xl text-blue-500" />
              Central de Suporte
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Estamos aqui para ajudar você com qualquer dúvida ou problema
            </p>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaTicketAlt className="text-xl text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tickets</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaClock className="text-xl text-yellow-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{openTickets}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abertos</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaExclamationTriangle className="text-xl text-orange-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressTickets}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Em Andamento</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaCheck className="text-xl text-green-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{closedTickets}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fechados</p>
            </Card>
          </div>

          {/* Ações e Filtros */}
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2"
              >
                <FaPlus />
                {showForm ? 'Cancelar' : 'Novo Ticket'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="support-search"
                  name="search"
                  placeholder="Buscar tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                id="support-filter"
                name="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="open">Abertos</option>
                <option value="in_progress">Em Andamento</option>
                <option value="closed">Fechados</option>
              </select>
            </div>
          </div>

          {/* Formulário de Novo Ticket */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 md:p-8 mb-8">
                <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                  Novo Ticket de Suporte
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="support-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assunto
                      </label>
                      <input 
                        id="support-subject"
                        name="subject" 
                        value={form.subject} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        placeholder="Descreva brevemente o problema" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="support-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoria
                      </label>
                      <select 
                        id="support-category"
                        name="category" 
                        value={form.category} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                        required
                      >
                        <option value="">Selecione a categoria</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="support-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prioridade
                    </label>
                    <select 
                      id="support-priority"
                      name="priority" 
                      value={form.priority} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                      required
                    >
                      {priorities.map(pri => (
                        <option key={pri.value} value={pri.value}>{pri.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="support-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mensagem
                    </label>
                    <textarea 
                      id="support-message"
                      name="message" 
                      value={form.message} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
                      rows={6}
                      placeholder="Descreva detalhadamente seu problema ou dúvida" 
                      required 
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button type="submit" className="px-8 flex items-center gap-2">
                      <FaTicketAlt />
                      Enviar Ticket
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
          
          {/* Lista de Tickets */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left text-gray-900 dark:text-white">
              Meus Tickets
            </h2>
            
            {filteredTickets.length === 0 ? (
              <Card className="text-center py-12">
                <FaTicketAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery 
                    ? 'Nenhum ticket encontrado com essa busca.'
                    : 'Você ainda não tem tickets de suporte.'
                  }
                </p>
              </Card>
            ) : (
              filteredTickets.map((ticket, index) => {
                const CategoryIcon = getCategoryIcon(ticket.category);
                
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <CategoryIcon className="text-xl text-blue-600 dark:text-blue-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {ticket.subject}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {getStatusLabel(ticket.status)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {getPriorityLabel(ticket.priority)}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {ticket.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{getCategoryLabel(ticket.category)}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(ticket.updatedAt)}</span>
                              <span>•</span>
                              <span>{ticket.responses.length} resposta{ticket.responses.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <FaEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Modal de Detalhes do Ticket */}
          <Modal
            isOpen={showTicketModal}
            onClose={() => setShowTicketModal(false)}
            title={selectedTicket?.subject}
            size="lg"
          >
            {selectedTicket && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusLabel(selectedTicket.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {getPriorityLabel(selectedTicket.priority)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getCategoryLabel(selectedTicket.category)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{selectedTicket.message}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Criado em {selectedTicket.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Respostas</h4>
                  {selectedTicket.responses.map((response, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      response.isStaff 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                        : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-400'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {response.isStaff ? (
                          <FaUserTie className="text-blue-500" />
                        ) : (
                          <FaUser className="text-gray-500" />
                        )}
                        <span className="font-medium text-sm">
                          {response.isStaff ? 'Equipe de Suporte' : 'Você'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(response.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{response.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage; 