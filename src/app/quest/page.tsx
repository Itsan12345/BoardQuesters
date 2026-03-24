
"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, Shield, Skull, Zap, FlaskConical, Microscope, Database, Stethoscope, ShieldAlert, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';
import { STATIC_QUESTIONS } from '@/lib/static-questions';
import { cn } from '@/lib/utils';

const SUBJECT_METADATA: Record<string, { name: string; icon: any; color: string; enemy: string; imageUrl?: string }> = {
  "Clinical Chemistry": { 
    name: "Clinical Chemistry", 
    icon: FlaskConical, 
    color: "bg-blue-500", 
    enemy: "Hyperglycemic Specter",
    imageUrl: "/images/island1.png"
  },
  "Hematology": { name: "Hematology", icon: Microscope, color: "bg-red-500", enemy: "Sickle-Cell Reaper" },
  "Microbiology": { name: "Microbiology", icon: Database, color: "bg-green-500", enemy: "Biohazard Overlord" },
  "Immunohematology": { name: "Immunohematology", icon: Stethoscope, color: "bg-purple-500", enemy: "Anti-Serum Hydra" },
  "Clinical Microscopy": { name: "Clinical Microscopy", icon: FlaskConical, color: "bg-yellow-500", enemy: "Crystal Golem" },
  "Histopathology & MT Laws": { name: "MT Laws & Histopath", icon: ShieldAlert, color: "bg-orange-500", enemy: "Legal Beholder" }
};

export default function LearningQuest() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_AREAS[0]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // RPG States
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isAnimating, setIsAnimating] = useState<"player" | "enemy" | null>(null);

  const startQuest = () => {
    const subjectQuestions = STATIC_QUESTIONS[selectedSubject] || [];
    setQuestions(subjectQuestions);
    setPlayerHealth(100);
    setEnemyHealth(100);
    setIsStarted(true);
    setIsFinished(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const damage = 100 / (questions.length || 5);
    if (isCorrect) {
      setIsAnimating("enemy");
      setEnemyHealth(prev => Math.max(0, prev - damage));
    } else {
      setIsAnimating("player");
      setPlayerHealth(prev => Math.max(0, prev - damage));
    }
    setTimeout(() => setIsAnimating(null), 500);
  };

  const handleFinish = (finalScore: number) => {
    setScore(finalScore);
    setIsFinished(true);
  };

  const subjectMeta = SUBJECT_METADATA[selectedSubject];
  const EnemyIcon = subjectMeta.icon;

  if (isFinished) {
    const isVictor = enemyHealth <= 0 || (score > questions.length / 2);
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-2xl mx-auto">
            {isVictor ? <Swords className="w-16 h-16 text-primary" /> : <Skull className="w-16 h-16 text-muted-foreground" />}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-bold font-headline">{isVictor ? "Victory!" : "Defeat..."}</h2>
          <p className="text-muted-foreground">You earned {score * XP_PER_QUESTION} XP towards your license.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={() => setIsStarted(false)} className="h-14 rounded-2xl text-lg font-bold">Try Another Subject</Button>
          <Link href="/"><Button variant="ghost" className="font-bold">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  if (isStarted) {
    return (
      <div className="min-h-full flex flex-col">
        {/* Battle Header */}
        <header className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-50">
          <Button variant="ghost" size="icon" onClick={() => setIsStarted(false)} className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-primary font-black font-headline text-lg uppercase leading-none">{selectedSubject}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Quest Session
            </p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col">
          {/* RPG Battle Arena */}
          <div className="relative h-[30vh] bg-gradient-to-b from-blue-100 to-green-50 overflow-hidden border-b">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Enemy Side */}
            <div className={cn(
              "absolute top-8 right-8 transition-all duration-300",
              isAnimating === "enemy" && "animate-shake scale-110"
            )}>
              <div className="bg-white/90 backdrop-blur-sm border-2 border-black p-2 rounded-lg shadow-md mb-2 min-w-[140px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase">{subjectMeta.enemy}</span>
                  <span className="text-[8px] bg-black text-white px-1 rounded font-mono">Lv.70</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-black/20">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${enemyHealth}%` }} />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-24 h-24 flex items-center justify-center">
                   <EnemyIcon className="w-16 h-16 text-primary drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Player Side */}
            <div className={cn(
              "absolute bottom-4 left-8 transition-all duration-300",
              isAnimating === "player" && "animate-shake scale-110"
            )}>
              <div className="w-20 h-20 mb-2 flex items-center justify-center">
                 <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                   <Shield className="w-8 h-8 text-white" />
                 </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm border-2 border-black p-2 rounded-lg shadow-md min-w-[140px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase">Aspirant Alex</span>
                  <span className="text-[8px] bg-primary text-white px-1 rounded font-mono">Lv.24</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-black/20">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${playerHealth}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white">
             <QuizInterface 
               questions={questions} 
               onFinish={handleFinish} 
               onAnswer={handleAnswer}
               isLoading={false} 
             />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col pb-12">
      <header className="px-6 pt-12 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold font-headline leading-tight tracking-tight">
          Select Your<br />
          <span className="text-primary">Quest Region</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Master each laboratory science</p>
      </header>

      <div className="flex-1 flex flex-col justify-center overflow-hidden py-12">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto overflow-y-hidden gap-8 px-12 no-scrollbar snap-x snap-mandatory items-center"
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
                  "flex-shrink-0 snap-center transition-all duration-500 ease-out transform outline-none flex flex-col items-center",
                  isSelected ? "scale-110 w-64" : "scale-90 w-48 opacity-60 grayscale blur-[2px]"
                )}
              >
                <div className="relative w-full flex flex-col items-center justify-center">
                  {meta.imageUrl ? (
                    /* Floating Image Representation */
                    <div className={cn(
                      "relative w-full aspect-square transition-all duration-700",
                      isSelected ? "animate-bounce-slow drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]" : "drop-shadow-lg"
                    )}>
                      <Image 
                        src={meta.imageUrl} 
                        alt={subject}
                        fill
                        className="object-contain"
                        priority={isSelected}
                        data-ai-hint="floating island"
                      />
                      {/* Shadow below the floating element */}
                      <div className={cn(
                        "absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 blur-xl rounded-[100%] transition-transform duration-700",
                        isSelected ? "scale-110 opacity-40" : "scale-100 opacity-20"
                      )} />
                    </div>
                  ) : (
                    /* Standard Themed Card for regions without images */
                    <div className={cn(
                      "w-full aspect-[4/5] rounded-[2.5rem] p-6 flex flex-col items-center justify-between text-white shadow-2xl relative overflow-hidden group",
                      meta.color
                    )}>
                      <div className="mt-8 relative z-10">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/30">
                          <Icon className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="text-center z-10 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Region</p>
                        <h3 className="text-xl font-bold leading-tight font-headline drop-shadow-md">{subject}</h3>
                      </div>
                      <div className="mb-4 relative z-10">
                         <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                           {STATIC_QUESTIONS[subject]?.length || 0} Battles
                         </Badge>
                      </div>
                    </div>
                  )}

                  {/* Legend/Info for Floating Image Style */}
                  {meta.imageUrl && (
                    <div className="mt-2 text-center space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Region</p>
                       <h3 className="text-2xl font-black font-headline text-foreground">{subject}</h3>
                       <Badge variant="outline" className="border-primary/20 text-primary font-bold">
                         {STATIC_QUESTIONS[subject]?.length || 0} Missions
                       </Badge>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6">
        <Button 
          size="lg" 
          onClick={startQuest} 
          className="w-full h-16 rounded-2xl bg-primary text-xl font-black shadow-xl shadow-primary/20"
        >
          Enter Battle Arena
        </Button>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
