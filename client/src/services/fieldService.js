import axios from "axios";

// Đổi lại URL này nếu Backend của bạn chạy ở port khác (ví dụ: 5000, 8000...)
const API_URL = "http://localhost:5000/api/fields";

// Hàm lấy Token của Admin từ LocalStorage để chứng minh quyền lực 👑
const getAuthHeaders = () => {
  // Lấy chuỗi userInfo từ LocalStorage
  const userInfoString = localStorage.getItem("userInfo"); 
  
  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString); // Dịch nó ra thành Object
    return {
      headers: {
        Authorization: `Bearer ${userInfo.token}`, // Lấy đúng cái token bên trong
      },
    };
  }
  
  // Trả về rỗng nếu chưa đăng nhập
  return { headers: {} }; 
};

// 1. LẤY TẤT CẢ SÂN (Cho cả Khách và Admin)
export const getAllFieldsAPI = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// 2. LẤY CHI TIẾT 1 SÂN
export const getFieldByIdAPI = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// 3. THÊM SÂN MỚI (Chỉ Admin)
export const createFieldAPI = async (fieldData) => {
  const response = await axios.post(API_URL, fieldData, getAuthHeaders());
  return response.data;
};

// 4. SỬA THÔNG TIN SÂN (Chỉ Admin)
export const updateFieldAPI = async (id, fieldData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    fieldData,
    getAuthHeaders(),
  );
  return response.data;
};

// 5. XÓA SÂN (Chỉ Admin)
export const deleteFieldAPI = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
