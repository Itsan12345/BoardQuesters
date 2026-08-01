"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Skull,
  Zap,
  FlaskConical,
  Microscope,
  Database,
  Stethoscope,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Star,
  Target,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Award,
  Trophy,
  BookOpen,
  Swords,
  Maximize,
  Minimize,
  Clock,
  Activity,
  Biohazard,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { QuizInterface, Question } from '@/components/quiz/QuizInterface';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';
import { provideExamFeedback } from '@/ai/flows/provide-exam-feedback';
import { getQuestQuestions } from '@/app/actions/arena';
import { completeQuest } from '@/app/actions/quest';
import { getUserProfile } from '@/app/actions/user';
import { calculateEarnedBadges, type Badge as BadgeType } from '@/lib/badge-system';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SUBJECT_METADATA: Record<string, {
  name: string;
  icon: any;
  color: string;
  enemy: string;
  imageUrl?: string;
  backgroundUrl?: string;
  difficulty: number;
  biome: string;
  description: string;
}> = {
  "Clinical Chemistry": {
    name: "Clinical Chemistry",
    icon: FlaskConical,
    color: "bg-primary",
    enemy: "Hyperglycemic Specter",
    imageUrl: "/images/ClinChem256.png",
    backgroundUrl: "/images/ClinChem256_bg.png",
    difficulty: 4,
    biome: "Crystal Peak Archipelago",
    description: "The air is thick with the scent of ozone and reagents. Master the metabolic currents."
  },
  "Hematology": {
    name: "Hematology",
    icon: Microscope,
    color: "bg-accent",
    enemy: "Sickle-Cell Reaper",
    imageUrl: "/images/Hema256.png",
    backgroundUrl: "/images/Hema256_bg.png",
    difficulty: 3,
    biome: "The Sanguine Marshes",
    description: "Crimson rivers flow through iron-rich soil. Study the life force within."
  },
  "Microbiology": {
    name: "Microbiology",
    icon: Database,
    color: "bg-primary",
    enemy: "Biohazard Overlord",
    imageUrl: "/images/MicroBio256.png",
    backgroundUrl: "/images/MicroBio256_bg.png",
    difficulty: 5,
    biome: "Toxic Spore Jungles",
    description: "Invisible dangers lurk in every shadow. Identification is survival."
  },
  "Immunology & Serology and Immunohematology": {
    name: "Immunology & Serology and Immunohematology",
    icon: Stethoscope,
    color: "bg-accent",
    enemy: "Anti-Serum Hydra",
    imageUrl: "/images/ImmunoHema256.png",
    backgroundUrl: "/images/ImmunoHema256_bg.png",
    difficulty: 5,
    biome: "The Serum Sea",
    description: "Navigate the complex tides of antigens and antibodies."
  },
  "Clinical Microscopy & Parasitology": {
    name: "Clinical Microscopy & Parasitology",
    icon: FlaskConical,
    color: "bg-primary",
    enemy: "Crystal Golem",
    imageUrl: "/images/ClinMicro256.png",
    backgroundUrl: "/images/ClinMicro256_bg.png",
    difficulty: 2,
    biome: "Amber Sediment Cliffs",
    description: "Examine the smallest details that reveal the greatest truths."
  },
  "Histopathology & MT Laws": {
    name: "Histopathology & MT Laws",
    icon: ShieldAlert,
    color: "bg-accent",
    enemy: "Legal Beholder",
    imageUrl: "/images/Hispatho256.png",
    backgroundUrl: "/images/Hispatho256_bg.png",
    difficulty: 3,
    biome: "The Citadel of Codes",
    description: "Where science meets the letter of the law. Preserve the ethics."
  }
};

type UserAnswerRecord = {
  questionIndex: number;
  questionId?: string;
  selectedLetter: string;
  isCorrect: boolean;
  difficulty?: string;
};

export default function LearningQuest() {
  const { toast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingResults, setIsSavingResults] = useState(false);
  const [quizMode, setQuizMode] = useState<'learning' | 'test' | 'boss-battle'>('learning');
  const [modeSelectDialogOpen, setModeSelectDialogOpen] = useState(false);
  const [leaveConfirmDialogOpen, setLeaveConfirmDialogOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<'mode' | 'details' | 'limit'>('mode');
  const [mobileModalStep, setMobileModalStep] = useState<'info' | 'action'>('info');
  const [score, setScore] = useState(0);
  const [fetchingExplanations, setFetchingExplanations] = useState<Record<number, boolean>>({});
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_AREAS[0]);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Sync fullscreen state with native browser events (e.g. hitting ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await fullscreenRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

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

  // Advanced Boss Mechanics States
  const [turnCount, setTurnCount] = useState(0);
  const [bossShieldActive, setBossShieldActive] = useState(false);
  const [playerPoisoned, setPlayerPoisoned] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState<'victory' | 'defeat' | null>(null);
  const [showBattleLog, setShowBattleLog] = useState(false);
  const [bossDifficulty, setBossDifficulty] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<number>(1);

  // Fetch User Level on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const profile = await getUserProfile();
        if (profile?.level) setUserLevel(profile.level);
      } catch (e) {
        console.error("Failed to load user level");
      }
    }
    fetchUser();
  }, []);

  // Monitor Boss Battle Health for Early Win/Loss
  useEffect(() => {
    if (isStarted && !isFinished && quizMode === 'boss-battle') {
      if (enemyHealth <= 0) {
        const currentScore = userAnswers.filter(a => a.isCorrect).length;
        handleFinish(currentScore, 'victory');
      } else if (playerHealth <= 0) {
        const currentScore = userAnswers.filter(a => a.isCorrect).length;
        handleFinish(currentScore, 'defeat');
      }
    }
  }, [enemyHealth, playerHealth, isStarted, isFinished, quizMode, userAnswers]);

  // Scroll selected item into view
  useEffect(() => {
    if (carouselRef.current) {
      const selectedButton = carouselRef.current.querySelector(`button:nth-child(${SUBJECT_AREAS.indexOf(selectedSubject) + 1})`);
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedSubject]);

  const startQuest = async (limit: number = 50, specificDifficulty?: string) => {
    setIsLoading(true);
    setUserAnswers([]);
    setConfidence(null);
    setEarnedBadges([]);
    setConfidenceSubmitted(false);
    setQuestStartTime(Date.now());
    try {
      if (quizMode === 'boss-battle' && specificDifficulty) {
        setBossDifficulty(specificDifficulty);
      }
      const selected = await getQuestQuestions(selectedSubject, quizMode, limit, specificDifficulty);

      if (!selected || selected.length === 0) {
        toast({
          variant: "destructive",
          title: "No Questions Found",
          description: "There are currently no questions available for this region in the database.",
        });
        return;
      }
      setQuestions(selected);
      // Level-scaled HP: 200 base + 5 per level
      const startingHp = quizMode === 'boss-battle' ? 200 + (userLevel * 5) : 100;
      setPlayerHealth(startingHp);
      
      let bossStartingHp = 100;
      if (quizMode === 'boss-battle') {
        const diffBase = specificDifficulty === 'EASY' ? 400 : specificDifficulty === 'HARD' ? 800 : 600;
        const levelScaling = specificDifficulty === 'EASY' ? 5 : specificDifficulty === 'HARD' ? 12 : 8;
        bossStartingHp = Math.floor(diffBase + (userLevel * levelScaling));
      }
      setEnemyHealth(bossStartingHp);
      setTurnCount(0);
      setBossShieldActive(false);
      setPlayerPoisoned(false);
      setBattleOutcome(null);
      setShowBattleLog(false);
      setIsStarted(true);
      setIsFinished(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Island Storm Detected",
        description: "An error occurred while fetching quest data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, index: number, letter: string, action?: 'heavy' | 'normal' | 'defend', questionData?: Question) => {
    setUserAnswers(prev => [...prev, {
      questionIndex: index,
      selectedLetter: letter,
      isCorrect,
      questionId: questionData?.id,
      difficulty: questionData?.difficulty
    }]);

    const baseDamage = quizMode === 'boss-battle' ? 25 : 100 / (questions.length || 5);
    let enemyDmg = 0;
    let playerDmg = 0;
    let playerHeal = 0;
    let enemyHeal = 0;

    let newPoisonedState = playerPoisoned;
    let newShieldState = bossShieldActive;

    // Apply poison tick at the very start of the turn
    if (quizMode === 'boss-battle' && playerPoisoned) {
      playerDmg += baseDamage * 0.5; // 50% of a normal hit in poison damage
    }

    // Evaluate Phase 3 Enrage Healing (if boss < 20% HP)
    if (quizMode === 'boss-battle' && enemyHealth > 0 && enemyHealth <= 20) {
      enemyHeal += baseDamage * 0.5; // Heals a bit every turn
    }

    if (quizMode === 'boss-battle' && action) {
      if (action === 'heavy') {
        if (isCorrect) {
          enemyDmg = baseDamage * 2;
          newShieldState = false; // Heavy shatters the shield!
        } else {
          playerDmg += baseDamage * 2;
        }
      } else if (action === 'defend') {
        if (isCorrect) {
          playerHeal += baseDamage * 1.5;
          newPoisonedState = false; // Cures poison!
        } else {
          playerDmg += baseDamage * 0.5;
        }
      } else {
        // normal
        if (isCorrect) {
          if (!bossShieldActive) {
            enemyDmg = baseDamage;
          } else {
            // Shield absorbed the hit
            enemyDmg = 0;
            toast({ title: "Shield Absorbed Attack!", description: "Normal attacks deal 0 damage while the shield is active.", variant: "destructive" });
          }
        } else {
          playerDmg += baseDamage;
        }
      }

      // Aggressive Phase 2: (Boss <= 60% HP and > 20% HP) -> Double damage on player mistake
      if (!isCorrect && enemyHealth <= 60 && enemyHealth > 20) {
        playerDmg *= 2;
      }

      // Poison Infliction Mechanics
      if (!isCorrect && Math.random() < 0.25) {
        newPoisonedState = true;
        toast({ title: "POISONED!", description: "The boss inflicted a toxic wound! Defend to cure it.", variant: "destructive" });
      }

      // Boss casts shield every 4 turns
      if ((turnCount + 1) % 4 === 0 && enemyHealth > 0) {
        newShieldState = true;
        toast({ title: "Boss Casts Shield!", description: "The boss puts up a magical shield. Only Heavy attacks can shatter it!", variant: "destructive" });
      }

    } else {
      if (isCorrect) enemyDmg = baseDamage;
      else playerDmg = baseDamage;
    }

    if (quizMode === 'boss-battle') {
      const bossMul = bossDifficulty === 'EASY' ? 0.7 : bossDifficulty === 'HARD' ? 1.5 : 1;
      const playerMul = bossDifficulty === 'EASY' ? 1.5 : bossDifficulty === 'HARD' ? 0.7 : 1;
      
      // Level-scaled damage: Add a bonus 0.5 base damage per level
      const levelBonusDamage = userLevel * 0.5;

      enemyDmg = (enemyDmg + (enemyDmg > 0 ? levelBonusDamage : 0)) * playerMul;
      
      const bossBonusDamage = userLevel * 0.4;
      playerDmg = (playerDmg + (playerDmg > 0 ? bossBonusDamage : 0)) * bossMul;
      
      enemyHeal *= bossMul;
      playerHeal *= playerMul;
    }

    // Apply health changes
    if (enemyHeal > 0) {
      setIsAnimating("enemy");
      const diffBase = bossDifficulty === 'EASY' ? 400 : bossDifficulty === 'HARD' ? 800 : 600;
      const levelScaling = bossDifficulty === 'EASY' ? 5 : bossDifficulty === 'HARD' ? 12 : 8;
      const maxEnemyHp = quizMode === 'boss-battle' ? Math.floor(diffBase + (userLevel * levelScaling)) : 100;
      setEnemyHealth(prev => Math.min(maxEnemyHp, prev + enemyHeal));
    }

    if (enemyDmg > 0) {
      setIsAnimating("enemy");
      setEnemyHealth(prev => Math.max(0, prev - enemyDmg));
    }

    if (playerDmg > 0) {
      setIsAnimating("player");
      setPlayerHealth(prev => Math.max(0, prev - playerDmg));
    }

    if (playerHeal > 0) {
      setIsAnimating("player");
      const maxHp = quizMode === 'boss-battle' ? 200 + (userLevel * 5) : 100;
      setPlayerHealth(prev => Math.min(maxHp, prev + playerHeal));
    }

    setPlayerPoisoned(newPoisonedState);
    setBossShieldActive(newShieldState);
    setTurnCount(prev => prev + 1);

    setTimeout(() => setIsAnimating(null), 500);
  };

  const handleRequestExplanation = async (index: number) => {
    const qToExplain = questions[index];
    const userAns = userAnswers.find(ua => ua.questionIndex === index);

    if (!qToExplain || !userAns || qToExplain.explanation) return;

    setFetchingExplanations(prev => ({ ...prev, [index]: true }));
    try {
      const feedback = await provideExamFeedback({
        questionId: qToExplain.id,
        question: qToExplain.question,
        correctAnswer: qToExplain.correctAnswer,
        userAnswer: userAns.selectedLetter
      });

      setQuestions(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], explanation: feedback.explanation };
        }
        return updated;
      });
    } catch (e) {
      console.error("Failed to fetch explanation", e);
    } finally {
      setFetchingExplanations(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleFinish = (finalScore: number, outcome?: 'victory' | 'defeat') => {
    setScore(finalScore);

    if (outcome) {
      setBattleOutcome(outcome);
    } else if (quizMode === 'boss-battle') {
      if (enemyHealth > 0) {
        setBattleOutcome('defeat');
        setPlayerHealth(0); // Visually wipe out player due to stamina exhaustion
      } else {
        setBattleOutcome('victory');
      }
    }

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
        userAnswers: userAnswers.map(ua => ({
          questionId: ua.questionId || '',
          isCorrect: ua.isCorrect,
          difficulty: ua.difficulty
        })).filter(ua => ua.questionId !== '')
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
    const isVictor = quizMode === 'boss-battle' ? battleOutcome === 'victory' : (score > questions.length / 2);

    return (
      <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-6 space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-500">

        {/* For standard learning/test modes, show the original header */}
        {quizMode !== 'boss-battle' && (
          <header className="text-center space-y-4 md:space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-125 md:scale-150 animate-pulse" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-background rounded-full flex items-center justify-center border-4 border-primary shadow-2xl mx-auto">
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
        )}

        {/* Dedicated Boss Battle Game Over Screen */}
        {quizMode === 'boss-battle' && !showBattleLog && (
          <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in fade-in zoom-in duration-500">
            {/* The Outcome Banner */}
            <div className={cn(
              "w-full max-w-2xl py-12 text-center rounded-[2rem] border-4 shadow-2xl",
              battleOutcome === 'victory' ? "bg-green-100 border-green-500 shadow-green-200" : "bg-red-100 border-red-600 shadow-red-200"
            )}>
              <h1 className={cn("text-5xl md:text-6xl font-black font-headline uppercase tracking-tight", battleOutcome === 'victory' ? "text-green-700" : "text-red-700")}>
                {battleOutcome === 'victory' ? 'VICTORY!' : 'DEFEAT!'}
              </h1>
              <p className={cn("text-base md:text-lg font-bold uppercase tracking-widest mt-4", battleOutcome === 'victory' ? "text-green-600" : "text-red-600")}>
                {battleOutcome === 'victory' ? 'The Boss has been vanquished!' : (playerHealth <= 0 && enemyHealth > 0) ? 'Your HP reached 0! The boss has defeated you!' : 'You have ran out of chances to defeat the Boss and failed'}
              </p>
            </div>

            {/* Boss Battle Stats */}
            <div className="flex justify-center items-center gap-6 md:gap-12 py-4">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-black font-headline text-primary">{score}</div>
                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Correct Answers</div>
              </div>
              <div className="h-10 md:h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-black font-headline text-accent">+{score * XP_PER_QUESTION}</div>
                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">XP Earned</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-lg mt-4">
              <Button 
                onClick={() => setShowBattleLog(true)} 
                className="w-full h-14 md:h-16 text-xl md:text-2xl font-bytebounce tracking-widest border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-amber-400 hover:bg-amber-500 text-black hover:-translate-y-1 transition-transform"
              >
                Review Battle Log
              </Button>
            </div>
          </div>
        )}

        {/* Motivational Cards (Only show if not in Boss-Battle, or if reviewing the log) */}
        {(quizMode !== 'boss-battle' || showBattleLog) && (
          <>
            {score === 0 && (
              <Card className="border border-border shadow-lg bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl overflow-hidden border-2 border-orange-200">
                <CardContent className="p-6 md:p-8 text-center space-y-4">
                  <p className="text-lg md:text-xl font-black text-foreground">Tough Expedition, Aspirant! 💪</p>
                  <p className="text-sm md:text-base text-foreground font-medium">
                    Even the greatest champions face setbacks. This is your learning moment! Every question you encounter strengthens your knowledge for the next quest.
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                    💡 Tip: Review the topics from this quest and try again. Better luck next time!
                  </p>
                </CardContent>
              </Card>
            )}

            {score > 0 && score < Math.ceil(questions.length / 2) && (
              <Card className="border border-border shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden border-2 border-yellow-200">
                <CardContent className="p-6 md:p-8 text-center space-y-4">
                  <p className="text-lg md:text-xl font-black text-foreground">Nice Effort, Aspirant! 🌟</p>
                  <p className="text-sm md:text-base text-foreground font-medium">
                    You're on the right path! You've grasped some key concepts. Keep reinforcing these topics and you'll see significant improvement on your next expedition.
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                    💡 Tip: Focus on the questions you missed—they're your learning opportunities!
                  </p>
                </CardContent>
              </Card>
            )}

            {score >= Math.ceil(questions.length / 2) && score < questions.length && (
              <Card className="border border-border shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden border-2 border-blue-200">
                <CardContent className="p-6 md:p-8 text-center space-y-4">
                  <p className="text-lg md:text-xl font-black text-foreground">Great Job, Aspirant! 🚀</p>
                  <p className="text-sm md:text-base text-foreground font-medium">
                    You're demonstrating solid knowledge! You're well on your way to mastery. A few more focused study sessions and you'll be unstoppable. Keep up the momentum!
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 font-semibold uppercase tracking-wide">
                    💡 Tip: You're almost there! One more push to achieve perfect mastery.
                  </p>
                </CardContent>
              </Card>
            )}

            {score === questions.length && score > 0 && (
              <Card className="border border-border shadow-lg bg-gradient-to-br from-primary/10 via-yellow-50 to-primary/5 rounded-2xl overflow-hidden border-2 border-primary">
                <CardContent className="p-6 md:p-8 text-center space-y-4 animate-pulse">
                  <p className="text-lg md:text-xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">PERFECT SCORE! 👑✨</p>
                  <p className="text-sm md:text-base text-foreground font-bold">
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
              <Card className="border border-border shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl overflow-hidden border-2 border-yellow-300">
                <CardContent className="p-6 md:p-8">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 text-center">🏆 Badges Earned</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {earnedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-300 text-center space-y-1 animate-pulse"
                      >
                        <div className="text-2xl">✨</div>
                        <p className="font-bold text-xs md:text-sm text-foreground">{badge.title}</p>
                        <p className="text-[9px] text-slate-600">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </>
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
                <p className="text-sm md:text-base text-foreground font-bold leading-relaxed">
                  Your conviction has been recorded and your quest success has been logged to your profile!
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        {/* AI Tutor Summary (Only show if not in Boss-Battle, or if reviewing the log) */}
        {(quizMode !== 'boss-battle' || showBattleLog) && (
          <Card className="border border-border shadow-xl bg-background overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
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
                <Badge variant="outline" className="border-primary/20 text-primary bg-background px-3 py-1 uppercase font-bold text-[8px] md:text-[10px]">
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
                              <Badge variant="outline" className="text-[8px] h-3.5 font-black uppercase tracking-tighter border-primary/20 text-primary">
                                {q.type?.replace('_', ' ') || "MCQ"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 md:px-6 pb-6 md:pb-8 pt-2">
                        <div className="bg-muted/30 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 border border-primary/5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                            <div className="p-4 bg-background rounded-xl border shadow-sm">
                              <p className="text-[9px] uppercase font-black text-muted-foreground mb-1">Aspirant Choice</p>
                              <p className={cn("font-bold text-sm", isCorrect ? "text-green-600" : "text-red-600")}>
                                {q.type === 'TRUE_FALSE' && userAns?.selectedLetter
                                  ? (userAns.selectedLetter === 'A' ? 'True (Option A)' : userAns.selectedLetter === 'B' ? 'False (Option B)' : userAns.selectedLetter)
                                  : userAns?.selectedLetter ? `Option ${userAns.selectedLetter}` : 'None'}
                              </p>
                            </div>
                            <div className="p-4 bg-background rounded-xl border shadow-sm">
                              <p className="text-[9px] uppercase font-black text-muted-foreground mb-1">Correct Rationale</p>
                              <p className="font-bold text-sm text-primary">
                                {q.type === 'TRUE_FALSE'
                                  ? (q.correctAnswer === 'A' ? 'True (Option A)' : q.correctAnswer === 'B' ? 'False (Option B)' : q.correctAnswer)
                                  : `Option ${q.correctAnswer}`}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-black font-headline text-primary flex items-center gap-2 uppercase text-[10px] tracking-widest">
                              <BrainCircuit className="w-3.5 h-3.5" />
                              AI LOGICAL ANALYSIS
                            </h4>
                            <div className="bg-background/80 p-4 md:p-6 rounded-xl border-2 border-dashed border-primary/10">
                              {q.explanation ? (
                                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground italic">
                                  {q.explanation}
                                </p>
                              ) : fetchingExplanations[idx] ? (
                                <div className="flex items-center gap-3 py-2">
                                  <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                  <p className="text-[10px] font-bold text-primary animate-pulse">INTERPRETING DATA...</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-start gap-2">
                                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground italic">
                                    Want to know why this is the correct answer?
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRequestExplanation(idx)}
                                    className="text-xs text-primary border-primary hover:bg-primary hover:text-white"
                                  >
                                    <BrainCircuit className="w-3 h-3 mr-2" />
                                    Ask AI Tutor
                                  </Button>
                                </div>
                              )}
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
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pb-12 w-full max-w-xl mx-auto px-4 sm:px-0 mt-8">
          <Button
            onClick={() => {
              setIsStarted(false);
              setIsFinished(false);
              setShowBattleLog(false);
            }}
            className="flex-1 h-14 md:h-16 text-lg md:text-2xl font-bytebounce tracking-widest border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-primary hover:bg-primary/90 text-white hover:-translate-y-1 transition-transform whitespace-nowrap"
          >
            Re-Enter Arena
          </Button>
          <Link href="/" className="flex-1 flex">
            <Button className="w-full h-14 md:h-16 text-lg md:text-2xl font-bytebounce tracking-widest border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white hover:bg-slate-100 text-black hover:-translate-y-1 transition-transform whitespace-nowrap">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isStarted) {
    return (
      <div
        ref={fullscreenRef}
        className={cn("min-h-full flex flex-col bg-background", isFullscreen ? "h-screen w-screen overflow-y-auto" : "")}
      >
        {/* Exit Confirmation Dialog */}
        <Dialog open={leaveConfirmDialogOpen} onOpenChange={setLeaveConfirmDialogOpen}>
          <DialogContent
            container={isFullscreen ? fullscreenRef.current : undefined}
            className="sm:max-w-md border-2 border-destructive bg-gradient-to-br from-slate-50 to-white"
          >
            <DialogHeader className="text-center space-y-4">
              <DialogTitle className="font-headline text-2xl text-destructive flex items-center justify-center gap-2">
                <ShieldAlert className="w-6 h-6" />
                Retreat from Battle?
              </DialogTitle>
              <DialogDescription className="text-sm font-bold text-slate-600 leading-relaxed">
                Are you certain you wish to retreat? Leaving the arena now means you will forfeit all potential XP and badges from this session.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 font-bold border-2"
                onClick={() => setLeaveConfirmDialogOpen(false)}
              >
                Return to Battle
              </Button>
              <Button
                variant="destructive"
                className="flex-1 font-bold shadow-lg shadow-destructive/20"
                onClick={() => {
                  setLeaveConfirmDialogOpen(false);
                  setIsStarted(false);
                }}
              >
                Flee Arena
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <header className="bg-background px-4 py-3 flex items-center justify-between border-b relative z-10">
          <Button variant="ghost" size="icon" onClick={() => setLeaveConfirmDialogOpen(true)} className="rounded-full shrink-0">
            <ChevronLeft className="h-6 w-6 text-primary" />
          </Button>
          <div className="text-center min-w-0 flex-1 px-4">
            <h1 className="text-primary font-black font-headline text-sm md:text-lg uppercase leading-none truncate">{selectedSubject}</h1>
            <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {quizMode === 'learning' ? 'Intel Gathering' : 'Battle Simulation'}
            </p>
          </div>
          <div className="w-10 flex shrink-0 justify-end" >
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="rounded-full text-primary hover:bg-primary/10 hover:text-primary" title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
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
                  <div className="flex items-center gap-1">
                    {bossShieldActive && <span className="text-[7px] md:text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-black shrink-0 animate-pulse" title="Immune to Normal Attacks">SHIELDED</span>}
                    {quizMode === 'boss-battle' && enemyHealth <= 20 && enemyHealth > 0 ? (
                      <span className="text-[7px] md:text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black shrink-0 animate-pulse" title="Healing every turn!">ENRAGED</span>
                    ) : quizMode === 'boss-battle' && enemyHealth <= 60 && enemyHealth > 0 ? (
                      <span className="text-[7px] md:text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-black shrink-0" title="Double damage on player mistakes!">AGGRESSIVE</span>
                    ) : null}
                    <span className="text-[7px] md:text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-black shrink-0">BOSS</span>
                  </div>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-background/10 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (enemyHealth / (quizMode === 'boss-battle' ? Math.floor((bossDifficulty === 'EASY' ? 400 : bossDifficulty === 'HARD' ? 800 : 600) + (userLevel * (bossDifficulty === 'EASY' ? 5 : bossDifficulty === 'HARD' ? 12 : 8))) : 100)) * 100)}%` }} />
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
                <div className="w-12 h-12 md:w-20 md:h-20 bg-background rounded-xl md:rounded-2xl rotate-3 flex items-center justify-center border-2 md:border-4 border-primary shadow-2xl">
                  <Shield className="w-6 h-6 md:w-10 md:h-10 text-primary" />
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-lg shadow-2xl min-w-[120px] md:min-w-[160px]">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="text-[7px] md:text-[8px] font-black text-white uppercase">Aspirant Rivera</span>
                    <div className="flex items-center gap-1">
                      {playerPoisoned && <span className="text-[7px] md:text-[8px] bg-green-500 text-white px-1.5 py-0.5 rounded font-black shrink-0 animate-pulse" title="Taking damage every turn! Defend to cure.">POISONED</span>}
                      <span className="text-[7px] md:text-[8px] bg-background text-primary px-1.5 py-0.5 rounded font-black shrink-0">LVL {userLevel}</span>
                    </div>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-background/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-background transition-all duration-500" style={{ width: `${Math.min(100, (playerHealth / (quizMode === 'boss-battle' ? 200 + (userLevel * 5) : 100)) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-background">
            <QuizInterface
              questions={questions}
              onFinish={handleFinish}
              onAnswer={handleAnswer}
              onRequestExplanation={handleRequestExplanation}
              isLoading={isLoading}
              mode={quizMode}
              bossShieldActive={bossShieldActive}
              playerPoisoned={playerPoisoned}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      ref={fullscreenRef}
      className={cn(
        "min-h-full flex flex-col pb-20 md:pb-12 overflow-hidden relative bg-black",
        isFullscreen ? "h-screen w-screen" : ""
      )}
      style={{
        backgroundImage: `url('${SUBJECT_METADATA[selectedSubject]?.backgroundUrl || ''}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'local',
        transition: 'background-image 0.6s ease-in-out',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px] transition-all duration-600" />

      <header className="px-6 md:px-8 pt-6 md:pt-8 pb-4 space-y-1 relative z-10">
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
          <Button
            variant="outline"
            size="icon"
            className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-md transition-all shadow-lg"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-0 mb-6 pr-12">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black font-headline leading-tight tracking-tight text-white">
              Select Your <br />
              <span className="text-primary" style={{
                textShadow: '2px 2px 0 #ffffff, -2px -2px 0 #8B0000, 2px -2px 0 #8B0000, -2px 2px 0 #8B0000',
                WebkitTextStroke: '2px #fbfbfb',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Quest Region
              </span>
            </h1>
          </div>
        </div>

        <p className="text-[11px] font-bold text-slate-200 uppercase tracking-[0.15em]">
          MASTER EACH LABORATORY SCIENCE
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center py-6 md:py-10 relative z-10 overflow-hidden">
        <div ref={carouselRef} className="flex overflow-x-auto gap-4 md:gap-8 px-8 md:px-12 no-scrollbar snap-x snap-mandatory items-center min-h-[400px] md:min-h-[500px]">
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
                  isSelected ? "scale-100 w-64 md:w-80" : "scale-75 w-48 md:w-56 opacity-35"
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

                  <div className={cn("mt-2 text-center space-y-3 md:space-y-2 transition-all", isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <div className="space-y-1 w-full px-2">
                      <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80" style={{ fontFamily: "'Poppins', sans-serif" }}>{meta.biome}</p>
                      <h3 className="text-3xl sm:text-4xl md:text-[3rem] font-bytebounce text-white leading-none break-words" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>{subject}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3 md:w-4 md:h-4", i < meta.difficulty ? "text-primary fill-primary" : "text-white/30")} />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-background/10 border-primary/40 text-white font-bold px-2 md:px-3 py-1 flex items-center gap-1 text-[8px] md:text-[10px]">
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

      <div className="px-6 md:px-8 mt-6 md:mt-10 relative z-20">
        <div className="flex justify-center w-full mt-4">
          <button
            onClick={() => {
              setSetupStep('mode');
              setModeSelectDialogOpen(true);
            }}
            disabled={isLoading}
            className="relative w-full max-w-md md:max-w-2xl h-24 md:h-36 group hover:scale-105 active:scale-95 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
          >
            <Image
              src="/ui/btn-enterArena.png"
              alt="Enter Battle Arena"
              fill
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center pb-2">
              {isLoading && (
                <Loader2 className="w-8 h-8 animate-spin text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mode Selection Dialog */}
      <Dialog open={modeSelectDialogOpen} onOpenChange={setModeSelectDialogOpen}>
        <DialogContent container={fullscreenRef.current} className="sm:max-w-3xl bg-transparent border-none shadow-none p-0 flex justify-center items-center">
          <DialogTitle className="sr-only">Select a session mode</DialogTitle>
          <div className="relative w-[800px] max-w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
            <Image
              src="/ui/modal-bg.png"
              alt="Select Mode Background"
              fill
              className="object-contain"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
            />

            {/* Custom Pixelated Close Button */}
            <button
              onClick={() => setModeSelectDialogOpen(false)}
              className="absolute top-[15.5%] right-[2%] z-50 flex items-center justify-center transition-all cursor-pointer group active:translate-y-0.5"
            >
              <span
                className="font-bytebounce text-white/90 group-hover:text-red-400 transition-colors text-2xl md:text-5xl leading-none"
                style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000' }}
              >
                X
              </span>
            </button>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-[14%] px-[4.5%] pb-[5%]">
              <div className="flex justify-center items-center gap-2 md:gap-3 w-full h-full">

                {setupStep === 'mode' ? (
                  <>
                    {/* Learning Mode Button */}
                    <button
                      onClick={() => { setQuizMode('learning'); setSetupStep('details'); setMobileModalStep('info'); }}
                      className="relative flex-1 h-full max-h-[80%] group hover:scale-105 active:scale-95 hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Image src="/ui/btn-learning.png" alt="Learning Mode" fill className="object-contain" style={{ imageRendering: 'pixelated' }} unoptimized />
                      <div className="absolute inset-x-0 bottom-[22%] flex items-center justify-center">
                        <span
                          className="font-bytebounce text-white text-2xl md:text-[2.2rem] leading-[0.75] text-center"
                          style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000' }}
                        >
                          LEARNING<br />MODE
                        </span>
                      </div>
                    </button>

                    {/* Test Mode Button */}
                    <button
                      onClick={() => { setQuizMode('test'); setSetupStep('details'); setMobileModalStep('info'); }}
                      className="relative flex-1 h-full max-h-[80%] group hover:scale-105 active:scale-95 hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Image src="/ui/btn-test.png" alt="Test Mode" fill className="object-contain" style={{ imageRendering: 'pixelated' }} unoptimized />
                      <div className="absolute inset-x-0 bottom-[22%] flex items-center justify-center">
                        <span
                          className="font-bytebounce text-white text-2xl md:text-[2.2rem] leading-[0.75] text-center"
                          style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000' }}
                        >
                          TEST<br />MODE
                        </span>
                      </div>
                    </button>

                    {/* Boss Battle Button */}
                    <button
                      onClick={() => { setQuizMode('boss-battle'); setSetupStep('details'); setMobileModalStep('info'); }}
                      className="relative flex-1 h-full max-h-[80%] group hover:scale-105 active:scale-95 hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Image src="/ui/btn-boss.png" alt="Boss Battle" fill className="object-contain" style={{ imageRendering: 'pixelated' }} unoptimized />
                      <div className="absolute inset-x-0 bottom-[22%] flex items-center justify-center">
                        <span
                          className="font-bytebounce text-white text-2xl md:text-[2.2rem] leading-[0.75] text-center"
                          style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000' }}
                        >
                          BOSS<br />BATTLE
                        </span>
                      </div>
                    </button>
                  </>
                ) : setupStep === 'details' ? (
                  <div className="flex flex-col w-full h-full bg-black/60 rounded-xl p-2 min-[375px]:p-3 md:p-6 overflow-hidden no-scrollbar border border-white/10 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 relative">
                    
                    {/* INFO SECTION */}
                    <div className={cn("flex-1 flex flex-col relative", mobileModalStep === 'action' ? "hidden md:flex" : "flex")}>
                      {quizMode === 'learning' && (
                      <div className="flex-1 flex flex-col space-y-1 sm:space-y-2 md:space-y-5 overflow-hidden">
                        <div className="text-center space-y-0.5 sm:space-y-1">
                          <h3 className="font-bytebounce text-primary text-3xl md:text-5xl tracking-wide" style={{ textShadow: '2px 2px 0 #000' }}>Intel Gathering</h3>
                          <p className="text-white/90 text-[9px] min-[375px]:text-[11px] sm:text-xs md:text-sm max-w-lg mx-auto font-bold leading-tight min-[375px]:leading-snug sm:leading-relaxed">
                            Hone your skills in a low-pressure environment. The AI Tutor provides immediate rationale after every answer. Master the basics before facing the real challenge.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 min-[375px]:flex min-[375px]:flex-row min-[375px]:flex-wrap min-[375px]:justify-center sm:grid sm:grid-cols-3 gap-1 min-[375px]:gap-1.5 md:gap-4 max-w-2xl mx-auto w-full">
                          <div className="bg-white/5 border border-white/10 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5 sm:gap-2">
                            <Zap className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-6 md:h-6 text-yellow-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-bold text-white tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Immediate Feedback</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5 sm:gap-2">
                            <BrainCircuit className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-6 md:h-6 text-blue-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-bold text-white tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">AI Tutor Analysis</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5 sm:gap-2">
                            <Target className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-6 md:h-6 text-green-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-bold text-white tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Precision Training</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {quizMode === 'test' && (
                      <div className="flex-1 flex flex-col space-y-1 sm:space-y-2 md:space-y-5 overflow-hidden">
                        <div className="text-center space-y-0.5 sm:space-y-1">
                          <h3 className="font-bytebounce text-destructive text-3xl md:text-5xl tracking-wide" style={{ textShadow: '2px 2px 0 #000' }}>Combat Simulation</h3>
                          <p className="text-white/90 text-[9px] min-[375px]:text-[11px] sm:text-xs md:text-sm max-w-lg mx-auto font-bold leading-tight min-[375px]:leading-snug sm:leading-relaxed">
                            A grueling test of endurance. No immediate feedback, no second chances. Only your final score matters.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 min-[375px]:flex min-[375px]:flex-row min-[375px]:flex-wrap min-[375px]:justify-center sm:grid sm:grid-cols-3 gap-1 min-[375px]:gap-1.5 md:gap-4 max-w-2xl mx-auto w-full">
                          <div className="bg-white/5 border border-white/10 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5 sm:gap-2">
                            <Clock className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-6 md:h-6 text-orange-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-bold text-white tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Continuous Flow</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5 sm:gap-2">
                            <Trophy className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-6 md:h-6 text-yellow-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-bold text-white tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Graded Assessment</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5 sm:gap-2">
                            <Activity className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-6 md:h-6 text-red-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-bold text-white tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Adaptive Difficulty</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {quizMode === 'boss-battle' && (
                      <div className="flex-1 flex flex-col space-y-1 sm:space-y-2 md:space-y-4 overflow-hidden">
                        <div className="text-center space-y-0.5 sm:space-y-2">
                          <h3 className="font-bytebounce text-purple-400 text-3xl md:text-4xl tracking-wide" style={{ textShadow: '2px 2px 0 #000' }}>Ultimate Challenge</h3>
                          <p className="text-white/90 text-[9px] min-[375px]:text-[11px] sm:text-xs max-w-lg mx-auto font-bold leading-tight min-[375px]:leading-snug sm:leading-relaxed">
                            Face off against the ultimate exam boss in a turn-based RPG battle! Answer correctly to deal damage, but beware of the boss's deadly mechanics. Do you have what it takes to survive?
                          </p>
                        </div>
                        <div className="grid grid-cols-3 min-[375px]:flex min-[375px]:flex-row min-[375px]:flex-wrap min-[375px]:justify-center sm:grid sm:grid-cols-3 gap-1 min-[375px]:gap-1.5 md:gap-3 max-w-2xl mx-auto w-full">
                          <div className="bg-purple-900/20 border border-purple-500/30 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5">
                            <ShieldAlert className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-5 md:h-5 text-blue-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-black text-blue-300 tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Shield Phase</p>
                            <p className="hidden sm:block text-[9px] text-white/70 leading-tight">Boss casts a shield every 4 turns. Only 'Heavy Attacks' can break it.</p>
                          </div>
                          <div className="bg-purple-900/20 border border-purple-500/30 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5">
                            <Biohazard className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-5 md:h-5 text-green-400 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-black text-green-300 tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Poison</p>
                            <p className="hidden sm:block text-[9px] text-white/70 leading-tight">25% chance to be poisoned on a wrong answer. Use 'Defend' to cure it.</p>
                          </div>
                          <div className="bg-purple-900/20 border border-purple-500/30 rounded-full sm:rounded-xl px-1 min-[375px]:px-2.5 py-1 sm:p-3 flex items-center sm:flex-col justify-center text-center gap-0.5 min-[375px]:gap-1.5">
                            <Flame className="w-2.5 h-2.5 min-[375px]:w-3.5 min-[375px]:h-3.5 md:w-5 md:h-5 text-red-500 shrink-0" />
                            <p className="text-[5.5px] min-[375px]:text-[8px] md:text-[10px] uppercase font-black text-red-400 tracking-tighter min-[375px]:tracking-wider whitespace-nowrap">Enrage</p>
                            <p className="hidden sm:block text-[9px] text-white/70 leading-tight">When the boss drops below 20% HP, it heals every turn. Finish it quickly!</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile Back to Modes */}
                    {mobileModalStep === 'info' && (
                      <div className="md:hidden mt-auto pt-2 pb-1 w-full flex justify-center">
                        <button 
                          onClick={() => setSetupStep('mode')} 
                          className="text-white/50 hover:text-white font-bytebounce text-xs min-[375px]:text-sm uppercase tracking-widest transition-colors"
                        >
                          &larr; Back to Modes
                        </button>
                      </div>
                    )}

                    {/* Mobile Next Arrow */}
                    {mobileModalStep === 'info' && (
                      <button 
                        onClick={() => setMobileModalStep('action')}
                        className="md:hidden absolute right-1 bottom-1 bg-white/10 hover:bg-white/20 p-1.5 rounded-full backdrop-blur-md border border-white/20 z-10 animate-pulse"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>

                  {/* ACTION SECTION */}
                  <div className={cn("mt-auto pt-2 md:pt-6 w-full max-w-2xl mx-auto border-t md:border-white/10 flex-col items-center gap-2 md:gap-4 shrink-0 relative", mobileModalStep === 'info' ? "hidden md:flex" : "flex", mobileModalStep === 'action' ? "border-transparent h-full justify-center" : "border-white/10")}>
                      {/* Mobile Back Arrow */}
                      {mobileModalStep === 'action' && (
                        <button 
                          onClick={() => setMobileModalStep('info')}
                          className="md:hidden absolute left-1 bottom-1 bg-white/10 hover:bg-white/20 p-1.5 rounded-full backdrop-blur-md border border-white/20 z-10"
                        >
                          <ChevronLeft className="w-4 h-4 text-white" />
                        </button>
                      )}
                      {quizMode !== 'boss-battle' ? (
                        <>
                          <h4 className="font-bytebounce text-white/80 text-xl tracking-widest">Select Question Limit</h4>
                          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 w-full">
                            {quizMode === 'learning' ? (
                              [10, 20, 30, 40, 50].map((num) => (
                                <Button key={num} onClick={() => startQuest(num)} className="h-8 md:h-12 text-xs md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-primary hover:bg-primary/90 hover:-translate-y-0.5 transition-transform flex-1 min-w-[100px]">
                                  {num} Questions
                                </Button>
                              ))
                            ) : (
                              <>
                                <Button onClick={() => startQuest(20)} className="flex-1 min-w-[100px] h-10 md:h-12 text-sm md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 transition-transform">
                                  Quick (20)
                                </Button>
                                <Button onClick={() => startQuest(50)} className="flex-1 min-w-[100px] h-10 md:h-12 text-sm md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-yellow-500 hover:bg-yellow-600 hover:-translate-y-0.5 transition-transform">
                                  Standard (50)
                                </Button>
                                <Button onClick={() => startQuest(100)} className="flex-1 min-w-[100px] h-10 md:h-12 text-sm md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-red-500 hover:bg-red-600 hover:-translate-y-0.5 transition-transform">
                                  Full (100)
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bytebounce text-purple-300 text-xl tracking-widest text-center">Select Boss Difficulty</h4>
                          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 w-full">
                            <Button onClick={() => startQuest(999, 'EASY')} className="flex-1 min-w-[90px] h-10 md:h-12 text-sm md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 transition-transform">
                              Easy
                            </Button>
                            <Button onClick={() => startQuest(999, 'MEDIUM')} className="flex-1 min-w-[90px] h-10 md:h-12 text-sm md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-yellow-500 hover:bg-yellow-600 hover:-translate-y-0.5 transition-transform">
                              Medium
                            </Button>
                            <Button onClick={() => startQuest(999, 'HARD')} className="flex-1 min-w-[90px] h-10 md:h-12 text-sm md:text-lg font-bytebounce border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-red-500 hover:bg-red-600 hover:-translate-y-0.5 transition-transform">
                              Hard
                            </Button>
                          </div>
                        </>
                      )}
                      <Button variant="ghost" onClick={() => setSetupStep('mode')} className="hidden md:flex text-white/60 hover:text-white hover:bg-transparent h-8 text-xs font-bold uppercase tracking-wider">
                        &larr; Back to Modes
                      </Button>
                    </div>
                  </div>
                ) : null}

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
