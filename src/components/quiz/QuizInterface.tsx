"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, Sparkles, BrainCircuit, Shield, Flame, Sword, ShieldPlus, Swords, ArrowRight, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Question = {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: string;
  type?: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
};

interface QuizInterfaceProps {
  questions: Question[];
  onFinish: (score: number) => void;
  onAnswer?: (isCorrect: boolean, index: number, selectedLetter: string, moveType?: 'heavy' | 'normal' | 'defend', activeQuestion?: Question) => void;
  onRequestExplanation?: (index: number) => void;
  isLoading: boolean;
  mode: 'learning' | 'test' | 'boss-battle';
}

export function QuizInterface({ questions, onFinish, onAnswer, onRequestExplanation, isLoading, mode }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);

  const [activeMove, setActiveMove] = useState<'heavy' | 'normal' | 'defend' | null>(null);
  const [turnMap, setTurnMap] = useState<number[]>([]);

  useEffect(() => {
    if (questions && turnMap.length !== questions.length) {
      setTurnMap(questions.map((_, i) => i));
    }
  }, [questions]);

  useEffect(() => {
    setIsFetchingExplanation(false);
  }, [currentIndex]);

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

  const currentQuestionIndex = turnMap[currentIndex] ?? currentIndex;
  const currentQuestion = questions[currentQuestionIndex];
  const optionLetters = Array.from({ length: currentQuestion.options.length }, (_, i) => String.fromCharCode(65 + i));

  const handleSelectMove = (move: 'heavy' | 'normal' | 'defend') => {
    setActiveMove(move);
    const targetDiff = move === 'heavy' ? 'HARD' : move === 'normal' ? 'MEDIUM' : 'EASY';
    
    const newTurnMap = [...turnMap];
    let foundIdxMapPos = newTurnMap.findIndex((qIdx, mapIdx) => mapIdx >= currentIndex && questions[qIdx]?.difficulty === targetDiff);
    
    if (foundIdxMapPos === -1) {
      foundIdxMapPos = newTurnMap.findIndex((qIdx, mapIdx) => mapIdx >= currentIndex);
    }
    
    if (foundIdxMapPos !== -1 && foundIdxMapPos !== currentIndex) {
      const temp = newTurnMap[currentIndex];
      newTurnMap[currentIndex] = newTurnMap[foundIdxMapPos];
      newTurnMap[foundIdxMapPos] = temp;
      setTurnMap(newTurnMap);
    }
  };

  const handleSubmit = (letter: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(letter);
    const isCorrect = currentQuestion.type === 'SHORT_ANSWER' 
      ? letter.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
      : letter === currentQuestion.correctAnswer;
    setIsAnswered(letter !== null); // In Test mode, we still mark it as "selected"
    
    // Logic for Learning Mode vs Test Mode vs Boss Battle
    if (mode === 'learning') {
      setIsAnswered(true);
      if (isCorrect) setScore(s => s + 1);
      if (onAnswer) onAnswer(isCorrect, currentQuestionIndex, letter, undefined, currentQuestion);
    } else if (mode === 'boss-battle') {
      setIsAnswered(true);
      if (isCorrect) setScore(s => s + 1);
      if (onAnswer) onAnswer(isCorrect, currentQuestionIndex, letter, activeMove || undefined, currentQuestion);
      
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setActiveMove(null);
        } else {
          onFinish(isCorrect ? score + 1 : score);
        }
      }, 1500);
    } else {
      // Test Mode: Immediate transition, no feedback
      const finalIsCorrect = letter === currentQuestion.correctAnswer;
      const newScore = finalIsCorrect ? score + 1 : score;
      setScore(newScore);
      if (onAnswer) onAnswer(finalIsCorrect, currentQuestionIndex, letter, undefined, currentQuestion);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        onFinish(newScore);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setActiveMove(null);
    } else {
      onFinish(score);
    }
  };

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto pb-20 no-scrollbar">
      <div className="px-6 pt-6 flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
             Quest {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-2 mt-1 flex-wrap">
             <Badge variant="outline" className={cn("h-4 text-[8px] uppercase tracking-tighter", mode === 'learning' || mode === 'boss-battle' ? "border-primary text-primary" : "border-slate-500 text-muted-foreground")}>
               {mode === 'learning' ? <BrainCircuit className="w-2 h-2 mr-1" /> : mode === 'boss-battle' ? <Swords className="w-2 h-2 mr-1" /> : <Shield className="w-2 h-2 mr-1" />}
               {mode === 'learning' ? 'Learning Mode' : mode === 'boss-battle' ? 'Boss Battle Mode' : 'Test Mode'}
             </Badge>
             {mode === 'learning' && (
               <Badge variant="default" className={cn(
                 "h-4 text-[8px] uppercase tracking-tighter",
                 currentQuestion.difficulty === 'EASY' ? "bg-green-500 hover:bg-green-600" :
                 currentQuestion.difficulty === 'MEDIUM' ? "bg-yellow-500 hover:bg-yellow-600" :
                 "bg-red-500 hover:bg-red-600"
               )}>
                 {currentQuestion.difficulty === 'EASY' ? 'Wave 1: Minion Phase' :
                  currentQuestion.difficulty === 'MEDIUM' ? 'Wave 2: Enforcer Phase' :
                  'Wave 3: Elite Phase'}
               </Badge>
             )}
          </div>
        </div>
      </div>

      {mode === 'boss-battle' && !activeMove ? (
        <div className="px-6 flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black font-headline text-foreground">Choose Your Move</h2>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select an action for the next turn</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {/* Heavy Attack Card */}
            <button
              onClick={() => handleSelectMove('heavy')}
              className="bg-background border-2 border-red-200 hover:border-red-500 hover:shadow-xl hover:shadow-red-100 transition-all p-8 rounded-3xl flex flex-col items-center text-center space-y-6 group"
            >
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-12 h-12 text-red-600" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-black text-red-700 uppercase tracking-tight text-lg">Heavy Attack</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-600 mt-2 leading-relaxed">Attempt a hard difficulty question. If correct, it deals massive damage. If wrong, the player takes a heavy counter-attack.</p>
              </div>
            </button>
            
            {/* Normal Attack Card */}
            <button
              onClick={() => handleSelectMove('normal')}
              className="bg-background border-2 border-primary/20 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all p-8 rounded-3xl flex flex-col items-center text-center space-y-6 group"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sword className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-black text-primary uppercase tracking-tight text-lg">Normal Attack</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-600 mt-2 leading-relaxed">Answer a normal-difficulty question. Deals standard damage.</p>
              </div>
            </button>
            
            {/* Defend / Heal Card */}
            <button
              onClick={() => handleSelectMove('defend')}
              className="bg-background border-2 border-green-200 hover:border-green-500 hover:shadow-xl hover:shadow-green-100 transition-all p-8 rounded-3xl flex flex-col items-center text-center space-y-6 group"
            >
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldPlus className="w-12 h-12 text-green-600" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-black text-green-700 uppercase tracking-tight text-lg">Defend / Heal</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-600 mt-2 leading-relaxed">Answer an easier question dealing no damage to the boss, but restoring the player's HP. Great for when they are close to dying.</p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 mb-8">
            <h2 className="text-xl font-bold leading-snug font-headline text-foreground">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="px-6 space-y-3">
            {currentQuestion.type === 'SHORT_ANSWER' ? (
              <div className="space-y-4">
                <Input
                  value={selectedAnswer || ''}
                  onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Type your answer here..."
                  className={cn(
                    "w-full text-lg p-6 rounded-2xl border-2 transition-all shadow-sm focus-visible:ring-primary focus-visible:border-primary",
                    isAnswered && (selectedAnswer?.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
                      ? "bg-green-50 border-green-500 text-green-700" 
                      : "bg-red-50 border-red-500 text-red-700")
                  )}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isAnswered && selectedAnswer) {
                      handleSubmit(selectedAnswer);
                    }
                  }}
                />
                
                {isAnswered && (
                  <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Correct Answer</span>
                    </div>
                    <span className="font-black text-green-700 text-sm">{currentQuestion.correctAnswer}</span>
                  </div>
                )}
                
                {!isAnswered && (
                  <Button 
                    className="w-full font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    size="lg"
                    disabled={!selectedAnswer?.trim()}
                    onClick={() => handleSubmit(selectedAnswer || '')}
                  >
                    Submit Answer <CornerDownLeft className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              currentQuestion.options.map((option, idx) => {
                const letter = optionLetters[idx];
                const isSelected = selectedAnswer === letter;
                
                // Only show correctness in Learning Mode
                const isCorrect = (mode === 'learning' || mode === 'boss-battle') && isAnswered && letter === currentQuestion.correctAnswer;
                const isWrong = (mode === 'learning' || mode === 'boss-battle') && isAnswered && isSelected && !isCorrect;

                return (
                  <button
                    key={letter}
                    disabled={isAnswered && (mode === 'learning' || mode === 'boss-battle')}
                    onClick={() => handleSubmit(letter)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left shadow-sm",
                      !isAnswered && "bg-background border-transparent hover:border-primary/20",
                      isSelected && mode === 'test' && "border-primary bg-primary/5",
                      isCorrect && "bg-green-50 border-green-500 shadow-green-100",
                      isWrong && "bg-red-50 border-red-500 shadow-red-100",
                      (mode === 'learning' || mode === 'boss-battle') && isAnswered && !isSelected && !isCorrect && "opacity-50 grayscale"
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
              })
            )}
          </div>

          {(mode === 'learning' || mode === 'boss-battle') && isAnswered && (
            <div className="mx-6 mt-8 space-y-6">
              <div className="p-5 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                 ) : isFetchingExplanation ? (
                   <div className="flex items-center gap-3 py-2">
                     <Loader2 className="w-3 h-3 text-primary animate-spin" />
                     <p className="text-[10px] font-bold text-primary animate-pulse">INTERPRETING DATA...</p>
                   </div>
                 ) : (
                   <div className="py-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={() => {
                         setIsFetchingExplanation(true);
                         if (onRequestExplanation) onRequestExplanation(currentQuestionIndex);
                       }}
                       className="text-xs text-primary border-primary hover:bg-primary hover:text-white"
                     >
                       <BrainCircuit className="w-3 h-3 mr-2" />
                       Ask AI Tutor
                     </Button>
                   </div>
                 )}
              </div>
              {mode !== 'boss-battle' && (
                <div className="flex justify-end animate-in fade-in duration-500 delay-150">
                  <Button 
                    onClick={handleNext}
                    size="lg"
                    className="font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all rounded-xl border-2 border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white px-8"
                  >
                    {currentIndex < questions.length - 1 ? "Next Quest" : "Finish Quest"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
