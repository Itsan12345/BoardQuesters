
"use client";

import { User, Settings, Award, Shield, History, MapPin, Calendar as CalendarIcon, Mail, Zap, Trophy, Swords, ClipboardCheck, Edit2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STUDY_SCHEDULE = [
  { subject: "Clinical Chemistry", date: "Mar 15, 2025", progress: 85 },
  { subject: "Hematology", date: "Apr 05, 2025", progress: 65 },
  { subject: "Microbiology", date: "Apr 30, 2025", progress: 45 },
  { subject: "Immunohematology", date: "May 10, 2025", progress: 82 },
  { subject: "Clinical Microscopy", date: "May 25, 2025", progress: 72 },
  { subject: "Histopathology", date: "Jun 15, 2025", progress: 58 },
];

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 px-4 lg:px-6 space-y-8 lg:space-y-10">
      {/* Profile Header */}
      <header className="relative bg-white p-6 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl border overflow-hidden">
        <div className="absolute top-0 right-0 p-4 lg:p-8 opacity-[0.03] pointer-events-none">
          <Zap className="w-32 h-32 lg:w-64 lg:h-64 text-primary" />
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
          <div className="relative group">
            <Avatar className="h-32 w-32 lg:h-44 lg:w-44 border-4 lg:border-8 border-primary/5 shadow-2xl transition-transform group-hover:scale-105 duration-500">
              <AvatarImage src="https://picsum.photos/seed/alex-v2/300/300" />
              <AvatarFallback className="bg-primary text-white text-4xl lg:text-6xl font-black">AR</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 bg-accent text-white p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg border-2 lg:border-4 border-white">
              <Shield className="w-5 h-5 lg:w-7 lg:h-7" />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-4 lg:space-y-6">
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-3xl lg:text-5xl font-black font-headline tracking-tight text-slate-900">Alex Rivera</h1>
              <p className="text-muted-foreground font-bold flex items-center justify-center lg:justify-start gap-2 text-sm uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-primary" /> Manila, Philippines
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-3">
              <Badge className="bg-primary text-white px-3 lg:px-5 py-1 lg:py-2 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.1em] shadow-sm">
                Lvl 24 Aspirant
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 lg:px-5 py-1 lg:py-2 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.1em]">
                MedTech Class of 2024
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Schedule Management Section - Integrated for Bulk Adjustments */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black font-headline uppercase tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Study Expedition Timeline
          </h2>
          <Link href="/onboarding">
            <Button variant="outline" className="rounded-xl border-primary text-primary font-bold">
              <Edit2 className="w-4 h-4 mr-2" /> Bulk Adjust
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDY_SCHEDULE.map((item) => (
            <Card key={item.subject} className="border-none shadow-md rounded-2xl bg-white overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">{item.subject}</h4>
                  <Badge variant="secondary" className="text-[9px] font-black uppercase">{item.progress}%</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Target: {item.date}
                </div>
                <Progress value={item.progress} className="h-1.5" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Stats Sidebar */}
        <div className="space-y-6 lg:space-y-8">
          <Card className="border-none shadow-lg rounded-[1.5rem] lg:rounded-[2rem] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg uppercase tracking-tight font-black">Aspirant Vitals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-primary/5">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-600 fill-current" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">12 Day Streak</span>
                </div>
                <Badge className="bg-primary text-white border-none font-black text-[10px]">+20% XP</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Feed */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Card className="border-none shadow-lg rounded-[1.5rem] lg:rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-6 lg:p-8">
              <CardTitle className="font-headline text-lg lg:text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                <History className="w-5 h-5 text-primary" />
                Battle Expedition Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {[
                  { task: "Mastered Hematology Quest", time: "2 hours ago", xp: "+450 XP", type: "quest" },
                  { task: "Simulated Exam Completion", time: "Yesterday", xp: "+1200 XP", type: "exam" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-primary/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl shadow-sm",
                        item.type === 'quest' ? "bg-primary/5 text-primary border border-primary/10" : "bg-accent/10 text-accent border border-accent/10"
                      )}>
                        {item.type === 'quest' ? <Swords className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-900 leading-tight">{item.task}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">{item.time}</p>
                      </div>
                    </div>
                    <span className="font-black text-primary text-sm tracking-tight">{item.xp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
