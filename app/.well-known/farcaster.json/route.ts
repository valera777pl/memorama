import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const config = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || '',
      payload: process.env.FARCASTER_PAYLOAD || '',
      signature: process.env.FARCASTER_SIGNATURE || '',
    },
    frame: {
      version: '1',
      name: 'Memorama',
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og-image.png`,
      buttonTitle: 'Play Now',
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#ffffff',
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return NextResponse.json(config);
}
