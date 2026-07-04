const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { listTodos, createTodo, updateTodo, deleteTodo, stats } = require('../controllers/todoController');

router.use(protect);

router.get('/', listTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.get('/stats/summary', stats);

module.exports = router;
