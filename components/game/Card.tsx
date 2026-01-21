'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card as CardType } from '@/lib/types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled?: boolean;
}

export function Card({ card, onClick, disabled }: CardProps) {
  const { isFlipped, isMatched, emoji } = card;

  return (
    <div
      className="relative aspect-square perspective-1000"
      onClick={!disabled ? onClick : undefined}
    >
      <motion.div
        className={cn(
          'relative w-full h-full cursor-pointer preserve-3d transition-transform duration-500',
          (disabled || isFlipped || isMatched) && 'pointer-events-none'
        )}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Card Back (Face Down) */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-xl backface-hidden',
            'bg-gradient-to-br from-blue-500 to-blue-700',
            'border-4 border-blue-400',
            'flex items-center justify-center',
            'shadow-lg hover:shadow-xl transition-shadow',
            'active:scale-95'
          )}
        >
          <div className="text-white/30 text-4xl font-bold">?</div>
        </div>

        {/* Card Front (Face Up) */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180',
            'bg-white border-4',
            isMatched ? 'border-green-400 bg-green-50' : 'border-gray-200',
            'flex items-center justify-center',
            'shadow-lg'
          )}
        >
          <motion.span
            className="text-4xl sm:text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: isFlipped || isMatched ? 1 : 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {emoji}
          </motion.span>

          {/* Match indicator */}
          {isMatched && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-green-400/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
