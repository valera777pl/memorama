import { Card, Difficulty } from './types';
import { CARD_EMOJIS } from './cards-data';
import { DIFFICULTY_CONFIG } from './constants';

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create card pairs for the game based on difficulty
 */
export function createCards(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const numPairs = config.pairs;

  // Select random emojis for the game
  const selectedEmojis = shuffleArray(CARD_EMOJIS).slice(0, numPairs);

  // Create pairs
  const cardPairs: Card[] = [];
  selectedEmojis.forEach((emoji, index) => {
    // First card of pair
    cardPairs.push({
      id: `card-${index}-a`,
      emoji,
      isFlipped: false,
      isMatched: false,
    });
    // Second card of pair
    cardPairs.push({
      id: `card-${index}-b`,
      emoji,
      isFlipped: false,
      isMatched: false,
    });
  });

  // Shuffle and return
  return shuffleArray(cardPairs);
}

/**
 * Format seconds to MM:SS display
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate score based on moves, time, and difficulty
 */
export function calculateScore(
  moves: number,
  timeSeconds: number,
  difficulty: Difficulty,
  totalPairs: number
): number {
  const config = DIFFICULTY_CONFIG[difficulty];

  // Base score for completing the game
  const baseScore = totalPairs * 100;

  // Efficiency bonus (fewer moves = higher bonus)
  const perfectMoves = totalPairs; // Minimum possible moves
  const moveEfficiency = Math.max(0, perfectMoves / moves);
  const moveBonus = Math.floor(moveEfficiency * 500);

  // Time bonus (faster = higher bonus)
  const timeLimit = config.timeLimit || 180;
  const timeEfficiency = Math.max(0, (timeLimit - timeSeconds) / timeLimit);
  const timeBonus = Math.floor(timeEfficiency * 300);

  // Difficulty multiplier
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;

  const totalScore = Math.floor((baseScore + moveBonus + timeBonus) * difficultyMultiplier);

  return Math.max(0, totalScore);
}

/**
 * Get star rating based on score
 */
export function getStarRating(score: number, difficulty: Difficulty): number {
  const thresholds = {
    easy: { three: 800, two: 500 },
    medium: { three: 1200, two: 800 },
    hard: { three: 2000, two: 1200 },
  };

  const t = thresholds[difficulty];
  if (score >= t.three) return 3;
  if (score >= t.two) return 2;
  return 1;
}

/**
 * Generate share text for social media
 */
export function generateShareText(
  moves: number,
  timeSeconds: number,
  difficulty: Difficulty,
  score: number
): string {
  const stars = getStarRating(score, difficulty);
  const starEmojis = '⭐'.repeat(stars);
  const timeStr = formatTime(timeSeconds);

  return `I just scored ${score} points in Memorama! ${starEmojis}

🎯 ${moves} moves
⏱️ ${timeStr}
📊 ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} mode

Play now on Farcaster!`;
}
