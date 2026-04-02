
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  BookMarked, 
  Clock, 
  PlayCircle,
  FlaskConical,
  Microscope,
  Database,
  Stethoscope,
  ShieldAlert,
  Search,
  Trophy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Mastery Helper Logic: average >= 75 and no score < 50
const calculateMasteryStatus = (scores: number[]) => {
  if (scores.length === 0) return { proficiency: 0, status: 'Not Started', isMastered: false };
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const min = Math.min(...scores);
  const isMastered = avg >= 75 && min >= 50;
  return { 
    proficiency: Math.round(avg), 
    isMastered, 
    status: isMastered ? 'Mastered' : 'In Training' 
  };
};

const MT_CURRICULUM = [
  {
    id: "clinical-chemistry",
    title: "Clinical Chemistry",
    icon: FlaskConical,
    scores: [85, 78, 92, 60],
    lessons: [
      { id: "cc1", title: "Carbohydrate Metabolism & Disorders", duration: "45m", status: "completed" },
      { id: "cc2", title: "Lipid Profile & Lipoproteins", duration: "60m", status: "in-progress" },
      { id: "cc3", title: "Renal Function Tests & NPNs", duration: "40m", status: "not-started" },
      { id: "cc4", title: "Enzymology & Cardiac Markers", duration: "55m", status: "not-started" }
    ]
  },
  {
    id: "hematology",
    title: "Hematology & Coagulation",
    icon: Microscope,
    scores: [70, 45, 80],
    lessons: [
      { id: "hem1", title: "RBC Morphology & Anemias", duration: "50m", status: "completed" },
      { id: "hem2", title: "WBC Disorders & Leukemias", duration: "75m", status: "not-started" },
      { id: "hem3", title: "Hemostasis & Platelet Function", duration: "45m", status: "not-started" }
    ]
  },
  {
    id: "microbiology",
    title: "Clinical Microbiology",
    icon: Database,
    scores: [45, 50],
    lessons: [
      { id: "mic1", title: "Bacteriology: Gram Positives", duration: "65m", status: "completed" },
      { id: "mic2", title: "Enterobacteriaceae & Non-fermenters", duration: "90m", status: "not-started" },
      { id: "mic3", title: "Mycology & Virology Overview", duration: "40m", status: "not-started" }
    ]
  },
  {
    id: "immunohematology",
    title: "Immunohematology (Blood Bank)",
    icon: Stethoscope,
    scores: [82, 75, 88],
    lessons: [
      { id: "bb1", title: "ABO & Rh Blood Group Systems", duration: "55m", status: "completed" },
      { id: "bb2", title: "Compatibility Testing & Crossmatching", duration: "45m", status: "completed" },
      { id: "bb3", title: "Blood Component Therapy & Transfusion", duration: "50m", status: "not-started" }
    ]
  },
  {
    id: "clinical-microscopy",
    title: "Clinical Microscopy",
    icon: FlaskConical,
    scores: [72, 68, 75],
    lessons: [
      { id: "cm1", title: "Routine Urinalysis: Physical & Chemical", duration: "40m", status: "completed" },
      { id: "cm2", title: "Microscopic Examination of Sediments", duration: "60m", status: "in-progress" },
      { id: "cm3", title: "CSF & Other Body Fluids Analysis", duration: "50m", status: "not-started" }
    ]
  },
  {
    id: "histopath-laws",
    title: "Histopathology & MT Laws",
    icon: ShieldAlert,
    scores: [58, 62],
    lessons: [
      { id: "hp1", title: "Tissue Fixation & Processing", duration: "50m", status: "completed" },
      { id: "hp2", title: "Staining Techniques & Microtomy", duration: "70m", status: "not-started" },
      { id: "law1", title: "RA 5527: Phil MedTech Act of 1969", duration: "45m", status: "not-started" }
    ]
  }
];

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState(MT_CURRICULUM[0]);
  const { proficiency, isMastered, status } = calculateMasteryStatus(selectedCategory.scores);

  return (
    <div className="min-h-full pb-12">
      <header className="bg-white border-b px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black font-headline text-primary uppercase tracking-tight">BoardQuest Curriculum</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-bold border-primary text-primary">Aspirant Mode</Badge>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search modules or protocols..." className="pl-10 h-12 bg-muted/50 border-none rounded-xl" />
        </div>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
        <aside className="md:col-span-4 space-y-4">
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Laboratory Disciplines</h2>
          <div className="space-y-2">
            {MT_CURRICULUM.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory.id === cat.id;
              const completedCount = cat.lessons.filter(l => l.status === 'completed').length;
              const { isMastered: catMastered } = calculateMasteryStatus(cat.scores);

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left border-2",
                    isActive ? "bg-white border-primary shadow-md translate-x-1" : "hover:bg-white/50 border-transparent"
                  )}
                >
                  <div className={cn("p-3 rounded-xl", isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-bold text-sm", isActive ? "text-primary" : "text-foreground")}>{cat.title}</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-bold text-muted-foreground uppercase">{completedCount}/{cat.lessons.length} Finished</span>
                       {catMastered && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[8px] h-3 px-1">Mastery Achieved</Badge>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="md:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl">{selectedCategory.title}</CardTitle>
                  <CardDescription>Targeting Board Mastery via Active Recall.</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-2">
                     <span className="text-3xl font-black text-primary">{proficiency}%</span>
                     {isMastered ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-orange-400" />}
                   </div>
                   <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest">{status}</Badge>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                  <span>Proficiency Metrics (Mastery Logic: Avg &ge; 75%, Min &ge; 50%)</span>
                  <span>{isMastered ? 'Mastered' : 'Deficit Identified'}</span>
                </div>
                <Progress value={proficiency} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {selectedCategory.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted font-bold text-muted-foreground text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{lesson.title}</h4>
                          {lesson.status === 'completed' && <Badge className="bg-accent h-4 text-[9px] uppercase">Finished</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.duration}</span>
                          <span className="uppercase tracking-wider text-[10px] font-bold">Concept Module</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                        <PlayCircle className="h-6 w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-primary text-white p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-lg">Mastery Checkpoint</h3>
                <p className="text-white/80 text-sm">Current {selectedCategory.title} logic is {status.toLowerCase()}.</p>
              </div>
              <Link href="/quest" className="ml-auto">
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                  Deploy to Quest Arena
                </button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
