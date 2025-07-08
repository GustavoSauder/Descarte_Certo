import React, { useState } from 'react';
import { FaStar, FaSmile, FaMeh, FaFrown, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function FeedbackPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const satisfactionOptions = [
    { value: 'muito_satisfeito', label: 'Muito Satisfeito', icon: FaSmile, color: 'text-green-500' },
    { value: 'satisfeito', label: 'Satisfeito', icon: FaSmile, color: 'text-green-400' },
    { value: 'neutro', label: 'Neutro', icon: FaMeh, color: 'text-yellow-500' },
    { value: 'insatisfeito', label: 'Insatisfeito', icon: FaFrown, color: 'text-red-400' },
    { value: 'muito_insatisfeito', label: 'Muito Insatisfeito', icon: FaFrown, color: 'text-red-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !satisfaction) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const feedbackData = {
        userId: user?.id,
        userEmail: user?.email,
        rating,
        satisfaction,
        comment,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        setSubmitted(true);
        setRating(0);
        setSatisfaction('');
        setComment('');
      } else {
        throw new Error('Erro ao enviar feedback');
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Erro ao enviar feedback. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Obrigado pelo seu feedback!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Sua opinião é muito importante para nós. Vamos usar essas informações para melhorar continuamente nossa plataforma.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Enviar Novo Feedback
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Avalie sua experiência
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sua opinião é fundamental para melhorarmos nossa plataforma. 
              Conte-nos como foi sua experiência com o Descarte Certo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avaliação Geral */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Como você avalia sua experiência geral? *
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                {rating === 0 && 'Clique nas estrelas para avaliar'}
                {rating === 1 && 'Péssimo'}
                {rating === 2 && 'Ruim'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bom'}
                {rating === 5 && 'Excelente'}
              </div>
            </div>

            {/* Nível de Satisfação */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Qual seu nível de satisfação com a plataforma? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {satisfactionOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSatisfaction(option.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                        satisfaction === option.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900'
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                      }`}
                    >
                      <Icon className={`text-2xl ${option.color}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comentário */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Comentários adicionais (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte-nos mais sobre sua experiência, sugestões de melhorias ou qualquer outra observação..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !rating || !satisfaction}
                className="w-full sm:w-auto px-8 py-3"
              >
                {loading ? 'Enviando...' : 'Enviar Feedback'}
              </Button>
            </div>
          </form>

          {/* Informações Adicionais */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Por que seu feedback é importante?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Nos ajuda a identificar pontos de melhoria</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Guia o desenvolvimento de novas funcionalidades</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Contribui para uma experiência melhor para todos os usuários</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 