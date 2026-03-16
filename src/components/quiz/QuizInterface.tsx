"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">
          {isMockExam ? "AI is generating adaptive mock questions..." : "Summoning AI questions for your quest..."}
        </p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="text-center p-8">No questions found. Try again!</div>;
  }

  const currentQuestion = questions[currentIndex];
  const optionLabels = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    // RPG Hook: Notify parent of result
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onFinish(score);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="border-primary text-primary font-bold">
            Question {currentIndex + 1} / {questions.length}
          </Badge>
          {isMockExam && (
            <Badge className="bg-orange-500 hover:bg-orange-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Adaptive Difficulty
            </Badge>
          )}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Quest Progress: {Math.round(((currentIndex) / questions.length) * 100)}%
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-primary/5 p-8 border-b">
          <CardTitle className="text-xl md:text-2xl font-headline leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <RadioGroup 
            className="space-y-4" 
            onValueChange={(val) => !isAnswered && setSelectedAnswer(val)}
            value={selectedAnswer || ""}
          >
            {currentQuestion.options.map((option, idx) => {
              const label = optionLabels[idx];
              const isSelected = selectedAnswer === label;
              const isCorrect = isAnswered && label === currentQuestion.correctAnswer;
              const isWrong = isAnswered && isSelected && label !== currentQuestion.correctAnswer;

              return (
                <div key={label} className="relative">
                  <Label
                    htmlFor={`option-${label}`}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer hover:bg-muted/30",
                      isSelected && !isAnswered && "border-primary bg-primary/5 ring-1 ring-primary",
                      isCorrect && "border-accent bg-accent/10 ring-1 ring-accent text-accent-foreground",
                      isWrong && "border-destructive bg-destructive/10 ring-1 ring-destructive text-destructive-foreground",
                      !isSelected && !isAnswered && "border-border"
                    )}
                  >
                    <RadioGroupItem value={label} id={`option-${label}`} className="sr-only" />
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors",
                      isSelected && !isAnswered && "bg-primary border-primary text-white",
                      isCorrect && "bg-accent border-accent text-white",
                      isWrong && "bg-destructive border-destructive text-white",
                      !isSelected && !isAnswered && "border-border text-muted-foreground"
                    )}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : label}
                    </div>
                    <span className="text-base font-medium flex-1">{option}</span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="p-8 border-t bg-muted/20 flex justify-between items-center">
          <div className="text-sm text-muted-foreground italic font-medium">
            {isAnswered && (
              <span className={selectedAnswer === currentQuestion.correctAnswer ? "text-accent" : "text-destructive"}>
                {selectedAnswer === currentQuestion.correctAnswer ? "Critical Hit!" : "The pathogen strikes back!"}
              </span>
            )}
          </div>
          {!isAnswered ? (
            <Button 
              size="lg" 
              onClick={handleSubmit} 
              disabled={!selectedAnswer}
              className="px-8 shadow-md"
            >
              Cast Answer
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={handleNext}
              className="px-8 shadow-md bg-accent hover:bg-accent/90"
            >
              {currentIndex === questions.length - 1 ? "End Battle" : "Next Turn"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {isAnswered && currentQuestion.explanation && (
        <Card className="border-none shadow-md bg-white border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h4 className="flex items-center gap-2 font-bold font-headline mb-2 text-primary">
              <Sparkles className="w-5 h-5" />
              Tutor Insight
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {currentQuestion.explanation}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
