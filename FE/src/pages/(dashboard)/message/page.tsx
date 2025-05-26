import { io } from "socket.io-client";
import ContentChat from "./components/ContentChat";
import SideBarUser from "./components/SideBarUser";
import { useUserContext } from "@/common/context/UserProvider";
import { useEffect } from "react";

const socket = io("http://localhost:3000");

const MessagePage = () => {
  const { _id } = useUserContext();

  console.log(_id);

  useEffect(() => {
    if (!_id) return;

    socket.emit("setup", _id);
  }, [_id]);

  // useEffect(() => {
  //   socket.on("messageRecieved", (message) => {
  //     console.log("message", message);
  //   });
  // }, []);

  return (
    <div className="bg-white py-2">
      <div className=" mt-5">
        <h1 className="text-2xl font-bold pl-4 pb-4 border-b">Tin nhắn</h1>
        <div className="flex gap-1 overflow-auto">
          <SideBarUser />
          <ContentChat socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
