const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  images: [{ type: String, required: true, trim: true }],
  category: { type: String, enum: ['Events', 'Activities', 'Campus'], default: 'Events' },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);
