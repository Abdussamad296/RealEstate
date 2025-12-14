// socket/socket.js
import { Server } from "socket.io";
import { sendNotification } from "../utils/sendNotification.js";

let io = null;

export const initSocket = (server, options = {}) => {
  if (io) return io; // Prevent double init

  io = new Server(server, {
    cors: {
      origin: options.cors?.origin || "http://localhost:5173",
      credentials: true,
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
      console.log("onlineIds", onlineIds);
      socket.emit("onlineUsers", onlineIds);
    });

    socket.on("propertyLiked", async (data) => {
      await sendNotification({
        recipientId: data.ownerId,
        title: "New Like",
        body: `${data.buyerName} liked your property "${data.listingName}"`,
        sender: { _id: data.buyerId, name: data.buyerName },
        meta: { type: "like", listingId: data.listingId },
      });
    });

    socket.on("propertyViewed", async (data) => {
      await sendNotification({
        recipientId: data.ownerId,
        title: "Property Viewed",
        body: `${data.buyerName} viewed your property "${data.listingName}"`,
        sender: { _id: data.buyerId, name: data.buyerName },
        meta: {
          type: "view",
          listingId: data.listingId,
        },
      });
    });

    socket.on("sendChatMessage", (data) => {
      console.log("sendChatMessage received:", data);

      const buyerSocketId = global.onlineUsers.get(String(data.buyerId));
      const sellerSocketId = global.onlineUsers.get(String(data.sellerId));

      const isFromBuyer = data.sender === "buyer";
      const recipientSocketId = isFromBuyer ? sellerSocketId : buyerSocketId;
      const senderSocketId = isFromBuyer ? buyerSocketId : sellerSocketId;

      const messageToEmit = {
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveChatMessage", {
          ...messageToEmit,
          sender: "other", 
        });
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveChatMessage", {
          ...messageToEmit,
          sender: "me", 
        });
      }
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

export const isUserOnline = (userId) => {
  return global.onlineUsers.has(String(userId));
}
