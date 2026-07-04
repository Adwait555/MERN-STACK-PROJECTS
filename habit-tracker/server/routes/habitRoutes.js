const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { listHabits, createHabit, toggleToday, deleteHabit } = require('../controllers/habitController');

router.use(protect);

router.get('/', listHabits);
router.post('/', createHabit);
router.post('/:id/toggle', toggleToday);
router.delete('/:id', deleteHabit);

module.exports = router;
