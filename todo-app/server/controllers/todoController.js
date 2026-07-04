const Todo = require('../models/Todo');

exports.listTodos = async (req, res) => {
  try {
    const { status } = req.query; // all | active | completed
    const filter = { owner: req.user._id };
    if (status === 'active') filter.completed = false;
    if (status === 'completed') filter.completed = true;

    const todos = await Todo.find(filter).sort({ completed: 1, createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title, notes, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const todo = await Todo.create({
      owner: req.user._id,
      title,
      notes: notes || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (String(todo.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your todo' });
    }

    const { title, notes, priority, dueDate, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (notes !== undefined) todo.notes = notes;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (completed !== undefined) {
      todo.completed = completed;
      todo.completedAt = completed ? new Date() : null;
    }
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (String(todo.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your todo' });
    }
    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user._id });
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = todos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    res.json({ total, completed, active, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
