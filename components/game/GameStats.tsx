'use client';

import { motion } from 'framer-motion';
import { Trophy, Timer, Move, Star } from 'lucide-react';
import { formatTime, getStarRating } from '@/lib/game-utils';
import { Difficulty } from '@/lib/types';

interface GameStatsProps {
  moves: number;
  time: number;
  score: number;
  difficulty: Difficulty;
}

export function GameStats({ moves, time, score, difficulty }: GameStatsProps) {
  const starRating = getStarRating(score, difficulty);

  return (
    <div className="space-y-4">
      {/* Stars */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: star <= starRating ? 1 : 0.5,
              rotate: 0,
            }}
            transition={{
              delay: star * 0.2,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <Star
              className={`w-10 h-10 ${
                star <= starRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Score */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-1">
          <Trophy className="w-4 h-4" />
          <span>Score</span>
        </div>
        <span className="text-4xl font-bold text-blue-600">{score}</span>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Move className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Moves</div>
            <div className="font-bold text-gray-900">{moves}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Timer className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Time</div>
            <div className="font-bold text-gray-900">{formatTime(time)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
