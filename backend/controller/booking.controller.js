// backend/controller/booking.controller.js

import Booking from "../model/booking.model.js";
import { getIo } from "../socket/socket.js";

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      action,
      agentId,
      buyerId,
      propertyId,        // ← Now receiving this
      listingName
    } = req.body;

    // Validate required fields
    if (!name || !email || !message || !action || !agentId || !buyerId || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including propertyId"
      });
    }

    // Create booking
    const booking = await Booking.create({
      buyerId,
      agentId,
      propertyId,
      name,
      email,
      message,
      action,
    });

    // Real-time notification to seller (if online)
    try {
      const io = getIo();
      const agentSocketId = global.onlineUsers.get(String(agentId));

      if (agentSocketId) {
        io.to(agentSocketId).emit("newInquiry", {
          _id: booking._id,
          buyerName: name,
          buyerEmail: email,
          listingName: listingName || "a property",
          propertyId,
          message: message.slice(0, 100) + (message.length > 100 ? "..." : ""),
          action: action.charAt(0).toUpperCase() + action.slice(1),
          timestamp: new Date().toISOString(),
        });
        console.log("Real-time inquiry sent to agent:", agentId);
      }
    } catch (socketErr) {
      console.warn("Socket emit failed (non-critical):", socketErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      booking
    });

  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};