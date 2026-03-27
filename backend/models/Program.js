const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  age: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  features: [{ type: String }],
  theme: { type: String, enum: ['pink', 'teal', 'yellow', 'blue', 'purple'], default: 'teal' },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Program', programSchema);
