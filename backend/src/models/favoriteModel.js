const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true }
}, {
  timestamps: true
});

// Ensure unique city-state combinations
favoriteSchema.index({ city: 1, state: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);