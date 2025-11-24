// backend/controller/booking.controller.js
import Booking from "../model/booking.model.js";
import Notification from "../model/notification.model.js";
import { getIo } from "../socket/socket.js";

export const createBooking = async (req, res) => {
  try {
    const { name, email, message, action, agentId } = req.body;
    if (!name || !email || !message || !action || !agentId) {
      return res.status(400).json({ success:false, message:"All fields are required" });
    }

    const booking = await Booking.create({ name, email, message, action, agentId });

    const notification = await Notification.create({
      title: `${action.toUpperCase()} Request`,
      body: message,
      recipient: agentId,
      sender: { name, email },
      booking: booking._id,
    });

    // emit realtime to agent if online
    try {
      const io = getIo();
      const agentSocketId = global.onlineUsers.get(String(agentId));
      if (agentSocketId) {
        io.to(agentSocketId).emit("newNotification", notification);
        console.log("Realtime notification sent to agent:", agentSocketId);
      } else {
        console.log("Agent offline: saved notification only");
      }
    } catch (e) {
      console.warn("Socket not initialized yet:", e.message);
    }

    return res.status(201).json({ success:true, message:"Request sent", booking, notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
