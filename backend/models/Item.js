const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["lost", "found"], required: true },
    category: {
      type: String,
      enum: ["wallet", "phone", "keys", "bag", "documents", "other"],
      default: "other",
    },
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    date: { type: Date, required: true },
    image: { type: String, default: null },
    secretQuestion: { type: String, required: true },
    secretAnswer: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);