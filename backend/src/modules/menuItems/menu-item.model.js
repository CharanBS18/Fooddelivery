import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    category: String,
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    imageUrl: String,
    isVeg: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, name: 1 });

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
