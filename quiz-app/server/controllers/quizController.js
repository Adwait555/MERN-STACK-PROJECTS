const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, topic, questions, isPublished } = req.body;
    if (!title || !topic || !questions || !questions.length) {
      return res.status(400).json({ message: 'title, topic and at least one question are required' });
    }
    for (const q of questions) {
      if (!q.text || !q.options || q.options.length < 2 || q.correctIndex == null) {
        return res.status(400).json({ message: 'Each question needs text, >=2 options, and correctIndex' });
      }
    }
    const quiz = await Quiz.create({
      title,
      description,
      topic,
      questions,
      isPublished: isPublished !== false,
      createdBy: req.user._id,
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student-facing list: published quizzes, no correct answers exposed
exports.listQuizzes = async (req, res) => {
  try {
    const filter = req.user.role === 'teacher' ? { createdBy: req.user._id } : { isPublished: true };
    const quizzes = await Quiz.find(filter)
      .select('title description topic createdBy questions isPublished createdAt')
      .lean();

    const shaped = quizzes.map((q) => ({
      ...q,
      questionCount: q.questions.length,
      questions: req.user.role === 'teacher' ? q.questions : undefined,
    }));
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const isOwner = req.user.role === 'teacher' && String(quiz.createdBy) === String(req.user._id);
    if (isOwner) return res.json(quiz);

    // Strip correct answers for students
    const safe = {
      ...quiz,
      questions: quiz.questions.map((q) => ({ _id: q._id, text: q.text, options: q.options })),
    };
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (String(quiz.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your quiz' });
    }
    Object.assign(quiz, req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (String(quiz.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your quiz' });
    }
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
