'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveStudyPlan(userId: string, targets: Record<string, Date>) {
  try {
    const operations = Object.entries(targets).map(([subject, date]) => {
      return prisma.studyPlan.upsert({
        where: {
          userId_subject: {
            userId,
            subject,
          },
        },
        update: {
          targetDate: date,
        },
        create: {
          userId,
          subject,
          targetDate: date,
        },
      });
    });

    await Promise.all(operations);
    revalidatePath('/');
    revalidatePath('/study');
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Failed to save study plan:', error);
    return { success: false, error: 'Database synchronization failed.' };
  }
}

export async function getStudyPlans(userId: string) {
  return prisma.studyPlan.findMany({
    where: { userId },
  });
}
