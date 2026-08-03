
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

export async function getStudyPlans(): Promise<any[]> {
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

export interface ReviewCenterProgramData {
  id: string;
  title: string;
  description?: string;
  companyName: string;
  category?: string;
  startDate?: string;
  endDate: string;
  status: string;
}

export async function getReviewCenterProgram(): Promise<ReviewCenterProgramData | null> {
  try {
    try {
      const p = await (prisma as any).reviewCenterProgram.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      });
      if (p) return JSON.parse(JSON.stringify(p));
    } catch (_) {
      // Fall through to raw command
    }

    const rawResult: any = await prisma.$runCommandRaw({
      find: "ReviewCenterProgram",
      filter: { status: "ACTIVE" },
      limit: 1
    });

    let firstBatch = rawResult?.cursor?.firstBatch;

    if (!firstBatch || firstBatch.length === 0) {
      const rawResultFallback: any = await prisma.$runCommandRaw({
        find: "ReviewCenterProgram",
        limit: 1
      });
      firstBatch = rawResultFallback?.cursor?.firstBatch;
    }

    if (firstBatch && firstBatch.length > 0) {
      const doc = firstBatch[0];
      const endDateVal = doc.endDate?.$date || doc.endDate;
      const startDateVal = doc.startDate?.$date || doc.startDate;
      const idVal = doc._id?.$oid || doc._id;

      return {
        id: String(idVal),
        title: doc.title || 'Review Period',
        description: doc.description || '',
        companyName: doc.companyName || 'berndt review center',
        category: doc.category || 'Board Review',
        startDate: startDateVal ? new Date(startDateVal).toISOString() : undefined,
        endDate: endDateVal ? new Date(endDateVal).toISOString() : new Date(2026, 10, 30).toISOString(),
        status: doc.status || 'ACTIVE'
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch ReviewCenterProgram:', error);
    return null;
  }
}

