import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'test ok',
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: (process.env.NEXT_PUBLIC_SUPABASE_URL || '').substring(0, 20),
    },
  });
}