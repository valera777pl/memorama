'use client';

import { useState, useEffect } from 'react';
import { UserContext } from '@/lib/types';
import sdk from '@farcaster/miniapp-sdk';

export function useMiniAppContext() {
  const [context, setContext] = useState<UserContext>({
    isLoaded: false,
  });
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const frameContext = await sdk.context;

        if (frameContext?.user) {
          setContext({
            fid: frameContext.user.fid,
            username: frameContext.user.username,
            displayName: frameContext.user.displayName,
            pfpUrl: frameContext.user.pfpUrl,
            isLoaded: true,
          });
        } else {
          setContext({
            isLoaded: true,
          });
        }
      } catch (error) {
        console.error('Error loading Farcaster context:', error);
        setContext({
          isLoaded: true,
        });
      }
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      sdk.actions.ready();
      loadContext();
    }
  }, [isSDKLoaded]);

  return {
    user: context,
    isInFrame: !!context.fid,
    isLoaded: context.isLoaded,
  };
}
