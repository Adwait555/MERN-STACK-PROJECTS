const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  createQuiz,
  listQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { submitAttempt } = require('../controllers/attemptController');
const { quizAnalytics } = require('../controllers/analyticsController');

router.use(protect);

router.post('/', requireRole('teacher'), createQuiz);
router.get('/', listQuizzes);
router.get('/:id', getQuiz);
router.put('/:id', requireRole('teacher'), updateQuiz);
router.delete('/:id', requireRole('teacher'), deleteQuiz);

router.post('/:id/attempts', requireRole('student'), submitAttempt);
router.get('/:id/analytics', requireRole('teacher'), quizAnalytics);

module.exports = router;
