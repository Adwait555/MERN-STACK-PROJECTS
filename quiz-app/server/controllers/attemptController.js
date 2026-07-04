const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

exports.submitAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body; // array of selected option indices, same order as quiz.questions
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'answers array must match number of questions' });
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score += 1;
    });

    const attempt = await Attempt.create({
      quiz: quiz._id,
      student: req.user._id,
      topic: quiz.topic,
      answers,
      score,
      total: quiz.questions.length,
    });

    res.status(201).json({
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      attemptId: attempt._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
