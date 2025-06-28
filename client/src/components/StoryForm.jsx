import React, { useState } from 'react';
import { FaPaperPlane, FaTimes, FaImage, FaLeaf } from 'react-icons/fa';
import Button from './ui/Button';

export default function StoryForm({ onSubmit, onCancel, posting }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    impact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim() && formData.impact.trim()) {
      onSubmit(formData);
      setFormData({ title: '', content: '', impact: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <FaLeaf className="text-2xl text-green-600" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Compartilhe sua História de Impacto
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título da História *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Como reciclagem mudou minha escola"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
            maxLength={100}
          />
        </div>

        {/* Conteúdo */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sua História *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Conte como o projeto Descarte Certo impactou sua vida, escola ou comunidade..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            required
            maxLength={500}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.content.length}/500 caracteres
          </div>
        </div>

        {/* Impacto */}
        <div>
          <label htmlFor="impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Impacto Medido *
          </label>
          <input
            type="text"
            id="impact"
            name="impact"
            value={formData.impact}
            onChange={handleChange}
            placeholder="Ex: 50kg de plástico reciclado, 100 alunos envolvidos"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
            maxLength={150}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={posting || !formData.title.trim() || !formData.content.trim() || !formData.impact.trim()}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {posting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Postando...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Compartilhar História
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={posting}
            className="flex items-center gap-2"
          >
            <FaTimes />
            Cancelar
          </Button>
        </div>
      </form>

      {/* Dicas */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
        <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
          💡 Dicas para uma boa história:
        </h4>
        <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
          <li>• Seja específico sobre o impacto alcançado</li>
          <li>• Inclua números e resultados mensuráveis</li>
          <li>• Compartilhe desafios superados</li>
          <li>• Inspire outros com sua experiência</li>
        </ul>
      </div>
    </div>
  );
} 