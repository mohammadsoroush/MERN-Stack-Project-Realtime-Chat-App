import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  user: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  subscribeMessageFromSocket: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;
    const { socket } = useAuthStore.getState();
    //optimize this later
    socket?.on("newMessage", (message) => {
      if (message.senderId === selectedUser._id)
        set({ messages: [...get().messages, message] });
    });
  },
  unsubscribeMessageFromSocket: () => {
    const { socket } = useAuthStore.getState();
    socket?.off("newMessage");
  },

  getUser: async () => {
    try {
      set({ isUserLoading: true });
      const response = await axiosInstance.get("/messages/users");
      set({ user: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isUserLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        message,
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      console.error(error);
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isMessageLoading: true });
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
