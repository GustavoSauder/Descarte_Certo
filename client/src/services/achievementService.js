import api from './api';

export const listAchievements = () => api.get('/users/me/achievements'); 