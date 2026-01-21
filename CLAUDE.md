# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memorama is a memory card matching game built as a **Base Mini App** for Farcaster. It uses Next.js 16, React 19, OnchainKit, and the Farcaster MiniApp SDK.

## Commands

```bash
npm run dev      # Start development server (typically port 3000/3001)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Testing with Base Build

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Expose via ngrok for Farcaster testing
ngrok http 3000  # or 3001 if 3000 is in use

# Then test at: https://base.dev/preview?url=<ngrok-url>
```

## Architecture

### Core Game Logic (`lib/`)
- `types.ts` - TypeScript types for Card, GameState, Difficulty, GameResult
- `constants.ts` - Difficulty configs (easy/medium/hard), timing constants
- `game-utils.ts` - Fisher-Yates shuffle, card creation, score calculation
- `cards-data.ts` - Emoji arrays for card faces

### Custom Hooks (`hooks/`)
- `useGameState.ts` - Main game state reducer (flip, match, reset actions)
- `useTimer.ts` - Timer with start/pause/reset, supports countdown mode
- `useMiniAppContext.ts` - Farcaster user context wrapper
- `useSafeAreaInsets.ts` - Mobile safe area handling from SDK

### Components Structure (`components/`)
- `game/` - GameBoard, Card, CardGrid, DifficultySelector, GameOverModal
- `ui/` - Button, Modal, Spinner (reusable primitives)
- `social/` - ShareResultButton, AddToFavoritesButton (Farcaster integration)
- `profile/` - PlayerIdentity (user display from Farcaster context)
- `providers/` - AppProviders wrapping MiniKitProvider

### API Routes (`app/api/` and `app/.well-known/`)
- `.well-known/farcaster.json/route.ts` - Farcaster manifest (required for mini apps)
- `api/webhook/route.ts` - Handles Farcaster events (frame_added, notifications)
- `api/embed/route.tsx` - Dynamic OG image generation (Edge runtime)

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:
- `NEXT_PUBLIC_URL` - App URL (ngrok URL for dev, production URL for deploy)
- `NEXT_PUBLIC_CDP_PROJECT_ID` - From https://cdp.coinbase.com
- `FARCASTER_HEADER/PAYLOAD/SIGNATURE` - Generated via Base Build account association

## Key Integration Points

### Farcaster SDK
The app uses `@farcaster/miniapp-sdk` for:
- `sdk.actions.ready()` - Signal app is loaded
- `sdk.context` - Get user info (fid, username, pfpUrl)
- `sdk.actions.composeCast()` - Share game results
- `sdk.actions.addFrame()` - Add to favorites

### OnchainKit
Uses `MiniKitProvider` from `@coinbase/onchainkit/minikit` for Base chain integration. Note: Due to React 19 type incompatibility, it's imported via `require()` with type assertion.

## Card Flip Animation

The 3D card flip uses CSS transforms with `perspective`, `preserve-3d`, and `backface-visibility` (defined in `globals.css`), animated via Framer Motion.
