
"use client";

import { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Target, Award, FlaskConical, Microscope, Database, Stethoscope, ShieldAlert, Sparkles, Loader2, Clock, Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getUserStats } from '@/app/actions/user';
import { getStudyPlans } from '@/app/actions/study-plan';
import { SUBJECT_AREAS } from '@/lib/game-logic';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

const ICON_MAP: Record<string, any> = {
  "Clinical Chemistry": FlaskConical,
  "Hematology": Microscope,
  "Microbiology": Database,
  "Immunohematology": Stethoscope,
  "Clinical Microscopy": FlaskConical,
  "Histopathology & MT Laws": ShieldAlert
};

export default function PerformancePage() {
  const [user, setUser] = useState<any>(null);
  const [nextObjective, setNextObjective] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [stats, plans] = await Promise.all([
        getUserStats(),
        getStudyPlans()
      ]);
      
      setUser(stats);

      if (plans && plans.length > 0) {
        const today = new Date();
        const futurePlans = plans
          .filter(p => new Date(p.targetDate) >= today)
          .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
        
        if (futurePlans.length > 0) {
          setNextObjective(futurePlans[0]);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const fullMastery = SUBJECT_AREAS.map(subjectName => {
    const existing = user?.mastery?.find((m: any) => m.subject === subjectName);
    return {
      subject: subjectName,
      shortName: subjectName.split(' ')[0],
      proficiency: existing?.proficiency || 0,
      status: existing?.status || "In Training",
      fullMark: 100
    };
  });

  const masteryData = fullMastery.map(m => ({
    subject: m.shortName,
    proficiency: m.proficiency,
    fullMark: 100
  }));

  const avgMastery = fullMastery.length > 0 
    ? (fullMastery.reduce((acc: number, m: any) => acc + m.proficiency, 0) / fullMastery.length).toFixed(1)
    : "0.0";

  const daysRemaining = nextObjective 
    ? differenceInDays(new Date(nextObjective.targetDate), new Date()) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 px-4 lg:px-6 space-y-8 lg:space-y-4 pb-24 lg:pb-12">
      <header className="space-y-0">
        <h1 className="text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight uppercase">Technical <span className="text-primary">Mastery</span></h1>
        <p className="text-muted-foreground text-sm lg:text-lg font-medium">Real-time analytics and mission objectives for your licensure expedition.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <CardTitle className="font-headline text-lg lg:text-xl font-semibold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Proficiency Radar</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary">Visuals mapping of subject area strengths.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-8">
            <div className="h-[300px] lg:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Proficiency" 
                    dataKey="proficiency" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.4} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-lg rounded-[2rem] bg-white p-6 lg:p-8 relative overflow-hidden border-t-4 border-primary">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Target className="w-24 h-24 text-primary" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900/90">Dailies / Objectives</h3>
              </div>

              {nextObjective ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Active Objective</p>
                    <p className="text-xl font-black font-headline text-slate-900 leading-tight">{nextObjective.subject}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Target Date</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <CalendarIcon className="w-3 h-3" />
                        {format(new Date(nextObjective.targetDate), "MMM dd")}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Intel Session</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Clock className="w-3 h-3 text-primary" />
                        90 mins
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                      <span className="text-muted-foreground">Completion Buffer</span>
                      <span className="text-primary">{daysRemaining} Days Left</span>
                    </div>
                    <Progress value={Math.max(10, 100 - (daysRemaining * 10))} className="h-1.5 bg-primary/5" />
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs font-medium text-muted-foreground italic">No objectives deployed. Visit the Curriculum to set your mission targets.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-none shadow-lg rounded-[2rem] bg-white p-6 border-l-4 border-primary shadow-xl">
            <h3 className="font-black font-semibold text-lg flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-5 h-5 text-primary" />
              Strategist Insight
            </h3>
            <p className="text-sm font-semibold   text-muted-foreground italic leading-relaxed mt-2">
              {parseFloat(avgMastery) < 75 
                ? "Your current average is below board standards. Prioritize your active objectives to bridge proficiency gaps." 
                : "Operational standards met. Maintain your objective streak to ensure mock exam readiness."}
            </p>
          </Card>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-black font-headline flex items-center gap-3 uppercase tracking-tight">
          <Award className="w-6 h-6 text-primary" />
          Technical Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullMastery.map((item: any) => {
            const Icon = ICON_MAP[item.subject] || Database;
            return (
              <Card key={item.subject} className="border-none shadow-md rounded-[2rem] bg-white border-t-4 border-primary/20 p-6 space-y-4 hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors"><Icon className="h-6 w-6" /></div>
                  <Badge variant="outline" className="text-[9px] font-semibold uppercase border-primary/20 text-primary">{item.status}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-tight truncate text-slate-900">{item.subject}</h4>
                  <p className="text-2xl font-semibold font-headline text-primary mt-1">{item.proficiency}% <span className="text-[10px] text-muted-foreground uppercase font-semibold">Verified</span></p>
                </div>
                <Progress value={item.proficiency} className="h-1.5 bg-slate-100" />
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
