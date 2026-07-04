import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const emptyQuestion = () => ({ text: '', options: ['', ''], correctIndex: 0 });

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState('');

  const updateQuestion = (i, field, value) => {
    const next = [...questions];
    next[i][field] = value;
    setQuestions(next);
  };

  const updateOption = (qi, oi, value) => {
    const next = [...questions];
    next[qi].options[oi] = value;
    setQuestions(next);
  };

  const addOption = (qi) => {
    const next = [...questions];
    next[qi].options.push('');
    setQuestions(next);
  };

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/quizzes', { title, description, topic, questions });
      navigate('/teacher');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h2 className="heading" style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>Create quiz</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input placeholder="Topic (e.g. Algebra)" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="card-flashcard">
            <input
              placeholder={`Question ${qi + 1}`}
              value={q.text}
              onChange={(e) => updateQuestion(qi, 'text', e.target.value)}
              required
              style={{ width: '100%', marginBottom: 10 }}
            />
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={q.correctIndex === oi}
                  onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                  title="Mark as correct answer"
                />
                <input
                  placeholder={`Option ${oi + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="button" className="secondary" onClick={() => addOption(qi)}>+ Option</button>
              {questions.length > 1 && (
                <button type="button" className="danger" onClick={() => removeQuestion(qi)}>Remove question</button>
              )}
            </div>
          </div>
        ))}

        <button type="button" className="secondary" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }} onClick={addQuestion}>+ Add question</button>
        {error && <p style={{ color: '#F09595', fontSize: 13 }}>{error}</p>}
        <button type="submit">Publish quiz</button>
      </form>
    </div>
  );
}
