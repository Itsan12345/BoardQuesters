
'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { SUBJECT_AREAS } from '@/lib/game-logic';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already in use.' };
    }

    // Create user with Level 1, 0 XP
    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, hash this
        name,
        level: 1,
        xp: 0,
        streak: 0,
      },
    });

    // Initialize Subject Mastery for all 6 areas at 0%
    await prisma.subjectMastery.createMany({
      data: SUBJECT_AREAS.map(subject => ({
        userId: user.id,
        subject,
        proficiency: 0,
        minScore: 0,
        status: "In Training"
      }))
    });

    (await cookies()).set('user_id', user.id);
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    return { success: false, error: `Database connection failed: ${errorMessage}` };
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    (await cookies()).set('user_id', user.id);
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Authentication service unavailable.' };
  }
}

export async function logout() {
  (await cookies()).delete('user_id');
}
