import api from './api';

export const getAllFieldsAPI = async () => {
  const response = await api.get('/fields');
  return response.data; // Trả về mảng các sân bóng
};export const getFieldByIdAPI = async (id) => {
  const response = await api.get(`/fields/${id}`);
  return response.data;
};

