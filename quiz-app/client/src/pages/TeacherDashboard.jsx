import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes').then((res) => setQuizzes(res.data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz?')) return;
    await api.delete(`/quizzes/${id}`);
    setQuizzes(quizzes.filter((q) => q._id !== id));
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 className="heading" style={{ color: '#fff', fontSize: 24 }}>My quizzes</h2>
          <p className="muted" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>{quizzes.length} published</p>
        </div>
        <Link to="/teacher/create">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>+ New quiz</motion.button>
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#fff' }}>Loading…</p>
      ) : quizzes.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>No quizzes yet. Create your first one to get started.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <AnimatePresence>
            {quizzes.map((q, i) => (
              <motion.div
                key={q._id}
                className="card-flashcard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
                whileHover={{ y: -3, boxShadow: '0 14px 30px -18px rgba(0,0,0,0.45)' }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{q.title}</p>
                  <span className="badge">{q.topic}</span>
                  <span className="muted" style={{ fontSize: 13, marginLeft: 8 }}>{q.questionCount} questions</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/teacher/quiz/${q._id}/analytics`}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }} className="secondary">Analytics</motion.button>
                  </Link>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }} className="danger" onClick={() => handleDelete(q._id)}>Delete</motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
