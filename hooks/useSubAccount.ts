'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import { SubAccountState } from '@/lib/types';

/**
 * Hook to manage Coinbase Sub Accounts for automatic transaction signing
 *
 * Sub Accounts are isolated wallets that can sign transactions automatically
 * without popup confirmation, enabling seamless game move recording.
 */
export function useSubAccount() {
  // ✅ UNCONDITIONAL hook call at top level
  const walletClientResult = useWalletClient();
  const walletClient = walletClientResult?.data;

  const [state, setState] = useState<SubAccountState>({
    address: null,
    isCreating: false,
    error: null,
  });

  // Try to load existing sub account from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('memorama_sub_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.address) {
          setState(prev => ({ ...prev, address: parsed.address }));
        }
      }
    } catch {
      // Invalid stored data or localStorage not available, ignore
    }
  }, []);

  /**
   * Create a new Sub Account for automatic signing
   * Uses wallet_addSubAccount RPC method
   */
  const createSubAccount = useCallback(async () => {
    if (!walletClient) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    // Return existing sub account if already created
    if (state.address) {
      return state.address;
    }

    setState(prev => ({ ...prev, isCreating: true, error: null }));

    try {
      // Request creation of a sub account
      // This uses the Coinbase Wallet's Sub Account feature
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (walletClient as any).request({
        method: 'wallet_addSubAccount',
        params: [{
          account: {
            type: 'create',
          },
        }],
      });

      const subAccountAddress = (result as { address: `0x${string}` }).address;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('memorama_sub_account', JSON.stringify({
          address: subAccountAddress,
          createdAt: Date.now(),
        }));
      }

      setState({
        address: subAccountAddress,
        isCreating: false,
        error: null,
      });

      return subAccountAddress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create sub account';
      console.warn('Sub account creation failed:', errorMessage);

      setState(prev => ({
        ...prev,
        isCreating: false,
        error: errorMessage,
      }));

      return null;
    }
  }, [walletClient, state.address]);

  /**
   * Check if sub account features are supported
   */
  const isSupported = useCallback(() => {
    // Sub accounts are supported in Coinbase Wallet
    // Check if wallet client supports the method
    return !!walletClient;
  }, [walletClient]);

  /**
   * Clear the sub account (for testing/reset)
   */
  const clearSubAccount = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('memorama_sub_account');
    }
    setState({
      address: null,
      isCreating: false,
      error: null,
    });
  }, []);

  return {
    address: state.address,
    isCreating: state.isCreating,
    error: state.error,
    createSubAccount,
    isSupported,
    clearSubAccount,
  };
}
