'use server';
/**
 * @fileOverview This file contains a Genkit flow for generating mock exam questions for Medical Technology students.
 *
 * - generateMockExamQuestions - A function that handles the generation of mock exam questions.
 * - GenerateMockExamQuestionsInput - The input type for the generateMockExamQuestions function.
 * - GenerateMockExamQuestionsOutput - The return type for the generateMockExamQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMockExamQuestionsInputSchema = z.object({
  subjectArea: z
    .string()
    .describe(
      'The specific laboratory science area (e.g., Clinical Chemistry, Hematology, Microbiology) for which to generate mock exam questions.'
    ),
  numberOfQuestions: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(5)
    .describe('The number of mock exam questions to generate (between 1 and 10).'),
});
export type GenerateMockExamQuestionsInput = z.infer<
  typeof GenerateMockExamQuestionsInputSchema
>;

const MockQuestionSchema = z.object({
  question: z.string().describe('The situational mock exam question.'),
  options: z
    .array(z.string())
    .length(4)
    .describe('Four multiple-choice options for the question.'),
  correctAnswer: z
    .string()
    .regex(/^[A-D]$/)
    .describe('The letter (A, B, C, or D) corresponding to the correct option.'),
  explanation: z
    .string()
    .describe('A detailed explanation for the correct answer.'),
});

const GenerateMockExamQuestionsOutputSchema = z.object({
  questions: z
    .array(MockQuestionSchema)
    .describe('An array of generated mock exam questions.'),
});
export type GenerateMockExamQuestionsOutput = z.infer<
  typeof GenerateMockExamQuestionsOutputSchema
>;

export async function generateMockExamQuestions(
  input: GenerateMockExamQuestionsInput
): Promise<GenerateMockExamQuestionsOutput> {
  return generateMockExamQuestionsFlow(input);
}

const generateMockExamQuestionsPrompt = ai.definePrompt({
  name: 'generateMockExamQuestionsPrompt',
  input: {schema: GenerateMockExamQuestionsInputSchema},
  output: {schema: GenerateMockExamQuestionsOutputSchema},
  prompt: `You are an expert Medical Technology professor specializing in creating challenging, realistic, and situational mock exam questions for students preparing for their licensure examination.

Generate {{numberOfQuestions}} multiple-choice questions for the "{{subjectArea}}" laboratory science area. Each question must be a realistic scenario relevant to medical technology, and you must provide exactly four options (labeled A, B, C, D), the correct answer (as a letter A, B, C, or D), and a detailed explanation for why that answer is correct and why other options are incorrect.

Ensure the questions are suitable for 4th-Year Medical Technology students and cover critical concepts within the specified subject area.`,
});

const generateMockExamQuestionsFlow = ai.defineFlow(
  {
    name: 'generateMockExamQuestionsFlow',
    inputSchema: GenerateMockExamQuestionsInputSchema,
    outputSchema: GenerateMockExamQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await generateMockExamQuestionsPrompt(input);
    return output!;
  }
);
