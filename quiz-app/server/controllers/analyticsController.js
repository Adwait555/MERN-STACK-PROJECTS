const Attempt = require('../models/Attempt');
const mongoose = require('mongoose');

// Student's own performance trend + topic breakdown
exports.myAnalytics = async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id })
      .populate('quiz', 'title')
      .sort({ createdAt: 1 })
      .lean();

    const trend = attempts.map((a) => ({
      date: a.createdAt,
      quizTitle: a.quiz ? a.quiz.title : 'Deleted quiz',
      percentage: Math.round((a.score / a.total) * 100),
    }));

    const byTopicMap = {};
    for (const a of attempts) {
      if (!byTopicMap[a.topic]) byTopicMap[a.topic] = { correct: 0, total: 0 };
      byTopicMap[a.topic].correct += a.score;
      byTopicMap[a.topic].total += a.total;
    }
    const topicBreakdown = Object.entries(byTopicMap).map(([topic, v]) => ({
      topic,
      accuracy: Math.round((v.correct / v.total) * 100),
      attemptsCount: attempts.filter((a) => a.topic === topic).length,
    }));

    const overall =
      attempts.length > 0
        ? Math.round(
            (attempts.reduce((s, a) => s + a.score, 0) /
              attempts.reduce((s, a) => s + a.total, 0)) *
              100
          )
        : 0;

    res.json({ overallAccuracy: overall, totalAttempts: attempts.length, trend, topicBreakdown });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Teacher: score distribution for one quiz
exports.quizAnalytics = async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const results = attempts.map((a) => ({
      student: a.student ? a.student.name : 'Unknown',
      score: a.score,
      total: a.total,
      percentage: Math.round((a.score / a.total) * 100),
      submittedAt: a.createdAt,
    }));

    const avg =
      attempts.length > 0
        ? Math.round(
            (attempts.reduce((s, a) => s + a.score / a.total, 0) / attempts.length) * 100
          )
        : 0;

    res.json({ attemptsCount: attempts.length, averagePercentage: avg, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
