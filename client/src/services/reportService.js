import api from './api';

export const getPersonalReport = () => api.get('/reports/personal', { responseType: 'blob' });
export const getCertificate = () => api.get('/reports/certificate', { responseType: 'blob' }); 