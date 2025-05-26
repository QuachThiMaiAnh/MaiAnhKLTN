import { create } from "zustand";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { ChatStoreActions, IChatStoreState } from "../types/Chat";
// import { useAuthStore } from "./useAuthStore";
import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;

const socket = io("http://localhost:3000");

export const useChatStore = create<IChatStoreState & ChatStoreActions>(
  (set, get) => ({
    listMessage: [],
    newMessage: "",
    conversations: [],
    selectedUser: null,
    selectedConversation: null,
    isConversationsLoading: false,
    isMessagesLoading: false,

    getConversations: async () => {
      set({ isConversationsLoading: true });
      try {
        const res = await axios.get(`${apiUrl}/conversation`);
        set({ conversations: res.data });
        // socket.emit()
      } catch (error) {
        toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      } finally {
        set({ isConversationsLoading: false });
      }
    },

    getMessages: async (conversationId: string) => {
      set({ isMessagesLoading: true });
      try {
        const res = await axios.get(`${apiUrl}/conversation/${conversationId}`);

        set({ listMessage: res.data });
        // console.log("res.data", res.data);
        socket.emit("joinChat", res.data._id);
      } catch (error) {
        console.log(error);
        // toast({
        //   variant: "destructive",
        //   title: error.response.data.message,
        // });
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    sendMessage: async (adminId) => {
      const { selectedConversation, listMessage, selectedUser, newMessage } =
        get();
      try {
        set({ newMessage: "" });
        const res = await axios.post(
          `${apiUrl}/conversation/${selectedConversation}/messageAdmin`,
          {
            text: newMessage,
            adminId,
            receiverId: selectedUser,
          }
        );

        socket.emit("newMessage", res.data);
        set({
          listMessage: {
            ...listMessage, // Giữ nguyên các thuộc tính khác của listMessage
            messages: [...listMessage.messages, res.data], // Cập nhật messages
          },
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      }
    },

    subscribeToMessages: () => {
      const { selectedUser, selectedConversation } = get();

      // console.log("selectedUser", selectedUser);

      socket.on("messageRecieved", (newMessageRecieved) => {
        console.log("newMessageRecieved");

        if (!selectedConversation || !selectedConversation) {
          // thong bao
          // console.log("newMessageRecieved", newMessageRecieved);
        } else {
          set({
            listMessage: {
              ...get().listMessage, // Giữ nguyên các thuộc tính khác của listMessage
              messages: [...get().listMessage.messages, newMessageRecieved], // Cập nhật messages
            },
          });
        }
      });

      // const socket = useAuthStore.getState().socket;
      // console.log("socket", socket);

      // socket.on("newMessage", (newMessage) => {
      //   // console.log("listMessage", get().listMessage);
      //   const isMessageSentFromSelectedUser =
      //     newMessage.senderId === selectedUser;

      //   // console.log(
      //   //   "isMessageSentFromSelectedUser",
      //   //   isMessageSentFromSelectedUser
      //   // );

      //   // if (!isMessageSentFromSelectedUser) return;

      //   set({
      //     listMessage: {
      //       ...get().listMessage, // Giữ nguyên các thuộc tính khác của listMessage
      //       messages: [...get().listMessage.messages, newMessage], // Cập nhật messages
      //     },
      //   });
      // });
    },

    unsubscribeFromMessages: () => {
      // const socket = useAuthStore.getState().socket;
      // socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    setSelectedConversation: (selectedConversation) =>
      set({ selectedConversation }),

    setNewMessage: (e) => set({ newMessage: e.target.value }),

    clearNewMessage: () => set({ newMessage: "" }),
  })
);
