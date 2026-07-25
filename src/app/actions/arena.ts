'use server';

import { prisma } from '@/lib/prisma';
import { Question as QuizQuestion } from '@/components/quiz/QuizInterface';

const difficultyOrder: Record<string, number> = {
  'EASY': 1,
  'MEDIUM': 2,
  'HARD': 3,
};

export async function getQuestQuestions(subject: string): Promise<QuizQuestion[]> {
  try {
    const category = await prisma.category.findFirst({
      where: { name: subject }
    });

    if (!category) {
      console.warn(`Category not found for subject: ${subject}`);
      return [];
    }

    const allQuestions = await prisma.question.findMany({
      where: {
        categoryId: category.id,
        status: 'APPROVED',
        isPublished: true,
      } as any,
      select: {
        id: true,
        question: true,
        choices: true,
        correctAnswer: true,
        difficulty: true,
        type: true,
      }
    });

    if (allQuestions.length === 0) {
      return [];
    }

    // Random shuffle
    const selected = allQuestions.sort(() => 0.5 - Math.random());

    // Sort selected by difficulty
    selected.sort((a, b) => {
      const diffA = difficultyOrder[String(a.difficulty || 'EASY').toUpperCase()] || 1;
      const diffB = difficultyOrder[String(b.difficulty || 'EASY').toUpperCase()] || 1;
      return diffA - diffB;
    });

    return selected.map((q: any) => {
      const options = q.choices || q.options || [];
      const correctIndex = options.indexOf(q.correctAnswer);
      
      let correctAnswerLetter = q.correctAnswer;
      // If found in options, map index to A, B, C, D...
      if (correctIndex !== -1) {
        correctAnswerLetter = String.fromCharCode(65 + correctIndex);
      } else if (["A", "B", "C", "D"].includes(q.correctAnswer)) {
        correctAnswerLetter = q.correctAnswer;
      }

      return {
        id: q.id,
        question: q.question,
        options: options,
        correctAnswer: correctAnswerLetter,
        explanation: undefined,
        difficulty: String(q.difficulty || 'EASY').toUpperCase(),
        type: q.type || 'MCQ',
      };
    });
  } catch (error) {
    console.error('Failed to get quest questions:', error);
    return [];
  }
}
