// ═══════════════════════════════════════════════════════════════════════════
// App Configuration
// ═══════════════════════════════════════════════════════════════════════════

export const appConfig = {
  // Cancellation fee = 1 day's room charge (configurable)
  cancellationFeeDays: 1,
  
  // Offer validity duration (1 hour = 3600 seconds)
  offerValiditySeconds: 3600,
  
  // Discount percentage for last-minute offers (configurable)
  lastMinuteDiscountPercent: 30,
  
  // Maximum active bookings per user
  maxBookingsPerUser: 1,
  
  // App colors
  colors: {
    background: '#F8F6F2',
    dark: '#2C2C2C',
    gold: '#CBA135',
  },
};

export default appConfig;
