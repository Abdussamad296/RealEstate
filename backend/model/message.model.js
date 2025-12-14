// models/Message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  buyerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message:   { type: String, required: true, trim: true },
  sender:    { type: String, enum: ["buyer", "seller"], required: true },
  isReadBySeller: {
      type: Boolean,
      default: false,
    },
}, { timestamps: true });

messageSchema.index({ listingId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);