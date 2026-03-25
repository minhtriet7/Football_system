import api from './api';

export const loginAPI = async (phone, password) => {
  const response = await api.post('/auth/login', { phone, password });
  return response.data; // Trả về { _id, name, phone, role, token }
};

export const registerAPI = async (name, phone, password) => {
  const response = await api.post('/auth/register', { name, phone, password });
  return response.data;
};