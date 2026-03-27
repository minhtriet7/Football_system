import api from './api';

export const getAllProductsAPI = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProductAPI = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProductAPI = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProductAPI = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};