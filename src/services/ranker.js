// ═══════════════════════════════════════════════════════════════════════════
// User-Property Match Ranker (heuristic, MVP)
// ───────────────────────────────────────────────────────────────────────────
// Given a cancelled-room offer and the candidate users, score each user
// 0..1 on how likely they are to convert on this specific deal right now.
//
// Pure functions only — no React, no I/O. Easy to test, easy to drop a real
// model behind later (the contract stays the same).
//
// Score components (each normalized to 0..1):
//
//   recency  — searches in last 24h / 48h / 7d (weighted, exp-decayed)
//   geo      — haversine distance from user's home to the property
//   pref     — city + price-range + amenity overlap with user prefs
//   local    — is "now" inside a reasonable local-time window at the property
//   affinity — has the user searched THIS exact hotel before?
//
// Final score is a weighted blend of the above; weights are configurable in
// appConfig.rankerWeights.
// ═══════════════════════════════════════════════════════════════════════════

import { getUserProfile, TIME_WINDOWS } from '../data/userProfiles';
import { getHotelGeo } from '../data/hotelGeo';
import appConfig from '../config/appConfig';

const { HOUR } = TIME_WINDOWS;

// ─── helpers ────────────────────────────────────────────────────────────────

function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function clamp01(x) {
  if (Number.isNaN(x) || x == null) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function localHourAt(timezone, now = Date.now()) {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: false,
      timeZone: timezone,
    });
    return Number(fmt.format(new Date(now)));
  } catch (_) {
    return new Date(now).getHours();
  }
}

// ─── component scores ───────────────────────────────────────────────────────

/** Combined recency score with sub-windows. */
function recencyScore(searches, now) {
  if (!Array.isArray(searches) || searches.length === 0) {
    return { score: 0, parts: { r24: 0, r2d: 0, r7d: 0 } };
  }
  const w = appConfig.rankerWeights.recencySubWeights;
  let r24 = 0; let r2d = 0; let r7d = 0;
  for (const s of searches) {
    const ageH = (now - s.timestamp) / HOUR;
    if (ageH <= 24) r24 += Math.exp(-ageH / 24);
    if (ageH <= 48) r2d += Math.exp(-ageH / 48);
    if (ageH <= 24 * 7) r7d += Math.exp(-ageH / (24 * 7));
  }
  // Saturate each bucket so prolific searchers don't blow the scale
  const cap = (x, c = 3) => Math.min(x, c) / c;
  const r24n = cap(r24);
  const r2dn = cap(r2d);
  const r7dn = cap(r7d);
  const score = clamp01(w.r24 * r24n + w.r2d * r2dn + w.r7d * r7dn);
  return { score, parts: { r24: r24n, r2d: r2dn, r7d: r7dn } };
}

/** Geo proximity score, smooth 1/(1+d/d0). */
function geoScore(userGeo, hotelGeo) {
  if (!userGeo || !hotelGeo) return { score: 0, parts: { km: null } };
  const km = haversineKm(userGeo, hotelGeo);
  if (km == null) return { score: 0, parts: { km: null } };
  const d0 = appConfig.rankerWeights.geoHalfDistanceKm;
  const s = 1 / (1 + km / d0);
  return { score: clamp01(s), parts: { km: Math.round(km) } };
}

/** Preferences match: city overlap + price-band fit + amenity overlap. */
function preferenceScore(prefs, offer) {
  if (!prefs || !offer) return { score: 0, parts: {} };
  const parts = { city: 0, price: 0, amenities: 0 };

  // City match
  if (Array.isArray(prefs.preferredCities) && offer.hotelLocation) {
    const loc = String(offer.hotelLocation).toLowerCase();
    parts.city = prefs.preferredCities.some((c) =>
      loc.includes(String(c).toLowerCase().split(',')[0].trim())
    )
      ? 1
      : 0;
  }

  // Price-band fit (use discountedPrice if available — that's what they'd pay)
  const price = Number(offer.discountedPrice != null ? offer.discountedPrice : offer.originalPrice);
  if (!Number.isNaN(price) && prefs.priceMin != null && prefs.priceMax != null) {
    if (price >= prefs.priceMin && price <= prefs.priceMax) {
      parts.price = 1;
    } else {
      // Soft penalty: how far outside the band?
      const span = Math.max(1, prefs.priceMax - prefs.priceMin);
      const distance = price < prefs.priceMin ? prefs.priceMin - price : price - prefs.priceMax;
      parts.price = clamp01(1 - distance / span);
    }
  }

  // Amenities overlap — offer rarely carries the full hotel amenity list, so
  // this stays best-effort; if absent we just score 0.5 to avoid penalizing.
  if (Array.isArray(prefs.amenities) && Array.isArray(offer.amenities)) {
    const a = new Set(offer.amenities.map((x) => String(x).toLowerCase()));
    const overlap = prefs.amenities.filter((x) => a.has(String(x).toLowerCase())).length;
    parts.amenities = clamp01(overlap / Math.max(1, prefs.amenities.length));
  } else {
    parts.amenities = 0.5;
  }

  const w = appConfig.rankerWeights.preferenceSubWeights;
  const score = clamp01(w.city * parts.city + w.price * parts.price + w.amenities * parts.amenities);
  return { score, parts };
}

/** Local-time fit at the property's timezone. Triangle peaking 18:00 local. */
function localTimeScore(hotelGeo, now) {
  if (!hotelGeo || !hotelGeo.tz) return { score: 0.5, parts: { hour: null } };
  const h = localHourAt(hotelGeo.tz, now);
  // Window: 8:00..22:00, peak 18:00
  if (h < 8 || h > 22) return { score: 0.1, parts: { hour: h } };
  const peak = 18;
  const dist = Math.abs(h - peak);
  const score = clamp01(1 - dist / 10);
  return { score, parts: { hour: h } };
}

/** Affinity: did the user search this specific hotel recently? */
function affinityScore(searches, hotelId, now) {
  if (!Array.isArray(searches) || hotelId == null) {
    return { score: 0, parts: { matches: 0 } };
  }
  let acc = 0;
  let matches = 0;
  for (const s of searches) {
    if (String(s.hotelId) !== String(hotelId)) continue;
    matches += 1;
    const ageH = (now - s.timestamp) / HOUR;
    acc += Math.exp(-ageH / 72); // 72h half-life-ish
  }
  return { score: clamp01(Math.min(acc, 2) / 2), parts: { matches } };
}

// ─── public API ─────────────────────────────────────────────────────────────

/**
 * Score a single user for a given offer.
 *
 * @param {number|string} userId
 * @param {object} offer       — full offer payload (hotelId, hotelLocation, prices, etc.)
 * @param {number} [now]       — epoch ms; defaults to Date.now()
 * @returns {{ userId, score, breakdown }}
 */
export function scoreUser(userId, offer, now = Date.now()) {
  const profile = getUserProfile(userId, now);
  if (!profile) {
    return {
      userId,
      score: 0,
      breakdown: { reason: 'no_profile' },
    };
  }

  const hotelGeo = getHotelGeo(offer.hotelId);
  const rec = recencyScore(profile.searches, now);
  const geo = geoScore(profile.geo, hotelGeo);
  const pref = preferenceScore(profile.preferences, offer);
  const loc = localTimeScore(hotelGeo, now);
  const aff = affinityScore(profile.searches, offer.hotelId, now);

  const W = appConfig.rankerWeights;
  const score = clamp01(
    W.W_recency * rec.score +
      W.W_geo * geo.score +
      W.W_pref * pref.score +
      W.W_localTime * loc.score +
      W.W_affinity * aff.score
  );

  return {
    userId,
    score,
    breakdown: {
      recency: { weight: W.W_recency, value: rec.score, parts: rec.parts },
      geo:     { weight: W.W_geo,     value: geo.score, parts: geo.parts },
      pref:    { weight: W.W_pref,    value: pref.score, parts: pref.parts },
      local:   { weight: W.W_localTime, value: loc.score, parts: loc.parts },
      affinity:{ weight: W.W_affinity, value: aff.score, parts: aff.parts },
    },
  };
}

/**
 * Rank a list of candidate user ids for an offer. Returns sorted desc by score.
 *
 * @param {Array<number|string>} userIds
 * @param {object} offer
 * @param {number} [now]
 * @returns {Array<{ userId, score, breakdown }>}
 */
export function rankUsersForOffer(userIds, offer, now = Date.now()) {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];
  return userIds
    .map((uid) => scoreUser(uid, offer, now))
    .sort((a, b) => b.score - a.score);
}

export default rankUsersForOffer;
