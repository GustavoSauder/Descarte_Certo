import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaUser, FaEnvelope, FaEdit, FaTrash, FaEllipsisH, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks';
import Button from './ui/Button';
import { Card } from './ui';
import { useTranslation } from 'react-i18next';

const Comments = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useAppState();
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [showActions, setShowActions] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  
  const [errors, setErrors] = useState({});

  // Carregar comentários
  useEffect(() => {
    fetchComments();
  }, []);

  // Preencher dados do formulário se usuário estiver logado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Comentário é obrigatório';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Comentário deve ter pelo menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addNotification({
        type: 'error',
        title: 'Erro de validação',
        message: 'Por favor, corrija os erros no formulário.'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Adicionar token se usuário estiver logado
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        addNotification({
          type: 'success',
          title: 'Comentário enviado!',
          message: 'Seu comentário foi enviado e aguarda aprovação.'
        });
        
        setFormData({
          name: '',
          email: '',
          content: ''
        });
        
        setShowForm(false);
        
        // Recarregar comentários
        fetchComments();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao enviar comentário.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        addNotification({
          type: 'success',
          title: 'Comentário deletado',
          message: 'Comentário removido com sucesso.'
        });
        
        setComments(prev => prev.filter(c => c.id !== commentId));
        setShowActions(prev => ({ ...prev, [commentId]: false }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Erro ao deletar comentário.'
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando comentários...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Seção de Comentários */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comentários ({comments.length})
          </h3>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            <FaComment className="mr-2" />
            {showForm ? 'Cancelar' : 'Comentar'}
          </Button>
        </div>

        {/* Formulário de Comentário */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {isAuthenticated ? 'Adicionar Comentário' : 'Faça Login para Comentar'}
                </h4>
                
                {!isAuthenticated && (
                  <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      Para comentar, você precisa estar logado. 
                      <a href="/login" className="text-green-600 dark:text-green-400 hover:underline ml-1">
                        Fazer login
                      </a>
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        id="comment-name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full p-3 border rounded-lg transition-colors ${
                          errors.name 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="Seu nome"
                        disabled={isAuthenticated}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="comment-email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full p-3 border rounded-lg transition-colors ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="seu@email.com"
                        disabled={isAuthenticated}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comentário *
                    </label>
                    <textarea
                      id="comment-content"
                      name="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      className={`w-full p-3 border rounded-lg transition-colors resize-none ${
                        errors.content 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="Digite seu comentário aqui..."
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !isAuthenticated}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {submitting ? 'Enviando...' : 'Enviar Comentário'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Comentários */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <Card className="p-8 text-center">
              <FaComment className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            </Card>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {comment.name}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                    
                    {/* Botão de ações */}
                    {(isAuthenticated && (user?.role === 'ADMIN' || comment.userId === user?.id)) && (
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(prev => ({ 
                            ...prev, 
                            [comment.id]: !prev[comment.id] 
                          }))}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <FaEllipsisH />
                        </button>
                        
                        <AnimatePresence>
                          {showActions[comment.id] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleDelete(comment.id)}
                                  className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  <span>Excluir</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments; 