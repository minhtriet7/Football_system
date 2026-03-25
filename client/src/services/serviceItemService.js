import api from './api';

export const getServicesAPI = async () => {
  const response = await api.get('/services');
  return response.data;
};


export const getAllProductsAPI = async () => {
  const response = await api.get('/products');
  return response.data;
};