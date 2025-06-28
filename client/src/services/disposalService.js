import api from './api';

export const listDisposals = (params) => api.get('/disposals', { params });
export const createDisposal = (data) => api.post('/disposals', data);
export const getDisposal = (id) => api.get(`/disposals/${id}`);
export const updateDisposal = (id, data) => api.put(`/disposals/${id}`, data);
export const deleteDisposal = (id) => api.delete(`/disposals/${id}`);
export const getDisposalStats = () => api.get('/disposals/stats');
export const uploadDisposalImage = (formData) => api.post('/disposals/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); 