import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quizzes').then((res) => setQuizzes(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 className="heading" style={{ color: '#fff', fontSize: 24 }}>Available quizzes</h2>
          <p className="muted" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>{quizzes.length} to try</p>
        </div>
        <Link to="/student/analytics">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
            My analytics
          </motion.button>
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#fff' }}>Loading…</p>
      ) : quizzes.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>No quizzes available yet. Check back soon.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {quizzes.map((q, i) => (
            <motion.div
              key={q._id}
              className="card-flashcard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
              whileHover={{ y: -3, boxShadow: '0 14px 30px -18px rgba(0,0,0,0.45)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{q.title}</p>
                  <span className="badge">{q.topic}</span>
                  <span className="muted" style={{ fontSize: 13, marginLeft: 8 }}>{q.questionCount} questions</span>
                  {q.description && <p className="muted" style={{ fontSize: 13, marginTop: 8, marginBottom: 0 }}>{q.description}</p>}
                </div>
                <Link to={`/student/quiz/${q._id}`}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>Take quiz</motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
