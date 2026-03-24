"use client";

import { useState, useRef } from 'react';
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
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { SUBJECT_AREAS, XP_PER_QUESTION } from '@/lib/game-logic';
import { STATIC_QUESTIONS } from '@/lib/static-questions';
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

  const subjectMeta = SUBJECT_AREAS.includes(selectedSubject) ? SUBJECT_METADATA[selectedSubject] : SUBJECT_METADATA[SUBJECT_AREAS[0]];
  const EnemyIcon = subjectMeta.icon;

  if (isFinished) {
    const isVictor = enemyHealth <= 0 || (score > questions.length / 2);
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-primary shadow-2xl mx-auto">
            {isVictor ? <Swords className="w-16 h-16 text-primary" /> : <Skull className="w-16 h-16 text-muted-foreground" />}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-bold font-headline text-primary">{isVictor ? "Victory!" : "Defeat..."}</h2>
          <p className="text-muted-foreground">You earned {score * XP_PER_QUESTION} XP towards your license.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={() => setIsStarted(false)} className="h-14 rounded-2xl text-lg font-bold">Return to Archipelago</Button>
          <Link href="/"><Button variant="ghost" className="font-bold text-primary">Back to Dashboard</Button></Link>
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
            <ChevronLeft className="h-6 w-6 text-primary" />
          </Button>
          <div className="text-center">
            <h1 className="text-primary font-black font-headline text-lg uppercase leading-none">{selectedSubject}</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {subjectMeta.biome}
            </p>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col">
          {/* RPG Battle Arena - Maroon Themed Sky */}
          <div className="relative h-[35vh] bg-gradient-to-b from-primary to-black overflow-hidden border-b">
            {/* Animated Sky Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-[10%] animate-pulse"><Cloud className="w-20 h-20 text-white" /></div>
              <div className="absolute top-20 right-[20%] animate-pulse delay-700"><Cloud className="w-24 h-24 text-white" /></div>
            </div>
            
            {/* Enemy Side */}
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

            {/* Player Side */}
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
               onAnswer={handleAnswer}
               isLoading={false} 
             />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col pb-12 bg-white overflow-hidden relative">
      {/* Dynamic Sky Background - White and Soft Gray */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] animate-cloud-slow opacity-20"><Cloud className="w-32 h-32 text-slate-200" /></div>
        <div className="absolute top-[40%] right-[10%] animate-cloud-fast opacity-10"><Cloud className="w-40 h-40 text-slate-300" /></div>
        <div className="absolute bottom-[20%] left-[15%] animate-cloud-slow opacity-15"><Wind className="w-24 h-24 text-slate-100" /></div>
      </div>

      <header className="px-8 pt-12 pb-2 space-y-1 relative z-10">
        <h1 className="text-4xl font-black font-headline leading-tight tracking-tight text-slate-900">
          Select Your <br />
          <span className="text-primary">Quest Region</span>
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">
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
                  {/* Floating Island Container */}
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
                    
                    {/* Shadow below */}
                    <div className={cn(
                      "absolute -bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-primary/5 blur-2xl rounded-[100%] transition-all duration-700",
                      isSelected ? "scale-125 opacity-40" : "scale-100 opacity-20"
                    )} />
                  </div>

                  {/* Island Stats & Details */}
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
                         <Badge className="bg-primary text-white font-bold px-3 py-1">
                           {STATIC_QUESTIONS[subject]?.length || 0} QUESTS
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
          className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 text-white flex items-center justify-center gap-4"
        >
          <Zap className="w-6 h-6 fill-white text-white" />
          Enter Battle Arena
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
