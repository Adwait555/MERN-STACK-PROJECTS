import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../api/axios';

function AnimatedNumber({ value }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: 'easeOut' });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value]);

  return <span>{display}</span>;
}

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const dragX = useMotionValue(0);
  const fired = useRef(false);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then((res) => {
      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(-1));
    });
  }, [id]);

  useEffect(() => {
    if (result && result.percentage >= 70 && !fired.current) {
      fired.current = true;
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ['#1D9E75', '#378ADD', '#F0997B'] });
    }
  }, [result]);

  const selectAnswer = (oi) => {
    const next = [...answers];
    next[current] = oi;
    setAnswers(next);
  };

  const goNext = () => {
    if (answers[current] === -1) return;
    if (current < quiz.questions.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    } else {
      handleSubmit();
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -80 && answers[current] !== -1) goNext();
    else if (info.offset.x > 80) goPrev();
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const { data } = await api.post(`/quizzes/${id}/attempts`, { answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  if (!quiz) return <div className="container"><p style={{ color: '#fff' }}>Loading…</p></div>;

  if (result) {
    return (
      <div className="container" style={{ maxWidth: 420, textAlign: 'center' }}>
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <h2 className="heading" style={{ fontSize: 22 }}>Result</h2>
          <p style={{ fontSize: 44, fontWeight: 700, margin: '12px 0 4px' }}>
            <AnimatedNumber value={result.percentage} />%
          </p>
          <p className="muted" style={{ margin: '0 0 16px' }}>{result.score} / {result.total} correct</p>
          <div className="progress-bar" style={{ marginBottom: 20 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${result.percentage}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/student/analytics')}>
              View analytics
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="secondary" onClick={() => navigate('/student')}>
              Back to quizzes
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = quiz.questions[current];
  const progress = ((current + (answers[current] !== -1 ? 1 : 0)) / quiz.questions.length) * 100;

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, rotate: dir > 0 ? 2 : -2 }),
    center: { x: 0, opacity: 1, rotate: 0 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, rotate: dir > 0 ? -2 : 2 }),
  };

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <h2 className="heading" style={{ color: '#fff', fontSize: 22 }}>{quiz.title}</h2>
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{current + 1} / {quiz.questions.length}</span>
      </div>

      <div className="progress-bar" style={{ marginBottom: 20 }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          style={{ x: dragX }}
          onDragEnd={handleDragEnd}
          className="card-flashcard"
          whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
        >
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 14px' }}>{q.text}</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {q.options.map((opt, oi) => {
              const selected = answers[current] === oi;
              return (
                <motion.button
                  key={oi}
                  type="button"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectAnswer(oi)}
                  style={{
                    textAlign: 'left',
                    background: selected ? 'var(--accent-soft)' : 'transparent',
                    color: selected ? 'var(--primary-dark)' : 'var(--text)',
                    border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                  }}
                >
                  <motion.span
                    animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }}
                  />
                  {opt}
                </motion.button>
              );
            })}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14, marginBottom: 0 }}>
            Swipe left to continue, swipe right to go back — or use the buttons below.
          </p>
        </motion.div>
      </AnimatePresence>

      {error && <p style={{ color: '#F09595', fontSize: 13, marginTop: 10 }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="secondary" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }} onClick={goPrev} disabled={current === 0}>
          Back
        </motion.button>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={goNext} disabled={answers[current] === -1}>
          {current === quiz.questions.length - 1 ? 'Submit' : 'Next'}
        </motion.button>
      </div>
    </div>
  );
}
