import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Função para obter token do localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
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
export const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const headers = await getAuthHeaders();
    
    const config = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
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
  
  post: (endpoint, data) => apiRequest(endpoint, 'POST', data),
  
  put: (endpoint, data) => apiRequest(endpoint, 'PUT', data),
  
  delete: (endpoint) => apiRequest(endpoint, 'DELETE'),
  
  patch: (endpoint, data) => apiRequest(endpoint, 'PATCH', data)
};

export default api; 