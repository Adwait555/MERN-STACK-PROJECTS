import { motion, useMotionValue, useTransform } from 'framer-motion';

const priorityLabel = { low: 'Low', medium: 'Medium', high: 'High' };

export default function TodoItem({ todo, onToggle, onDelete }) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-140, 0, 140],
    ['rgba(163,45,45,0.18)', 'rgba(0,0,0,0)', 'var(--accent-soft)']
  );
  const deleteOpacity = useTransform(x, [-140, -40, 0], [1, 0, 0]);
  const completeOpacity = useTransform(x, [0, 40, 140], [0, 0, 1]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 110) onToggle(todo);
    else if (info.offset.x < -110) onDelete(todo);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, transition: { duration: 0.25 } }}
      style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden' }}
    >
      <motion.div style={{ position: 'absolute', inset: 0, background, borderRadius: 'var(--radius)' }} />
      <motion.span style={{ position: 'absolute', left: 18, top: '50%', translateY: '-50%', opacity: deleteOpacity, fontSize: 13, fontWeight: 600, color: '#A32D2D' }}>
        ← Delete
      </motion.span>
      <motion.span style={{ position: 'absolute', right: 18, top: '50%', translateY: '-50%', opacity: completeOpacity, fontSize: 13, fontWeight: 600, color: 'var(--primary-dark)' }}>
        Complete →
      </motion.span>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
        className="card-flashcard"
        style={{ x, position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12 }}
      >
        <button
          onClick={() => onToggle(todo)}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as complete'}
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            padding: 0,
            borderRadius: '50%',
            background: todo.completed ? 'var(--accent)' : 'transparent',
            border: `2px solid ${todo.completed ? 'var(--accent)' : 'var(--border)'}`,
            boxShadow: 'none',
            marginTop: 2,
          }}
        >
          {todo.completed && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontWeight: 600,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'var(--text-soft)' : 'var(--text)',
          }}>
            {todo.title}
          </p>
          {todo.notes && <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>{todo.notes}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`badge badge-${todo.priority}`}>{priorityLabel[todo.priority]}</span>
            {todo.dueDate && (
              <span className="muted" style={{ fontSize: 12 }}>
                Due {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <button className="danger" onClick={() => onDelete(todo)} style={{ padding: '6px 10px', fontSize: 12, flexShrink: 0 }}>
          Delete
        </button>
      </motion.div>
    </motion.div>
  );
}
