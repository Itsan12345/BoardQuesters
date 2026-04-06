"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Swords,
  Shield,
  Skull,
  Zap,
  FlaskConical,
  Microscope,
  Database,
  Stethoscope,
  ShieldAlert,
  ChevronLeft,
  Star,
  Target,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Award,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QuizInterface, Question } from '@/components/quiz/QuizInterface';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';
import { provideExamFeedback } from '@/ai/flows/provide-exam-feedback';
import { STATIC_QUESTIONS } from '@/lib/static-questions';
import { completeQuest } from '@/app/actions/quest';
import { calculateEarnedBadges, type Badge as BadgeType } from '@/lib/badge-system';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SUBJECT_METADATA: Record<string, { 
  name: string; 
  icon: any; 
  color: string; 
  enemy: string; 
  imageUrl?: string;
  difficulty: number;
  biome: string;
  description: string;
}> = {
  "Clinical Chemistry": { 
    name: "Clinical Chemistry", 
    icon: FlaskConical, 
    color: "bg-primary", 
    enemy: "Hyperglycemic Specter",
    imageUrl: "/images/island1.png",
    difficulty: 4,
    biome: "Crystal Peak Archipelago",
    description: "The air is thick with the scent of ozone and reagents. Master the metabolic currents."
  },
  "Hematology": { 
    name: "Hematology", 
    icon: Microscope, 
    color: "bg-accent", 
    enemy: "Sickle-Cell Reaper",
    difficulty: 3,
    biome: "The Sanguine Marshes",
    description: "Crimson rivers flow through iron-rich soil. Study the life force within."
  },
  "Microbiology": { 
    name: "Microbiology", 
    icon: Database, 
    color: "bg-primary", 
    enemy: "Biohazard Overlord",
    difficulty: 5,
    biome: "Toxic Spore Jungles",
    description: "Invisible dangers lurk in every shadow. Identification is survival."
  },
  "Immunohematology": { 
    name: "Immunohematology", 
    icon: Stethoscope, 
    color: "bg-accent", 
    enemy: "Anti-Serum Hydra",
    difficulty: 5,
    biome: "The Serum Sea",
    description: "Navigate the complex tides of antigens and antibodies."
  },
  "Clinical Microscopy": { 
    name: "Clinical Microscopy", 
    icon: FlaskConical, 
    color: "bg-primary", 
    enemy: "Crystal Golem",
    difficulty: 2,
    biome: "Amber Sediment Cliffs",
    description: "Examine the smallest details that reveal the greatest truths."
  },
  "Histopathology & MT Laws": { 
    name: "MT Laws & Histopath", 
    icon: ShieldAlert, 
    color: "bg-accent", 
    enemy: "Legal Beholder",
    difficulty: 3,
    biome: "The Citadel of Codes",
    description: "Where science meets the letter of the law. Preserve the ethics."
  }
};

type UserAnswerRecord = {
  questionIndex: number;
  selectedLetter: string;
  isCorrect: boolean;
};

export default function LearningQuest() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingResults, setIsSavingResults] = useState(false);
  const [quizMode, setQuizMode] = useState<'learning' | 'test'>('learning');
  const [score, setScore] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_AREAS[0]);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<BadgeType[]>([]);
  const [questStartTime, setQuestStartTime] = useState<number | null>(null);
  const [questCompletionTime, setQuestCompletionTime] = useState<number>(0);
  const [confidenceSubmitted, setConfidenceSubmitted] = useState(false);
  const [confidenceDialogOpen, setConfidenceDialogOpen] = useState(false);
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false);

  // RPG States
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isAnimating, setIsAnimating] = useState<"player" | "enemy" | null>(null);

  const startQuest = async () => {
    setIsLoading(true);
    setUserAnswers([]);
    setConfidence(null);
    setEarnedBadges([]);
    setConfidenceSubmitted(false);
    setQuestStartTime(Date.now());
    try {
      const pool = STATIC_QUESTIONS[selectedSubject] || STATIC_QUESTIONS["Clinical Chemistry"];
      const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 5);

      setQuestions(selected);
      setPlayerHealth(100);
      setEnemyHealth(100);
      setIsStarted(true);
      setIsFinished(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Island Storm Detected",
        description: "Quest data unavailable.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (isCorrect: boolean, index: number, selectedLetter: string) => {
    const damage = 100 / (questions.length || 5);
    setUserAnswers(prev => [...prev, { questionIndex: index, selectedLetter, isCorrect }]);

    if (isCorrect) {
      setIsAnimating("enemy");
      setEnemyHealth(prev => Math.max(0, prev - damage));
    } else {
      setIsAnimating("player");
      setPlayerHealth(prev => Math.max(0, prev - damage));
    }
    
    if (quizMode === 'learning' && !questions[index].explanation) {
      try {
        const feedback = await provideExamFeedback({
          question: questions[index].question,
          correctAnswer: questions[index].correctAnswer,
          userAnswer: selectedLetter
        });
        
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], explanation: feedback.explanation };
        setQuestions(updatedQuestions);
      } catch (e) {}
    }
    setTimeout(() => setIsAnimating(null), 500);
  };

  const handleFinish = (finalScore: number) => {
    setScore(finalScore);
    if (questStartTime) {
      const completionTime = Math.floor((Date.now() - questStartTime) / 1000);
      setQuestCompletionTime(completionTime);

      // Calculate earned badges
      const badges = calculateEarnedBadges({
        score: finalScore,
        totalQuestions: questions.length,
        confidenceLevel: 'Shaky',
        completionTime,
        streak: 0,
      });
      setEarnedBadges(badges);
    }
    setIsFinished(true);
    // Auto-open confidence dialog
    setTimeout(() => setConfidenceDialogOpen(true), 300);
  };

  const handleConfidenceSubmit = async (selectedLevel: string) => {
    setConfidence(selectedLevel);
    setConfidenceSubmitted(true);
    setConfidenceDialogOpen(false);
    setIsSavingResults(true);

    try {
      const result = await completeQuest({
        score,
        totalQuestions: questions.length,
        confidenceLevel: selectedLevel as any,
        completionTime: questCompletionTime,
        questMode: quizMode,
        subject: selectedSubject,
      });

      if (result.success) {
        // Recalculate badges with actual confidence level
        const updatedBadges = calculateEarnedBadges({
          score,
          totalQuestions: questions.length,
          confidenceLevel: selectedLevel as any,
          completionTime: questCompletionTime,
          streak: 0,
        });
        setEarnedBadges(updatedBadges);

        // Open thank you dialog after a short delay
        setTimeout(() => setThankYouDialogOpen(true), 200);

        toast({
          title: "Quest Completed!",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to save quest results.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSavingResults(false);
    }
  };

  const subjectMeta = SUBJECT_METADATA[selectedSubject];
  const EnemyIcon = subjectMeta.icon;

  if (isFinished) {
    const isVictor = enemyHealth <= 0 || (score > questions.length / 2);
    return (
      <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6 space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-500">
        <header className="text-center space-y-4 md:space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-125 md:scale-150 animate-pulse" />
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-2xl mx-auto">
              {isVictor ? <Award className="w-12 h-12 md:w-16 md:h-16 text-primary" /> : <Skull className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />}
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black font-headline text-primary tracking-tighter">
              {isVictor ? "BATTLE VICTORY" : "QUEST DEFEAT"}
            </h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Expedition for {selectedSubject}
            </p>
          </div>

          <div className="flex justify-center items-center gap-6 md:gap-12 py-4">
             <div className="text-center">
               <div className="text-2xl md:text-4xl font-black font-headline text-primary">{score}/{questions.length}</div>
               <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Accuracy</div>
             </div>
             <div className="h-10 md:h-12 w-px bg-border" />
             <div className="text-center">
               <div className="text-2xl md:text-4xl font-black font-headline text-accent">+{score * XP_PER_QUESTION}</div>
               <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">XP Earned</div>
             </div>
          </div>
        </header>

        {score === 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl overflow-hidden border-2 border-orange-200">
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <p className="text-lg md:text-xl font-black text-slate-900">Tough Expedition, Aspirant! 💪</p>
              <p className="text-sm md:text-base text-slate-700 font-medium">
                Even the greatest champions face setbacks. This is your learning moment! Every question you encounter strengthens your knowledge for the next quest.
              </p>
              <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                💡 Tip: Review the topics from this quest and try again. Better luck next time!
              </p>
            </CardContent>
          </Card>
        )}

        {score > 0 && score < 3 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden border-2 border-yellow-200">
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <p className="text-lg md:text-xl font-black text-slate-900">Nice Effort, Aspirant! 🌟</p>
              <p className="text-sm md:text-base text-slate-700 font-medium">
                You're on the right path! You've grasped some key concepts. Keep reinforcing these topics and you'll see significant improvement on your next expedition.
              </p>
              <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                💡 Tip: Focus on the questions you missed—they're your learning opportunities!
              </p>
            </CardContent>
          </Card>
        )}

        {score >= 3 && score < 5 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden border-2 border-blue-200">
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <p className="text-lg md:text-xl font-black text-slate-900">Great Job, Aspirant! 🚀</p>
              <p className="text-sm md:text-base text-slate-700 font-medium">
                You're demonstrating solid knowledge! You're well on your way to mastery. A few more focused study sessions and you'll be unstoppable. Keep up the momentum!
              </p>
              <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                💡 Tip: You're almost there! One more push to achieve perfect mastery.
              </p>
            </CardContent>
          </Card>
        )}

        {score === 5 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 via-yellow-50 to-primary/5 rounded-2xl overflow-hidden border-2 border-primary">
            <CardContent className="p-6 md:p-8 text-center space-y-4 animate-pulse">
              <p className="text-lg md:text-xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">PERFECT SCORE! 👑✨</p>
              <p className="text-sm md:text-base text-slate-700 font-bold">
                PHENOMENAL! You've achieved PERFECT MASTERY! You are a true champion among aspirants. This is the peak of excellence—celebrate this victory!
              </p>
              <div className="flex justify-center gap-2 text-2xl animate-bounce">
                🏆 ⭐ 🏆
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                You've earned extra respect in the BoardQuest arena!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Earned Badges Section */}
        {earnedBadges.length > 0 && (
          <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl overflow-hidden border-2 border-yellow-300">
            <CardContent className="p-6 md:p-8">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 text-center">🏆 Badges Earned</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-300 text-center space-y-1 animate-pulse"
                  >
                    <div className="text-2xl">✨</div>
                    <p className="font-bold text-xs md:text-sm text-slate-900">{badge.title}</p>
                    <p className="text-[9px] text-slate-600">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confidence Dialog */}
        <Dialog open={confidenceDialogOpen} onOpenChange={setConfidenceDialogOpen}>
          <DialogContent className="sm:max-w-md border-2 border-primary/20 bg-gradient-to-br from-slate-50 to-white">
            <DialogHeader className="text-center space-y-4">
              <DialogTitle className="font-headline text-2xl">⚡ Aspirant's Conviction</DialogTitle>
              <DialogDescription className="text-sm">How confident are you in your answers?</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3 py-6">
              {[
                {
                  level: 'Shaky',
                  emoji: '🔥',
                  color: 'bg-red-50 border-red-200 hover:bg-red-100',
                  selectedColor: 'bg-red-100 border-red-500 ring-2 ring-red-300',
                  description: 'Low Confidence',
                },
                {
                  level: 'Steady',
                  emoji: '⚡',
                  color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                  selectedColor: 'bg-yellow-100 border-yellow-500 ring-2 ring-yellow-300',
                  description: 'Balanced Confidence',
                },
                {
                  level: 'Unyielding',
                  emoji: '💫',
                  color: 'bg-primary/5 border-primary/30 hover:bg-primary/15',
                  selectedColor: 'bg-primary/20 border-primary ring-2 ring-primary/50',
                  description: 'High Confidence',
                },
              ].map((option) => (
                <button
                  key={option.level}
                  onClick={() => {
                    if (!confidenceSubmitted) {
                      handleConfidenceSubmit(option.level);
                    }
                  }}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all duration-200 text-center transform',
                    confidence === option.level ? option.selectedColor : option.color,
                    !confidenceSubmitted && 'hover:scale-105'
                  )}
                  disabled={isSavingResults}
                >
                  <div className="space-y-2">
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="font-black text-xs leading-tight">{option.level}</div>
                    <div className="text-[9px] text-muted-foreground font-bold">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Thank You Dialog */}
        <Dialog open={thankYouDialogOpen} onOpenChange={setThankYouDialogOpen}>
          <DialogContent className="sm:max-w-md border-2 border-primary bg-gradient-to-br from-white via-slate-50 to-white animate-in fade-in zoom-in duration-500">
            <DialogTitle className="sr-only">Quest Completion</DialogTitle>
            <div className="space-y-6 text-center py-8 px-2">
              {/* Trophy Animation */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 border-4 border-primary/30 shadow-2xl animate-bounce">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-3">
                <p className="text-3xl md:text-4xl font-black font-headline text-primary tracking-tight">
                  Thank You, Aspirant!
                </p>
                <p className="text-sm md:text-base text-slate-700 font-bold leading-relaxed">
                  Your conviction has been recorded and your quest success has been logged to your profile!
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Tutor Summary */}
        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
          <CardHeader className="bg-muted/30 border-b p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  Battle Log
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                  Post-Battle Rationale
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/20 text-primary bg-white px-3 py-1 uppercase font-bold text-[8px] md:text-[10px]">
                {quizMode} Mode Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {questions.map((q, idx) => {
                const userAns = userAnswers.find(ua => ua.questionIndex === idx);
                const isCorrect = userAns?.isCorrect;
                
                return (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border-b last:border-0 px-2 md:px-4">
                    <AccordionTrigger className="hover:no-underline py-4 md:py-6 px-2 md:px-4">
                      <div className="flex items-start text-left gap-4 md:gap-6">
                        <div className="mt-1 shrink-0">
                          {isCorrect ? (
                            <div className="bg-green-100 p-1.5 md:p-2 rounded-lg md:rounded-xl"><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" /></div>
                          ) : (
                            <div className="bg-red-100 p-1.5 md:p-2 rounded-lg md:rounded-xl"><XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs md:text-sm leading-snug line-clamp-1">{q.question}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={isCorrect ? "secondary" : "destructive"} className="text-[8px] h-3.5 font-black uppercase tracking-tighter">
                              {isCorrect ? "Mastered" : "Review"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 md:px-6 pb-6 md:pb-8 pt-2">
                      <div className="bg-muted/30 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 border border-primary/5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                          <div className="p-4 bg-white rounded-xl border shadow-sm">
                            <p className="text-[9px] uppercase font-black text-muted-foreground mb-1">Aspirant Choice</p>
                            <p className={cn("font-bold text-sm", isCorrect ? "text-green-600" : "text-red-600")}>
                              Option {userAns?.selectedLetter || 'None'}
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-xl border shadow-sm">
                            <p className="text-[9px] uppercase font-black text-muted-foreground mb-1">Correct Rationale</p>
                            <p className="font-bold text-sm text-primary">
                              Option {q.correctAnswer}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-black font-headline text-primary flex items-center gap-2 uppercase text-[10px] tracking-widest">
                            <BrainCircuit className="w-3.5 h-3.5" />
                            AI LOGICAL ANALYSIS
                          </h4>
                          <div className="bg-white/80 p-4 md:p-6 rounded-xl border-2 border-dashed border-primary/10">
                            <p className="text-xs md:text-sm leading-relaxed text-muted-foreground italic">
                              {q.explanation || "AI analysis is being finalized..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-12">
          <Button 
            size="lg" 
            onClick={() => {
              setIsStarted(false);
              setIsFinished(false);
            }} 
            className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg font-black shadow-xl"
          >
            Re-Enter Arena
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg font-bold border-2">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isStarted) {
    return (
      <div className="min-h-full flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center justify-between border-b sticky top-0 z-50">
          <Button variant="ghost" size="icon" onClick={() => setIsStarted(false)} className="rounded-full shrink-0">
            <ChevronLeft className="h-6 w-6 text-primary" />
          </Button>
          <div className="text-center min-w-0 flex-1 px-4">
            <h1 className="text-primary font-black font-headline text-sm md:text-lg uppercase leading-none truncate">{selectedSubject}</h1>
            <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {quizMode === 'learning' ? 'Intel Gathering' : 'Battle Simulation'}
            </p>
          </div>
          <div className="w-10 shrink-0" />
        </header>

        <main className="flex-1 flex flex-col">
          <div className="relative h-[25vh] md:h-[35vh] bg-gradient-to-b from-primary to-black overflow-hidden border-b">
            {/* Health Bars Stacked on Mobile, Floating on Desktop */}
            <div className={cn(
              "absolute top-4 right-4 md:top-8 md:right-8 transition-all duration-300 z-10",
              isAnimating === "enemy" && "animate-shake scale-110"
            )}>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-lg shadow-2xl min-w-[120px] md:min-w-[160px]">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="text-[8px] md:text-[10px] font-black text-white uppercase truncate">{subjectMeta.enemy}</span>
                  <span className="text-[7px] md:text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-black shrink-0">BOSS</span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${enemyHealth}%` }} />
                </div>
              </div>
              <div className="flex justify-end pr-2 md:pr-4 mt-2">
                 <EnemyIcon className="w-12 h-12 md:w-20 md:h-20 text-white drop-shadow-glow" />
              </div>
            </div>

            <div className={cn(
              "absolute bottom-4 left-4 md:bottom-6 md:left-8 transition-all duration-300 z-10",
              isAnimating === "player" && "animate-shake scale-110"
            )}>
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl rotate-3 flex items-center justify-center border-2 md:border-4 border-primary shadow-2xl hidden sm:flex">
                   <Shield className="w-6 h-6 md:w-10 md:h-10 text-primary" />
                 </div>
                 <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-lg shadow-2xl min-w-[120px] md:min-w-[160px]">
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <span className="text-[8px] md:text-[10px] font-black text-white uppercase">Aspirant Rivera</span>
                      <span className="text-[7px] md:text-[8px] bg-white text-primary px-1.5 py-0.5 rounded font-black shrink-0">LVL 24</span>
                    </div>
                    <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-white transition-all duration-500" style={{ width: `${playerHealth}%` }} />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white">
             <QuizInterface 
               questions={questions} 
               onFinish={handleFinish} 
               onAnswer={handleAnswer}
               isLoading={isLoading}
               mode={quizMode}
             />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col pb-20 md:pb-12 bg-white overflow-hidden relative">
      <header className="px-6 md:px-8 pt-8 md:pt-12 pb-2 space-y-1 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black font-headline leading-tight tracking-tight text-slate-900">
          Select Your <br />
          <span className="text-primary">Quest Region</span>
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
            MASTER EACH LABORATORY SCIENCE
          </p>
          <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-xl border">
            <Label htmlFor="quiz-mode" className="text-[9px] font-black uppercase text-muted-foreground whitespace-nowrap">
              {quizMode === 'learning' ? 'Learning Mode' : 'Test Mode'}
            </Label>
            <Switch 
              id="quiz-mode" 
              checked={quizMode === 'test'} 
              onCheckedChange={(checked) => setQuizMode(checked ? 'test' : 'learning')}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center py-6 md:py-10 relative z-10 overflow-hidden">
        <div className="flex overflow-x-auto gap-4 md:gap-8 px-8 md:px-12 no-scrollbar snap-x snap-mandatory items-center min-h-[400px] md:min-h-[500px]">
          {SUBJECT_AREAS.map((subject) => {
            const meta = SUBJECT_METADATA[subject];
            const isSelected = selectedSubject === subject;
            const Icon = meta.icon;

            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={cn(
                  "flex-shrink-0 snap-center transition-all duration-500 transform outline-none flex flex-col items-center",
                  isSelected ? "scale-100 w-64 md:w-80" : "scale-75 w-48 md:w-56 opacity-30 grayscale blur-[1px]"
                )}
              >
                <div className="relative w-full flex flex-col items-center">
                  <div className={cn(
                    "relative w-full aspect-square transition-all duration-500",
                    isSelected ? "animate-float" : ""
                  )}>
                    {meta.imageUrl ? (
                      <div className="relative w-full h-full transform hover:scale-105 transition-transform">
                        <Image src={meta.imageUrl} alt={subject} fill className="object-contain" priority={isSelected} />
                      </div>
                    ) : (
                      <div className={cn("w-full h-full rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden group border-4 border-white/50", meta.color)}>
                        <Icon className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                    )}
                  </div>

                  <div className={cn("mt-8 md:mt-12 text-center space-y-3 md:space-y-4 transition-all", isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                     <div className="space-y-1">
                       <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{meta.biome}</p>
                       <h3 className="text-xl md:text-3xl font-black font-headline text-slate-900 tracking-tighter truncate">{subject}</h3>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                       <div className="flex items-center gap-1">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={cn("w-3 h-3 md:w-4 md:h-4", i < meta.difficulty ? "text-primary fill-primary" : "text-slate-200")} />
                         ))}
                       </div>
                       <div className="flex gap-2">
                         <Badge variant="outline" className="bg-white border-primary/20 text-primary font-bold px-2 md:px-3 py-1 flex items-center gap-1 text-[8px] md:text-[10px]">
                           <Target className="w-2.5 h-2.5 md:w-3 md:h-3" /> {meta.enemy}
                         </Badge>
                       </div>
                     </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 md:px-8 mt-4 relative z-20">
        <Button 
          size="lg" 
          onClick={startQuest} 
          disabled={isLoading}
          className="w-full h-16 md:h-20 rounded-2xl md:rounded-[2rem] bg-primary hover:bg-primary/90 text-lg md:text-xl font-black shadow-2xl text-white flex items-center justify-center gap-4"
        >
          {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Zap className="w-5 h-5 md:w-6 md:h-6 fill-white text-white" />}
          {isLoading ? "Synchronizing..." : "Initiate Quest"}
        </Button>
      </div>
    </div>
  );
}
