// socket/socket.js
import { Server } from "socket.io";

let io = null;

export const initSocket = (server, options = {}) => {
  if (io) return io; // Prevent double init

  io = new Server(server, {
    cors: {
      origin: options.cors?.origin || "http://localhost:5173",
      credentials: true
    },
   path: "/socket.io/", // default, but explicit is good
  });

  global.onlineUsers = global.onlineUsers || new Map();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("registerUser", (userId) => {
      if (userId) {
        global.onlineUsers.set(String(userId), socket.id);
        console.log(`User ${userId} registered → socket ${socket.id}`);
      }
    });

    // Support online status check
    socket.on("getOnlineUsers", () => {
      const onlineIds = Array.from(global.onlineUsers.keys());
      socket.emit("onlineUsers", onlineIds);
    });

    socket.on("disconnect", () => {
      for (const [userId, sid] of global.onlineUsers.entries()) {
        if (sid === socket.id) {
          global.onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  // Attach io to server so controllers can use it
  server.io = io;

  return io;
};

// Helper to get io instance
export const getIo = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};