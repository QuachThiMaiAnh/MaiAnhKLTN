import { useUserContext } from "@/common/context/UserProvider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

import { io } from "socket.io-client";
import { Message } from "../page";

const socket = io("http://localhost:3000");

const Comment = ({
  conversationId,
  setMessages,
}: {
  conversationId: string | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const { _id } = useUserContext();
  const [newMessage, setNewMessage] = useState("");

  const sendUserMessageSocket = async () => {
    try {
      const data = await axios.post(
        `http://localhost:8080/api/conversation/${_id}/message`,
        {
          text: newMessage,
          conversationId,
        }
      );

      socket.emit("newMessage", data.data);
      setNewMessage("");
      setMessages((prev) => [...prev, data.data]);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="absolute bottom-2 flex justify-between w-full gap-2 px-2">
      {/* <Button onClick={handleSendMessage}>Gửi</Button> */}
      {_id ? (
        <div className="flex items-center gap-2 w-full">
          <input
            placeholder="Nhập tin nhắn"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 w-full border-[#b8cd06] rounded-lg ring-0 outline-0 focus:ring-0 focus:border-[#b8cd06] p-2"
            type="text"
          />
          <Button onClick={sendUserMessageSocket}>Gửi</Button>
        </div>
      ) : (
        <div className="text-center items-center">
          đăng nhập để trò chuyện với chúng tôi!
        </div>
      )}
    </div>
  );
};

export default Comment;
