
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

export async function getUserProfile() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    if (!userId) return null;

    // Fetch current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    if (!user) return null;

    // Calculate global ranking
    const totalUsers = await prisma.user.count();
    const usersWithHigherXp = await prisma.user.count({
      where: { xp: { gt: user.xp } }
    });

    const userRank = usersWithHigherXp + 1;
    const rankingPercentage = Math.round(((totalUsers - usersWithHigherXp) / totalUsers) * 100);

    // Calculate class year from createdAt (year - 1)
    const classYear = new Date(user.createdAt).getFullYear() - 1;
    const classString = `MedTech Class of ${classYear}`;

    return {
      ...user,
      classString,
      userRank,
      rankingPercentage
    };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
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

export async function generateDailyMissions() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    if (!userId) return [];

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mastery: true,
        studyPlans: {
          orderBy: { targetDate: 'asc' }
        }
      }
    });

    if (!user || !user.studyPlans.length) return [];

    const today = new Date();
    const missions: any[] = [];

    // Sort plans by urgency (closest deadline first)
    const sortedPlans = user.studyPlans.sort((a, b) =>
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    );

    for (const plan of sortedPlans) {
      const daysRemaining = Math.ceil(
        (new Date(plan.targetDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Skip past deadlines
      if (daysRemaining < 0) continue;

      const subjectMastery = user.mastery.find(m => m.subject === plan.subject);
      const currentProficiency = subjectMastery?.proficiency || 0;

      // Determine mission based on urgency and proficiency
      let title = '';
      let priority = 0;

      if (daysRemaining <= 3) {
        // Urgent: final review
        title = `Final review: ${plan.subject} (Due in ${daysRemaining} days)`;
        priority = 1;
      } else if (daysRemaining <= 7) {
        // Near deadline: intensive study
        title = `Master ${plan.subject.split(' ')[0]} concepts (${daysRemaining} days left)`;
        priority = 2;
      } else if (currentProficiency < 50) {
        // Low proficiency: catch up
        title = `Strengthen ${plan.subject} foundation`;
        priority = 3;
      } else {
        // On track: consistent progress
        title = `Progress ${plan.subject} (${daysRemaining} days on schedule)`;
        priority = 4;
      }

      missions.push({
        id: `${plan.subject}-${daysRemaining}`,
        title,
        subject: plan.subject,
        daysRemaining,
        proficiency: currentProficiency,
        priority,
        xp: daysRemaining <= 3 ? 150 : daysRemaining <= 7 ? 100 : daysRemaining <= 14 ? 75 : 50,
        targetDate: plan.targetDate
      });

      // Limit to 3 most urgent missions
      if (missions.length >= 3) break;
    }

    // Add streak maintenance mission if user has active streak
    if (user.streak > 0) {
      missions.unshift({
        id: 'streak-maintenance',
        title: `Maintain ${user.streak}-day streak`,
        subject: 'Consistency',
        daysRemaining: 1,
        proficiency: 100,
        priority: 0,
        xp: 100,
        isStreakMission: true
      });
    }

    return missions.slice(0, 3); // Return top 3 missions
  } catch (error) {
    console.error('Failed to generate daily missions:', error);
    return [];
  }
}
