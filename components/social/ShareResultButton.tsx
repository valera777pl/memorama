'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { generateShareText } from '@/lib/game-utils';
import { APP_URL } from '@/lib/constants';
import { Difficulty } from '@/lib/types';
import { Share2, Check } from 'lucide-react';
import sdk from '@farcaster/miniapp-sdk';

interface ShareResultButtonProps {
  moves: number;
  time: number;
  score: number;
  difficulty: Difficulty;
}

export function ShareResultButton({
  moves,
  time,
  score,
  difficulty,
}: ShareResultButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    setIsSharing(true);

    try {
      const text = generateShareText(moves, time, difficulty, score);

      // Try to use Farcaster SDK to compose cast
      await sdk.actions.composeCast({
        text,
        embeds: [APP_URL],
      });

      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch (error) {
      console.error('Error sharing:', error);

      // Fallback: copy to clipboard
      try {
        const text = generateShareText(moves, time, difficulty, score);
        await navigator.clipboard.writeText(`${text}\n\n${APP_URL}`);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    } finally {
      setIsSharing(false);
    }
  }, [moves, time, score, difficulty]);

  return (
    <Button
      variant="success"
      size="lg"
      onClick={handleShare}
      isLoading={isSharing}
      className="w-full"
      disabled={shared}
    >
      {shared ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Shared!
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 mr-2" />
          Share Result
        </>
      )}
    </Button>
  );
}
