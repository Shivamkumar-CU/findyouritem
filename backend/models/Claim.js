const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // When did they lose it
    lostTime: {
      type: String,
      required: true,
    },

    // Were they present at that location
    presenceProof: {
      type: String, // Cloudinary image URL
      default: null,
    },

    // What was inside the item
    itemContents: {
      type: String,
      required: true,
    },

    // Any special marks
    specialMarks: {
      type: String,
      default: "",
    },

    // Contact details
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", claimSchema);