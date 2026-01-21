export interface Card {
  id: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  label: string;
  pairs: number;
  gridCols: number;
  timeLimit?: number;
}

export interface GameState {
  cards: Card[];
  flippedCards: string[];
  matchedPairs: number;
  moves: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  difficulty: Difficulty;
  totalPairs: number;
}

export type GameAction =
  | { type: 'FLIP_CARD'; cardId: string }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_FLIPPED' }
  | { type: 'START_GAME'; difficulty: Difficulty }
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'RESET_GAME' };

export interface GameResult {
  moves: number;
  time: number;
  difficulty: Difficulty;
  score: number;
  pairs: number;
}

export interface UserContext {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  isLoaded: boolean;
}

// On-chain game state types

/**
 * Transaction to be queued for on-chain recording
 */
export interface QueuedTransaction {
  id: string;
  functionName: 'startGame' | 'recordFlip' | 'recordMatch' | 'completeGame';
  args: readonly unknown[];
  timestamp: number;
  retries: number;
}

/**
 * Transaction queue state
 */
export interface TransactionQueueState {
  queue: QueuedTransaction[];
  processing: boolean;
  lastProcessed: number | null;
  errors: string[];
}

/**
 * Sub Account state
 */
export interface SubAccountState {
  address: `0x${string}` | null;
  isCreating: boolean;
  error: string | null;
}

/**
 * On-chain game state extension
 */
export interface OnChainGameState extends GameState {
  gameId: `0x${string}` | null;
  isOnChainEnabled: boolean;
  subAccountAddress: `0x${string}` | null;
  pendingTransactions: number;
}
