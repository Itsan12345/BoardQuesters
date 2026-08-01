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
import { syncSubjectMastery } from '@/app/actions/study';

import { differenceInCalendarDays } from 'date-fns';

export interface CompleteQuestParams {
  score: number;
  totalQuestions: number;
  confidenceLevel: ConfidenceLevel;
  completionTime: number; // in seconds
  questMode: 'learning' | 'test' | 'boss-battle';
  subject: string;
  userAnswers?: { questionId: string; isCorrect: boolean; difficulty?: string }[];
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

    // Calculate streak dynamically before creating the new achievement
    const lastAchievement = await prisma.achievement.findFirst({
      where: { userId, type: 'quest' },
      orderBy: { timestamp: 'desc' },
    });

    let newStreak = user.streak;
    const now = new Date();
    
    if (lastAchievement) {
      const diff = differenceInCalendarDays(now, lastAchievement.timestamp);
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Calculate actual total and accuracy. In boss-battle, totalQuestions is artificially high (e.g., 999), 
    // so we use the number of questions actually answered.
    const actualTotal = params.questMode === 'boss-battle' 
      ? (params.userAnswers?.length || params.score) 
      : params.totalQuestions;
    
    const accuracy = actualTotal > 0 ? (params.score / actualTotal) * 100 : 0;

    // Calculate earned badges using the CURRENT streak
    const earnedBadges = calculateEarnedBadges({
      score: params.score,
      totalQuestions: params.totalQuestions,
      confidenceLevel: params.confidenceLevel,
      completionTime: params.completionTime,
      streak: newStreak,
    });

    // Calculate base XP based on difficulty
    let baseXp = 0;
    if (params.userAnswers && params.userAnswers.length > 0) {
      params.userAnswers.forEach((ua) => {
        if (ua.isCorrect) {
          const diff = (ua.difficulty || 'MEDIUM').toUpperCase();
          if (diff === 'HARD') baseXp += 100;
          else if (diff === 'EASY') baseXp += 25;
          else baseXp += 50;
        }
      });
    } else {
      baseXp = params.score * 50;
    }

    // Calculate total XP earned with streak multiplier
    const totalXpEarned = calculateTotalXp(baseXp, earnedBadges, params.confidenceLevel, newStreak);

    // Calculate new user stats
    const newTotalXp = user.xp + totalXpEarned;
    const newLevel = getLevelFromXp(newTotalXp);

    // Update user XP, level, and streak
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newTotalXp,
        level: newLevel,
        streak: newStreak,
      },
    });

    // Save ExamResult
    await prisma.examResult.create({
      data: {
        userId,
        score: params.score,
        total: actualTotal,
        accuracy,
        subject: params.subject,
      },
    });

    // ALWAYS create a primary achievement record for completing the quest with the total XP
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

    // Create Achievement records for each earned badge, but with 0 XP to prevent duplicating the total XP
    if (earnedBadges.length > 0) {
      await Promise.all(
        earnedBadges.map((badge) =>
          prisma.achievement.create({
            data: {
              userId,
              task: `Earned ${badge.name}: ${badge.description}`,
              type: 'quest',
              xp: 0, // Set to 0 because the totalXpEarned is already logged in the main achievement above
              badge: badge.id as string,
              confidenceLevel: params.confidenceLevel,
              accuracy,
              questMode: params.questMode,
              subject: params.subject,
            } as any,
          })
        )
      );
    }

    // Sync Subject Mastery
    await syncSubjectMastery(userId, params.subject);

    // Record individual question attempts for Spaced Repetition logic
    if (params.userAnswers && params.userAnswers.length > 0) {
      await Promise.all(
        params.userAnswers.map((ua) =>
          (prisma as any).userQuestionAttempt.upsert({
            where: {
              userId_questionId: { userId, questionId: ua.questionId },
            },
            update: {
              attempts: { increment: 1 },
              correct: { increment: ua.isCorrect ? 1 : 0 },
              lastAttempt: new Date(),
            },
            create: {
              userId,
              questionId: ua.questionId,
              attempts: 1,
              correct: ua.isCorrect ? 1 : 0,
            },
          })
        )
      );
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
