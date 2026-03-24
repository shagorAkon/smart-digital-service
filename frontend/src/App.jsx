import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CVBuilder from './pages/CVBuilder';

const ProtectedRoute = ({ children, requireAdmin, requireCVBuilder }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" />;
  if (requireCVBuilder && (user.service_interest !== 'CV Builder' || user.status !== 'approved')) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/cv-builder" 
        element={<ProtectedRoute requireCVBuilder><CVBuilder /></ProtectedRoute>} 
      />
      <Route 
        path="/admin" 
        element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} 
      />
    </Routes>
  );
}

export default App;
