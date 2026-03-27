import axios from "axios";

// Đảm bảo trỏ ĐÚNG vào cổng 5000 của Backend
const API_URL = "http://localhost:5000/api/payment";

export const createVnpayUrlAPI = async (bookingId) => {
  // Lấy token để xác thực
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };

  // Gọi API tạo link
  const response = await axios.post(`${API_URL}/create-vnpay-url`, { bookingId }, config);
  
  // Trả về data (chứa paymentUrl)
  return response.data; 
};