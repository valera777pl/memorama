import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log webhook event for debugging
    console.log('Farcaster webhook event:', JSON.stringify(body, null, 2));

    // Handle different event types
    const { event } = body;

    switch (event) {
      case 'frame_added':
        // User added the mini app to favorites
        console.log('User added the app to favorites');
        break;

      case 'frame_removed':
        // User removed the mini app from favorites
        console.log('User removed the app from favorites');
        break;

      case 'notifications_enabled':
        // User enabled notifications
        console.log('Notifications enabled');
        break;

      case 'notifications_disabled':
        // User disabled notifications
        console.log('Notifications disabled');
        break;

      default:
        console.log('Unknown event type:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint is active' });
}
