import { useState, useRef } from 'react';

const usePreparationCountdown = (playBeep, playStartSound) => {
  const [isPreparationCountdown, setIsPreparationCountdown] = useState(false);
  const [preparationTime, setPreparationTime] = useState(5);
  const preparationIntervalRef = useRef(null);

  const startPreparationCountdown = (onComplete) => {
    setIsPreparationCountdown(true);
    setPreparationTime(5);
    
    preparationIntervalRef.current = setInterval(() => {
      setPreparationTime((prev) => {
        if (prev <= 1) {
          clearInterval(preparationIntervalRef.current);
          setIsPreparationCountdown(false);
          // Play start sound when preparation ends
          if (playStartSound) {
            playStartSound();
          }
          // Call the completion callback to start the actual workout
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        
        // Play beep for each second of preparation countdown
        if (playBeep) {
          playBeep();
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelPreparationCountdown = () => {
    if (preparationIntervalRef.current) {
      clearInterval(preparationIntervalRef.current);
    }
    setIsPreparationCountdown(false);
    setPreparationTime(5);
  };

  const resetPreparationCountdown = () => {
    cancelPreparationCountdown();
  };

  return {
    isPreparationCountdown,
    preparationTime,
    startPreparationCountdown,
    cancelPreparationCountdown,
    resetPreparationCountdown,
  };
};

export default usePreparationCountdown;