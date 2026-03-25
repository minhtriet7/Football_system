import axios from 'axios';

// Tạo một instance của axios với đường dẫn gốc trỏ tới Backend của bạn
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Port 5000 là port server.js của bạn đang chạy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn token vào header nếu có token trong localStorage
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;