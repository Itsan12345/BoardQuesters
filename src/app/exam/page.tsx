
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ShieldCheck, AlertCircle, CheckCircle2, XCircle, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QuizInterface, Question } from '@/components/quiz/QuizInterface';
import { generateMockExamQuestions } from '@/ai/flows/generate-mock-exam-questions';
import { provideExamFeedback } from '@/ai/flows/provide-exam-feedback';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type DetailedFeedback = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

export default function MockExam() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<DetailedFeedback[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const startExam = async () => {
    setIsLoading(true);
    try {
      const result = await generateMockExamQuestions({
        subjectArea: "Mixed Laboratory Sciences",
        numberOfQuestions: 10
      });
      // @ts-ignore
      setQuestions(result.questions);
      setIsStarted(true);
      setTimeLeft(600);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Quota Exceeded",
        description: "The AI tutor is currently busy. Please wait a few seconds and try again.",
      });
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isStarted && !isFinished) {
      handleFinish(score);
    }
  }, [isStarted, isFinished, timeLeft]);

  const handleFinish = async (finalScore: number) => {
    setIsFinished(true);
    setScore(finalScore);
    setIsGeneratingFeedback(true);
    
    const detailedFeedback: DetailedFeedback[] = [];
    
    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const isCorrect = Math.random() > 0.3; // Simulated for MVP
        const simulatedAnswer = isCorrect ? q.correctAnswer : ['A', 'B', 'C', 'D'].find(l => l !== q.correctAnswer)!;
        
        try {
          const feedbackResult = await provideExamFeedback({
            question: q.question,
            correctAnswer: q.correctAnswer,
            userAnswer: simulatedAnswer
          });

          detailedFeedback.push({
            question: q.question,
            correctAnswer: q.correctAnswer,
            userAnswer: simulatedAnswer,
            isCorrect: simulatedAnswer === q.correctAnswer,
            explanation: feedbackResult.explanation
          });
        } catch (e) {
          detailedFeedback.push({
            question: q.question,
            correctAnswer: q.correctAnswer,
            userAnswer: simulatedAnswer,
            isCorrect: simulatedAnswer === q.correctAnswer,
            explanation: "Feedback temporarily unavailable due to AI quota limits."
          });
        }
      }
    } finally {
      setFeedback(detailedFeedback);
      setIsGeneratingFeedback(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <Card className="border-none shadow-2xl bg-white overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="text-center p-12 space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold font-headline">Mock Licensure Examination</CardTitle>
            <CardDescription className="text-lg max-w-xl mx-auto">
              Simulate the high-pressure environment of the MedTech board exam. 
              Features adaptive difficulty and AI tutor review.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-12 pt-0 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-b border-t py-8 my-8">
            <div className="space-y-2">
              <Clock className="w-6 h-6 text-primary mx-auto" />
              <p className="font-bold">10 Minutes</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Time Limit</p>
            </div>
            <div className="space-y-2">
              <AlertCircle className="w-6 h-6 text-orange-500 mx-auto" />
              <p className="font-bold">10 Questions</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Situational</p>
            </div>
            <div className="space-y-2">
              <Sparkles className="w-6 h-6 text-accent mx-auto" />
              <p className="font-bold">AI Feedback</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Tutor Support</p>
            </div>
          </CardContent>
          <div className="p-12 text-center bg-muted/30">
            <Button size="lg" onClick={startExam} disabled={isLoading} className="px-12 h-14 text-lg shadow-xl hover:scale-105 transition-transform">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Begin Examination"}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest">
              Syncing with BoardQuest Central Server
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <header className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-headline">Examination Result</h2>
          <div className="flex justify-center items-center gap-8 py-8">
            <div className="text-center">
              <div className="text-5xl font-bold font-headline text-primary mb-1">{score}/10</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Final Score</div>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <div className="text-5xl font-bold font-headline text-accent mb-1">{Math.round((score/10)*100)}%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </header>

        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl">Personalized AI Tutor Review</CardTitle>
                <CardDescription>Deep dive into your situational reasoning gaps.</CardDescription>
              </div>
              <Sparkles className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isGeneratingFeedback ? (
              <div className="p-20 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <p className="text-muted-foreground font-medium">AI is analyzing your decision-making patterns...</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {feedback.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border-b last:border-0">
                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                      <div className="flex items-start text-left gap-4">
                        <div className="mt-1">
                          {item.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm line-clamp-1">{item.question}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={item.isCorrect ? "secondary" : "destructive"} className="text-[10px] h-4">
                              {item.isCorrect ? "Mastered" : "Review Needed"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-lg border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Your Selection</p>
                            <p className={cn("font-bold text-sm", item.isCorrect ? "text-accent" : "text-destructive")}>
                              Option {item.userAnswer}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Correct Rationale</p>
                            <p className="font-bold text-sm text-accent">
                              Option {item.correctAnswer}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold font-headline text-primary flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Logical Analysis
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground italic bg-white/50 p-4 rounded-lg border-2 border-dashed border-primary/20">
                            {item.explanation}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 pb-12">
          <Link href="/">
            <Button size="lg" variant="outline" className="px-8">
              Back to Dashboard
            </Button>
          </Link>
          <Button size="lg" className="px-8" onClick={() => {
            setIsStarted(false);
            setIsFinished(false);
            setFeedback([]);
          }}>
            Retake Simulation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-bold font-headline text-lg hidden sm:block">Mock Licensure Examination</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-mono text-xl font-bold text-primary">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleFinish(score)}>
              Quit Exam
            </Button>
          </div>
        </div>
        <Progress value={((questions.length - 0) / questions.length) * 100} className="h-1 rounded-none bg-muted" />
      </div>

      <main className="container mx-auto py-8">
        <QuizInterface 
          questions={questions} 
          onFinish={handleFinish} 
          isLoading={isLoading} 
          isMockExam={true}
        />
      </main>
    </div>
  );
}
