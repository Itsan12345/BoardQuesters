'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  calculateEarnedBadges,
  calculateTotalXp,
  getLevelFromXp,
  type ConfidenceLevel,
  type Badge,
  type BadgeId,
} from '@/lib/badge-system';

export interface CompleteQuestParams {
  score: number;
  totalQuestions: number;
  confidenceLevel: ConfidenceLevel;
  completionTime: number; // in seconds
  questMode: 'learning' | 'test';
  subject: string;
}

export interface CompleteQuestResponse {
  success: boolean;
  earnedBadges: Badge[];
  totalXp: number;
  newLevel: number;
  message: string;
  error?: string;
}

export async function completeQuest(params: CompleteQuestParams): Promise<CompleteQuestResponse> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return {
        success: false,
        earnedBadges: [],
        totalXp: 0,
        newLevel: 1,
        message: '',
        error: 'Not authenticated. Please log in.',
      };
    }

    // Fetch current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true },
    });

    if (!user) {
      return {
        success: false,
        earnedBadges: [],
        totalXp: 0,
        newLevel: 1,
        message: '',
        error: 'User not found.',
      };
    }

    // Calculate accuracy
    const accuracy = (params.score / params.totalQuestions) * 100;

    // Calculate earned badges
    const earnedBadges = calculateEarnedBadges({
      score: params.score,
      totalQuestions: params.totalQuestions,
      confidenceLevel: params.confidenceLevel,
      completionTime: params.completionTime,
      streak: user.streak,
    });

    // Calculate total XP earned
    const totalXpEarned = calculateTotalXp(params.score, earnedBadges, params.confidenceLevel);

    // Calculate new user stats
    const newTotalXp = user.xp + totalXpEarned;
    const newLevel = getLevelFromXp(newTotalXp);

    // Update user XP and level
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newTotalXp,
        level: newLevel,
      },
    });

    // Save ExamResult
    await prisma.examResult.create({
      data: {
        userId,
        score: params.score,
        total: params.totalQuestions,
        accuracy,
        subject: params.subject,
      },
    });

    // Create Achievement records for each earned badge
    const achievements = await Promise.all(
      earnedBadges.map((badge) =>
        prisma.achievement.create({
          data: {
            userId,
            task: `Earned ${badge.name}: ${badge.description}`,
            type: 'quest',
            xp: totalXpEarned,
            badge: badge.id as string,
            confidenceLevel: params.confidenceLevel,
            accuracy,
            questMode: params.questMode,
            subject: params.subject,
          } as any,
        })
      )
    );

    // If no badges earned, still create an achievement record
    if (earnedBadges.length === 0) {
      await prisma.achievement.create({
        data: {
          userId,
          task: `Completed quest: ${params.subject} (${Math.round(accuracy)}% accuracy)`,
          type: 'quest',
          xp: totalXpEarned,
          confidenceLevel: params.confidenceLevel,
          accuracy,
          questMode: params.questMode,
          subject: params.subject,
        } as any,
      });
    }

    // Revalidate related pages
    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/quest');

    // Determine message
    let message = '';
    if (earnedBadges.length === 0) {
      message = `Great effort! You scored ${params.score}/${params.totalQuestions} and earned ${totalXpEarned} XP.`;
    } else if (earnedBadges.length === 1) {
      message = `Excellent! You earned the ${earnedBadges[0].name} and gained ${totalXpEarned} XP!`;
    } else {
      const badgeNames = earnedBadges.map((b) => b.name).join(', ');
      message = `Amazing! You earned ${earnedBadges.length} badges (${badgeNames}) and gained ${totalXpEarned} XP!`;
    }

    return {
      success: true,
      earnedBadges,
      totalXp: totalXpEarned,
      newLevel,
      message,
    };
  } catch (error) {
    console.error('Failed to complete quest:', error);
    return {
      success: false,
      earnedBadges: [],
      totalXp: 0,
      newLevel: 1,
      message: '',
      error: 'Failed to save quest results. Please try again.',
    };
  }
}
