import React from 'react';
import toast from 'react-hot-toast';

/**
 * Branded last-minute-offer notification card.
 * Rendered via react-hot-toast's `toast.custom`.
 *
 * Props:
 *   t       - the toast object from react-hot-toast (for dismiss + visibility state)
 *   offer   - the offer payload  { hotelName, hotelImage, hotelLocation,
 *                                  discountPercent, originalPrice, discountedPrice,
 *                                  expiresAt, hotelId, id }
 *   onView  - optional callback fired when the user clicks "View offer"
 */
const OfferToastCard = ({ t, offer, onView }) => {
  const visible = t && t.visible;
  const handleView = () => {
    try {
      onView && onView(offer);
    } finally {
      toast.dismiss(t.id);
    }
  };
  const handleClose = () => toast.dismiss(t.id);

  return (
    <div
      role="alert"
      className={[
        // base layout
        'relative w-[360px] max-w-[92vw] overflow-hidden rounded-2xl',
        'flex items-stretch',
        // brand colors / surface
        'bg-cream text-dark border border-gold/40',
        'shadow-soft-lg',
        // animation
        visible ? 'animate-splash-in' : 'animate-splash-out',
        'pointer-events-auto',
      ].join(' ')}
      style={{
        // subtle inner sheen using the cream + gold gradient
        backgroundImage:
          'linear-gradient(135deg, #F8F6F2 0%, #FBF7EE 55%, #F4EEDF 100%)',
      }}
    >
      {/* Gold accent rail */}
      <div className="w-1.5 shrink-0 bg-gradient-to-b from-gold via-[#E2BE5C] to-gold" />

      {/* Image */}
      {offer && offer.hotelImage ? (
        <div className="relative w-[88px] shrink-0 self-stretch overflow-hidden">
          <img
            src={offer.hotelImage}
            alt={offer.hotelName || 'Offer'}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          {/* discount chip */}
          <span
            className={[
              'absolute left-1.5 top-1.5 rounded-full px-2 py-0.5',
              'text-[10px] font-semibold tracking-wide',
              'bg-gold text-dark shadow-soft animate-pulse-gold',
            ].join(' ')}
          >
            {offer.discountPercent}% OFF
          </span>
        </div>
      ) : null}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[15px] font-semibold leading-tight text-dark">
            Last-minute deal
          </p>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Dismiss notification"
            className="-mr-1 -mt-1 rounded-full p-1 text-dark/50 transition hover:bg-dark/5 hover:text-dark"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="text-[13px] leading-snug text-dark/80">
          <span className="font-medium">{offer ? offer.hotelName : ''}</span>
          {offer && offer.hotelLocation ? (
            <span className="text-dark/55"> · {offer.hotelLocation}</span>
          ) : null}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          {offer && offer.discountedPrice != null ? (
            <span className="font-display text-lg font-semibold text-gold">
              ${offer.discountedPrice}
            </span>
          ) : null}
          {offer && offer.originalPrice != null ? (
            <span className="text-xs text-dark/50 line-through">
              ${offer.originalPrice}
            </span>
          ) : null}
          <span className="ml-auto text-[11px] font-medium uppercase tracking-wider text-dark/45">
            limited
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleView}
            className={[
              'inline-flex items-center gap-1 rounded-full',
              'bg-dark px-3.5 py-1.5 text-[12px] font-semibold text-cream',
              'transition hover:bg-dark/85 active:scale-[0.98]',
            ].join(' ')}
          >
            View offer
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="text-[11px] font-medium uppercase tracking-wider text-dark/45 hover:text-dark/70"
          >
            later
          </button>
        </div>
      </div>

      {/* Shimmer line at the bottom */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] animate-shimmer"
        style={{
          background:
            'linear-gradient(90deg, rgba(203,161,53,0) 0%, rgba(203,161,53,0.85) 50%, rgba(203,161,53,0) 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
};

export default OfferToastCard;
