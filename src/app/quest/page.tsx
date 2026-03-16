
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Trophy, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizInterface, Question } from '@/components/quiz/QuizInterface';
import { generateMockExamQuestions } from '@/ai/flows/generate-mock-exam-questions';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';

export default function LearningQuest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_AREAS[0]);

  const fetchQuestions = async (subject: string) => {
    setIsLoading(true);
    setIsFinished(false);
    try {
      const result = await generateMockExamQuestions({
        subjectArea: subject,
        numberOfQuestions: 5
      });
      // @ts-ignore - map fields from Genkit output to our component type
      setQuestions(result.questions);
    } catch (error) {
      console.error("Failed to fetch quest questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedSubject);
  }, [selectedSubject]);

  const handleFinish = (finalScore: number) => {
    setScore(finalScore);
    setIsFinished(true);
  };

  if (isFinished) {
    const totalXp = score * XP_PER_QUESTION;
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <Trophy className="w-24 h-24 text-amber-500 mx-auto relative drop-shadow-xl" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-bold font-headline">Quest Completed!</h2>
          <p className="text-muted-foreground text-lg">You've strengthened your retention in {selectedSubject}.</p>
        </div>

        <Card className="border-none shadow-xl bg-white">
          <CardContent className="p-8 grid grid-cols-2 gap-8 divide-x">
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
              <h3 className="text-4xl font-bold font-headline text-primary">{Math.round((score / questions.length) * 100)}%</h3>
              <p className="text-xs font-medium text-muted-foreground">{score} / {questions.length} Correct</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gained</p>
              <h3 className="text-4xl font-bold font-headline text-accent">+{totalXp} XP</h3>
              <p className="text-xs font-medium text-muted-foreground">Study Streak: 12 Days</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => fetchQuestions(selectedSubject)} className="bg-primary hover:bg-primary/90">
            <RefreshCw className="mr-2 w-5 h-5" />
            Restart Quest
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent fill-accent" />
            <span className="font-bold font-headline text-lg">Learning Quest</span>
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </nav>

      <main className="container mx-auto max-w-5xl py-8">
        {!isLoading && !isFinished && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {SUBJECT_AREAS.map((subject) => (
              <Button 
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className="rounded-full px-4 text-xs font-bold uppercase tracking-wider h-8"
              >
                {subject}
              </Button>
            ))}
          </div>
        )}

        <QuizInterface 
          questions={questions} 
          onFinish={handleFinish} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
}
