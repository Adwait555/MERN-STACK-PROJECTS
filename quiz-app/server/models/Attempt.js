const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    answers: { type: [Number], required: true }, // selected option index per question, -1 if unanswered
    score: { type: Number, required: true }, // number correct
    total: { type: Number, required: true },
  },
  { timestamps: true } // createdAt used as submittedAt
);

attemptSchema.index({ student: 1, createdAt: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
