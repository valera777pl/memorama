'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOnChainGameState, useTimer } from '@/hooks';
import { CardGrid } from './CardGrid';
import { GameHeader } from './GameHeader';
import { GameOverModal } from './GameOverModal';
import { DifficultySelector } from './DifficultySelector';
import { CountdownTimer } from './CountdownTimer';
import { Button } from '@/components/ui/Button';
import { PlayerIdentity } from '@/components/profile/PlayerIdentity';
import { calculateScore } from '@/lib/game-utils';
import { DIFFICULTY_CONFIG } from '@/lib/constants';
import { Difficulty } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

export function GameBoard() {
  const {
    cards,
    flippedCards,
    matchedPairs,
    moves,
    isGameOver,
    isGameStarted,
    difficulty,
    totalPairs,
    handleCardClick,
    startGame,
    newGame,
    resetGame,
    // On-chain specific
    recordGameCompletion,
    isOnChainEnabled,
    pendingTransactions,
  } = useOnChainGameState();

  const config = DIFFICULTY_CONFIG[difficulty];

  const { time, isRunning, start, pause, reset: resetTimer } = useTimer({
    initialTime: 0,
    countDown: false,
    autoStart: false,
  });

  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Start timer on first card flip
  useEffect(() => {
    if (flippedCards.length === 1 && !isRunning && isGameStarted) {
      start();
    }
  }, [flippedCards.length, isRunning, isGameStarted, start]);

  // Handle game over
  useEffect(() => {
    if (isGameOver && isGameStarted) {
      pause();
      const score = calculateScore(moves, time, difficulty, totalPairs);
      setFinalScore(score);
      // Record game completion on-chain
      recordGameCompletion(moves, time, score);
      // Small delay before showing modal for better UX
      setTimeout(() => setShowGameOver(true), 500);
    }
  }, [isGameOver, isGameStarted, moves, time, difficulty, totalPairs, pause, recordGameCompletion]);

  // Handle time limit
  useEffect(() => {
    if (config.timeLimit && time >= config.timeLimit && isGameStarted && !isGameOver) {
      // Time's up - end the game
      pause();
      const score = calculateScore(moves, time, difficulty, totalPairs);
      setFinalScore(score);
      // Record game completion on-chain
      recordGameCompletion(moves, time, score);
      setShowGameOver(true);
    }
  }, [time, config.timeLimit, isGameStarted, isGameOver, moves, difficulty, totalPairs, pause, recordGameCompletion]);

  const handleDifficultySelect = useCallback(
    (diff: Difficulty) => {
      startGame(diff);
      resetTimer(0);
    },
    [startGame, resetTimer]
  );

  const handlePlayAgain = useCallback(() => {
    setShowGameOver(false);
    newGame(difficulty);
    resetTimer(0);
  }, [newGame, difficulty, resetTimer]);

  const handleNewGame = useCallback(() => {
    setShowGameOver(false);
    resetGame();
    resetTimer(0);
  }, [resetGame, resetTimer]);

  const handleRestart = useCallback(() => {
    newGame(difficulty);
    resetTimer(0);
  }, [newGame, difficulty, resetTimer]);

  // Show difficulty selector if game hasn't started
  if (!isGameStarted) {
    return (
      <div className="w-full">
        <PlayerIdentity />
        <DifficultySelector onSelect={handleDifficultySelect} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Player identity */}
      <PlayerIdentity />

      {/* Game header with stats */}
      <GameHeader
        moves={moves}
        time={time}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        difficulty={difficulty}
      />

      {/* Countdown timer for timed modes */}
      {config.timeLimit && (
        <CountdownTimer time={time} timeLimit={config.timeLimit} />
      )}

      {/* Card grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CardGrid
          cards={cards}
          difficulty={difficulty}
          onCardClick={handleCardClick}
          disabled={flippedCards.length >= 2 || isGameOver}
        />
      </motion.div>

      {/* Restart button */}
      <div className="mt-4 flex justify-center">
        <Button variant="ghost" size="sm" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      {/* On-chain transaction indicator */}
      {isOnChainEnabled && pendingTransactions > 0 && (
        <div className="text-xs text-muted-foreground text-center mt-2">
          {pendingTransactions} pending tx...
        </div>
      )}

      {/* Game over modal */}
      <GameOverModal
        isOpen={showGameOver}
        onClose={() => setShowGameOver(false)}
        moves={moves}
        time={time}
        score={finalScore}
        difficulty={difficulty}
        onPlayAgain={handlePlayAgain}
        onNewGame={handleNewGame}
      />
    </div>
  );
}
