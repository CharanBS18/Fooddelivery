import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    cuisines: [{ type: String, trim: true }],
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String
    },
    avgDeliveryMinutes: { type: Number, default: 30 },
    imageUrl: String,
    isActive: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 0 }
  },
  { timestamps: true }
);

restaurantSchema.index({ name: "text", cuisines: "text" });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
