import React, { useMemo, useState } from 'react';
import { users } from '../data/users';
import { hotels } from '../data/hotels';
import { getUserProfile } from '../data/userProfiles';
import { getHotelGeo } from '../data/hotelGeo';
import { rankUsersForOffer } from '../services/ranker';
import appConfig from '../config/appConfig';
import AdminLayout from '../admin/components/AdminLayout';

// ═══════════════════════════════════════════════════════════════════════════
// AI Match Demo Page  —  /ai-match
//
// Standalone codefest demo: judges can pick "if user X cancels hotel Y, who
// does RevPar's matching engine notify?" The page exposes the ranking
// breakdown live, the underlying mocked user data, and the methodology.
//
// All data is mocked in /src/data/userProfiles.js + /src/data/hotelGeo.js.
// In production this would come from real search-log + profile tables.
// ═══════════════════════════════════════════════════════════════════════════

// ─── small UI helpers ──────────────────────────────────────────────────────

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-[#EAE7E0] shadow-sm ${className}`}
  >
    {children}
  </div>
);

const SectionHeader = ({ kicker, title, subtitle }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-1.5 h-5 bg-gold rounded-full" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#7A7672]">
        {kicker}
      </span>
    </div>
    <h2 className="font-display text-2xl font-bold text-dark leading-tight">{title}</h2>
    {subtitle ? <p className="text-sm text-[#7A7672] mt-1">{subtitle}</p> : null}
  </div>
);

const ScoreBar = ({ value, label, weight }) => {
  const pct = Math.round((value || 0) * 100);
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-16 shrink-0 text-dark/60 uppercase tracking-wider">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-dark/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gold"
          style={{ width: pct + '%' }}
        />
      </div>
      <span className="w-7 text-right tabular-nums text-dark/70">{pct}</span>
      {weight != null ? (
        <span className="w-9 text-right text-[9px] text-dark/40">×{weight.toFixed(2)}</span>
      ) : null}
    </div>
  );
};

const Pill = ({ children, variant = 'neutral' }) => {
  const styles = {
    gold:    'bg-gold/15 text-[#8a6a14] border-gold/40',
    neutral: 'bg-dark/5 text-dark/70 border-dark/10',
    muted:   'bg-dark/5 text-dark/50 border-dark/10',
  };
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

// ─── candidate row ─────────────────────────────────────────────────────────

const CandidateRow = ({ rank, entry, notified }) => {
  const user = users.find((u) => u.id === entry.userId) || { name: 'Unknown' };
  const b = entry.breakdown || {};
  const initials = String(user.name || '')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card className={notified ? 'border-gold/50' : 'opacity-80'}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-dark/40 w-6">
            #{rank}
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold ${
              notified ? 'bg-gold text-dark' : 'bg-dark/10 text-dark/60'
            }`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-dark truncate">{user.name}</p>
              {notified ? (
                <Pill variant="gold">notified</Pill>
              ) : (
                <Pill variant="muted">skipped</Pill>
              )}
            </div>
            <p className="text-xs text-[#7A7672]">{user.tier} · {user.loyaltyPoints?.toLocaleString()} pts</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-display text-2xl font-bold text-dark tabular-nums leading-none">
              {Math.round((entry.score || 0) * 100)}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-dark/45 mt-1">score</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <ScoreBar label="Recency"  value={b.recency  && b.recency.value}  weight={b.recency  && b.recency.weight}  />
          <ScoreBar label="Geo"      value={b.geo      && b.geo.value}      weight={b.geo      && b.geo.weight}      />
          <ScoreBar label="Prefs"    value={b.pref     && b.pref.value}     weight={b.pref     && b.pref.weight}     />
          <ScoreBar label="Affinity" value={b.affinity && b.affinity.value} weight={b.affinity && b.affinity.weight} />
          <ScoreBar label="Time"     value={b.local    && b.local.value}    weight={b.local    && b.local.weight}    />
        </div>

        {/* Tiny rationale row */}
        <div className="mt-3 pt-2 border-t border-dark/5 flex flex-wrap gap-1.5 text-[10px] text-dark/55">
          {b.geo && b.geo.parts && b.geo.parts.km != null ? (
            <Pill variant="neutral">{b.geo.parts.km.toLocaleString()} km from home</Pill>
          ) : null}
          {b.affinity && b.affinity.parts && b.affinity.parts.matches > 0 ? (
            <Pill variant="neutral">{b.affinity.parts.matches} searches of this hotel</Pill>
          ) : null}
          {b.pref && b.pref.parts && b.pref.parts.city ? (
            <Pill variant="neutral">city in preferred list</Pill>
          ) : null}
          {b.local && b.local.parts && b.local.parts.hour != null ? (
            <Pill variant="neutral">{b.local.parts.hour}:00 local at property</Pill>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

// ─── user profile card ─────────────────────────────────────────────────────

const ProfileCard = ({ user }) => {
  const profile = getUserProfile(user.id);
  if (!profile) return null;
  const recentSearches = profile.searches.slice(0, 4);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-display text-base font-semibold text-dark leading-tight">{user.name}</p>
          <p className="text-[11px] text-[#7A7672]">
            {user.tier} · {profile.homeCity}
          </p>
        </div>
        <Pill variant="neutral">id #{user.id}</Pill>
      </div>

      <div className="space-y-2 text-[11px]">
        <div>
          <p className="text-dark/55 uppercase tracking-wider text-[10px] mb-1">Preferred cities</p>
          <div className="flex flex-wrap gap-1">
            {profile.preferences.preferredCities.map((c) => (
              <Pill key={c} variant="neutral">{c}</Pill>
            ))}
          </div>
        </div>

        <div>
          <p className="text-dark/55 uppercase tracking-wider text-[10px] mb-1">Price band</p>
          <p className="text-dark/80 font-medium">
            ${profile.preferences.priceMin}–${profile.preferences.priceMax} / night
          </p>
        </div>

        <div>
          <p className="text-dark/55 uppercase tracking-wider text-[10px] mb-1">
            Recent searches ({profile.searches.length} in last 7d)
          </p>
          <ul className="space-y-1">
            {recentSearches.map((s, i) => {
              const h = hotels.find((x) => x.id === s.hotelId);
              return (
                <li key={i} className="flex items-center justify-between text-dark/75">
                  <span className="truncate">{h ? h.name : s.location}</span>
                  <span className="text-dark/45 tabular-nums">
                    {s.hoursAgo < 24
                      ? `${Math.round(s.hoursAgo)}h ago`
                      : `${Math.round(s.hoursAgo / 24)}d ago`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
};

// ─── main page ─────────────────────────────────────────────────────────────

const AIMatchContent = () => {
  // Default scenario: Michael cancels The St. Regis Aspen — Michael lives in
  // Denver so the geo signal is strong for him; for OTHERS the ranking varies.
  // Use the booking generator's offer shape so the ranker sees the same data
  // it would in production.

  const [cancellerId, setCancellerId] = useState(4); // Michael
  const [hotelId, setHotelId] = useState(6);          // St. Regis Aspen

  const hotel = useMemo(() => hotels.find((h) => h.id === Number(hotelId)) || hotels[0], [hotelId]);
  const room = (hotel && hotel.rooms && hotel.rooms[0]) || { type: 'Deluxe', price: 800 };

  // Build a synthetic offer object identical in shape to what AppContext emits
  const offer = useMemo(() => {
    const discountPercent = appConfig.lastMinuteDiscountPercent;
    return {
      id: 'OFFDEMO',
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.thumbnail,
      hotelLocation: hotel.location,
      roomType: room.type,
      originalPrice: room.price,
      discountedPrice: Math.round(room.price * (1 - discountPercent / 100)),
      discountPercent,
      amenities: hotel.amenities,
    };
  }, [hotel, room]);

  // Candidate pool = everyone except the canceller
  const candidates = users.filter((u) => u.id !== Number(cancellerId)).map((u) => u.id);

  const ranking = useMemo(() => rankUsersForOffer(candidates, offer), [candidates, offer]);
  const topK = appConfig.topK || 2;
  const winners = new Set(ranking.slice(0, topK).map((r) => String(r.userId)));

  const W = appConfig.rankerWeights;

  // ─── render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Top header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A7672]">
              AI Match Engine
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-dark">
            Who hears about which last-minute deal?
          </h1>
          <p className="text-sm text-[#7A7672] mt-1 max-w-2xl">
            When a guest cancels, we don't broadcast. We score every other user on
            recency, geo, preferences, search affinity and local time — and notify
            only the top {topK}. Less noise, higher conversion, recovered RevPar.
          </p>
        </div>
        <Card className="px-4 py-3 self-start md:self-auto">
          <p className="text-[10px] uppercase tracking-widest text-dark/55">Demo data</p>
          <p className="text-xs text-dark/80 mt-0.5 max-w-[260px]">
            User profiles, preferences and search history are mocked for the codefest.
            In production they would come from your CDP / search-log tables.
          </p>
        </Card>
      </div>

      {/* Scenario controls */}
      <Card className="p-5">
        <SectionHeader
          kicker="Scenario"
          title="Simulate a cancellation"
          subtitle="Pick who is cancelling and which hotel. The ranker reruns automatically."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-dark/60">
              Cancelling user
            </span>
            <select
              value={cancellerId}
              onChange={(e) => setCancellerId(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.tier}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-dark/60">
              Hotel (cancelled booking)
            </span>
            <select
              value={hotelId}
              onChange={(e) => setHotelId(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.location}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dark/5 pt-4">
          <Pill variant="neutral">
            Property timezone: {getHotelGeo(hotel.id)?.tz || '—'}
          </Pill>
          <Pill variant="neutral">Original ${offer.originalPrice}/night</Pill>
          <Pill variant="gold">{offer.discountPercent}% off → ${offer.discountedPrice}</Pill>
          <Pill variant="neutral">{candidates.length} candidates</Pill>
          <Pill variant="neutral">notify top {topK}</Pill>
        </div>
      </Card>

      {/* Ranking + methodology side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking */}
        <div className="lg:col-span-2 space-y-3">
          <SectionHeader
            kicker="Ranked candidates"
            title="Live ranking"
            subtitle="Top scores get the push. Skipped users see nothing — that's the point."
          />
          <div className="space-y-3">
            {ranking.map((entry, idx) => (
              <CandidateRow
                key={entry.userId}
                rank={idx + 1}
                entry={entry}
                notified={winners.has(String(entry.userId))}
              />
            ))}
          </div>
        </div>

        {/* Methodology */}
        <Card className="p-5 h-fit lg:sticky lg:top-6">
          <SectionHeader kicker="Methodology" title="How it scores" />
          <ul className="space-y-3 text-xs text-dark/75">
            <li>
              <p className="font-semibold text-dark">Recency</p>
              <p>Exponentially-decayed search activity in last 24h / 48h / 7d.</p>
            </li>
            <li>
              <p className="font-semibold text-dark">Geo</p>
              <p>Haversine distance from user's home to the property, smooth 1/(1+d/d₀).</p>
            </li>
            <li>
              <p className="font-semibold text-dark">Preferences</p>
              <p>Preferred-city overlap + price-band fit + amenities match.</p>
            </li>
            <li>
              <p className="font-semibold text-dark">Affinity</p>
              <p>Has the user searched THIS specific hotel recently?</p>
            </li>
            <li>
              <p className="font-semibold text-dark">Local time</p>
              <p>Is "now" inside a reasonable booking window at the property's timezone?</p>
            </li>
          </ul>

          <div className="mt-4 border-t border-dark/5 pt-4">
            <p className="text-[10px] uppercase tracking-wider text-dark/55 mb-2">Weights</p>
            <div className="space-y-1.5">
              <ScoreBar label="Recency"  value={W.W_recency}   />
              <ScoreBar label="Geo"      value={W.W_geo}       />
              <ScoreBar label="Prefs"    value={W.W_pref}      />
              <ScoreBar label="Affinity" value={W.W_affinity}  />
              <ScoreBar label="Time"     value={W.W_localTime} />
            </div>
            <p className="mt-3 text-[10px] text-dark/45 leading-relaxed">
              Heuristic weights for the MVP. In production, learn these from
              conversion data (gradient-boosted ranker on click/book labels).
            </p>
          </div>
        </Card>
      </div>

      {/* User profiles */}
      <div>
        <SectionHeader
          kicker="Underlying data"
          title="User profiles the model sees"
          subtitle="Each user's recent search history, home city, and explicit preferences."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((u) => (
            <ProfileCard key={u.id} user={u} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AIMatchDemo = () => (
  <AdminLayout>
    <div className="max-w-screen-xl mx-auto">
      <AIMatchContent />
    </div>
  </AdminLayout>
);

export default AIMatchDemo;
