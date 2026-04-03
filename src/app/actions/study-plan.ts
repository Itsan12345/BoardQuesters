'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function saveStudyPlan(targets: Record<string, Date>) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return { success: false, error: 'Aspirant session not found. Please log in.' };
    }

    // Process each subject individually using the compound unique key defined in schema.prisma
    // @@unique([userId, subject])
    const operations = Object.entries(targets).map(([subject, date]) => {
      return prisma.studyPlan.upsert({
        where: {
          userId_subject: {
            userId,
            subject,
          },
        },
        update: {
          targetDate: new Date(date),
        },
        create: {
          userId,
          subject,
          targetDate: new Date(date),
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
    return { success: false, error: 'Tactical sync failed. Please ensure database connectivity.' };
  }
}

export async function getStudyPlans() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) return [];

    return await prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { targetDate: 'asc' }
    });
  } catch (error) {
    console.error('Failed to fetch study plans:', error);
    return [];
  }
}
