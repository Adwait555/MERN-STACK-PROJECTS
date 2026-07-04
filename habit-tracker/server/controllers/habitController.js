const Habit = require('../models/Habit');
const { todayKey, currentStreak, longestStreak, last7Days } = require('../utils/streak');

function shapeHabit(habit) {
  const week = last7Days();
  return {
    _id: habit._id,
    name: habit.name,
    icon: habit.icon,
    completedDates: habit.completedDates,
    doneToday: habit.completedDates.includes(todayKey()),
    currentStreak: currentStreak(habit.completedDates),
    longestStreak: longestStreak(habit.completedDates),
    last7Days: week.map((d) => ({ date: d, done: habit.completedDates.includes(d) })),
  };
}

exports.listHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(habits.map(shapeHabit));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const habit = await Habit.create({ owner: req.user._id, name, icon: icon || '⭐' });
    res.status(201).json(shapeHabit(habit));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleToday = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    if (String(habit.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your habit' });
    }
    const today = todayKey();
    if (habit.completedDates.includes(today)) {
      habit.completedDates = habit.completedDates.filter((d) => d !== today);
    } else {
      habit.completedDates.push(today);
    }
    await habit.save();
    res.json(shapeHabit(habit));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    if (String(habit.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not your habit' });
    }
    await habit.deleteOne();
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
