
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
  AlertCircle,
  Zap,
  Sparkles,
  BrainCircuit
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
    intel: "Focus on metabolic pathways and enzymatic markers. High-yield: Jaffe reaction mechanics and Glucose-6-Phosphate Dehydrogenase deficiency impacts.",
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
    intel: "Master the granulocytic series. Critical: Differential diagnosis of anemias using MCV/MCHC and identifying abnormal RBC morphologies.",
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
    intel: "Invisible dangers. Prioritize biochemical test reactions for Enterobacteriaceae and the identification of Gram-positive cocci clusters.",
    lessons: [
      { id: "mic1", title: "Bacteriology: Gram Positives", duration: "65m", status: "completed" },
      { id: "mic2", title: "Enterobacteriaceae & Non-fermenters", duration: "90m", status: "not-started" },
      { id: "mic3", title: "Mycology & Virology Overview", duration: "40m", status: "not-started" }
    ]
  },
  {
    id: "immunohematology",
    title: "Immunohematology",
    icon: Stethoscope,
    scores: [82, 75, 88],
    intel: "The Serum Sea. Deep dive into ABO/Rh systems and the Coombs test (Direct vs Indirect) for identifying hemolytic transfusion reactions.",
    lessons: [
      { id: "bb1", title: "ABO & Rh Blood Group Systems", duration: "55m", status: "completed" },
      { id: "bb2", title: "Compatibility Testing & Crossmatching", duration: "45m", status: "completed" },
      { id: "bb3", title: "Blood Component Therapy", duration: "50m", status: "not-started" }
    ]
  },
  {
    id: "clinical-microscopy",
    title: "Clinical Microscopy",
    icon: FlaskConical,
    scores: [72, 68, 75],
    intel: "Microscopic truths. Focus on sediment identification (Casts, Crystals) and the physical-chemical correlation in routine urinalysis.",
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
    intel: "Ethics and Tissues. Memorize RA 5527 key sections and the sequential steps of tissue processing (Fixation to Mounting).",
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
    <div className="min-h-full pb-20 lg:pb-12 bg-white">
      <header className="bg-white border-b px-6 py-8 lg:py-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-black font-headline text-slate-900 tracking-tight leading-none uppercase">
                Study <span className="text-primary">Curriculum</span>
              </h1>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                Intel Gathering & Concept Mastery
              </p>
            </div>
            <Badge variant="outline" className="font-black border-primary text-primary px-3 py-1 text-[10px] uppercase bg-primary/5">
              Aspirant Mode: Level 24
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search concepts, protocols, or RA sections..." 
              className="pl-12 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl focus-visible:ring-primary/20 text-sm font-medium" 
            />
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* Navigation Sidebar (Stacked on mobile/tablet) */}
        <aside className="lg:col-span-4 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Laboratory Disciplines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
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
                    "w-full flex items-center gap-4 p-5 rounded-3xl transition-all text-left border-2",
                    isActive 
                      ? "bg-white border-primary shadow-xl lg:translate-x-2" 
                      : "hover:bg-slate-50 border-slate-100 bg-white"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl shrink-0 transition-colors", 
                    isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-black text-sm uppercase tracking-tight truncate", 
                      isActive ? "text-primary" : "text-slate-900"
                    )}>
                      {cat.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                         {completedCount}/{cat.lessons.length} Modules Finished
                       </span>
                       {catMastered && (
                         <Badge className="bg-accent text-white border-none text-[8px] h-3.5 px-1.5 font-black uppercase">
                           Mastery Verified
                         </Badge>
                       )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Mastery Overview */}
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-slate-50 border-2 border-slate-100">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="font-headline font-black text-xl lg:text-2xl text-slate-900 uppercase">
                      {selectedCategory.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Technical Readiness Analytics
                    </CardDescription>
                  </div>
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm">
                    {isMastered ? <CheckCircle2 className="w-6 h-6 text-accent" /> : <AlertCircle className="w-6 h-6 text-primary" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end gap-3">
                   <span className="text-5xl font-black font-headline text-primary leading-none">{proficiency}%</span>
                   <div className="flex flex-col pb-1">
                     <span className="text-[10px] font-black uppercase text-slate-400 leading-none">Proficiency</span>
                     <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[8px] h-4 mt-1 font-black uppercase">
                       {status}
                     </Badge>
                   </div>
                </div>
                <div className="space-y-2">
                  <Progress value={proficiency} className="h-2.5 bg-slate-200" />
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                    <span>Initiate (0%)</span>
                    <span>Aspirant (75%)</span>
                    <span>Master (100%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* High-Yield AI Intel */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-primary text-white p-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline font-black text-lg uppercase tracking-tight">High-Yield Intel</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed italic opacity-90">
                  "{selectedCategory.intel}"
                </p>
                <div className="pt-2">
                   <Badge className="bg-white text-primary border-none font-black text-[9px] uppercase px-3">
                     AI Strategic Insights
                   </Badge>
                </div>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            </Card>
          </div>

          {/* Module List */}
          <Card className="border-none shadow-sm rounded-[2rem] bg-white border-2 border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-6 lg:p-8">
              <CardTitle className="font-headline text-lg font-black uppercase tracking-tight flex items-center gap-3">
                <BookMarked className="w-5 h-5 text-primary" />
                Intel Expedition Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-slate-100">
                  {selectedCategory.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-6 flex items-center gap-5 hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-sm border-2 transition-all",
                        lesson.status === 'completed' 
                          ? "bg-accent/10 border-accent/20 text-accent" 
                          : "bg-white border-slate-100 text-slate-300 group-hover:border-primary/20"
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-sm lg:text-base text-slate-900 truncate">{lesson.title}</h4>
                          {lesson.status === 'completed' && (
                            <Badge className="bg-accent text-white h-4 text-[8px] font-black uppercase px-2">Verified</Badge>
                          )}
                          {lesson.status === 'in-progress' && (
                            <Badge variant="outline" className="border-primary/20 text-primary h-4 text-[8px] font-black uppercase px-2 bg-primary/5">Active</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {lesson.duration} Intel</span>
                          <span className="hidden sm:inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Conceptual Core</span>
                        </div>
                      </div>
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <PlayCircle className="h-6 w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 text-white p-8 lg:p-10 overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="p-5 bg-primary rounded-3xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-headline font-black text-2xl lg:text-3xl uppercase tracking-tight">Deploy to Arena</h3>
                <p className="text-slate-400 text-sm font-medium max-w-md">
                  Validated your {selectedCategory.title} intel? It's time to face adaptive situational challenges in the Quest Arena.
                </p>
              </div>
              <Link href="/quest" className="w-full md:ml-auto md:w-auto">
                <button className="w-full bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  Initiate Quest
                </button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          </Card>
        </section>
      </main>
    </div>
  );
}

