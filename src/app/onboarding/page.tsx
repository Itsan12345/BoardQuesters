
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, CheckCircle2, ChevronRight, GraduationCap, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { SUBJECT_AREAS } from '@/lib/game-logic';
import { saveStudyPlan } from '@/app/actions/study-plan';
import { useToast } from '@/hooks/use-toast';

const FACULTY_DEADLINE = new Date(2025, 5, 30); // June 30, 2025

export default function Onboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targets, setTargets] = useState<Record<string, Date>>({});

  const handleDateSelect = (subject: string, date: Date | undefined) => {
    if (date) {
      setTargets(prev => ({ ...prev, [subject]: date }));
    }
  };

  const isComplete = SUBJECT_AREAS.every(s => targets[s]);

  const finalizePlan = async () => {
    setIsSubmitting(true);
    
    const sanitizedTargets: Record<string, Date> = {};
    Object.entries(targets).forEach(([sub, date]) => {
      sanitizedTargets[sub] = startOfDay(date);
    });

    try {
      const result = await saveStudyPlan(sanitizedTargets);
      
      if (result.success) {
        toast({
          title: "Strategy Deployed",
          description: "Your personalized study timeline is now synced with your dashboard.",
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Sync Error",
          description: result.error || "Could not save your plan. Please check your connection.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Tactical Error",
        description: "An unexpected error occurred during mission deployment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <div className="h-2 bg-primary" />
        <CardHeader className="p-8 lg:p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black font-headline uppercase tracking-tight text-slate-900">
            Setup Your Study Plan
          </CardTitle>
          <CardDescription className="text-base font-medium">
            Align your personal review pacing with the Faculty's global timeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 lg:p-12 pt-0 space-y-8">
          <div className="p-4 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-black uppercase text-primary/70 tracking-widest">Faculty Deadline</span>
            </div>
            <span className="font-bold text-primary">{format(FACULTY_DEADLINE, "PPP")}</span>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Major Lab Science Targets</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUBJECT_AREAS.map((subject) => (
                <div key={subject} className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">{subject}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={cn(
                        "flex w-full items-center justify-start text-left font-normal rounded-xl h-12 border-2 px-3 transition-all",
                        !targets[subject] && "text-muted-foreground border-slate-200",
                        targets[subject] && "border-primary/20 bg-primary/5 text-primary"
                      )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">
                          {targets[subject] ? format(targets[subject], "PPP") : "Set Target Date"}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={targets[subject]}
                        onSelect={(date) => handleDateSelect(subject, date)}
                        disabled={(date) => {
                          const today = startOfDay(new Date());
                          return date < today || date > FACULTY_DEADLINE;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black uppercase tracking-widest shadow-xl group text-white"
            disabled={!isComplete || isSubmitting}
            onClick={finalizePlan}
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Deploy Study Strategy 
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
