"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
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
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const masteryData = [
  { subject: 'Chemistry', proficiency: 78, fullMark: 100 },
  { subject: 'Hematology', proficiency: 65, fullMark: 100 },
  { subject: 'Microbiology', proficiency: 45, fullMark: 100 },
  { subject: 'Blood Bank', proficiency: 82, fullMark: 100 },
  { subject: 'Clinical Micro', proficiency: 72, fullMark: 100 },
  { subject: 'Histopath', proficiency: 58, fullMark: 100 },
];

const subjectDetails = [
  { label: "Clinical Chemistry", val: 78, icon: FlaskConical, status: "Mastering" },
  { label: "Hematology", val: 65, icon: Microscope, status: "Proficient" },
  { label: "Microbiology", val: 45, icon: Database, status: "Review Needed" },
  { label: "Blood Bank", val: 82, icon: Stethoscope, status: "Mastered" },
  { label: "Clinical Microscopy", val: 72, icon: FlaskConical, status: "Proficient" },
  { label: "Histopathology & MT Laws", val: 58, icon: ShieldAlert, status: "Developing" }
];

export default function PerformancePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black font-headline tracking-tight">Performance Mastery</h1>
        <p className="text-muted-foreground text-lg">Detailed analysis of your technical proficiency across laboratory domains.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart Summary */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl">Proficiency Radar</CardTitle>
                <CardDescription>Visual mapping of subject area strengths.</CardDescription>
              </div>
              <Target className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Proficiency"
                    dataKey="proficiency"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg rounded-3xl bg-primary text-white p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">Board Readiness</p>
                  <p className="text-3xl font-black font-headline">67.4%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Target: 85%</span>
                  <span>+2.4% this week</span>
                </div>
                <Progress value={67.4} className="h-2 bg-white/20" />
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-lg rounded-3xl bg-white p-8 space-y-4">
            <h3 className="font-bold font-headline text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              AI Insight
            </h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "Your Hematology scores are rising, but Microbiology remains a bottleneck. Focus on your Gram-negative protocols to boost your overall percentile."
            </p>
            <div className="pt-4 flex gap-2">
              <Badge variant="secondary" className="bg-primary/5 text-primary">Microbiology Focus</Badge>
              <Badge variant="secondary" className="bg-accent/5 text-accent">Top 12%</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Domain Breakdown */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
          <Award className="w-6 h-6 text-primary" />
          Domain Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectDetails.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-none shadow-md hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden group">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors",
                      item.val >= 75 ? "bg-green-100 text-green-600" : item.val >= 50 ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm leading-tight">{item.label}</h4>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black font-headline text-primary">{item.val}%</span>
                      {item.val >= 75 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mb-1" />
                      ) : item.val < 50 ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
                      ) : null}
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
