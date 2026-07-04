import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div className="card" style={{ width: 380 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
        <h2 className="heading" style={{ fontSize: 22, marginBottom: 4 }}>Create your account</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 14 }}>Start organizing your tasks</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} />
          {error && <p style={{ color: '#A32D2D', fontSize: 13, margin: 0 }}>{error}</p>}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} type="submit">Create account</motion.button>
        </form>
        <p className="muted" style={{ fontSize: 13, marginTop: 16, marginBottom: 0 }}>
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
