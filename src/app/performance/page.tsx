
"use client";

import { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Target, Award, FlaskConical, Microscope, Database, Stethoscope, ShieldAlert, Sparkles, Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getUserStats } from '@/app/actions/user';
import { SUBJECT_AREAS } from '@/lib/game-logic';
import { cn } from '@/lib/utils';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const stats = await getUserStats();
      setUser(stats);
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

  // Ensure we always have all 6 subjects even if user has no mastery records yet
  const fullMastery = SUBJECT_AREAS.map(subjectName => {
    const existing = user?.mastery?.find((m: any) => m.subject === subjectName);
    return {
      subject: subjectName,
      shortName: subjectName.split(' ')[0], // Short name for chart
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

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 px-4 lg:px-6 space-y-8 lg:space-y-10 pb-24 lg:pb-12">
      <header className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight">Technical Mastery</h1>
        <p className="text-muted-foreground text-sm lg:text-lg">Real-time analytics based on your quest performance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <CardTitle className="font-headline text-lg lg:text-xl font-black uppercase tracking-tight">Proficiency Radar</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-8">
            <div className="h-[300px] lg:h-[400px] w-full">
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
          <Card className="border-none shadow-lg rounded-[2rem] bg-primary text-white p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Mastery Rating</p>
                  <p className="text-3xl font-black font-headline tracking-tighter">{avgMastery}%</p>
                </div>
              </div>
              <Progress value={parseFloat(avgMastery)} className="h-2 bg-white/20" />
            </div>
          </Card>

          <Card className="border-none shadow-lg rounded-[2rem] bg-white p-6 border-l-4 border-primary">
            <h3 className="font-black font-headline text-lg flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-5 h-5 text-primary" />
              Strategist Insight
            </h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {parseFloat(avgMastery) < 75 
                ? "Your current average is below board standards. Focus on subjects with proficiency under 50%." 
                : "You are maintaining board-standard accuracy. Keep this consistency for the mock exam phase."}
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
              <Card key={item.subject} className="border-none shadow-md rounded-[2rem] bg-white border-t-4 border-primary/20 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Icon className="h-6 w-6" /></div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase">{item.status}</Badge>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight truncate">{item.subject}</h4>
                  <p className="text-2xl font-black font-headline text-primary">{item.proficiency}% <span className="text-[10px] text-muted-foreground uppercase font-bold">Avg</span></p>
                </div>
                <Progress value={item.proficiency} className="h-1.5" />
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
