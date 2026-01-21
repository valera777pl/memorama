'use client';

import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { GameStats } from './GameStats';
import { ShareResultButton } from '@/components/social/ShareResultButton';
import { Difficulty } from '@/lib/types';
import { RefreshCw, Home } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  time: number;
  score: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function GameOverModal({
  isOpen,
  onClose,
  moves,
  time,
  score,
  difficulty,
  onPlayAgain,
  onNewGame,
}: GameOverModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="text-center">
        {/* Celebration emoji */}
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          🎉
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-2xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Congratulations!
        </motion.h2>

        {/* Stats */}
        <GameStats
          moves={moves}
          time={time}
          score={score}
          difficulty={difficulty}
        />

        {/* Actions */}
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {/* Share button */}
          <ShareResultButton
            moves={moves}
            time={time}
            score={score}
            difficulty={difficulty}
          />

          {/* Play again */}
          <Button
            variant="default"
            size="lg"
            onClick={onPlayAgain}
            className="w-full"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Play Again
          </Button>

          {/* New game (different difficulty) */}
          <Button
            variant="secondary"
            size="md"
            onClick={onNewGame}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Change Difficulty
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
