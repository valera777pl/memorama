import { Difficulty, DifficultyConfig } from './types';

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    pairs: 6,
    gridCols: 3,
    timeLimit: undefined,
  },
  medium: {
    label: 'Medium',
    pairs: 8,
    gridCols: 4,
    timeLimit: 120,
  },
  hard: {
    label: 'Hard',
    pairs: 12,
    gridCols: 4,
    timeLimit: 90,
  },
};

export const FLIP_DELAY = 1000; // ms before unmatched cards flip back
export const MATCH_ANIMATION_DELAY = 300; // ms for match animation

export const APP_NAME = 'Memorama';
export const APP_DESCRIPTION = 'A fun memory card matching game on Base';
export const APP_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
