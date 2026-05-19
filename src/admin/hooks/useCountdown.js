import { useState, useEffect } from 'react';

/**
 * Returns { days, hours, minutes, seconds, expired }
 * Recalculates every second until the expiresAt timestamp is passed.
 */
const useCountdown = (expiresAt) => {
  const calculate = () => {
    const diff = new Date(expiresAt) - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    const totalSec = Math.floor(diff / 1000);
    return {
      hours:   Math.floor(totalSec / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate);

  useEffect(() => {
    if (timeLeft.expired) return;
    const id = setInterval(() => {
      const next = calculate();
      setTimeLeft(next);
      if (next.expired) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return timeLeft;
};

export default useCountdown;
