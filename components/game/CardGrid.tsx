'use client';

import { Card } from './Card';
import { Card as CardType, Difficulty } from '@/lib/types';
import { DIFFICULTY_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CardGridProps {
  cards: CardType[];
  difficulty: Difficulty;
  onCardClick: (cardId: string) => void;
  disabled?: boolean;
}

export function CardGrid({ cards, difficulty, onCardClick, disabled }: CardGridProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const gridCols = config.gridCols;

  const gridClassName = cn(
    'grid gap-2 sm:gap-3 w-full max-w-md mx-auto',
    {
      'grid-cols-3': gridCols === 3,
      'grid-cols-4': gridCols === 4,
    }
  );

  return (
    <div className={gridClassName}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => onCardClick(card.id)}
          disabled={disabled || card.isFlipped || card.isMatched}
        />
      ))}
    </div>
  );
}
