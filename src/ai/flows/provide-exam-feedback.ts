'use server';
/**
 * @fileOverview Provides detailed, AI-generated explanations for mock exam questions.
 *
 * - provideExamFeedback - A function that generates AI feedback for a given exam question.
 * - ProvideExamFeedbackInput - The input type for the provideExamFeedback function.
 * - ProvideExamFeedbackOutput - The return type for the provideExamFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideExamFeedbackInputSchema = z.object({
  question: z.string().describe('The mock exam question text.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  userAnswer: z
    .string()
    .describe('The answer chosen by the student (can be incorrect).'),
});
export type ProvideExamFeedbackInput = z.infer<
  typeof ProvideExamFeedbackInputSchema
>;

const ProvideExamFeedbackOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed explanation clarifying why the correct answer is right and why the user\'s chosen answer was wrong.'
    ),
});
export type ProvideExamFeedbackOutput = z.infer<
  typeof ProvideExamFeedbackOutputSchema
>;

export async function provideExamFeedback(
  input: ProvideExamFeedbackInput
): Promise<ProvideExamFeedbackOutput> {
  return provideExamFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideExamFeedbackPrompt',
  input: {schema: ProvideExamFeedbackInputSchema},
  output: {schema: ProvideExamFeedbackOutputSchema},
  prompt: `You are an expert Medical Technology instructor providing personalized feedback to a student after a mock exam.

Your task is to explain the following:
1. Why the correct answer is indeed correct.
2. Why the student's chosen answer is incorrect, specifically addressing the misconceptions it might imply.

Provide a detailed, logical explanation in clear and concise language.

Question: {{{question}}}
Correct Answer: {{{correctAnswer}}}
Student's Answer: {{{userAnswer}}}`,
});

const provideExamFeedbackFlow = ai.defineFlow(
  {
    name: 'provideExamFeedbackFlow',
    inputSchema: ProvideExamFeedbackInputSchema,
    outputSchema: ProvideExamFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
