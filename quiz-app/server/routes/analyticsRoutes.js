const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const { myAnalytics } = require('../controllers/analyticsController');

router.get('/me', protect, requireRole('student'), myAnalytics);

module.exports = router;
