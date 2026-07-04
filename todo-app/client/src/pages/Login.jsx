import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div className="card" style={{ width: 360 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
        <h2 className="heading" style={{ fontSize: 22, marginBottom: 4 }}>Welcome back</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 14 }}>Log in to your to-do list</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: '#A32D2D', fontSize: 13, margin: 0 }}>{error}</p>}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} type="submit">Log in</motion.button>
        </form>
        <p className="muted" style={{ fontSize: 13, marginTop: 16, marginBottom: 0 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
