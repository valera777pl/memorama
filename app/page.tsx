'use client';

import { useEffect, useState } from 'react';
import { GameBoard } from '@/components/game';
import { Spinner } from '@/components/ui';
import { useSafeAreaInsets } from '@/hooks';
import sdk from '@farcaster/miniapp-sdk';

// Prevent static generation - MiniKit requires browser environment
export const dynamic = 'force-dynamic';

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const init = async () => {
      try {
        // Signal to Farcaster that the app is ready
        await sdk.actions.ready();
      } catch (error) {
        console.error('Error initializing SDK:', error);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{
        paddingTop: `max(env(safe-area-inset-top), ${insets.top}px)`,
        paddingBottom: `max(env(safe-area-inset-bottom), ${insets.bottom}px)`,
        paddingLeft: `max(env(safe-area-inset-left), ${insets.left}px)`,
        paddingRight: `max(env(safe-area-inset-right), ${insets.right}px)`,
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-start py-4">
        <GameBoard />
      </div>
    </main>
  );
}
