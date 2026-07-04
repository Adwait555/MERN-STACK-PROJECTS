import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../api/axios';
import HabitItem from '../components/HabitItem';
import AnimatedNumber from '../components/AnimatedNumber';

const ICONS = ['⭐', '🔥', '💧', '🏃', '📚', '🧘', '🥗', '😴', '✍️', '🎯'];

export default function HabitDashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '⭐' });

  const load = () => api.get('/habits').then((res) => setHabits(res.data));

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await api.post('/habits', form);
    setForm({ name: '', icon: '⭐' });
    setShowForm(false);
    load();
  };

  const handleToggle = async (habit) => {
    const { data } = await api.post(`/habits/${habit._id}/toggle`);
    if (data.doneToday) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ['#E8A23A', '#B5730A', '#FCEFD9'] });
    }
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? data : h)));
  };

  const handleDelete = async (habit) => {
    await api.delete(`/habits/${habit._id}`);
    setHabits((prev) => prev.filter((h) => h._id !== habit._id));
  };

  const doneCount = habits.filter((h) => h.doneToday).length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak), 0);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 className="heading" style={{ color: '#fff', fontSize: 24 }}>Today</h2>
          <p className="muted" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
            {doneCount} / {habits.length} checked in
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New habit'}
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 }}>
        <div className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px' }}><AnimatedNumber value={habits.length} /></p>
          <p className="muted" style={{ fontSize: 12, margin: 0 }}>Habits tracked</p>
        </div>
        <div className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px' }}>🔥 <AnimatedNumber value={bestStreak} /></p>
          <p className="muted" style={{ fontSize: 12, margin: 0 }}>Best active streak</p>
        </div>
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
                placeholder="e.g. Drink 2L of water"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
                required
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ICONS.map((icon) => (
                  <motion.button
                    key={icon}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setForm({ ...form, icon })}
                    style={{
                      width: 38,
                      height: 38,
                      padding: 0,
                      fontSize: 18,
                      background: form.icon === icon ? 'var(--accent-soft)' : 'transparent',
                      border: `1.5px solid ${form.icon === icon ? 'var(--accent)' : 'var(--border)'}`,
                      color: 'inherit',
                      boxShadow: 'none',
                    }}
                  >
                    {icon}
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit">Add habit</motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <p style={{ color: '#fff' }}>Loading…</p>
      ) : habits.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>No habits yet. Add one to start your first streak.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitItem key={habit._id} habit={habit} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
