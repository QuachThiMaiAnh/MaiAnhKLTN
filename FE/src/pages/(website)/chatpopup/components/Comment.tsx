import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { Message } from "../page";

const Comment = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const [newMessage, setNewMessage] = useState("");

  const sendUserMessageSocket = async () => {
    if (!newMessage.trim()) return;

    // Hiển thị tin nhắn của người dùng trước
    const userMessage: Message = {
      _id: new Date().toISOString(),
      text: newMessage,
      senderType: "User",
      createdAt: new Date().toISOString(),
      sender: {
        _id: "user",
        firstName: "Người",
        lastName: "Dùng",
        role: "user",
        imageUrl: "",
      },
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.get(`http://localhost:8080/api/chatbot`, {
        params: { newMessage },
      });
      const botMessage: Message = {
        _id: new Date().toISOString(),
        text: res.data.reply,
        senderType: "Admin",
        createdAt: new Date().toISOString(),
        sender: {
          _id: "admin",
          firstName: "Trợ lý",
          lastName: "AI",
          role: "admin",
          imageUrl:
            "https://res.cloudinary.com/do9l1lmcz/image/upload/v1726331293/zfbtxb1rprydlfsgicbt.png",
        },
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }

    setNewMessage("");
  };

  return (
    <div className="absolute bottom-2 flex justify-between w-full gap-2 px-2">
      <input
        placeholder="Nhập tin nhắn"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 w-full border-[#b8cd06] rounded-lg ring-0 outline-0 focus:ring-0 focus:border-[#b8cd06] p-2"
        type="text"
      />
      <Button onClick={sendUserMessageSocket}>Gửi</Button>
    </div>
  );
};

export default Comment;
