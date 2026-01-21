'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Heart, Check } from 'lucide-react';
import sdk from '@farcaster/miniapp-sdk';

export function AddToFavoritesButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToFavorites = useCallback(async () => {
    setIsAdding(true);

    try {
      await sdk.actions.addFrame();
      setAdded(true);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setIsAdding(false);
    }
  }, []);

  if (added) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2">
        <Check className="w-4 h-4 text-green-500" />
        Added!
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddToFavorites}
      isLoading={isAdding}
      className="gap-2"
    >
      <Heart className="w-4 h-4" />
      Add to Favorites
    </Button>
  );
}
