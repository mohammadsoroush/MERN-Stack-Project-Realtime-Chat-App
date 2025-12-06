// socket.js
import { Server } from "socket.io";

export const onlineUsersMap = {}; // بیرون تعریف شود

let io = null;

export const getReceiversSocketIds = (userId) => {
  const socketSet = onlineUsersMap[userId];
  if (!socketSet) return [];
  return Array.from(socketSet);
};

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  const emitOnlineUsers = () => {
    io.emit("getUsersOnline", Object.keys(onlineUsersMap));
  };

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const handshakeUserId = socket.handshake?.query?.userId;
    if (handshakeUserId) {
      // ensure set exists
      onlineUsersMap[handshakeUserId] =
        onlineUsersMap[handshakeUserId] || new Set();
      onlineUsersMap[handshakeUserId].add(socket.id);
      emitOnlineUsers();
    }

    socket.on("join", (userData) => {
      const userId = typeof userData === "string" ? userData : userData?.userId;
      if (!userId) return;

      onlineUsersMap[userId] = onlineUsersMap[userId] || new Set();
      onlineUsersMap[userId].add(socket.id);

      emitOnlineUsers();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const [userId, socketsSet] of Object.entries(onlineUsersMap)) {
        if (socketsSet.has(socket.id)) {
          socketsSet.delete(socket.id);
          if (socketsSet.size === 0) {
            delete onlineUsersMap[userId];
          }
          break;
        }
      }

      emitOnlineUsers();
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
