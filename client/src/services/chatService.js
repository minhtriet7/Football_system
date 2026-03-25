import api from './api';

export const sendChatMessageAPI = async (message) => {
  // Gọi xuống route POST /api/chat ở backend
  const response = await api.post('/chat', { message });
  return response.data; // Trả về { reply: "câu trả lời của AI" }
};