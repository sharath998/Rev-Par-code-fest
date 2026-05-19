import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { offersService } from '../../services/offersService';

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats]               = useState(null);
  const [selected, setSelected]         = useState(null);
  const [filters, setFilters]           = useState({ hotel: '', date: '', status: '' });
  const [loading, setLoading]           = useState(true);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    const res = await offersService.getAll(filters);
    if (res.success) setReservations(res.data);
    setLoading(false);
  }, [filters]);

  const fetchStats = useCallback(async () => {
    const res = await offersService.getStats();
    if (res.success) setStats(res.data);
  }, []);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);
  useEffect(() => { fetchStats(); },        [fetchStats]);

  const selectReservation = (res) => setSelected(res);
  const clearSelection    = ()    => setSelected(null);
  const updateFilters     = (f)   => setFilters(prev => ({ ...prev, ...f }));
  const resetFilters      = ()    => setFilters({ hotel: '', date: '', status: '' });

  return (
    <OffersContext.Provider value={{
      reservations, stats, selected, filters, loading,
      selectReservation, clearSelection, updateFilters, resetFilters,
    }}>
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => {
  const ctx = useContext(OffersContext);
  if (!ctx) throw new Error('useOffers must be used inside OffersProvider');
  return ctx;
};
