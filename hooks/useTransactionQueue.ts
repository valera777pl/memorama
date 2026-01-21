'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { QueuedTransaction } from '@/lib/types';
import {
  MEMORAMA_CONTRACT_ADDRESS,
  MEMORAMA_GAME_LOG_ABI,
} from '@/lib/contracts/memorama-game-log';

// Configuration
const PROCESS_INTERVAL = 1000; // Process every 1 second
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // Base delay for exponential backoff

interface UseTransactionQueueOptions {
  enabled?: boolean;
  onError?: (error: string) => void;
}

/**
 * Hook to manage a fire-and-forget transaction queue
 *
 * Features:
 * - Processes transactions one at a time
 * - Processes every 1 second
 * - Gas is automatically sponsored by MiniKit when running in Warpcast
 * - Handles retries with exponential backoff
 */
export function useTransactionQueue(options: UseTransactionQueueOptions = {}) {
  const { enabled = true, onError } = options;

  // ✅ UNCONDITIONAL hook calls at top level
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [queue, setQueue] = useState<QueuedTransaction[]>([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const processingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Add a transaction to the queue
   */
  const enqueue = useCallback(
    (
      functionName: QueuedTransaction['functionName'],
      args: readonly unknown[]
    ) => {
      if (!enabled) return;

      const tx: QueuedTransaction = {
        id: `${functionName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        functionName,
        args,
        timestamp: Date.now(),
        retries: 0,
      };

      setQueue(prev => [...prev, tx]);
    },
    [enabled]
  );

  /**
   * Process a single transaction from the queue
   */
  const processNext = useCallback(async () => {
    if (processingRef.current || queue.length === 0 || !enabled || !isConnected || !writeContractAsync) {
      return;
    }

    processingRef.current = true;
    setProcessing(true);

    // Take the first transaction
    const [tx, ...remainingQueue] = queue;

    try {
      // Submit transaction
      await writeContractAsync({
        address: MEMORAMA_CONTRACT_ADDRESS,
        abi: MEMORAMA_GAME_LOG_ABI,
        functionName: tx.functionName,
        args: tx.args as unknown[],
      });

      // Success - remove from queue
      setQueue(remainingQueue);
      setErrors([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      console.warn('Transaction failed:', errorMessage);

      // Handle retries
      const retried = { ...tx, retries: tx.retries + 1 };

      if (retried.retries >= MAX_RETRIES) {
        // Drop the transaction after max retries
        const dropError = `Dropped transaction after ${MAX_RETRIES} retries: ${tx.functionName}`;
        setErrors(prev => [...prev.slice(-4), dropError]);
        onError?.(dropError);
        setQueue(remainingQueue);
      } else {
        // Re-add to end of queue with delay
        setQueue(remainingQueue);
        setTimeout(() => {
          setQueue(prev => [...prev, retried]);
        }, RETRY_DELAY_BASE * Math.pow(2, retried.retries - 1));
      }
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }, [queue, enabled, isConnected, writeContractAsync, onError]);

  // Set up processing interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      processNext();
    }, PROCESS_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, processNext]);

  /**
   * Clear the queue (for testing/reset)
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
    setErrors([]);
  }, []);

  /**
   * Force process the queue immediately
   */
  const flush = useCallback(() => {
    processNext();
  }, [processNext]);

  return {
    enqueue,
    queueLength: queue.length,
    processing,
    errors,
    clearQueue,
    flush,
  };
}
