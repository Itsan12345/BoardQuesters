"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Zap, ChevronRight, Calendar as CalendarIcon, Clock, Target, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const leaderboardUsers = [
  { name: "Stefan Cong", xp: "2,500 XP", initial: "C" },
  { name: "Ryan Go", xp: "2,480 XP", initial: "R" },
  { name: "Kevin Yap Gomez", xp: "2,350 XP", initial: "K" },
];

export default function Dashboard() {
  const [studyDate, setStudyDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-full bg-[#f8f8f8] p-4 md:p-8 space-y-6 md:space-y-8">
      <section className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-4xl font-black font-headline tracking-tight leading-tight text-[#1a1a1a]">
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
        {/* Left Column: Stats & Progress */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-headline">BOARD READINESS</p>
                  <h3 className="text-lg md:text-xl font-bold text-[#1a1a1a]">MedTech Licensure Mastery</h3>
                </div>
                <Badge className="bg-primary/10 text-primary border-none font-bold">Lvl 24</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-4xl md:text-5xl font-black font-headline text-primary leading-none">67%</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest pb-1">Mastery Verified (Avg &ge; 75%)</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: '67%' }} />
                </div>
              </div>

              <Link href="/study" className="block">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-3">
                  Continue Review: Clinical Chemistry
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Study Quest Scheduler */}
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-4 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-lg">Study Quest Scheduler</CardTitle>
                  <CardDescription>Align your review center timeline with BoardQuest.</CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-2 flex gap-2 w-full md:w-auto justify-start">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      {studyDate ? format(studyDate, "PPP") : "Set Timeline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={studyDate} onSelect={setStudyDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-2xl p-4 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 text-sm font-medium">
                  <div className="p-2 bg-white rounded-lg border-2 border-primary/10 w-fit">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <span className="flex-1">Next Target: <span className="font-bold">Hematology Mastery</span></span>
                  <span className="text-[10px] md:text-xs text-muted-foreground">Due {studyDate ? format(studyDate, "MMM dd") : 'Soon'}</span>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                  <div className="flex gap-3">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                      Strategist Tip: You have <span className="font-bold">12 days</span> until your review center's Hematology mock exam. Aim for 75% Mastery by then.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Social & Leaderboard */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Hall of Fame</p>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-6">
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
