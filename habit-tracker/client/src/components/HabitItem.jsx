import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HabitItem({ habit, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
      className="card-flashcard"
      whileHover={{ y: -2, boxShadow: '0 14px 30px -18px rgba(0,0,0,0.4)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <motion.button
          onClick={() => onToggle(habit)}
          whileTap={{ scale: 0.88 }}
          animate={habit.doneToday ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          aria-label={habit.doneToday ? 'Mark as not done today' : 'Check in for today'}
          style={{
            flexShrink: 0,
            width: 54,
            height: 54,
            borderRadius: '50%',
            fontSize: 22,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: habit.doneToday ? 'var(--accent)' : 'var(--accent-soft)',
            color: habit.doneToday ? '#fff' : 'var(--primary-dark)',
            boxShadow: habit.doneToday ? '0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent)' : 'none',
            border: 'none',
          }}
        >
          {habit.icon}
        </motion.button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <p style={{ fontWeight: 600, margin: 0 }}>{habit.name}</p>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
              🔥 <AnimatedNumber value={habit.currentStreak} />
            </span>
          </div>
          <p className="muted" style={{ fontSize: 12, margin: '2px 0 8px' }}>
            Best streak: {habit.longestStreak} day{habit.longestStreak === 1 ? '' : 's'}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {habit.last7Days.map((d, i) => (
              <div key={d.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: d.done ? 'var(--accent)' : 'transparent',
                    border: `1.5px solid ${d.done ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                />
                <span className="muted" style={{ fontSize: 10 }}>{dayLabels[new Date(d.date + 'T00:00:00Z').getUTCDay()]}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="danger" onClick={() => onDelete(habit)} style={{ padding: '6px 10px', fontSize: 12, flexShrink: 0, alignSelf: 'flex-start' }}>
          Delete
        </button>
      </div>
    </motion.div>
  );
}
