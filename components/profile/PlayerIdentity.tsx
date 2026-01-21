'use client';

import { useMiniAppContext } from '@/hooks';
import { Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

export function PlayerIdentity() {
  const { user, isInFrame, isLoaded } = useMiniAppContext();

  if (!isLoaded) {
    return null;
  }

  if (!isInFrame || !user.fid) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 py-3 mb-4">
      <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
        {user.pfpUrl ? (
          <img
            src={user.pfpUrl}
            alt={user.displayName || user.username || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {(user.displayName || user.username || '?')[0].toUpperCase()}
          </div>
        )}
        <span className="font-medium text-gray-900">
          {user.displayName || user.username || `FID: ${user.fid}`}
        </span>
      </div>
    </div>
  );
}
