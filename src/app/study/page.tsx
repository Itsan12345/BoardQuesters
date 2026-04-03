"use client";

import { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Clock, 
  PlayCircle,
  FlaskConical,
  Microscope,
  Database,
  Stethoscope,
  ShieldAlert,
  Search,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getStudyPlans, saveStudyPlan } from '@/app/actions/study-plan';
import { format, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const INITIAL_CURRICULUM = [
  {
    id: "clinical-chemistry",
    title: "Clinical Chemistry",
    icon: FlaskConical,
    lessons: [
      { id: "cc1", title: "Carbohydrate Metabolism & Disorders", duration: "45m", status: "completed" },
      { id: "cc2", title: "Lipid Profile & Lipoproteins", duration: "60m", status: "in-progress" },
      { id: "cc3", title: "Renal Function Tests & NPNs", duration: "40m", status: "not-started" }
    ]
  },
  {
    id: "hematology",
    title: "Hematology & Coagulation",
    icon: Microscope,
    lessons: [
      { id: "hem1", title: "RBC Morphology & Anemias", duration: "50m", status: "completed" },
      { id: "hem2", title: "WBC Disorders & Leukemias", duration: "75m", status: "not-started" }
    ]
  },
  {
    id: "microbiology",
    title: "Clinical Microbiology",
    icon: Database,
    lessons: [
      { id: "mic1", title: "Bacteriology: Gram Positives", duration: "65m", status: "completed" },
      { id: "mic2", title: "Enterobacteriaceae & Non-fermenters", duration: "90m", status: "not-started" }
    ]
  },
  {
    id: "immunohematology",
    title: "Immunohematology",
    icon: Stethoscope,
    lessons: [
      { id: "bb1", title: "ABO & Rh Blood Group Systems", duration: "55m", status: "completed" },
      { id: "bb2", title: "Blood Component Therapy", duration: "50m", status: "not-started" }
    ]
  },
  {
    id: "clinical-microscopy",
    title: "Clinical Microscopy",
    icon: FlaskConical,
    lessons: [
      { id: "cm1", title: "Routine Urinalysis: Physical & Chemical", duration: "40m", status: "completed" },
      { id: "cm2", title: "CSF & Other Body Fluids Analysis", duration: "50m", status: "not-started" }
    ]
  },
  {
    id: "histopathology-mt-laws",
    title: "Histopathology & MT Laws",
    icon: ShieldAlert,
    lessons: [
      { id: "hp1", title: "Tissue Fixation & Processing", duration: "50m", status: "completed" },
      { id: "law1", title: "RA 5527: Phil MedTech Act of 1969", duration: "45m", status: "not-started" }
    ]
  }
];

export default function StudyPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [curriculum, setCurriculum] = useState(INITIAL_CURRICULUM);
  const [selectedCategoryId, setSelectedCategoryId] = useState(INITIAL_CURRICULUM[0].id);
  const [targetDates, setTargetDates] = useState<Record<string, Date>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadPlans() {
      const plans = await getStudyPlans();
      const dates: Record<string, Date> = {};
      plans.forEach(p => {
        dates[p.subject] = new Date(p.targetDate);
      });
      setTargetDates(dates);
      setLoading(false);
    }
    loadPlans();
  }, []);

  const handleSetDate = async (subject: string, date: Date | undefined) => {
    if (!date) return;
    
    setIsSaving(subject);
    try {
      const result = await saveStudyPlan({ [subject]: date });
      if (result.success) {
        setTargetDates(prev => ({ ...prev, [subject]: date }));
        toast({ title: "Target Synchronized", description: `${subject} deadline set for ${format(date, "PPP")}.` });
      } else {
        toast({ variant: "destructive", title: "Sync Failed", description: result.error });
      }
    } finally {
      setIsSaving(null);
    }
  };

  const selectedCategory = curriculum.find(c => c.id === selectedCategoryId) || curriculum[0];
  const selectedDate = targetDates[selectedCategory.title];

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
            {curriculum.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategoryId === cat.id;
              const catDate = targetDates[cat.title];

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
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
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {mounted && catDate ? format(catDate, "MMM dd, yyyy") : "No target set"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-slate-50 border-2 border-slate-100 overflow-hidden">
            <CardHeader className="pb-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="font-headline font-black text-xl lg:text-2xl text-slate-900 uppercase">
                    {selectedCategory.title}
                  </CardTitle>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Discipline Parameters</p>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "rounded-xl border-2 h-12 px-6 flex items-center gap-3 transition-all",
                        selectedDate ? "border-primary/20 bg-primary/5 text-primary" : "border-slate-200"
                      )}
                      disabled={isSaving === selectedCategory.title}
                    >
                      {isSaving === selectedCategory.title ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CalendarIcon className="w-4 h-4" />
                      )}
                      <div className="text-left">
                        <p className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-1">Target Date</p>
                        <p className="text-xs font-bold leading-none">
                          {mounted && selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Set Target"}
                        </p>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => handleSetDate(selectedCategory.title, date)}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-primary">Mastery Progress</span>
                  <span className="text-xs font-bold text-slate-900">45%</span>
                </div>
                <Progress value={45} className="h-2.5 bg-slate-200" />
              </div>
            </CardHeader>
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
