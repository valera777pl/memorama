'use client';

import { ReactNode } from 'react';
import { base } from 'wagmi/chains';

// Import MiniKitProvider with type workaround for React 19
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MiniKitProvider = require('@coinbase/onchainkit/minikit').MiniKitProvider as any;

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          name: 'Memorama',
          logo: `${process.env.NEXT_PUBLIC_URL || ''}/icon.png`,
        },
      }}
    >
      {children}
    </MiniKitProvider>
  );
}
