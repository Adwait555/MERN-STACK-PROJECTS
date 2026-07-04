import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AnimatedWallpaper from './components/AnimatedWallpaper';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateQuiz from './pages/CreateQuiz';
import QuizAnalytics from './pages/QuizAnalytics';
import StudentDashboard from './pages/StudentDashboard';
import TakeQuiz from './pages/TakeQuiz';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/create" element={<ProtectedRoute role="teacher"><CreateQuiz /></ProtectedRoute>} />
          <Route path="/teacher/quiz/:id/analytics" element={<ProtectedRoute role="teacher"><QuizAnalytics /></ProtectedRoute>} />

          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/quiz/:id" element={<ProtectedRoute role="student"><TakeQuiz /></ProtectedRoute>} />
          <Route path="/student/analytics" element={<ProtectedRoute role="student"><AnalyticsDashboard /></ProtectedRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Shell() {
  const { user } = useAuth();
  return (
    <div className={user ? 'app-shell' : 'wallpaper'} style={{ position: 'relative' }}>
      <AnimatedWallpaper />
      <Navbar />
      <AnimatedRoutes />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
