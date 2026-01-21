'use client';

import { motion } from 'framer-motion';
import { Difficulty } from '@/lib/types';
import { DIFFICULTY_CONFIG, APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Zap, Clock, Flame } from 'lucide-react';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficultyIcons = {
  easy: Zap,
  medium: Clock,
  hard: Flame,
};

const difficultyColors = {
  easy: 'from-green-400 to-green-600',
  medium: 'from-yellow-400 to-orange-500',
  hard: 'from-red-400 to-red-600',
};

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      {/* Logo/Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          🧠
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
        <p className="text-gray-600">Test your memory! Match all the pairs.</p>
      </motion.div>

      {/* Difficulty options */}
      <div className="w-full max-w-sm space-y-3">
        {difficulties.map((diff, index) => {
          const config = DIFFICULTY_CONFIG[diff];
          const Icon = difficultyIcons[diff];
          const colorClass = difficultyColors[diff];

          return (
            <motion.div
              key={diff}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <button
                onClick={() => onSelect(diff)}
                className={`w-full p-4 rounded-xl bg-gradient-to-r ${colorClass} text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">{config.label}</div>
                      <div className="text-white/80 text-sm">
                        {config.pairs} pairs
                        {config.timeLimit && ` • ${config.timeLimit}s limit`}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      <motion.div
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>Flip cards to find matching pairs</p>
        <p>Fewer moves = higher score!</p>
      </motion.div>
    </div>
  );
}
