'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime?: number;
  countDown?: boolean;
  autoStart?: boolean;
  onTimeUp?: () => void;
}

interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  stop: () => void;
}

export function useTimer({
  initialTime = 0,
  countDown = false,
  autoStart = false,
  onTimeUp,
}: UseTimerOptions = {}): UseTimerReturn {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(
    (newTime?: number) => {
      setIsRunning(false);
      setTime(newTime ?? initialTime);
      clearTimer();
    },
    [initialTime, clearTimer]
  );

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (countDown) {
            if (prevTime <= 1) {
              clearTimer();
              setIsRunning(false);
              onTimeUp?.();
              return 0;
            }
            return prevTime - 1;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isRunning, countDown, clearTimer, onTimeUp]);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    stop,
  };
}
