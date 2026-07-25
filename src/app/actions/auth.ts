
'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { SUBJECT_AREAS } from '@/lib/game-logic';
import bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Level 1, 0 XP
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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

    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
    
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

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Authentication service unavailable.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('user_id', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });
}
