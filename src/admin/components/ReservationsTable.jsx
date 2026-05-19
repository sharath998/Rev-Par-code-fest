import React from 'react';
import { useOffers } from '../context/OffersContext';
import { OfferStatusBadge, CountdownTimer } from './Badges';

const fmt = (iso, opts) =>
  new Date(iso).toLocaleString('en-US', opts || {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

const ReservationsTable = () => {
  const { reservations, selected, selectReservation, loading } = useOffers();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE7E0] shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="h-5 bg-gray-100 rounded flex-1" />
              <div className="h-5 bg-gray-100 rounded w-32" />
              <div className="h-5 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE7E0] shadow-sm p-12 text-center">
        <div className="w-14 h-14 bg-[#F8F6F2] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#CBA135]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="font-display text-lg text-[#2C2C2C]">No reservations found</p>
        <p className="text-sm text-[#7A7672] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAE7E0] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EAE7E0] bg-[#F8F6F2]">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Hotel</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Guest</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Check-in</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Cancelled At</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Offer Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#7A7672] uppercase tracking-wider">Time Left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE7E0]">
            {reservations.map(res => {
              const isActive = selected?.id === res.id;
              return (
                <tr
                  key={res.id}
                  onClick={() => selectReservation(isActive ? null : res)}
                  className={`
                    cursor-pointer transition-colors duration-150
                    ${isActive
                      ? 'bg-amber-50 border-l-4 border-l-[#CBA135]'
                      : 'hover:bg-[#F8F6F2]'
                    }
                  `}
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-sm text-[#2C2C2C]">{res.hotelName}</div>
                    <div className="text-xs text-[#7A7672] mt-0.5">{res.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-[#2C2C2C]">{res.guestName}</div>
                    <div className="text-xs text-[#7A7672]">{res.roomType}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#2C2C2C] whitespace-nowrap">
                    {fmt(res.checkInDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#2C2C2C] whitespace-nowrap">
                    {fmt(res.cancelledAt)}
                  </td>
                  <td className="px-5 py-4">
                    <OfferStatusBadge status={res.offer.status} />
                  </td>
                  <td className="px-5 py-4">
                    <CountdownTimer expiresAt={res.offer.expiresAt} status={res.offer.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;
