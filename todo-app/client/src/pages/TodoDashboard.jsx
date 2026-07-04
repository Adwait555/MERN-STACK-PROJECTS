import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../api/axios';
import TodoItem from '../components/TodoItem';
import AnimatedNumber from '../components/AnimatedNumber';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, overdue: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [showForm, setShowForm] = useState(false);

  const loadTodos = (f = filter) => {
    api.get('/todos', { params: { status: f === 'all' ? undefined : f } }).then((res) => setTodos(res.data));
  };
  const loadStats = () => {
    api.get('/todos/stats/summary').then((res) => setStats(res.data));
  };

  useEffect(() => {
    setLoading(true);
    loadTodos(filter);
    loadStats();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post('/todos', {
      title: form.title,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });
    setForm({ title: '', priority: 'medium', dueDate: '' });
    setShowForm(false);
    loadTodos();
    loadStats();
  };

  const handleToggle = async (todo) => {
    const nowCompleted = !todo.completed;
    await api.put(`/todos/${todo._id}`, { completed: nowCompleted });
    if (nowCompleted) {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, scalar: 0.7 });
    }
    loadTodos();
    loadStats();
  };

  const handleDelete = async (todo) => {
    await api.delete(`/todos/${todo._id}`);
    loadTodos();
    loadStats();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 className="heading" style={{ color: '#fff', fontSize: 24 }}>My tasks</h2>
          <p className="muted" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
            {stats.active} active · {stats.completed} done{stats.overdue > 0 ? ` · ${stats.overdue} overdue` : ''}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New task'}
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Total', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Completed', value: stats.completed },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px' }}><AnimatedNumber value={s.value} /></p>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAdd}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="card" style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                autoFocus
                required
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ flex: 1 }}>
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ flex: 1 }} />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit">Add task</motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filters.map((f) => (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? '' : 'secondary'}
            style={filter !== f.key ? { color: '#fff', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' } : {}}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#fff' }}>Loading…</p>
      ) : todos.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>Nothing here. Add a task to get started.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <AnimatePresence>
            {todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="muted" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 20, textAlign: 'center' }}>
        Swipe a task right to complete it, or left to delete it.
      </p>
    </div>
  );
}
