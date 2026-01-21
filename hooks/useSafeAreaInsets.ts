'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function useSafeAreaInsets(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const loadInsets = async () => {
      try {
        const context = await sdk.context;
        if (context?.client?.safeAreaInsets) {
          setInsets(context.client.safeAreaInsets);
        }
      } catch (error) {
        console.error('Error loading safe area insets:', error);
      }
    };

    loadInsets();
  }, []);

  return insets;
}
