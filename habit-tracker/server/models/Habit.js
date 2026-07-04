const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '⭐' },
    // Each entry is a 'YYYY-MM-DD' string representing a completed day
    completedDates: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
