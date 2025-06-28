import React, { useState } from 'react';
import { FaHeart, FaTrash, FaUser, FaLeaf, FaClock, FaEye } from 'react-icons/fa';
import { useAuth } from '../hooks';
import Button from './ui/Button';

export default function StoryCard({ story, onDelete, onLike }) {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAuthor = user && story.userId === user.id;
  const timeAgo = getTimeAgo(story.createdAt);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(story.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erro ao deletar história:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Você precisa estar logado para curtir uma história');
      return;
    }
    try {
      await onLike(story.id);
    } catch (error) {
      console.error('Erro ao curtir história:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              {story.user?.avatar ? (
                <img 
                  src={story.user.avatar} 
                  alt={story.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {story.user?.name || 'Usuário'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaClock className="text-xs" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <FaTrash className="text-sm" />
            </Button>
          )}
        </div>

        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {story.title}
        </h4>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {story.content}
        </p>

        {/* Impacto */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <FaLeaf className="text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-800 dark:text-green-200">
              Impacto Alcançado:
            </span>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">
            {story.impact}
          </p>
        </div>

        {/* Estatísticas */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FaEye className="text-xs" />
              <span>{story.views || 0} visualizações</span>
            </div>
            <div className="flex items-center gap-1">
              <FaHeart className="text-xs" />
              <span>{story.likes || 0} curtidas</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaHeart className="text-sm" />
            Curtir
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tem certeza que deseja excluir esta história? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Função para calcular tempo decorrido
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''} atrás`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''} atrás`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ano${diffInYears > 1 ? 's' : ''} atrás`;
} 