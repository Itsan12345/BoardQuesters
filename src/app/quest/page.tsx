"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Trophy, RefreshCw, Shield, Swords, Heart, Ghost, Skull, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizInterface, Question } from '@/components/quiz/QuizInterface';
import { generateMockExamQuestions } from '@/ai/flows/generate-mock-exam-questions';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/navigation/BottomNav';

const SUBJECT_ENEMIES: Record<string, { name: string; icon: any; color: string }> = {
  "Clinical Chemistry": { name: "Hyperglycemic Specter", icon: Ghost, color: "text-blue-500" },
  "Hematology": { name: "Sickle-Cell Reaper", icon: Skull, color: "text-red-500" },
  "Microbiology": { name: "Biohazard Overlord", icon: Zap, color: "text-green-500" },
  "Immunohematology": { name: "Anti-Serum Hydra", icon: Ghost, color: "text-purple-500" },
  "Clinical Microscopy": { name: "Crystal Golem", icon: Ghost, color: "text-yellow-500" },
  "Histopathology & MT Laws": { name: "Legal Beholder", icon: Skull, color: "text-orange-500" }
};

export default function LearningQuest() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_AREAS[0]);
  
  // RPG States
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isAnimating, setIsAnimating] = useState<"player" | "enemy" | null>(null);

  const fetchQuestions = async (subject: string) => {
    setIsLoading(true);
    setIsFinished(false);
    setPlayerHealth(100);
    setEnemyHealth(100);
    try {
      const result = await generateMockExamQuestions({
        subjectArea: subject,
        numberOfQuestions: 5
      });
      // @ts-ignore
      setQuestions(result.questions);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Quota Exceeded",
        description: "Pathogens are regenerating... Please wait a few seconds before challenging them again.",
      });
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedSubject);
  }, [selectedSubject]);

  const handleAnswer = (isCorrect: boolean) => {
    const damage = 100 / (questions.length || 5);
    if (isCorrect) {
      setIsAnimating("enemy");
      setEnemyHealth(prev => Math.max(0, prev - damage));
    } else {
      setIsAnimating("player");
      setPlayerHealth(prev => Math.max(0, prev - damage));
    }
    setTimeout(() => setIsAnimating(null), 1000);
  };

  const handleFinish = (finalScore: number) => {
    setScore(finalScore);
    setIsFinished(true);
  };

  const enemyInfo = SUBJECT_ENEMIES[selectedSubject] || SUBJECT_ENEMIES["Clinical Chemistry"];
  const EnemyIcon = enemyInfo.icon;

  if (isFinished) {
    const totalXp = score * XP_PER_QUESTION;
    const isVictor = enemyHealth <= 0;

    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 animate-pulse" />
          {isVictor ? (
            <Trophy className="w-24 h-24 text-amber-500 mx-auto relative drop-shadow-xl" />
          ) : (
            <Skull className="w-24 h-24 text-destructive mx-auto relative drop-shadow-xl" />
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-bold font-headline">
            {isVictor ? "Victory!" : "Defeat..."}
          </h2>
          <p className="text-muted-foreground text-lg">
            {isVictor 
              ? `You defeated the ${enemyInfo.name} in ${selectedSubject}.` 
              : `The ${enemyInfo.name} overwhelmed you. Keep studying!`}
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white">
          <CardContent className="p-8 grid grid-cols-2 gap-8 divide-x">
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
              <h3 className="text-4xl font-bold font-headline text-primary">{Math.round((score / (questions.length || 1)) * 100)}%</h3>
              <p className="text-xs font-medium text-muted-foreground">{score} / {questions.length} Hits</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gained</p>
              <h3 className="text-4xl font-bold font-headline text-accent">+{isVictor ? totalXp : Math.floor(totalXp/2)} XP</h3>
              <p className="text-xs font-medium text-muted-foreground">Streak: 12 Days</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => fetchQuestions(selectedSubject)} className="bg-primary hover:bg-primary/90">
            <RefreshCw className="mr-2 w-5 h-5" />
            Re-enter Battle
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Retreat to Dashboard
            </Button>
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-accent" />
            <span className="font-bold font-headline text-lg">Battle Quest</span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      <main className="container mx-auto max-w-5xl py-8 space-y-8">
        {!isLoading && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {SUBJECT_AREAS.map((subject) => (
              <Button 
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className="rounded-full px-4 text-[10px] font-bold uppercase tracking-wider h-8"
              >
                {subject}
              </Button>
            ))}
          </div>
        )}

        {/* RPG Battle Scene */}
        {!isLoading && questions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
            {/* Player Side */}
            <div className={cn(
              "flex flex-col items-center space-y-4 transition-transform duration-200",
              isAnimating === "player" && "translate-x-4 animate-bounce"
            )}>
              <div className="relative">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary shadow-lg">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                {isAnimating === "player" && <span className="absolute -top-4 -right-4 text-destructive font-bold text-2xl animate-ping">-HP</span>}
              </div>
              <div className="w-full max-w-[200px] space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500 fill-red-500" /> Aspirant</span>
                  <span>{Math.round(playerHealth)}%</span>
                </div>
                <Progress value={playerHealth} className="h-3 bg-red-100" />
              </div>
            </div>

            {/* Enemy Side */}
            <div className={cn(
              "flex flex-col items-center space-y-4 transition-transform duration-200",
              isAnimating === "enemy" && "-translate-x-4 animate-bounce"
            )}>
              <div className="relative">
                <div className={cn(
                  "w-24 h-24 bg-muted rounded-full flex items-center justify-center border-4 border-destructive shadow-lg",
                  enemyInfo.color
                )}>
                  <EnemyIcon className="w-12 h-12" />
                </div>
                {isAnimating === "enemy" && <span className="absolute -top-4 -left-4 text-accent font-bold text-2xl animate-ping">CRIT!</span>}
              </div>
              <div className="w-full max-w-[200px] space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>{enemyInfo.name}</span>
                  <span>{Math.round(enemyHealth)}%</span>
                </div>
                <Progress value={enemyHealth} className="h-3 bg-destructive/10" />
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Summoning AI questions for your quest...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground">The pathogens are currently shielding. Try again in a moment.</p>
            <Button onClick={() => fetchQuestions(selectedSubject)} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry Summoning
            </Button>
          </div>
        ) : (
          <QuizInterface 
            questions={questions} 
            onFinish={handleFinish} 
            onAnswer={handleAnswer}
            isLoading={false} 
          />
        )}
      </main>
      <BottomNav />
    </div>
  );
}
