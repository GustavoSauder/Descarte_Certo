import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  // Buscar todas as histórias
  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('stories')
        .select(`
          *,
          user:users(name, avatar)
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setStories(data || []);
    } catch (err) {
      console.error('Erro ao buscar histórias:', err);
      setError('Erro ao carregar histórias');
    } finally {
      setLoading(false);
    }
  };

  // Postar nova história
  const postStory = async (storyData) => {
    if (!user) {
      throw new Error('Você precisa estar logado para postar uma história');
    }

    try {
      setPosting(true);
      setError(null);

      const { data, error: postError } = await supabase
        .from('stories')
        .insert([
          {
            userId: user.id,
            title: storyData.title,
            content: storyData.content,
            impact: storyData.impact,
            approved: true, // Auto-aprovação para simplificar
            imageUrl: storyData.imageUrl || null
          }
        ])
        .select()
        .single();

      if (postError) throw postError;

      // Atualizar a lista de histórias
      await fetchStories();

      return data;
    } catch (err) {
      console.error('Erro ao postar história:', err);
      setError('Erro ao postar história');
      throw err;
    } finally {
      setPosting(false);
    }
  };

  // Deletar história (apenas pelo autor)
  const deleteStory = async (storyId) => {
    if (!user) {
      throw new Error('Você precisa estar logado para deletar uma história');
    }

    try {
      setError(null);

      // Verificar se o usuário é o autor da história
      const story = stories.find(s => s.id === storyId);
      if (!story || story.userId !== user.id) {
        throw new Error('Você só pode deletar suas próprias histórias');
      }

      const { error: deleteError } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId)
        .eq('userId', user.id);

      if (deleteError) throw deleteError;

      // Atualizar a lista de histórias
      await fetchStories();

      return true;
    } catch (err) {
      console.error('Erro ao deletar história:', err);
      setError('Erro ao deletar história');
      throw err;
    }
  };

  // Curtir história
  const likeStory = async (storyId) => {
    if (!user) {
      throw new Error('Você precisa estar logado para curtir uma história');
    }

    try {
      setError(null);

      const { error: likeError } = await supabase
        .from('stories')
        .update({ likes: supabase.rpc('increment') })
        .eq('id', storyId);

      if (likeError) throw likeError;

      // Atualizar a lista de histórias
      await fetchStories();

      return true;
    } catch (err) {
      console.error('Erro ao curtir história:', err);
      setError('Erro ao curtir história');
      throw err;
    }
  };

  // Buscar histórias na inicialização
  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
    posting,
    postStory,
    deleteStory,
    likeStory,
    refreshStories: fetchStories
  };
} 