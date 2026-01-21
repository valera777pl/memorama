'use client';

import { Timer, Move, Target } from 'lucide-react';
import { formatTime } from '@/lib/game-utils';
import { Difficulty } from '@/lib/types';
import { DIFFICULTY_CONFIG } from '@/lib/constants';

interface GameHeaderProps {
  moves: number;
  time: number;
  matchedPairs: number;
  totalPairs: number;
  difficulty: Difficulty;
}

export function GameHeader({
  moves,
  time,
  matchedPairs,
  totalPairs,
  difficulty,
}: GameHeaderProps) {
  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      {/* Difficulty badge */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
          {config.label} Mode
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Moves */}
        <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
            <Move className="w-3 h-3" />
            <span>Moves</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{moves}</span>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
            <Timer className="w-3 h-3" />
            <span>Time</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatTime(time)}</span>
        </div>

        {/* Pairs */}
        <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
            <Target className="w-3 h-3" />
            <span>Pairs</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            {matchedPairs}/{totalPairs}
          </span>
        </div>
      </div>
    </div>
  );
}
