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
  Loader2,
  CheckCircle2,
  Brain,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { CustomCalendar } from '@/components/ui/custom-calendar';
import { cn } from '@/lib/utils';
import { getStudyPlans, saveStudyPlan } from '@/app/actions/study-plan';
import { getSubjectMetrics, updateLessonStatus, type SubjectMetrics } from '@/app/actions/study';
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
    title: "Hematology",
    icon: Microscope,
    lessons: [
      { id: "hem1", title: "RBC Morphology & Anemias", duration: "50m", status: "completed" },
      { id: "hem2", title: "WBC Disorders & Leukemias", duration: "75m", status: "not-started" }
    ]
  },
  {
    id: "microbiology",
    title: "Microbiology",
    icon: Database,
    lessons: [
      { id: "mic1", title: "Bacteriology: Gram Positives", duration: "65m", status: "completed" },
      { id: "mic2", title: "Enterobacteriaceae & Non-fermenters", duration: "90m", status: "not-started" }
    ]
  },
  {
    id: "immunohematology",
    title: "Immunology & Serology and Immunohematology",
    icon: Stethoscope,
    lessons: [
      { id: "bb1", title: "ABO & Rh Blood Group Systems", duration: "55m", status: "completed" },
      { id: "bb2", title: "Blood Component Therapy", duration: "50m", status: "not-started" }
    ]
  },
  {
    id: "clinical-microscopy",
    title: "Clinical Microscopy & Parasitology",
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
  const [subjectMetrics, setSubjectMetrics] = useState<Record<string, SubjectMetrics>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      const [plans, metrics] = await Promise.all([
        getStudyPlans(),
        getSubjectMetrics(),
      ]);

      const dates: Record<string, Date> = {};
      plans.forEach(p => {
        dates[p.subject] = new Date(p.targetDate);
      });
      setTargetDates(dates);

      const metricsMap: Record<string, SubjectMetrics> = {};
      metrics.forEach(m => {
        metricsMap[m.subject] = m;
      });
      setSubjectMetrics(metricsMap);

      setLoading(false);
    }
    loadData();

    // Refresh metrics every 30 seconds to keep them in sync across pages
    const metricsRefreshInterval = setInterval(async () => {
      const metrics = await getSubjectMetrics();
      const metricsMap: Record<string, SubjectMetrics> = {};
      metrics.forEach(m => {
        metricsMap[m.subject] = m;
      });
      setSubjectMetrics(metricsMap);
    }, 30000);

    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => {
      clearInterval(metricsRefreshInterval);
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  const handleSetDate = async (subject: string, date: Date | undefined) => {
    if (!date) return;

    setIsSaving(subject);
    try {
      const result = await saveStudyPlan({ [subject]: date });
      if (result.success) {
        setTargetDates(prev => ({ ...prev, [subject]: date }));
        toast({ title: "Target Synchronized", description: `${subject} deadline set for ${format(date, "PPP")}.` });
        setCalendarOpen(false);
      } else {
        toast({ variant: "destructive", title: "Sync Failed", description: result.error });
      }
    } finally {
      setIsSaving(null);
    }
  };

  const handleSubmitLesson = async (lessonId: string) => {
    const updated = await updateLessonStatus(selectedCategory.title, lessonId, 'completed');
    if (updated) {
      // Refresh metrics
      const metrics = await getSubjectMetrics();
      const metricsMap: Record<string, SubjectMetrics> = {};
      metrics.forEach(m => {
        metricsMap[m.subject] = m;
      });
      setSubjectMetrics(metricsMap);

      toast({
        title: "Lesson Completed",
        description: "Great work! Your progress has been saved.",
      });
    }
  };

  const selectedCategory = curriculum.find(c => c.id === selectedCategoryId) || curriculum[0];
  const selectedDate = targetDates[selectedCategory.title];

  return (
    <div className="min-h-full pb-20 lg:pb-12 bg-background">
      <header className="bg-background border-b px-6 py-8 lg:py-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-none uppercase" style={{ fontFamily: "'Inter-bold', sans-serif"}}>
                Study <span className="text-primary">Curriculum</span>
              </h1>
              <p className="text-[10px] lg:text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Intel Gathering & Concept Mastery
              </p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Final Deadline</span>
              </div>
              <p className="text-sm font-black text-red-700">June 15, 2026</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search concepts, protocols, or RA sections..."
              className="pl-12 h-14 bg-muted border-2 border-border rounded-2xl focus-visible:ring-primary/20 text-sm font-medium"
            />
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-4 space-y-4">
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2">Laboratory Disciplines</h2>
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
                      ? "bg-background border-primary shadow-xl" 
                      : "hover:bg-muted border-border bg-background"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl shrink-0 transition-colors", 
                    isActive ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-sm uppercase tracking-tight truncate",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {cat.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">
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
          <Card className="border border-border shadow-sm rounded-[2rem] bg-muted border-2 border-border overflow-hidden">
            <CardHeader className="pb-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <CardTitle className="font-headline font-semibold text-xl lg:text-2xl text-foreground uppercase">
                    {selectedCategory.title}
                  </CardTitle>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Discipline Parameters</p>
                </div>
                
                {isDesktop ? (
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "rounded-xl border-2 h-12 px-6 flex items-center gap-3 transition-all hover:shadow-lg hover:border-primary/40",
                          selectedDate ? "border-primary/30 bg-primary/10 text-primary shadow-md" : "border-border hover:border-slate-300"
                        )}
                        disabled={isSaving === selectedCategory.title}
                      >
                        {isSaving === selectedCategory.title ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CalendarIcon className="w-4 h-4" />
                        )}
                        <div className="text-left">
                          <p className="text-[8px] font-semibold uppercase text-muted-foreground leading-none mb-1">Target Date</p>
                          <p className="text-xs font-semibold leading-none">
                            {mounted && selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Set Target"}
                          </p>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-2xl border-2 border-border rounded-2xl bg-background" align="end">
                      <div className="space-y-4 p-4">
                        <div className="space-y-1 border-b pb-4">
                          <h3 className="font-black text-sm uppercase text-foreground">Select Target Date</h3>
                          <p className="text-[10px] text-muted-foreground font-semibold">For {selectedCategory.title}</p>
                        </div>
                        <CustomCalendar
                          selected={selectedDate}
                          onSelect={(date) => handleSetDate(selectedCategory.title, date)}
                          disabled={(date) => date < startOfDay(new Date())}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "rounded-xl border-2 h-12 px-6 flex items-center gap-3 transition-all hover:shadow-lg hover:border-primary/40",
                          selectedDate ? "border-primary/30 bg-primary/10 text-primary shadow-md" : "border-border hover:border-slate-300"
                        )}
                        disabled={isSaving === selectedCategory.title}
                      >
                        {isSaving === selectedCategory.title ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CalendarIcon className="w-4 h-4" />
                        )}
                        <div className="text-left">
                          <p className="text-[8px] font-semibold uppercase text-muted-foreground leading-none mb-1">Target Date</p>
                          <p className="text-xs font-semibold leading-none">
                            {mounted && selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Set Target"}
                          </p>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-sm rounded-3xl p-6 border-0 shadow-2xl gap-0">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-1 border-b pb-4 text-center px-8">
                          <DialogTitle className="font-black text-sm sm:text-base uppercase text-foreground leading-tight">Select Target Date</DialogTitle>
                          <p className="text-xs text-muted-foreground font-semibold">For {selectedCategory.title}</p>
                        </div>
                        <div className="flex justify-center">
                          <CustomCalendar
                            selected={selectedDate}
                            onSelect={(date) => handleSetDate(selectedCategory.title, date)}
                            disabled={(date) => date < startOfDay(new Date())}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="space-y-4 pt-2">
                {/* Completion Metric */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold uppercase text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      Completion
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {subjectMetrics[selectedCategory.title]?.completion || 0}%
                    </span>
                  </div>
                  <Progress value={subjectMetrics[selectedCategory.title]?.completion || 0} className="h-2.5 bg-secondary" />
                </div>

                {/* Mastery Metric */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold uppercase text-primary flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Mastery (Quest Avg)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {subjectMetrics[selectedCategory.title]?.mastery || 0}%
                      </span>
                      <span className={cn(
                        "text-[9px] font-semibold px-2 py-1 rounded-full uppercase",
                        subjectMetrics[selectedCategory.title]?.masteryStatus === 'Mastered' ? "bg-green-100 text-green-700" :
                        subjectMetrics[selectedCategory.title]?.masteryStatus === 'Proficient' ? "bg-blue-100 text-blue-700" :
                        subjectMetrics[selectedCategory.title]?.masteryStatus === 'In Training' ? "bg-orange-100 text-orange-700" :
                        "bg-secondary text-slate-600"
                      )}>
                        {subjectMetrics[selectedCategory.title]?.masteryStatus || 'Not Started'}
                      </span>
                    </div>
                  </div>
                  <Progress value={subjectMetrics[selectedCategory.title]?.mastery || 0} className="h-2.5 bg-secondary" />
                  <p className="text-[9px] text-muted-foreground font-semibold">Based on your average performance in Quest Arena for this subject</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border border-border shadow-sm rounded-[2rem] bg-background border-2 border-border overflow-hidden">
            <CardHeader className="bg-muted border-b p-6 lg:p-8">
              <CardTitle className="font-headline text-lg font-semibold uppercase tracking-tight flex items-center gap-3">
                <BookMarked className="w-5 h-5 text-primary" />
                Intel Expedition Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-slate-100">
                  {selectedCategory.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-6 flex items-center gap-5 hover:bg-muted transition-all cursor-pointer group">
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-semibold text-sm border-2 transition-all",
                        lesson.status === 'completed'
                          ? "bg-accent/10 border-accent/20 text-accent"
                          : "bg-background border-border text-slate-300 group-hover:border-primary/20"
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm lg:text-base text-foreground truncate">{lesson.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-tighter">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {lesson.duration} Intel</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSubmitLesson(lesson.id)}
                        className={cn(
                          "h-10 w-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
                          lesson.status === 'completed'
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-white"
                        )}
                      >
                        {lesson.status === 'completed' ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <PlayCircle className="h-6 w-6" />
                        )}
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
