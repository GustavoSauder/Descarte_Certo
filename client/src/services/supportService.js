import api from './api';

export const listMyTickets = () => api.get('/support/my-tickets');
export const getTicket = (id) => api.get(`/support/${id}`);
export const createTicket = (data) => api.post('/support', data);
export const updateTicket = (id, data) => api.put(`/support/${id}`, data);
export const closeTicket = (id) => api.patch(`/support/${id}/close`);
export const getCategories = () => api.get('/support/categories'); 