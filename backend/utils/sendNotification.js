// utils/sendNotification.js
import Notification from "../model/notification.model.js";
import { getIo } from "../socket/socket.js";

export const sendNotification = async ({
  recipientId,
  title,
  body,
  sender = null,
  bookingId = null,
  meta = {},
}) => {
  try {
    const notificationType = meta.type || "info";
    let existing;
    if (notificationType === "like") {
      existing = await Notification.findOne({
        recipient: recipientId,
        "sender.id": sender?._id || sender?.id,
        "meta.type": "like",
        "meta.listingId": meta.listingId,
      });
    } else if (notificationType === "view") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      existing = await Notification.findOne({
        recipient: recipientId,
        "sender.id": sender?._id || sender?.id,
        "meta.type": "view",
        "meta.listingId": meta.listingId,
        createdAt: { $gte: today },
      });
    }

    if (existing) {
      console.log(`Duplicate ${notificationType} notification blocked`);
      return existing;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      title,
      body,
      sender: sender
        ? {
            id: sender._id || sender.id,
            name: sender.name || sender.username,
            email: sender.email || null,
          }
        : null,
      booking: bookingId || null,
      meta: {
        type: meta.type || "info",
        listingId: meta.listingId || null,
        ...meta,
      },
    });

    // Send real-time via socket
    const io = getIo();
    const socketId = global.onlineUsers.get(String(recipientId));
    if (socketId) {
      io.to(socketId).emit("notification", {
        _id: notification._id,
        title: notification.title,
        body: notification.body,
        createdAt: notification.createdAt,
        isRead: false,
        sender: notification.sender,
        meta: notification.meta,
      });
    }

    return notification;
  } catch (err) {
    console.error("sendNotification error:", err);
  }
};
