import React from 'react';
import { hotelFilterOptions, statusFilterOptions } from '../../data/lastMinuteOffers';
import { useOffers } from '../context/OffersContext';

const AdminFilters = () => {
  const { filters, updateFilters, resetFilters } = useOffers();
  const hasActive = filters.hotel || filters.date || filters.status;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Hotel */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-[#7A7672] uppercase tracking-wider mb-1.5">
          Hotel
        </label>
        <select
          value={filters.hotel}
          onChange={e => updateFilters({ hotel: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-[#EAE7E0] rounded-xl bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
        >
          {hotelFilterOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-semibold text-[#7A7672] uppercase tracking-wider mb-1.5">
          Check-in Date
        </label>
        <input
          type="date"
          value={filters.date}
          onChange={e => updateFilters({ date: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-[#EAE7E0] rounded-xl bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
        />
      </div>

      {/* Status */}
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-semibold text-[#7A7672] uppercase tracking-wider mb-1.5">
          Offer Status
        </label>
        <select
          value={filters.status}
          onChange={e => updateFilters({ status: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-[#EAE7E0] rounded-xl bg-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
        >
          {statusFilterOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasActive && (
        <button
          onClick={resetFilters}
          className="px-4 py-2.5 text-sm text-[#CBA135] border border-[#CBA135] rounded-xl
                     hover:bg-amber-50 transition-colors font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default AdminFilters;
