import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
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

const RootRedirect = () => {
  const { isAuthenticated } = useApp();
  return <Navigate to={isAuthenticated ? '/hotels' : '/login'} replace />;
};

// ═══════════════════════════════════════════════════════════════════════════
// App Routes
// ═══════════════════════════════════════════════════════════════════════════

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
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
        <Route path="/admin/offers" element={<OffersAdmin />} />
      </Route>

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
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
