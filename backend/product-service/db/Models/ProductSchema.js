const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["TCG", "Comics", "Sports", "Figurines", "Other"],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sold: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
