import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: 380 }}>
        <h2 className="heading" style={{ fontSize: 22, marginBottom: 4 }}>Create your account</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 14 }}>Join as a teacher or a student</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} />
          <div style={{ display: 'flex', gap: 10 }}>
            {['student', 'teacher'].map((r) => (
              <label
                key={r}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px 0',
                  borderRadius: 10,
                  border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                  background: form.role === r ? 'var(--accent-soft)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={form.role === r}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                {r === 'student' ? 'Student' : 'Teacher'}
              </label>
            ))}
          </div>
          {error && <p style={{ color: '#A32D2D', fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit">Create account</button>
        </form>
        <p className="muted" style={{ fontSize: 13, marginTop: 16, marginBottom: 0 }}>
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
