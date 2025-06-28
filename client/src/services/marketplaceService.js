import api from './api';

export const listRewards = () => api.get('/marketplace/catalog');
export const redeemReward = (id) => api.post(`/marketplace/redeem/${id}`);
export const getRewardHistory = () => api.get('/marketplace/history'); 