import api from './api';

export const listPosts = (params) => api.get('/blog', { params });
export const getPost = (id) => api.get(`/blog/${id}`);
export const createPost = (data) => api.post('/blog', data);
export const commentPost = (id, data) => api.post(`/blog/${id}/comment`, data); 