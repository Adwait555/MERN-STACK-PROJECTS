import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { themeKey, setThemeKey, themes } = useTheme();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 28px',
        background: 'color-mix(in srgb, var(--wallpaper-a) 55%, transparent)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid color-mix(in srgb, #ffffff 12%, transparent)',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <motion.span
          className="heading"
          style={{ color: '#fff', fontSize: 18, display: 'inline-block' }}
          whileHover={{ scale: 1.04, rotate: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          🔥 Habits
        </motion.span>
      </Link>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <select
          value={themeKey}
          onChange={(e) => setThemeKey(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          aria-label="Choose color theme"
        >
          {Object.entries(themes).map(([key, t]) => (
            <option key={key} value={key} style={{ color: '#111' }}>{t.label}</option>
          ))}
        </select>
        {user ? (
          <>
            <span style={{ color: '#fff', fontSize: 14 }}>{user.name}</span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
