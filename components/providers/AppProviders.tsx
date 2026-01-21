'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Import MiniKitProvider with type workaround for React 19
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MiniKitProvider = require('@coinbase/onchainkit/minikit').MiniKitProvider as any;

interface AppProvidersProps {
  children: ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';
const chain = isDev ? baseSepolia : base;

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [
    coinbaseWallet({
      appName: 'Memorama',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true, // Enable SSR support
});

export function AppProviders({ children }: AppProvidersProps) {
  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  );
}
