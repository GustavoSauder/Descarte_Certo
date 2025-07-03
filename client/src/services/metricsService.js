import { supabase } from '../lib/supabase';

export async function fetchUserMetrics(userId) {
  const { data, error } = await supabase
    .from('user_metrics')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createUserMetrics(userId) {
  const { data, error } = await supabase
    .from('user_metrics')
    .insert([{ user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserMetrics(userId, updates) {
  const { data, error } = await supabase
    .from('user_metrics')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
} 