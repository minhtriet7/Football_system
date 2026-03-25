import api from './api';

export const createBookingAPI = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};
export const getMyBookingsAPI = async () => {
  const response = await api.get('/bookings/mybookings');
  return response.data;
};
// Thêm vào cuối file
export const checkAvailabilityAPI = async (fieldId, date) => {
  const response = await api.get(`/bookings/check-availability?fieldId=${fieldId}&date=${date}`);
  return response.data;
};
// Thêm vào cuối file src/services/bookingService.js
export const addItemsToBookingAPI = async (id, newServices) => {
  const response = await api.put(`/bookings/${id}/add-items`, { newServices });
  return response.data;
};
// Thêm vào cuối file src/services/bookingService.js

// Lấy 4 con số thống kê chính cho trang Dashboard
export const getAdminStatsAPI = async () => {
  const response = await api.get('/bookings/admin/stats');
  return response.data;
};

// Lấy 5 đơn đặt sân gần đây nhất để hiển thị
export const getRecentBookingsAPI = async () => {
  const response = await api.get('/bookings/admin/recent');
  return response.data;
};
// --- CÁC HÀM DÀNH RIÊNG CHO ADMIN ---

// Lấy toàn bộ danh sách đơn đặt sân (Admin)
export const getAllBookingsAdminAPI = async () => {
  const response = await api.get('/bookings/admin');
  return response.data;
};

// Cập nhật trạng thái đơn hàng (Duyệt, Hoàn thành, Hủy)
export const updateBookingStatusAPI = async (id, status) => {
  const response = await api.put(`/bookings/admin/${id}/status`, { status });
  return response.data;
};