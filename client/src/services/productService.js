import api from './api';

export const getAllProductsAPI = async () => {
  const response = await api.get('/products');
  return response.data;
};