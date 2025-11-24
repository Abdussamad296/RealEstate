// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { 
        type: String,
        required: true 
    },
    body: { 
        type: String, 
        required: true 
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
      name: String,
      email: String,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    meta: { 
        type: Object, 
        default: {} 
    }, 
    isRead: { 
        type: Boolean, 
        default: false 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
