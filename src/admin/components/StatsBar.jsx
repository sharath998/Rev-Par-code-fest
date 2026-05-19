import React from 'react';

const icons = {
  total:    (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>),
  active:   (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>),
  claimed:  (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>),
  expired:  (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>),
  notified: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>),
};

const StatsBar = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { key: 'total',    label: 'Cancelled Reservations', value: stats.total,         color: 'text-[#2C2C2C]',  bg: 'bg-[#F8F6F2]', icon: icons.total    },
    { key: 'active',   label: 'Active Offers',           value: stats.active,        color: 'text-emerald-600', bg: 'bg-emerald-50', icon: icons.active   },
    { key: 'claimed',  label: 'Claimed',                 value: stats.claimed,       color: 'text-amber-600',   bg: 'bg-amber-50',   icon: icons.claimed  },
    { key: 'expired',  label: 'Expired',                 value: stats.expired,       color: 'text-gray-500',    bg: 'bg-gray-50',    icon: icons.expired  },
    { key: 'notified', label: 'Total Notified',          value: stats.totalNotified, color: 'text-indigo-600',  bg: 'bg-indigo-50',  icon: icons.notified },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(c => (
        <div key={c.key} className="bg-white rounded-2xl border border-[#EAE7E0] shadow-sm p-5 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg} ${c.color}`}>
            {c.icon}
          </div>
          <div>
            <div className={`text-2xl font-bold font-display ${c.color}`}>{c.value}</div>
            <div className="text-xs text-[#7A7672] mt-0.5 leading-snug">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
