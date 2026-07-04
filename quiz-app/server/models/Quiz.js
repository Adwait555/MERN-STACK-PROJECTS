const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: (v) => Array.isArray(v) && v.length >= 2,
  },
  correctIndex: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    topic: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: { type: [questionSchema], validate: (v) => v.length > 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
