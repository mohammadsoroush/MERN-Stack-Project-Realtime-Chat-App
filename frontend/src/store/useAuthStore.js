// useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "production" ? "/" : "http://localhost:5001";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignedUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  connectSocket: () => {
    console.log("connectSocket called");
    const { authUser, socket } = get();

    if (!authUser?._id) {
      console.log("1");
      return;
    }

    if (socket?.connected) {
      console.log("2");
      return;
    }

    if (socket && !socket.connected) {
      console.log("3");
      socket.connect();
      return;
    }

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,

      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      const { authUser } = get();
      if (authUser?._id) {
        newSocket.emit("join", authUser._id);
      }
    });

    newSocket.on("getUsersOnline", (users) => {
      set({ onlineUsers: users || [] });
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // Re-emit on reconnect attempts
    newSocket.on("reconnect", () => {
      const { authUser } = get();
      if (authUser?._id) {
        newSocket.emit("join", authUser._id);
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  checkAuthUser: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      const user = response?.data?.user || null;
      set({ authUser: user });
    } catch (error) {
      set({ authUser: null });
      console.error("checkAuthUser error:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      const user = response?.data?.user || null;
      set({ authUser: user, isSignedUp: true });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  },

  logIn: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      const user = response?.data?.user || null;
      set({ authUser: user });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      get().disconnectSocket();

      set({ authUser: null, isSignedUp: false });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        userData
      );
      set({ authUser: response?.data?.user || null });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },
}));

export default useAuthStore;
