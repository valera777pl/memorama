'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { keccak256, encodePacked } from 'viem';
import { useGameState } from './useGameState';
import { Difficulty, OnChainGameState } from '@/lib/types';
import { DIFFICULTY_TO_UINT8, MEMORAMA_CONTRACT_ADDRESS } from '@/lib/contracts/memorama-game-log';

// Conditionally import wagmi hooks to avoid crashes when provider isn't available
let useAccount: () => { address?: `0x${string}`; isConnected: boolean };
let useSubAccountHook: () => {
  address: `0x${string}` | null;
  createSubAccount: () => Promise<`0x${string}` | null>;
  isCreating: boolean;
};
let useTransactionQueueHook: (options?: { enabled?: boolean }) => {
  enqueue: (functionName: string, args: readonly unknown[]) => void;
  queueLength: number;
  processing: boolean;
  errors: string[];
};

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const wagmi = require('wagmi');
  useAccount = wagmi.useAccount;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useSubAccountHook = require('./useSubAccount').useSubAccount;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useTransactionQueueHook = require('./useTransactionQueue').useTransactionQueue;
} catch {
  // Wagmi not available, use fallbacks
  useAccount = () => ({ address: undefined, isConnected: false });
  useSubAccountHook = () => ({
    address: null,
    createSubAccount: async () => null,
    isCreating: false,
  });
  useTransactionQueueHook = () => ({
    enqueue: () => {},
    queueLength: 0,
    processing: false,
    errors: [],
  });
}

/**
 * Hook that wraps useGameState with on-chain move recording
 *
 * Features:
 * - Generates unique gameId (keccak256 hash) on game start
 * - Records all card flips, matches, and game completion on-chain
 * - Uses Sub Accounts for automatic signing (no popups)
 * - Uses Paymaster for gas sponsorship (free for users)
 * - Falls back to regular gameplay if on-chain recording fails
 */
export function useOnChainGameState() {
  const gameState = useGameState();

  // Use wagmi hooks with fallbacks
  let walletAddress: `0x${string}` | undefined;
  let isConnected = false;
  let subAccountAddress: `0x${string}` | null = null;
  let createSubAccount: () => Promise<`0x${string}` | null> = async () => null;
  let isCreatingSubAccount = false;
  let enqueue: (functionName: string, args: readonly unknown[]) => void = () => {};
  let queueLength = 0;
  let processing = false;
  let errors: string[] = [];

  try {
    const accountResult = useAccount();
    walletAddress = accountResult.address;
    isConnected = accountResult.isConnected;

    const subAccountResult = useSubAccountHook();
    subAccountAddress = subAccountResult.address;
    createSubAccount = subAccountResult.createSubAccount;
    isCreatingSubAccount = subAccountResult.isCreating;

    const queueResult = useTransactionQueueHook({
      enabled: !!subAccountResult.address && isOnChainConfigured(),
    });
    enqueue = queueResult.enqueue;
    queueLength = queueResult.queueLength;
    processing = queueResult.processing;
    errors = queueResult.errors;
  } catch {
    // Wagmi provider not available, on-chain features disabled
  }

  const [gameId, setGameId] = useState<`0x${string}` | null>(null);
  const [isOnChainEnabled, setIsOnChainEnabled] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  // Track previous state to detect matches
  const prevMatchedPairsRef = useRef(gameState.matchedPairs);
  const prevFlippedCardsRef = useRef<string[]>([]);

  /**
   * Check if on-chain features are configured
   * Only requires contract address - gas sponsorship is automatic via MiniKit
   */
  function isOnChainConfigured(): boolean {
    const contractAddress = MEMORAMA_CONTRACT_ADDRESS;

    return (
      !!contractAddress &&
      contractAddress !== '0x0000000000000000000000000000000000000000'
    );
  }

  /**
   * Generate a unique game ID using keccak256
   */
  const generateGameId = useCallback((): `0x${string}` => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const address = walletAddress || subAccountAddress || '0x0';

    return keccak256(
      encodePacked(
        ['address', 'uint256', 'string'],
        [address as `0x${string}`, BigInt(timestamp), random]
      )
    );
  }, [walletAddress, subAccountAddress]);

  /**
   * Initialize sub account when wallet connects
   */
  useEffect(() => {
    if (isConnected && !subAccountAddress && !isCreatingSubAccount && isOnChainConfigured()) {
      createSubAccount();
    }
  }, [isConnected, subAccountAddress, isCreatingSubAccount, createSubAccount]);

  /**
   * Enable on-chain recording when sub account is ready
   */
  useEffect(() => {
    setIsOnChainEnabled(!!subAccountAddress && isOnChainConfigured());
  }, [subAccountAddress]);

  /**
   * Start a new game with on-chain recording
   */
  const startGame = useCallback(
    (difficulty: Difficulty) => {
      // Reset state
      setFlipCount(0);
      prevMatchedPairsRef.current = 0;
      prevFlippedCardsRef.current = [];

      // Generate new game ID
      const newGameId = generateGameId();
      setGameId(newGameId);

      // Start the game in local state
      gameState.startGame(difficulty);

      // Record on-chain if enabled
      if (isOnChainEnabled) {
        const difficultyUint8 = DIFFICULTY_TO_UINT8[difficulty];
        enqueue('startGame', [newGameId, difficultyUint8]);
      }
    },
    [gameState, generateGameId, isOnChainEnabled, enqueue]
  );

  /**
   * Start a new game with the same difficulty
   */
  const newGame = useCallback(
    (difficulty: Difficulty) => {
      // Reset state
      setFlipCount(0);
      prevMatchedPairsRef.current = 0;
      prevFlippedCardsRef.current = [];

      // Generate new game ID
      const newGameId = generateGameId();
      setGameId(newGameId);

      // Start the game
      gameState.newGame(difficulty);

      // Record on-chain if enabled
      if (isOnChainEnabled) {
        const difficultyUint8 = DIFFICULTY_TO_UINT8[difficulty];
        enqueue('startGame', [newGameId, difficultyUint8]);
      }
    },
    [gameState, generateGameId, isOnChainEnabled, enqueue]
  );

  /**
   * Handle card click with on-chain recording
   */
  const handleCardClick = useCallback(
    (cardId: string) => {
      // Don't record if game is over or 2 cards already flipped
      if (gameState.flippedCards.length >= 2 || gameState.isGameOver) {
        return;
      }

      // Get card index from cards array
      const cardIndex = gameState.cards.findIndex(c => c.id === cardId);
      const card = gameState.cards[cardIndex];

      // Don't flip if already flipped or matched
      if (!card || card.isFlipped || card.isMatched) {
        return;
      }

      // Increment flip count
      const newFlipCount = flipCount + 1;
      setFlipCount(newFlipCount);

      // Record the flip on-chain
      if (isOnChainEnabled && gameId) {
        enqueue('recordFlip', [gameId, cardIndex, newFlipCount]);
      }

      // Store current flipped cards before the flip
      prevFlippedCardsRef.current = [...gameState.flippedCards, cardId];

      // Execute the actual card flip
      gameState.handleCardClick(cardId);
    },
    [gameState, flipCount, isOnChainEnabled, gameId, enqueue]
  );

  /**
   * Detect matches and record them on-chain
   */
  useEffect(() => {
    // Check if a new match was made
    if (gameState.matchedPairs > prevMatchedPairsRef.current) {
      prevMatchedPairsRef.current = gameState.matchedPairs;

      // Record match on-chain
      if (isOnChainEnabled && gameId && prevFlippedCardsRef.current.length === 2) {
        const [card1Id, card2Id] = prevFlippedCardsRef.current;
        const card1Index = gameState.cards.findIndex(c => c.id === card1Id);
        const card2Index = gameState.cards.findIndex(c => c.id === card2Id);

        if (card1Index >= 0 && card2Index >= 0) {
          enqueue('recordMatch', [gameId, card1Index, card2Index]);
        }
      }
    }
  }, [gameState.matchedPairs, gameState.cards, isOnChainEnabled, gameId, enqueue]);

  /**
   * Record game completion
   */
  const recordGameCompletion = useCallback(
    (moves: number, time: number, score: number) => {
      if (isOnChainEnabled && gameId) {
        enqueue('completeGame', [gameId, moves, BigInt(time), BigInt(score)]);
      }
    },
    [isOnChainEnabled, gameId, enqueue]
  );

  /**
   * Reset the game
   */
  const resetGame = useCallback(() => {
    setGameId(null);
    setFlipCount(0);
    prevMatchedPairsRef.current = 0;
    prevFlippedCardsRef.current = [];
    gameState.resetGame();
  }, [gameState]);

  // Build the extended state
  const onChainState: OnChainGameState = {
    ...gameState,
    gameId,
    isOnChainEnabled,
    subAccountAddress,
    pendingTransactions: queueLength,
  };

  return {
    ...onChainState,
    // Override methods with on-chain versions
    startGame,
    newGame,
    handleCardClick,
    resetGame,
    // Additional on-chain specific methods
    recordGameCompletion,
    // Queue state for UI feedback
    isProcessing: processing,
    queueErrors: errors,
    // Sub account state
    isCreatingSubAccount,
  };
}
