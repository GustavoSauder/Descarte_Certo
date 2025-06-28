import api from './api';

export const listNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`); 