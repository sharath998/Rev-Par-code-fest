import React from 'react';
import { useOffers } from '../context/OffersContext';
import { OfferStatusBadge, CountdownTimer } from './Badges';
import NotificationsList from './NotificationsList';

const fmt = (iso, opts) =>
  new Date(iso).toLocaleString('en-US', opts || {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-[#EAE7E0] last:border-0">
    <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7672]">{label}</span>
    <span className="text-sm font-medium text-[#2C2C2C]">{value}</span>
  </div>
);

const OfferDetailsPanel = () => {
  const { selected, clearSelection } = useOffers();

  if (!selected) return null;

  const { offer, hotelName, guestName, roomType, id } = selected;
  const discountAmt = selected.originalPrice - offer.discountedPrice;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2C2C2C] leading-tight">
            Offer Details
          </h2>
          <p className="text-sm text-[#7A7672] mt-0.5">{id} · {hotelName}</p>
        </div>
        <button
          onClick={clearSelection}
          className="p-2 hover:bg-[#F8F6F2] rounded-xl transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-[#7A7672]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Offer card ── */}
      <div className="bg-white rounded-2xl border border-[#EAE7E0] shadow-sm p-6 space-y-1">

        {/* Pricing hero */}
        <div className="flex items-end justify-between pb-4 mb-2 border-b border-[#EAE7E0]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7A7672] mb-1">
              Discounted Rate
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-[#CBA135]">
                ${offer.discountedPrice}
              </span>
              <span className="text-lg line-through text-[#7A7672]">
                ${selected.originalPrice}
              </span>
            </div>
            <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Save ${discountAmt} · {offer.discountPct}% off
            </span>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>

        {/* Details rows */}
        <Row label="Hotel"          value={hotelName} />
        <Row label="Guest"          value={guestName} />
        <Row label="Room Type"      value={roomType} />
        <Row label="Offer ID"       value={offer.id} />
        <Row label="Created At"     value={fmt(offer.createdAt)} />
        <Row label="Expires At"     value={fmt(offer.expiresAt)} />
        {offer.status === 'Claimed' && (
          <Row label="Claimed By" value={offer.claimedBy || '—'} />
        )}

        {/* Countdown */}
        <div className="pt-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7672]">
            Time Remaining
          </span>
          <CountdownTimer expiresAt={offer.expiresAt} status={offer.status} />
        </div>
      </div>

      {/* ── Notifications ── */}
      <NotificationsList notifications={offer.notifications} />
    </div>
  );
};

export default OfferDetailsPanel;
