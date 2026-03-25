import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { sendChatMessageAPI } from '../../services/chatService';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Dạ chào bạn! Mình là trợ lý ảo của 24h Sports. Bạn cần hỏi giá sân hay đặt nước uống ạ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    // 1. Thêm tin nhắn của user vào khung chat
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Gọi API gửi câu hỏi cho Gemini AI
      const data = await sendChatMessageAPI(userMessage);
      
      // 3. Thêm câu trả lời của AI vào khung chat
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Xin lỗi, hệ thống AI đang bận. Bạn vui lòng thử lại sau nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Nút bật/tắt Chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} absolute bottom-0 right-0 p-4 bg-rose-600 text-white rounded-full shadow-2xl hover:bg-rose-700 hover:shadow-rose-500/50 transition-all duration-300 transform`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Khung cửa sổ Chatbot */}
      <div 
        className={`${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'} 
        absolute bottom-0 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] transition-all duration-300 transform origin-bottom-right`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-[#003b73] p-4 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center text-white">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Trợ lý AI 24h Sports</h3>
              <p className="text-xs text-blue-200 flex items-center mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span> Đang trực tuyến
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Khung chứa tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {/* Hiệu ứng gõ chữ khi đang tải */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khu vực nhập tin nhắn */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full flex-shrink-0 transition ${input.trim() && !isLoading ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}