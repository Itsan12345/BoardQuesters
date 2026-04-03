
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, ChevronRight, Calendar as CalendarIcon, Clock, Target, Info, Rocket, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStudyPlans } from '@/app/actions/study-plan';
import { format } from 'date-fns';

const leaderboardUsers = [
  { name: "Stefan Cong", xp: "2,500 XP", initial: "C" },
  { name: "Ryan Go", xp: "2,480 XP", initial: "R" },
  { name: "Kevin Yap Gomez", xp: "2,350 XP", initial: "K" },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [nextMilestone, setNextMilestone] = useState<{ subject: string; date: Date } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadPlan() {
      const plans = await getStudyPlans();
      if (plans && plans.length > 0) {
        // Find the next milestone (first plan that is in the future or closest to today)
        const today = new Date();
        const futurePlans = plans.filter(p => new Date(p.targetDate) >= today);
        const activePlan = futurePlans.length > 0 ? futurePlans[0] : plans[plans.length - 1];
        
        setNextMilestone({
          subject: activePlan.subject,
          date: new Date(activePlan.targetDate)
        });
      }
      setLoading(false);
    }
    loadPlan();
  }, []);

  return (
    <div className="min-h-full bg-[#f8f8f8] p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Daily Mission Widget - Integrated Calendar Action */}
      <section className="bg-slate-900 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl min-h-[180px] flex items-center">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Rocket className="w-32 h-32" />
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : nextMilestone ? (
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase">Active Mission</Badge>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Today's Target</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black font-headline tracking-tight">
                Finish <span className="text-primary">{nextMilestone.subject}</span> modules
              </h2>
              <p className="text-white/60 text-sm font-medium">
                to stay on track for your <span className="text-white font-bold">{format(nextMilestone.date, "MMMM dd")}</span> deadline.
              </p>
            </div>
            <Link href="/study">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl">
                Initiate Lesson
              </Button>
            </Link>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl lg:text-3xl font-black font-headline tracking-tight">Setup Your Study Expedition</h2>
              <p className="text-white/60 text-sm font-medium">No active mission detected. Initialize your study plan now.</p>
            </div>
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl">
                Setup Plan
              </Button>
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-4 lg:space-y-6">
        <h1 className="text-2xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-[#1a1a1a]">
          Aspirant Dashboard <br />
          <span className="text-primary">Strategize Your Success</span>
        </h1>
        <div className="flex flex-wrap gap-4">
          <Link href="/quest" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-12 px-6 rounded-xl text-md font-bold shadow-lg bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              Start Quest <Zap className="h-4 w-4 fill-current" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-headline">BOARD READINESS</p>
                  <h3 className="text-lg lg:text-xl font-bold text-[#1a1a1a]">MedTech Licensure Mastery</h3>
                </div>
                <Badge className="bg-primary/10 text-primary border-none font-bold">Lvl 24</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-4xl lg:text-5xl font-black font-headline text-primary leading-none">67%</span>
                  <span className="text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest pb-1">Mastery Verified (Avg &ge; 75%)</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: '67%' }} />
                </div>
              </div>

              <Link href="/study" className="block">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs lg:text-sm font-bold flex items-center justify-center gap-3">
                  Continue Review: Clinical Chemistry
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Hall of Fame</p>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 space-y-6">
              {leaderboardUsers.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-6 text-center font-black text-muted-foreground text-sm italic">
                    #{idx + 1}
                  </div>
                  <Avatar className="h-10 w-10 bg-accent border-none ring-offset-2 group-hover:ring-2 ring-accent/20 transition-all">
                    <AvatarFallback className="bg-accent text-white text-xs font-black">{user.initial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#1a1a1a] truncate">{user.name}</p>
                    <p className="text-[9px] font-medium text-muted-foreground uppercase">{user.xp}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-30" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm rounded-2xl bg-primary text-white p-6">
             <div className="space-y-4">
               <h4 className="font-headline font-bold">Quest Streak</h4>
               <div className="flex items-center gap-4">
                 <div className="text-4xl font-black">12</div>
                 <div className="text-[10px] font-bold uppercase leading-tight opacity-80">Days Active <br/> Consistent Review</div>
               </div>
               <Progress value={85} className="h-1.5 bg-white/20" />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
