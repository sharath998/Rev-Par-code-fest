import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    {
      to: '/admin/offers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Last-Minute Offers',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-[#2C2C2C] min-h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#CBA135] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg font-display">R</span>
          </div>
          <div>
            <div className="text-white font-display font-semibold text-lg leading-none">RevPar</div>
            <div className="text-[#CBA135] text-xs mt-0.5 font-medium tracking-wider uppercase">Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-[#CBA135] text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400
                     hover:bg-white/10 hover:text-white transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
