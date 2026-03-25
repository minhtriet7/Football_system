import api from './api';

export const sendChatMessageAPI = async (message) => {
    const response = await api.post('/chat', { message });
    return response.data; // Trả về { reply: "..." }
};