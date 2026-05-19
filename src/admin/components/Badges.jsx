import React from 'react';
import useCountdown from '../hooks/useCountdown';

// ── Status badge ─────────────────────────────────────────────────────────────
export const OfferStatusBadge = ({ status }) => {
  const styles = {
    Active:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Expired: 'bg-gray-100   text-gray-500    border border-gray-200',
    Claimed: 'bg-amber-100  text-amber-700   border border-amber-200',
  };
  const dot = {
    Active:  'bg-emerald-500',
    Expired: 'bg-gray-400',
    Claimed: 'bg-amber-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.Expired}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || dot.Expired}`} />
      {status}
    </span>
  );
};

// ── Notification status badge ─────────────────────────────────────────────────
export const NotifBadge = ({ status }) => {
  const styles = {
    Sent:    'bg-indigo-50  text-indigo-600  border border-indigo-200',
    Seen:    'bg-amber-50   text-amber-600   border border-amber-200',
    Clicked: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
      {status}
    </span>
  );
};

// ── Live countdown timer ──────────────────────────────────────────────────────
export const CountdownTimer = ({ expiresAt, status }) => {
  const { hours, minutes, seconds, expired } = useCountdown(expiresAt);

  if (status === 'Expired' || expired) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">Expired</span>
      </div>
    );
  }

  if (status === 'Claimed') {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">Claimed</span>
      </div>
    );
  }

  const isUrgent = hours === 0 && minutes < 15;

  return (
    <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-600' : 'text-emerald-700'}`}>
      <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex items-center gap-1 font-mono text-sm font-semibold">
        {hours > 0 && <><span>{String(hours).padStart(2,'0')}</span><span className="opacity-60">h</span></>}
        <span>{String(minutes).padStart(2,'0')}</span><span className="opacity-60">m</span>
        <span>{String(seconds).padStart(2,'0')}</span><span className="opacity-60">s</span>
      </div>
      {isUrgent && (
        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium animate-pulse">
          Expiring soon
        </span>
      )}
    </div>
  );
};
