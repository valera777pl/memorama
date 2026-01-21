'use client';

import { motion } from 'framer-motion';
import { formatTime } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  time: number;
  timeLimit?: number;
}

export function CountdownTimer({ time, timeLimit }: CountdownTimerProps) {
  if (!timeLimit) return null;

  const remaining = Math.max(0, timeLimit - time);
  const percentage = (remaining / timeLimit) * 100;
  const isLow = percentage < 25;
  const isCritical = percentage < 10;

  return (
    <div className="w-full max-w-md mx-auto mb-2">
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div
        className={cn(
          'text-center text-sm mt-1 font-medium',
          isCritical ? 'text-red-500' : isLow ? 'text-yellow-600' : 'text-gray-600'
        )}
      >
        {isCritical && remaining > 0 && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ⚠️{' '}
          </motion.span>
        )}
        {formatTime(remaining)} remaining
      </div>
    </div>
  );
}
