import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const score = searchParams.get('score') || '0';
    const moves = searchParams.get('moves') || '0';
    const time = searchParams.get('time') || '0';
    const difficulty = searchParams.get('difficulty') || 'easy';

    // Format time
    const timeNum = parseInt(time);
    const mins = Math.floor(timeNum / 60);
    const secs = timeNum % 60;
    const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '40px',
          }}
        >
          {/* Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            <span style={{ fontSize: '60px' }}>🧠</span>
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
              }}
            >
              Memorama
            </span>
          </div>

          {/* Score */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <span
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#2563eb',
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: '24px',
                color: '#6b7280',
              }}
            >
              points
            </span>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: '20px 30px',
                borderRadius: '16px',
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {moves}
              </span>
              <span style={{ fontSize: '16px', color: '#6b7280' }}>moves</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: '20px 30px',
                borderRadius: '16px',
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>
                {formattedTime}
              </span>
              <span style={{ fontSize: '16px', color: '#6b7280' }}>time</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: '20px 30px',
                borderRadius: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  textTransform: 'capitalize',
                }}
              >
                {difficulty}
              </span>
              <span style={{ fontSize: '16px', color: '#6b7280' }}>mode</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
