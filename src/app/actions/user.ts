
'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getUserStats() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    if (!userId) return null;

    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mastery: true,
        achievements: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return null;
  }
}

export async function getLeaderboard() {
  try {
    return await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        xp: true,
        level: true
      }
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}
