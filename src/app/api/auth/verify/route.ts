import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      // User doesn't exist, clear the cookie
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.delete('user_id');
      return response;
    }

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
