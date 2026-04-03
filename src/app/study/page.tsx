
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
  Calendar as CalendarIcon,
  Edit2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MT_CURRICULUM = [
  {
    id: "clinical-chemistry",
    title: "Clinical Chemistry",
    icon: FlaskConical,
    scores: [85, 78, 92, 60],
    targetDate: "Mar 15, 2025",
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
    targetDate: "Apr 05, 2025",
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
    targetDate: "Apr 30, 2025",
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
    targetDate: "May 10, 2025",
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
    targetDate: "May 25, 2025",
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
    targetDate: "Jun 15, 2025",
    lessons: [
      { id: "hp1", title: "Tissue Fixation & Processing", duration: "50m", status: "completed" },
      { id: "hp2", title: "Staining Techniques & Microtomy", duration: "70m", status: "not-started" },
      { id: "law1", title: "RA 5527: Phil MedTech Act of 1969", duration: "45m", status: "not-started" }
    ]
  }
];

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState(MT_CURRICULUM[0]);

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
            <div className="flex items-center gap-2">
              <Link href="/onboarding">
                <Button variant="outline" size="sm" className="rounded-xl border-primary text-primary font-bold">
                  <Edit2 className="w-3 h-3 mr-2" /> Edit Global Schedule
                </Button>
              </Link>
            </div>
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
        <aside className="lg:col-span-4 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Laboratory Disciplines</h2>
          <div className="grid grid-cols-1 gap-3">
            {MT_CURRICULUM.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory.id === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 rounded-3xl transition-all text-left border-2",
                    isActive 
                      ? "bg-white border-primary shadow-xl" 
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
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Target: {cat.targetDate}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-slate-50 border-2 border-slate-100 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="font-headline font-black text-xl lg:text-2xl text-slate-900 uppercase">
                    {selectedCategory.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                      Completion Target: {selectedCategory.targetDate}
                    </span>
                  </div>
                </div>
                <Link href="/onboarding">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={45} className="h-2.5 bg-slate-200" />
            </CardContent>
          </Card>

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
                        <h4 className="font-bold text-sm lg:text-base text-slate-900 truncate">{lesson.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {lesson.duration} Intel</span>
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
        </section>
      </main>
    </div>
  );
}
