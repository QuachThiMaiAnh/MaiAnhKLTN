import { useState } from "react";
import { CiChat2 } from "react-icons/ci";
import Comment from "./components/Comment";
import Content from "./components/Content";
// import { useChatStore } from "@/common/context/useChatStore";

// import { useGetConversation } from "./actions/useGetConversation";
import axios from "axios";


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


const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  console.log("messages", messages)
  return (
    <>
      <div
        className="fixed bottom-[4%] rounded-full right-5 z-10 bg-white p-2 border-4 shadow-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CiChat2 className="text-3xl text-[#b8cd06]" />
      </div>

      <div
        className={`w-[340px] max-w-[340px] fixed bottom-[12%] right-5 border h-[410px] bg-white rounded-md text-black ${
          isOpen ? "opacity-100 z-40 block" : "opacity-0 z-0 hidden"
        }`}
      >
        <div className="h-[325px] py-5">
          <Content messages={messages} />
        </div>

        <Comment setMessages={setMessages} />
      </div>
    </>
  );
};

export default ChatPopup;
