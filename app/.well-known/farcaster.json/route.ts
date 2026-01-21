import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to Farcaster hosted manifest
  return NextResponse.redirect(
    'https://api.farcaster.xyz/miniapps/hosted-manifest/019be1f4-8c2c-653d-cdee-15f55260d3db',
    307
  );
}
