
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Sparkles, BrainCircuit, Shield } from 'lucide-react';
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
  onAnswer?: (isCorrect: boolean, index: number, selectedLetter: string) => void;
  isLoading: boolean;
  mode: 'learning' | 'test';
}

export function QuizInterface({ questions, onFinish, onAnswer, isLoading, mode }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary/50" />
        </div>
        <div className="text-center">
          <p className="text-primary font-black uppercase tracking-widest text-sm">Synchronizing Quest Data</p>
          <p className="text-muted-foreground text-[10px] font-bold mt-1">LOADING ADMIN-SYNTHESIZED MODULES...</p>
        </div>
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
    setIsAnswered(letter !== null); // In Test mode, we still mark it as "selected"
    
    // Logic for Learning Mode vs Test Mode
    if (mode === 'learning') {
      setIsAnswered(true);
      if (isCorrect) setScore(s => s + 1);
      if (onAnswer) onAnswer(isCorrect, currentIndex, letter);

      // Auto-advance after feedback in Learning Mode
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
        } else {
          onFinish(isCorrect ? score + 1 : score);
        }
      }, 4000);
    } else {
      // Test Mode: Immediate transition, no feedback
      const finalIsCorrect = letter === currentQuestion.correctAnswer;
      const newScore = finalIsCorrect ? score + 1 : score;
      setScore(newScore);
      if (onAnswer) onAnswer(finalIsCorrect, currentIndex, letter);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        onFinish(newScore);
      }
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <div className="px-6 pt-6 flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             Quest {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-2 mt-1">
             <Badge variant="outline" className={cn("h-4 text-[8px] uppercase tracking-tighter", mode === 'learning' ? "border-primary text-primary" : "border-slate-500 text-slate-500")}>
               {mode === 'learning' ? <BrainCircuit className="w-2 h-2 mr-1" /> : <Shield className="w-2 h-2 mr-1" />}
               {mode === 'learning' ? 'Learning Mode' : 'Test Mode'}
             </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold leading-snug font-headline text-foreground">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="px-6 space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const letter = optionLetters[idx];
          const isSelected = selectedAnswer === letter;
          
          // Only show correctness in Learning Mode
          const isCorrect = mode === 'learning' && isAnswered && letter === currentQuestion.correctAnswer;
          const isWrong = mode === 'learning' && isAnswered && isSelected && !isCorrect;

          return (
            <button
              key={letter}
              disabled={isAnswered && mode === 'learning'}
              onClick={() => handleSubmit(letter)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left shadow-sm",
                !isAnswered && "bg-white border-transparent hover:border-primary/20",
                isSelected && mode === 'test' && "border-primary bg-primary/5",
                isCorrect && "bg-green-50 border-green-500 shadow-green-100",
                isWrong && "bg-red-50 border-red-500 shadow-red-100",
                mode === 'learning' && isAnswered && !isSelected && !isCorrect && "opacity-50 grayscale"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm",
                isCorrect ? "bg-green-500 text-white" : 
                isWrong ? "bg-red-500 text-white" : 
                isSelected ? "bg-primary text-white" : "bg-muted text-primary"
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

      {mode === 'learning' && isAnswered && (
        <div className="mx-6 mt-8 p-5 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-2 mb-3">
             <div className="bg-primary/10 p-1.5 rounded-lg">
               <Sparkles className="w-4 h-4 text-primary" />
             </div>
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">
               AI Tutor Logic Analysis
             </p>
           </div>
           
           {currentQuestion.explanation ? (
             <p className="text-xs text-muted-foreground italic leading-relaxed">
               {currentQuestion.explanation}
             </p>
           ) : (
             <div className="flex items-center gap-3 py-2">
               <Loader2 className="w-3 h-3 text-primary animate-spin" />
               <p className="text-[10px] font-bold text-primary animate-pulse">INTERPRETING DATA...</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
