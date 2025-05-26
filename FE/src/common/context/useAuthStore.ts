import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async (clerkId: string) => {
    try {
      const res = await axios.get(`${apiUrl}/users/${clerkId}`);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      // toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io("http://localhost:3000", {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
