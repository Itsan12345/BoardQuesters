
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

    // Use a transaction for reliability
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
    return { success: false, error: 'Tactical sync failed. Ensure you ran npx prisma db push.' };
  }
}

export async function getStudyPlans() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) return [];

    const plans = await prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { targetDate: 'asc' }
    });
    
    return plans ? JSON.parse(JSON.stringify(plans)) : [];
  } catch (error) {
    console.error('Failed to fetch study plans:', error);
    return [];
  }
}
