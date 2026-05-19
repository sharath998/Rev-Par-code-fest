import { useState, useEffect } from 'react';

/**
 * Live countdown hook - updates every second
 * Returns { hours, minutes, seconds, isExpired }
 */
export const useCountdown = (targetDate) => {
  const calculateTimeLeft = () => {
    if (!targetDate) return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    
    const diff = new Date(targetDate) - new Date();
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (timeLeft.isExpired) return;

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      
      if (newTime.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
