import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendChatMessageAPI } from "../../services/chatService";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Dạ em chào anh/chị! Em là trợ lý ảo của **24h Sports** ⚽. Anh/chị cần tư vấn đặt sân hay xem bảng giá dịch vụ ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      // Gọi API gửi tin nhắn lên Backend
      const res = await sendChatMessageAPI(userMsg);
      setMessages((prev) => [...prev, { sender: "bot", text: res.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Dạ hiện tại em đang bị mất kết nối mạng. Anh/chị thông cảm đợi em xíu nhé! 😥",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Nút bấm mở Chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center animate-bounce"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Khung Chat */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-red-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <span className="font-bold">Trợ lý 24h Sports</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-rose-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    // Dùng ReactMarkdown để render chữ in đậm, gạch đầu dòng
                    // CODE MỚI ĐÃ FIX
                    <div className="prose prose-sm prose-rose max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Hiệu ứng đang gõ chữ */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 flex space-x-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Khung nhập liệu */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white p-2 rounded-full transition"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
