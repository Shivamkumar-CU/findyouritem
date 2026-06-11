const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const authMiddleware = require("../middleware/auth");
const { upload } = require("../middleware/cloudinary");

// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = { status: "active" };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const items = await Item.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET MY ITEMS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET INCOMING CLAIMS ON MY ITEMS
router.get("/claims", authMiddleware, async (req, res) => {
  try {
    const myItems = await Item.find({ postedBy: req.user.id });
    const myItemIds = myItems.map((item) => item._id);
    const claims = await Claim.find({ item: { $in: myItemIds } })
      .populate("item", "title type")
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET MY OWN CLAIMS — jo maine submit kiye hain
router.get("/my-claims", authMiddleware, async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user.id })
      .populate("item", "title type _id")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET SINGLE ITEM
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST ITEM
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const {
      title, description, type, category,
      location, date, secretQuestion, secretAnswer, lat, lng,
    } = req.body;

    if (!title || !description || !type || !location || !date || !secretQuestion || !secretAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const coordinates = {
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
    };

    const item = await Item.create({
      title, description, type,
      category: category || "other",
      location, coordinates, date,
      secretQuestion, secretAnswer,
      image: req.file ? req.file.path : null,
      postedBy: req.user.id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.log("POST ITEM ERROR:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CLAIM ITEM
router.post("/:id/claim", authMiddleware, upload.single("presenceProof"), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot claim your own item" });
    }

    const existingClaim = await Claim.findOne({
      item: req.params.id,
      claimant: req.user.id,
    });
    if (existingClaim) {
      return res.status(400).json({ message: "You already submitted a claim" });
    }

    const { lostTime, itemContents, specialMarks, phone, email } = req.body;

    const claim = await Claim.create({
      item: req.params.id,
      claimant: req.user.id,
      lostTime, itemContents, specialMarks, phone, email,
      presenceProof: req.file ? req.file.path : null,
    });

    res.status(201).json({
      message: "Claim submitted successfully. Owner will review it.",
      claim,
    });
  } catch (err) {
    console.log("CLAIM ERROR:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// APPROVE / REJECT CLAIM
router.put("/claims/:claimId", authMiddleware, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId).populate("item");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    claim.status = req.body.action;
    await claim.save();

    if (req.body.action === "approved") {
      await Item.findByIdAndUpdate(claim.item._id, { status: "resolved" });
    }

    res.json({ message: `Claim ${req.body.action}`, claim });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE ITEM
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;