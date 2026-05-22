import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import AIMatchDemo from './pages/AIMatchDemo';
import OffersAdmin from './admin/pages/OffersAdmin';

// Layout
import MainLayout from './components/layout/MainLayout';

// ═══════════════════════════════════════════════════════════════════════════
// Protected Route
// ═══════════════════════════════════════════════════════════════════════════

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/hotels" replace />;
  return children;
};

const RootRedirect = () => {
  const { isAuthenticated, isAdmin } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin/offers' : '/hotels'} replace />;
};

// ═══════════════════════════════════════════════════════════════════════════
// App Routes
// ═══════════════════════════════════════════════════════════════════════════

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Guest Routes — wrapped in MainLayout (top nav with Hotels + Overview) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/hotels" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
      </Route>

      {/* Admin Routes — each page brings its own AdminLayout (sidebar only) */}
      <Route path="/admin/offers"   element={<AdminRoute><OffersAdmin /></AdminRoute>} />
      <Route path="/admin/ai-match" element={<AdminRoute><AIMatchDemo /></AdminRoute>} />

      {/* Default Redirect */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Main App Component
// ═══════════════════════════════════════════════════════════════════════════

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AppProvider>
    </HashRouter>
  );
}

export default App;
