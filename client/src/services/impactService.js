import api from './api';

export const getImpact = () => api.get('/impact');
export const getImpactStats = () => api.get('/impact/stats'); 