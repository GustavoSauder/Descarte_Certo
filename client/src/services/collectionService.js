import api from './api';

export const listCollectionPoints = (params) => api.get('/collection', { params });
export const getCollectionPoint = (id) => api.get(`/collection/${id}`); 