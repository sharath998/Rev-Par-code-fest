import React, { useEffect, useState } from 'react';
import { getUserById } from '../../data/users';
import appConfig from '../../config/appConfig';

// ═══════════════════════════════════════════════════════════════════════════
// Match Insights — small slide-in panel shown to the canceller right after
// they cancel, explaining which other users the AI picked to notify and why.
//
// Props:
//   ranking       : [{ userId, score, breakdown }]    full ranking, sorted desc
//   notifiedIds   : userIds that actually received the push (top-K)
//   onDismiss     : () => void
// ═══════════════════════════════════════════════════════════════════════════

const ScoreBar = ({ value, weight, label }) => {
  const pct = Math.round((value || 0) * 100);
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="w-14 shrink-0 text-dark/55 uppercase tracking-wider">{label}</span>
      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-dark/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gold"
          style={{ width: pct + '%' }}
        />
      </div>
      <span className="w-7 text-right tabular-nums text-dark/60">{pct}</span>
    </div>
  );
};

const UserRow = ({ entry, notified }) => {
  const user = getUserById(entry.userId) || { name: 'User ' + entry.userId };
  const b = entry.breakdown || {};
  const initials = String(user.name || '')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={[
        'rounded-xl border px-3 py-2.5 transition',
        notified
          ? 'border-gold/40 bg-white/70 shadow-sm'
          : 'border-dark/10 bg-white/30 opacity-70',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            'flex h-8 w-8 items-center justify-center rounded-full',
            'font-display text-[11px] font-semibold',
            notified ? 'bg-gold text-dark' : 'bg-dark/15 text-dark/60',
          ].join(' ')}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[13px] font-medium text-dark">{user.name}</p>
            {notified ? (
              <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8a6a14]">
                notified
              </span>
            ) : (
              <span className="rounded-full bg-dark/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-dark/55">
                skipped
              </span>
            )}
          </div>
          <p className="text-[11px] text-dark/55">{user.tier || ''}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display text-base font-bold text-dark tabular-nums">
            {Math.round((entry.score || 0) * 100)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-dark/45">score</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-2 grid grid-cols-1 gap-1">
        <ScoreBar label="Recency"  value={b.recency  && b.recency.value}  />
        <ScoreBar label="Geo"      value={b.geo      && b.geo.value}      />
        <ScoreBar label="Prefs"    value={b.pref     && b.pref.value}     />
        <ScoreBar label="Affinity" value={b.affinity && b.affinity.value} />
        <ScoreBar label="Time"     value={b.local    && b.local.value}    />
      </div>
    </div>
  );
};

const MatchInsightsCard = ({ ranking, notifiedIds, onDismiss }) => {
  const [closing, setClosing] = useState(false);
  const notifiedSet = new Set((notifiedIds || []).map(String));

  // Auto-dismiss after 12 seconds (long enough to read for a demo)
  useEffect(() => {
    const t = setTimeout(() => setClosing(true), 12000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!closing) return undefined;
    const t = setTimeout(() => onDismiss && onDismiss(), 350);
    return () => clearTimeout(t);
  }, [closing, onDismiss]);

  if (!ranking || ranking.length === 0) return null;

  const topK = appConfig.topK || 2;

  return (
    <div
      className={[
        'fixed bottom-6 right-6 z-50',
        'w-[360px] max-w-[92vw]',
        'rounded-2xl border border-gold/40 bg-cream shadow-soft-lg',
        'overflow-hidden',
        closing ? 'animate-splash-out' : 'animate-splash-in',
      ].join(' ')}
      style={{
        backgroundImage:
          'linear-gradient(135deg, #F8F6F2 0%, #FBF7EE 55%, #F4EEDF 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gold/20 px-4 py-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-dark/55">
              AI Match Engine
            </span>
          </div>
          <p className="font-display text-[15px] font-semibold leading-tight text-dark">
            {notifiedSet.size} of {ranking.length} candidates notified
          </p>
        </div>
        <button
          onClick={() => setClosing(true)}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 rounded-full p-1 text-dark/50 transition hover:bg-dark/5 hover:text-dark"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="space-y-2 px-4 py-3 max-h-[55vh] overflow-y-auto">
        <p className="text-[11px] leading-snug text-dark/65">
          Ranked by recency · geo · preferences · search affinity · local time.
          Only top {topK} receive a push to avoid notification fatigue.
        </p>
        {ranking.map((entry, idx) => (
          <UserRow key={entry.userId} entry={entry} notified={idx < topK || notifiedSet.has(String(entry.userId))} />
        ))}
      </div>

      {/* Shimmer */}
      <span
        aria-hidden
        className="pointer-events-none block h-[2px] animate-shimmer"
        style={{
          background:
            'linear-gradient(90deg, rgba(203,161,53,0) 0%, rgba(203,161,53,0.85) 50%, rgba(203,161,53,0) 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
};

export default MatchInsightsCard;
