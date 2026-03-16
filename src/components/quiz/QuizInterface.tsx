
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

interface QuizInterfaceProps {
  questions: Question[];
  onFinish: (score: number) => void;
  onAnswer?: (isCorrect: boolean) => void;
  isLoading: boolean;
  isMockExam?: boolean;
}

export function QuizInterface({ questions, onFinish, onAnswer, isLoading, isMockExam = false }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Battle Session...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="text-center p-12 text-muted-foreground font-medium">No challenges in this region yet.</div>;
  }

  const currentQuestion = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSubmit = (letter: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(letter);
    const isCorrect = letter === currentQuestion.correctAnswer;
    setIsAnswered(true);
    
    if (isCorrect) setScore(s => s + 1);
    if (onAnswer) onAnswer(isCorrect);

    // Auto-advance after a delay for a better flow
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        onFinish(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Progress Bar Top */}
      <div className="px-6 pt-6 flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
           Challenge {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-2">
           {isMockExam && <Badge className="bg-orange-500 h-4 text-[8px] uppercase">Adaptive</Badge>}
        </div>
      </div>

      {/* Question Text */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold leading-snug font-headline text-foreground">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="px-6 pb-12 space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const letter = optionLetters[idx];
          const isSelected = selectedAnswer === letter;
          const isCorrect = isAnswered && letter === currentQuestion.correctAnswer;
          const isWrong = isAnswered && isSelected && !isCorrect;

          return (
            <button
              key={letter}
              disabled={isAnswered}
              onClick={() => handleSubmit(letter)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left shadow-sm",
                !isAnswered && "bg-white border-transparent hover:border-primary/20",
                isSelected && !isAnswered && "border-primary ring-2 ring-primary/10",
                isCorrect && "bg-green-50 border-green-500 shadow-green-100",
                isWrong && "bg-red-50 border-red-500 shadow-red-100",
                isAnswered && !isSelected && !isCorrect && "opacity-50 grayscale"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm",
                isCorrect ? "bg-green-500 text-white" : 
                isWrong ? "bg-red-500 text-white" : 
                "bg-muted text-primary"
              )}>
                {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : letter}
              </div>
              <span className={cn(
                "text-sm font-bold flex-1",
                isCorrect ? "text-green-700" : isWrong ? "text-red-700" : "text-foreground"
              )}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer Insight */}
      {isAnswered && currentQuestion.explanation && (
        <div className="mx-6 mb-8 p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/20 animate-in fade-in slide-in-from-bottom-2">
           <p className="text-[10px] font-bold text-primary uppercase mb-1 flex items-center gap-1">
             <Sparkles className="w-3 h-3" /> Tutor Insight
           </p>
           <p className="text-xs text-muted-foreground italic leading-relaxed">
             {currentQuestion.explanation}
           </p>
        </div>
      )}
    </div>
  );
}
