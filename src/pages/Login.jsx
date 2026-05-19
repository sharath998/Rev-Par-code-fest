import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { users } from '../data/users';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const handleLogin = (userId) => {
    const success = login(userId);
    if (success) {
      navigate('/overview');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl text-dark mb-4">
            Welcome to RevPar
          </h1>
          <p className="font-sans text-lg text-gray-600">
            Select your account to continue
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className="group bg-white rounded-xl shadow-soft p-8 text-left hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl font-display text-white">
                  {user.name.charAt(0)}
                </span>
              </div>

              {/* User Info */}
              <h3 className="font-display text-2xl text-dark mb-2">
                {user.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>

              {/* Tier Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.tier === 'Platinum'
                      ? 'bg-gray-800 text-white'
                      : user.tier === 'Gold'
                      ? 'bg-gold text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {user.tier}
                </span>
                <span className="text-gold font-semibold">
                  {user.loyaltyPoints.toLocaleString()} pts
                </span>
              </div>

              {/* Login Arrow */}
              <div className="mt-4 flex items-center text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-semibold mr-2">Login</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Premium Hotel Booking Experience</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
