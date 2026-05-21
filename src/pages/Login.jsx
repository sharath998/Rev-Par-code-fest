import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError('');
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const result = login(credentials.username, credentials.password);

    if (result.success) {
      navigate('/hotels');
      return;
    }

    setError(result.error);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-soft-lg lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9A8A57]">
              Premium access
            </p>
            <h1 className="font-display text-5xl text-dark">
              Welcome back
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Sign in with your username and password to access your bookings,
              last-minute offers, and loyalty dashboard.
            </p>

            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-dark">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-[#E5E0D6] bg-[#FCFBF8] px-4 py-3.5 text-dark outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-dark">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-[#E5E0D6] bg-[#FCFBF8] px-4 py-3.5 text-dark outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-dark px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1c1c1c]"
              >
                Sign In
              </button>
            </form>

          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[#2C2C2C] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(203,161,53,0.38),_transparent_28%),linear-gradient(160deg,_rgba(255,255,255,0.06),_transparent_55%)]" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                RevPar Signature Access
              </p>
              <h2 className="mt-6 max-w-md font-display text-5xl leading-tight">
                Curated stays, member rewards, and last-minute luxury offers.
              </h2>
            </div>

            <div className="space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.22em] text-white/50">
                  Member benefits
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  <li>Access premium hotel inventory and exclusive rates</li>
                  <li>Track loyalty points and active bookings in one place</li>
                  <li>Receive time-limited offers when last-minute rooms open up</li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Hotels</p>
                  <p className="mt-2 font-display text-3xl">08</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Users</p>
                  <p className="mt-2 font-display text-3xl">05</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Offers</p>
                  <p className="mt-2 font-display text-3xl">Live</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
