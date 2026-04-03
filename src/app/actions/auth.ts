'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

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

    const user = await prisma.user.create({
      data: {
        email,
        password, // In a production app, always hash the password with bcrypt
        name,
        level: 24, // Starting level for the MVP as per UI designs
        xp: 12450,
      },
    });

    // Simple session simulation for MVP
    (await cookies()).set('user_id', user.id);
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create account.' };
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
    return { success: false, error: 'Failed to log in.' };
  }
}

export async function logout() {
  (await cookies()).delete('user_id');
}
