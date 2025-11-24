// socket.js
import { Server } from "socket.io";

let ioInstance = null;

export const initSocket = (server, options = {}) => {
  ioInstance = new Server(server, {
    cors: {
      origin: options.origin || "http://localhost:5173",
      credentials: true,
    },
    ...options,
  });

  global.onlineUsers = new Map();

  ioInstance.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("registerUser", (userId) => {
      if (userId) {
        global.onlineUsers.set(String(userId), socket.id);
        console.log("User registered:", userId);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sId] of global.onlineUsers.entries()) {
        if (sId === socket.id) {
          global.onlineUsers.delete(userId);
        }
      }
      console.log("Socket disconnected:", socket.id);
    });
  });

  return ioInstance;
};

export const getIo = () => {
  if (!ioInstance) throw new Error("Socket.io not initialized");
  return ioInstance;
};
