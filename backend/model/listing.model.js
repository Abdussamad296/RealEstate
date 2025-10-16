import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  regularPrice: { type: Number, required: true, min: 0 },
  discountedPrice: { 
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        return !value || value < this.regularPrice;
      },
      message: "Discounted price must be less than regular price"
    }
  },
  bedrooms: { type: Number, required: true, min: 1, max: 10 },
  bathrooms: { type: Number, required: true, min: 1, max: 10 },
  furnished: { type: Boolean, required: true, default: false },
  offer: { type: Boolean, required: true, default: false },
  parking: { type: Boolean, required: true, default: false },
  type: { type: String, required: true, enum: ["rent", "sale"], trim: true },
  images: { type: [String], required: true, validate: [arr => arr.length > 0, "At least one image is required"] },
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;