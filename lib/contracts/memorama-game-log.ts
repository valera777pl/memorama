import { Abi } from 'viem';

/**
 * MemoramaGameLog contract address
 * Set via NEXT_PUBLIC_MEMORAMA_CONTRACT environment variable
 */
export const MEMORAMA_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_MEMORAMA_CONTRACT as `0x${string}`) || '0x0000000000000000000000000000000000000000';

/**
 * MemoramaGameLog contract ABI
 */
export const MEMORAMA_GAME_LOG_ABI: Abi = [
  {
    type: 'event',
    name: 'GameStarted',
    inputs: [
      { name: 'gameId', type: 'bytes32', indexed: true },
      { name: 'player', type: 'address', indexed: true },
      { name: 'difficulty', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'CardFlipped',
    inputs: [
      { name: 'gameId', type: 'bytes32', indexed: true },
      { name: 'player', type: 'address', indexed: true },
      { name: 'cardIndex', type: 'uint8', indexed: false },
      { name: 'moveNumber', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'MatchFound',
    inputs: [
      { name: 'gameId', type: 'bytes32', indexed: true },
      { name: 'player', type: 'address', indexed: true },
      { name: 'card1', type: 'uint8', indexed: false },
      { name: 'card2', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'GameCompleted',
    inputs: [
      { name: 'gameId', type: 'bytes32', indexed: true },
      { name: 'player', type: 'address', indexed: true },
      { name: 'moves', type: 'uint8', indexed: false },
      { name: 'time', type: 'uint256', indexed: false },
      { name: 'score', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'gameExists',
    inputs: [{ name: '', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'startGame',
    inputs: [
      { name: 'gameId', type: 'bytes32' },
      { name: 'difficulty', type: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recordFlip',
    inputs: [
      { name: 'gameId', type: 'bytes32' },
      { name: 'cardIndex', type: 'uint8' },
      { name: 'moveNumber', type: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recordMatch',
    inputs: [
      { name: 'gameId', type: 'bytes32' },
      { name: 'card1', type: 'uint8' },
      { name: 'card2', type: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'completeGame',
    inputs: [
      { name: 'gameId', type: 'bytes32' },
      { name: 'moves', type: 'uint8' },
      { name: 'time', type: 'uint256' },
      { name: 'score', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * Contract function names for type safety
 */
export const MEMORAMA_FUNCTIONS = {
  START_GAME: 'startGame',
  RECORD_FLIP: 'recordFlip',
  RECORD_MATCH: 'recordMatch',
  COMPLETE_GAME: 'completeGame',
} as const;

/**
 * Difficulty mapping for contract (0=easy, 1=medium, 2=hard)
 */
export const DIFFICULTY_TO_UINT8 = {
  easy: 0,
  medium: 1,
  hard: 2,
} as const;
