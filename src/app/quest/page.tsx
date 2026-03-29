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
  Cloud,
  Wind,
  Target,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { QuizInterface, Question } from '@/components/quiz/QuizInterface';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';
import { generateMockExamQuestions } from '@/ai/flows/generate-mock-exam-questions';
import { provideExamFeedback } from '@/ai/flows/provide-exam-feedback';
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
  const [score, setScore] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_AREAS[0]);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // RPG States
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isAnimating, setIsAnimating] = useState<"player" | "enemy" | null>(null);

  const startQuest = async () => {
    setIsLoading(true);
    setUserAnswers([]);
    try {
      const result = await generateMockExamQuestions({
        subjectArea: selectedSubject,
        numberOfQuestions: 5
      });
      // @ts-ignore
      setQuestions(result.questions);
      setPlayerHealth(100);
      setEnemyHealth(100);
      setIsStarted(true);
      setIsFinished(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Island Storm Detected",
        description: "The AI spirits are busy. Try landing in another archipelago in a few seconds.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (isCorrect: boolean, index: number, selectedLetter: string) => {
    const damage = 100 / (questions.length || 5);
    
    // Track user answer for the summary
    setUserAnswers(prev => [...prev, { questionIndex: index, selectedLetter, isCorrect }]);

    // RPG Visual Effects
    if (isCorrect) {
      setIsAnimating("enemy");
      setEnemyHealth(prev => Math.max(0, prev - damage));
    } else {
      setIsAnimating("player");
      setPlayerHealth(prev => Math.max(0, prev - damage));
    }
    
    // AI Tutor Logic: Fetch explanation if not present (Real-time Adaptive Feedback)
    if (!questions[index].explanation) {
      try {
        const feedback = await provideExamFeedback({
          question: questions[index].question,
          correctAnswer: questions[index].correctAnswer,
          userAnswer: selectedLetter
        });
        
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          explanation: feedback.explanation
        };
        setQuestions(updatedQuestions);
      } catch (e) {
        // Fallback or silent fail for explanation
      }
    }

    setTimeout(() => setIsAnimating(null), 500);
  };

  const handleFinish = (finalScore: number) => {
    setScore(finalScore);
    setIsFinished(true);
  };

  const subjectMeta = SUBJECT_AREAS.includes(selectedSubject) ? SUBJECT_METADATA[selectedSubject] : SUBJECT_METADATA[SUBJECT_AREAS[0]];
  const EnemyIcon = subjectMeta.icon;

  if (isFinished) {
    const isVictor = enemyHealth <= 0 || (score > questions.length / 2);
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in zoom-in duration-500">
        <header className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-2xl mx-auto">
              {isVictor ? <Swords className="w-16 h-16 text-primary" /> : <Skull className="w-16 h-16 text-muted-foreground" />}
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black font-headline text-primary tracking-tighter">
              {isVictor ? "BATTLE VICTORY" : "QUEST DEFEAT"}
            </h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
              Expedition Result for {selectedSubject}
            </p>
          </div>

          <div className="flex justify-center items-center gap-12 py-4">
             <div className="text-center">
               <div className="text-4xl font-black font-headline text-primary">{score}/{questions.length}</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Accuracy</div>
             </div>
             <div className="h-12 w-px bg-border" />
             <div className="text-center">
               <div className="text-4xl font-black font-headline text-accent">+{score * XP_PER_QUESTION}</div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">XP Earned</div>
             </div>
          </div>
        </header>

        {/* AI Tutor Summary Section */}
        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-muted/30 border-b p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Battle Log & AI Rationale
                </CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Analyzing your situational decision-making patterns
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/20 text-primary bg-white px-4 py-1">
                Lvl 24 Aspirant
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {questions.map((q, idx) => {
                const userAns = userAnswers.find(ua => ua.questionIndex === idx);
                const isCorrect = userAns?.isCorrect;
                
                return (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border-b last:border-0 px-4">
                    <AccordionTrigger className="hover:no-underline py-6 px-4">
                      <div className="flex items-start text-left gap-6">
                        <div className="mt-1">
                          {isCorrect ? (
                            <div className="bg-green-100 p-2 rounded-xl"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                          ) : (
                            <div className="bg-red-100 p-2 rounded-xl"><XCircle className="w-5 h-5 text-red-600" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-snug line-clamp-2 max-w-xl">{q.question}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={isCorrect ? "secondary" : "destructive"} className="text-[9px] h-4 font-black uppercase tracking-tighter">
                              {isCorrect ? "Mastered" : "Review Required"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2">
                      <div className="bg-muted/30 rounded-3xl p-8 space-y-6 border border-primary/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-5 bg-white rounded-2xl border shadow-sm">
                            <p className="text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest">Your Selection</p>
                            <p className={cn("font-bold text-base", isCorrect ? "text-green-600" : "text-red-600")}>
                              Option {userAns?.selectedLetter || 'None'}
                            </p>
                          </div>
                          <div className="p-5 bg-white rounded-2xl border shadow-sm">
                            <p className="text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest">Correct Path</p>
                            <p className="font-bold text-base text-primary">
                              Option {q.correctAnswer}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-black font-headline text-primary flex items-center gap-2 uppercase text-xs tracking-widest">
                            <Sparkles className="w-4 h-4" />
                            AI LOGICAL ANALYSIS
                          </h4>
                          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-dashed border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-12 h-12 text-primary" /></div>
                            <p className="text-sm leading-relaxed text-muted-foreground italic relative z-10">
                              {q.explanation || "AI analysis processing..."}
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
            className="h-16 px-10 rounded-2xl text-lg font-black shadow-xl hover:scale-105 transition-transform"
          >
            Return to Archipelago
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold border-2">
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
        <header className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-50">
          <Button variant="ghost" size="icon" onClick={() => setIsStarted(false)} className="rounded-full">
            <ChevronLeft className="h-6 w-6 text-primary" />
          </Button>
          <div className="text-center">
            <h1 className="text-primary font-black font-headline text-lg uppercase leading-none">{selectedSubject}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Adaptive Quest Arena
            </p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col">
          <div className="relative h-[35vh] bg-gradient-to-b from-primary to-black overflow-hidden border-b">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-[10%] animate-pulse"><Cloud className="w-20 h-20 text-white" /></div>
              <div className="absolute top-20 right-[20%] animate-pulse delay-700"><Cloud className="w-24 h-24 text-white" /></div>
            </div>
            
            <div className={cn(
              "absolute top-8 right-8 transition-all duration-300",
              isAnimating === "enemy" && "animate-shake scale-110"
            )}>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl mb-2 min-w-[160px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-white uppercase">{subjectMeta.enemy}</span>
                  <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-black">BOSS</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${enemyHealth}%` }} />
                </div>
              </div>
              <div className="flex justify-end pr-4">
                <div className="w-28 h-28 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                   <EnemyIcon className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10" />
                </div>
              </div>
            </div>

            <div className={cn(
              "absolute bottom-6 left-8 transition-all duration-300",
              isAnimating === "player" && "animate-shake scale-110"
            )}>
              <div className="w-24 h-24 mb-3 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full animate-pulse" />
                 <div className="w-20 h-20 bg-white rounded-2xl rotate-3 flex items-center justify-center border-4 border-primary shadow-2xl relative z-10">
                   <Shield className="w-10 h-10 text-primary" />
                 </div>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl min-w-[160px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-white uppercase">Aspirant Alex</span>
                  <span className="text-[8px] bg-white text-primary px-1.5 py-0.5 rounded font-black">LVL 24</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${playerHealth}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white">
             <QuizInterface 
               questions={questions} 
               onFinish={handleFinish} 
               onAnswer={(correct, idx, letter) => handleAnswer(correct, idx, letter)}
               isLoading={isLoading} 
             />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col pb-12 bg-white overflow-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] animate-cloud-slow opacity-20"><Cloud className="w-32 h-32 text-slate-200" /></div>
        <div className="absolute top-[40%] right-[10%] animate-cloud-fast opacity-10"><Cloud className="w-40 h-40 text-slate-300" /></div>
        <div className="absolute bottom-[20%] left-[15%] animate-cloud-slow opacity-15"><Wind className="w-24 h-24 text-slate-100" /></div>
      </div>

      <header className="px-8 pt-12 pb-2 space-y-1 relative z-10">
        <h1 className="text-5xl font-black font-headline leading-tight tracking-tight text-slate-900">
          Select Your <br />
          <span className="text-primary">Quest Region</span>
        </h1>
        <p className="text-s font-bold text-slate-500 uppercase tracking-[0.15em]">
          Master Each Laboratory Science
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center py-10 relative z-10 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 px-12 no-scrollbar snap-x snap-mandatory items-center min-h-[550px] scroll-smooth"
        >
          {SUBJECT_AREAS.map((subject) => {
            const meta = SUBJECT_METADATA[subject];
            const isSelected = selectedSubject === subject;
            const Icon = meta.icon;

            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={cn(
                  "flex-shrink-0 snap-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform outline-none flex flex-col items-center",
                  isSelected ? "scale-100 w-80" : "scale-75 w-56 opacity-30 grayscale blur-[2px]"
                )}
              >
                <div className="relative w-full flex flex-col items-center">
                  <div className={cn(
                    "relative w-full aspect-square transition-all duration-700",
                    isSelected ? "animate-float drop-shadow-[0_30px_35px_rgba(0,0,0,0.15)]" : "drop-shadow-sm"
                  )}>
                    {meta.imageUrl ? (
                      <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-500">
                        <Image 
                          src={meta.imageUrl} 
                          alt={subject}
                          fill
                          className="object-contain"
                          priority={isSelected}
                          data-ai-hint="floating island"
                        />
                      </div>
                    ) : (
                      <div className={cn(
                        "w-full h-full rounded-[3rem] p-8 flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden group border-4 border-white/50",
                        meta.color
                      )}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/30">
                            <Icon className="w-12 h-12" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={cn(
                      "absolute -bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-primary/5 blur-2xl rounded-[100%] transition-all duration-700",
                      isSelected ? "scale-125 opacity-40" : "scale-100 opacity-20"
                    )} />
                  </div>

                  <div className={cn(
                    "mt-12 text-center space-y-4 transition-all duration-700",
                    isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}>
                     <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{meta.biome}</p>
                       <h3 className="text-3xl font-black font-headline text-slate-900 tracking-tighter">{subject}</h3>
                     </div>

                     <div className="flex flex-col items-center gap-3">
                       <div className="flex items-center gap-1">
                         {[...Array(5)].map((_, i) => (
                           <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4",
                              i < meta.difficulty ? "text-primary fill-primary" : "text-slate-200"
                            )} 
                           />
                         ))}
                       </div>
                       
                       <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed italic">
                         "{meta.description}"
                       </p>

                       <div className="flex gap-2">
                         <Badge variant="outline" className="bg-white border-primary/20 text-primary font-bold px-3 py-1 flex items-center gap-1">
                           <Target className="w-3 h-3" /> {meta.enemy}
                         </Badge>
                         <Badge className="bg-primary text-white font-bold px-3 py-1 flex items-center gap-1">
                           <Sparkles className="w-3 h-3" /> AI ADAPTIVE
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

      <div className="px-8 mt-4 relative z-20">
        <Button 
          size="lg" 
          onClick={startQuest} 
          disabled={isLoading}
          className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 text-white flex items-center justify-center gap-4"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-white text-white" />}
          {isLoading ? "Generating Battle..." : "Enter Battle Arena"}
        </Button>
      </div>

      <style jsx global>{`
        @keyframes cloud-move {
          0% { transform: translateX(-20px); opacity: 0; }
          50% { transform: translateX(20px); opacity: 0.2; }
          100% { transform: translateX(-20px); opacity: 0; }
        }
        .animate-cloud-slow {
          animation: cloud-move 15s linear infinite;
        }
        .animate-cloud-fast {
          animation: cloud-move 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
