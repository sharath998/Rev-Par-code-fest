import React from 'react';
import { OffersProvider, useOffers } from '../context/OffersContext';
import AdminLayout from '../components/AdminLayout';
import AdminFilters from '../components/AdminFilters';
import StatsBar from '../components/StatsBar';
import ReservationsTable from '../components/ReservationsTable';
import OfferDetailsPanel from '../components/OfferDetailsPanel';

const OffersContent = () => {
  const { selected, stats } = useOffers();

  return (
    <div className="space-y-6 max-w-screen-xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-[#CBA135] rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A7672]">
              Admin Module
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2C2C2C]">
            Last-Minute Offers
          </h1>
          <p className="text-sm text-[#7A7672] mt-1">
            Cancelled reservations within 24 hrs of check-in · Offers valid for 1 hour
          </p>
        </div>

        {/* Live pulse indicator */}
        <div className="flex items-center gap-2 bg-white border border-[#EAE7E0] rounded-xl px-4 py-2.5 shadow-sm self-start sm:self-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-[#2C2C2C]">Live</span>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsBar stats={stats} />

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-[#EAE7E0] shadow-sm p-5">
        <AdminFilters />
      </div>

      {/* ── Main layout: table + panel ── */}
      <div className={`grid gap-6 ${selected ? 'xl:grid-cols-5' : 'grid-cols-1'}`}>

        {/* Table */}
        <div className={selected ? 'xl:col-span-3' : 'col-span-1'}>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-[#2C2C2C]">
              Cancelled Reservations
            </h2>
            <span className="text-xs bg-[#F8F6F2] border border-[#EAE7E0] text-[#7A7672] px-2.5 py-1 rounded-full font-medium">
              Click row to inspect offer
            </span>
          </div>
          <ReservationsTable />
        </div>

        {/* Details panel */}
        {selected && (
          <div className="xl:col-span-2">
            <div className="bg-[#F8F6F2] rounded-2xl border border-[#EAE7E0] p-5 sticky top-6">
              <OfferDetailsPanel />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

const OffersAdmin = () => (
  <OffersProvider>
    <AdminLayout>
      <OffersContent />
    </AdminLayout>
  </OffersProvider>
);

export default OffersAdmin;
