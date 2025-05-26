import { useEffect, useState } from "react";
import { CiChat2 } from "react-icons/ci";
import Comment from "./components/Comment";
import Content from "./components/Content";
// import { useChatStore } from "@/common/context/useChatStore";

import { io } from "socket.io-client";
import { useUserContext } from "@/common/context/UserProvider";
// import { useGetConversation } from "./actions/useGetConversation";
import axios from "axios";

const socket = io("http://localhost:3000");

export type Message = {
  _id: string;
  text: string;
  senderType: string;
  createdAt: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    imageUrl: string;
  };
};

type ConversationResponse = {
  _id: string;
  messages: Message[];
};

const ChatPopup1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { _id } = useUserContext();

  // const { conversation, isLoading, error } = useGetConversation(_id!);

  const fetchMessages = async () => {
    try {
      const data = await axios.get<ConversationResponse>(
        `http://localhost:8080/api/conversation/${_id}`
      );
      // console.log("data", data.data);
      socket.emit("joinChat", data.data._id);
      setConversationId(data.data._id);
      setMessages(data.data.messages);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!_id) return;
    socket.emit("setup", _id);
    fetchMessages();
    // socket.emit("joinChat", conversation?._id);
  }, [_id]);

  useEffect(() => {
    socket.on("messageRecieved", (message: Message) => {
      console.log("message", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div
        className="fixed bottom-[12%] rounded-full right-5 z-10 bg-white p-2 border-4 shadow-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CiChat2 className="text-3xl text-[#b8cd06]" />
      </div>

      <div
        className={`w-[340px] max-w-[340px] fixed bottom-[20%] right-5 border h-[410px] bg-white rounded-md text-black ${
          isOpen ? "opacity-100 z-40 block" : "opacity-0 z-0 hidden"
        }`}
      >
        <div className="h-[325px] py-5">
          <Content messages={messages} />
        </div>

        <Comment conversationId={conversationId} setMessages={setMessages} />
      </div>
    </>
  );
};

export default ChatPopup1;
