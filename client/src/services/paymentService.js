import api from './api';

export const createVnpayUrlAPI = async (bookingId) => {
  const response = await api.post('/payment/create-vnpay-url', { bookingId });
  return response.data;
};