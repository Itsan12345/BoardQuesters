
"use client";

import { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as ChartTooltip
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Award, 
  FlaskConical, 
  Microscope, 
  Database, 
  Stethoscope, 
  ShieldAlert, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const masteryData = [
  { subject: 'Chemistry', proficiency: 78, fullMark: 100 },
  { subject: 'Hematology', proficiency: 65, fullMark: 100 },
  { subject: 'Microbiology', proficiency: 45, fullMark: 100 },
  { subject: 'Blood Bank', proficiency: 82, fullMark: 100 },
  { subject: 'Clinical Micro', proficiency: 72, fullMark: 100 },
  { subject: 'Histopath', proficiency: 58, fullMark: 100 },
];

const subjectDetails = [
  { label: "Clinical Chemistry", val: 78, min: 60, icon: FlaskConical, status: "Mastered" },
  { label: "Hematology", val: 65, min: 45, icon: Microscope, status: "Review Needed" },
  { label: "Microbiology", val: 45, min: 30, icon: Database, status: "Critical" },
  { label: "Blood Bank", val: 82, min: 70, icon: Stethoscope, status: "Mastered" },
  { label: "Clinical Microscopy", val: 72, min: 55, icon: FlaskConical, status: "In Training" },
  { label: "Histopathology & MT Laws", val: 58, min: 50, icon: ShieldAlert, status: "In Training" }
];

export default function PerformancePage() {
  const [studyDate, setStudyDate] = useState<Date | undefined>(new Date());

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-headline tracking-tight">Technical Mastery</h1>
          <p className="text-muted-foreground text-lg">Active analytics based on the 75/50 proficiency formula.</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 flex gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-[8px] font-black uppercase text-muted-foreground">Self-Pacing Goal</p>
                <p className="text-xs font-bold">{studyDate ? format(studyDate, "PPP") : "Set Timeline"}</p>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={studyDate} onSelect={setStudyDate} initialFocus />
          </PopoverContent>
        </Popover>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl">Proficiency Radar</CardTitle>
                <CardDescription>Domain analysis for board readiness.</CardDescription>
              </div>
              <Target className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Proficiency" dataKey="proficiency" stroke="#800000" fill="#800000" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-lg rounded-3xl bg-primary text-white p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">Mastery Rating</p>
                  <p className="text-3xl font-black font-headline">67.4%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Threshold: 75% Avg</span>
                  <span>Goal: {studyDate ? format(studyDate, "MMM dd") : 'Set Date'}</span>
                </div>
                <Progress value={67.4} className="h-2 bg-white/20" />
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-lg rounded-3xl bg-white p-8 space-y-4">
            <h3 className="font-bold font-headline text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Strategist Insight
            </h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "You have failed to reach Mastery in Microbiology (Current: 45%). Your timeline indicates you must resolve this by {studyDate ? format(studyDate, "MMM dd") : 'next week'}."
            </p>
          </Card>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
          <Award className="w-6 h-6 text-primary" />
          Detailed Breakdown (75/50 Formula)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectDetails.map((item) => {
            const Icon = item.icon;
            const isMastered = item.val >= 75 && item.min >= 50;
            return (
              <Card key={item.label} className={cn("border-none shadow-md rounded-3xl bg-white overflow-hidden border-t-4", isMastered ? "border-green-500" : "border-primary/20")}>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={cn("p-3 rounded-2xl", isMastered ? "bg-green-100 text-green-600" : "bg-primary/5 text-primary")}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">{item.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{item.label}</h4>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black font-headline text-primary">{item.val}% <span className="text-[10px] text-muted-foreground uppercase">Avg</span></span>
                        <span className="text-xs font-bold text-muted-foreground">{item.min}% <span className="text-[8px] uppercase">Low Score</span></span>
                      </div>
                      {isMastered ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                  <Progress value={item.val} className="h-1.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
