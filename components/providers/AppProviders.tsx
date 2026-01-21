'use client';

import { ReactNode } from 'react';
import { base, baseSepolia } from 'viem/chains';

// Import MiniKitProvider with type workaround for React 19
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MiniKitProvider = require('@coinbase/onchainkit/minikit').MiniKitProvider as any;

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const isDev = process.env.NODE_ENV === 'development';
  const chain = isDev ? baseSepolia : base;

  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
      chain={chain}
      config={{
        appearance: {
          name: 'Memorama',
          logo: `${process.env.NEXT_PUBLIC_URL || ''}/icon.png`,
        },
      }}
    >
      {children}
    </MiniKitProvider>
  );
}
