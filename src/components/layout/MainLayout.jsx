import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-dark shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <h1 className="font-display text-3xl text-white">RevPar</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white font-semibold">{currentUser?.name}</p>
                <p className="text-gold text-sm">{currentUser?.tier} Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-8 border-t border-gray-700 pt-4 pb-2">
            <NavLink
              to="/hotels"
              className={({ isActive }) =>
                `pb-2 border-b-2 transition font-semibold ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`
              }
            >
              Hotels
            </NavLink>
            <NavLink
              to="/overview"
              className={({ isActive }) =>
                `pb-2 border-b-2 transition font-semibold ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`
              }
            >
              Overview
            </NavLink>
            {/* <NavLink
              to="/admin/offers"
              className={({ isActive }) =>
                `pb-2 border-b-2 transition font-semibold ${
                  isActive
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink> */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-2xl mb-4">RevPar</h3>
              <p className="text-gray-400">
                Your premium hotel booking experience
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gold transition">About Us</a></li>
                <li><a href="#" className="hover:text-gold transition">Contact</a></li>
                <li><a href="#" className="hover:text-gold transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gold transition">Help Center</a></li>
                <li><a href="#" className="hover:text-gold transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 RevPar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
