'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export interface SubjectMetrics {
  subject: string;
  completion: number; // 0-100: percentage of lessons completed
  mastery: number; // 0-100: based on actual quest performance
  masteryStatus: 'Not Started' | 'In Training' | 'Proficient' | 'Mastered';
}

export async function getSubjectMetrics(): Promise<SubjectMetrics[]> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return [];
    }

    const subjects = [
      'Clinical Chemistry',
      'Hematology & Coagulation',
      'Clinical Microbiology',
      'Immunohematology',
      'Clinical Microscopy',
      'Histopathology & MT Laws',
    ];

    const metrics = await Promise.all(
      subjects.map(async (subject) => {
        // Get total lessons for this subject from the curriculum
        const totalLessonsMap: Record<string, number> = {
          'Clinical Chemistry': 3,
          'Hematology & Coagulation': 2,
          'Clinical Microbiology': 2,
          'Immunohematology': 2,
          'Clinical Microscopy': 2,
          'Histopathology & MT Laws': 2,
        };

        const totalLessons = totalLessonsMap[subject] || 0;

        // Calculate completion: percentage of completed lessons
        const completedLessons = await prisma.lessonCompletion.count({
          where: {
            userId,
            subject,
            status: 'completed',
          },
        });

        const completion = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        // Calculate mastery: average accuracy from exam results for this subject
        const examResults = await prisma.examResult.findMany({
          where: {
            userId,
            subject,
          },
          select: {
            accuracy: true,
          },
        });

        let mastery = 0;
        if (examResults.length > 0) {
          const totalAccuracy = examResults.reduce((sum, result) => sum + result.accuracy, 0);
          mastery = totalAccuracy / examResults.length;
        }

        // Determine mastery status
        let masteryStatus: 'Not Started' | 'In Training' | 'Proficient' | 'Mastered' = 'Not Started';
        if (mastery === 0) {
          masteryStatus = 'Not Started';
        } else if (mastery < 60) {
          masteryStatus = 'In Training';
        } else if (mastery < 85) {
          masteryStatus = 'Proficient';
        } else {
          masteryStatus = 'Mastered';
        }

        return {
          subject,
          completion: Math.round(completion),
          mastery: Math.round(mastery),
          masteryStatus,
        };
      })
    );

    return metrics;
  } catch (error) {
    console.error('Failed to get subject metrics:', error);
    return [];
  }
}

export async function updateLessonStatus(
  subject: string,
  lessonId: string,
  status: 'completed' | 'in-progress' | 'not-started'
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return false;
    }

    await prisma.lessonCompletion.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        status,
        subject,
      },
      create: {
        userId,
        subject,
        lessonId,
        status,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to update lesson status:', error);
    return false;
  }
}
