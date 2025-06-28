import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Função para obter token do localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Gerar um token simples baseado no ID do usuário
      return btoa(`${userData.id}:${userData.email}`);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }
  return null;
};

// Interceptor para adicionar token JWT do localStorage
const getAuthHeaders = async () => {
  const token = getAuthToken();
  
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json'
  };
};

// Função genérica para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  try {
    const headers = await getAuthHeaders();
    
    const config = {
      headers,
      ...options
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
};

// Métodos HTTP
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  }),
  
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
};

export default api; 