'use client';

import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Difficulty } from '@/lib/types';
import { createCards } from '@/lib/game-utils';
import { DIFFICULTY_CONFIG, FLIP_DELAY } from '@/lib/constants';

const initialState: GameState = {
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  isGameOver: false,
  isGameStarted: false,
  difficulty: 'easy',
  totalPairs: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
    case 'NEW_GAME': {
      const config = DIFFICULTY_CONFIG[action.difficulty];
      const cards = createCards(action.difficulty);
      return {
        ...initialState,
        cards,
        difficulty: action.difficulty,
        totalPairs: config.pairs,
        isGameStarted: true,
      };
    }

    case 'FLIP_CARD': {
      const { cardId } = action;
      const card = state.cards.find((c) => c.id === cardId);

      // Don't flip if already flipped, matched, or 2 cards are already flipped
      if (
        !card ||
        card.isFlipped ||
        card.isMatched ||
        state.flippedCards.length >= 2
      ) {
        return state;
      }

      const newCards = state.cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      return {
        ...state,
        cards: newCards,
        flippedCards: [...state.flippedCards, cardId],
      };
    }

    case 'CHECK_MATCH': {
      if (state.flippedCards.length !== 2) return state;

      const [firstId, secondId] = state.flippedCards;
      const firstCard = state.cards.find((c) => c.id === firstId);
      const secondCard = state.cards.find((c) => c.id === secondId);

      if (!firstCard || !secondCard) return state;

      const isMatch = firstCard.emoji === secondCard.emoji;
      const newMatchedPairs = isMatch ? state.matchedPairs + 1 : state.matchedPairs;
      const totalPairs = state.totalPairs;
      const isGameOver = newMatchedPairs === totalPairs;

      const newCards = state.cards.map((c) => {
        if (c.id === firstId || c.id === secondId) {
          return isMatch ? { ...c, isMatched: true } : c;
        }
        return c;
      });

      return {
        ...state,
        cards: newCards,
        matchedPairs: newMatchedPairs,
        moves: state.moves + 1,
        isGameOver,
        flippedCards: isMatch ? [] : state.flippedCards,
      };
    }

    case 'RESET_FLIPPED': {
      const newCards = state.cards.map((c) =>
        state.flippedCards.includes(c.id) && !c.isMatched
          ? { ...c, isFlipped: false }
          : c
      );

      return {
        ...state,
        cards: newCards,
        flippedCards: [],
      };
    }

    case 'RESET_GAME': {
      return initialState;
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const flipCard = useCallback((cardId: string) => {
    dispatch({ type: 'FLIP_CARD', cardId });
  }, []);

  const checkMatch = useCallback(() => {
    dispatch({ type: 'CHECK_MATCH' });
  }, []);

  const resetFlipped = useCallback(() => {
    dispatch({ type: 'RESET_FLIPPED' });
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'START_GAME', difficulty });
  }, []);

  const newGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'NEW_GAME', difficulty });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (state.flippedCards.length >= 2) return;

      flipCard(cardId);

      // Check for match after second card is flipped
      if (state.flippedCards.length === 1) {
        setTimeout(() => {
          checkMatch();
          // Reset flipped cards after delay if no match
          setTimeout(() => {
            resetFlipped();
          }, FLIP_DELAY);
        }, 100);
      }
    },
    [state.flippedCards.length, flipCard, checkMatch, resetFlipped]
  );

  return {
    ...state,
    flipCard,
    checkMatch,
    resetFlipped,
    startGame,
    newGame,
    resetGame,
    handleCardClick,
  };
}
