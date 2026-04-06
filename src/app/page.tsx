
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, ChevronRight, Rocket, Loader2, Flame, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getUserStats, getLeaderboard, generateDailyMissions } from '@/app/actions/user';
import { getStudyPlans } from '@/app/actions/study-plan';
import { format } from 'date-fns';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [dailyMissions, setDailyMissions] = useState<any[]>([]);
  const [nextMilestone, setNextMilestone] = useState<{ subject: string; date: Date } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      const [stats, leaders, plans, missions] = await Promise.all([
        getUserStats(),
        getLeaderboard(),
        getStudyPlans(),
        generateDailyMissions()
      ]);

      setUser(stats);
      setLeaderboard(leaders);
      setDailyMissions(missions);

      if (plans && plans.length > 0) {
        const today = new Date();
        const futurePlans = plans.filter(p => new Date(p.targetDate) >= today);
        const activePlan = futurePlans.length > 0 ? futurePlans[0] : plans[plans.length - 1];
        setNextMilestone({ subject: activePlan.subject, date: new Date(activePlan.targetDate) });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const totalMastery = user?.mastery?.length > 0
    ? Math.round(user.mastery.reduce((acc: number, m: any) => acc + m.proficiency, 0) / user.mastery.length)
    : 0;

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f8f8f8] p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <section className="space-y-4 lg:space-y-6">
        <h1 className="text-3xl lg:text-5xl font-black font-headline tracking-tight leading-tight text-[#1a1a1a]">
          Master Your Boards,<br />
          <span className="text-primary">Level Up Your Knowledge</span>
        </h1>
        <Link href="/quest">
          <Button size="lg" className="h-12 px-6 rounded-xl text-sm font-bold shadow-lg bg-primary hover:bg-primary/90">
            Start Quest <Zap className="h-4 w-4 ml-2 fill-current" />
          </Button>
        </Link>
      </section>

      {/* Your Study Dashboard Section */}
      <section className="space-y-3">
        <h2 className="text-xl lg:text-2xl font-black font-headline text-[#1a1a1a]">Your Study Dashboard</h2>
        <p className="text-sm text-muted-foreground font-medium">Real-time tracking of your journey to professional certification</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Course */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6 lg:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-headline">CURRENT COURSE</p>
                  <h3 className="text-lg lg:text-xl font-bold text-[#1a1a1a]">MedTech Board Mastery</h3>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-4xl lg:text-5xl font-black font-headline text-primary leading-none">{totalMastery}%</span>
                  <span className="text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest pb-1">20/30 MODULES COMPLETED</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70" style={{ width: `${totalMastery}%` }} />
                </div>
              </div>

              {nextMilestone && (
                <Link href="/study" className="block">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs lg:text-sm font-bold flex items-center justify-center gap-3">
                    Continue: {nextMilestone.subject}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Weekly Leaderboard */}
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weekly Leaderboard</p>
                <p className="text-xs font-medium text-muted-foreground">You placed 5TH this week</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <div className="space-y-4">
                {leaderboard.map((u, idx) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 last:pb-0 border-b border-slate-100 last:border-b-0">
                    <div className="flex-shrink-0 w-8 text-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-black text-primary text-sm">#{idx + 1}</span>
                      </div>
                    </div>
                    <Avatar className="h-12 w-12 bg-primary/20 border-2 border-primary/10">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-xs font-black">{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1a1a1a]">{u.name}</p>
                      <p className="text-[9px] font-medium text-muted-foreground uppercase">{u.xp.toLocaleString()} XP This Week</p>
                    </div>
                    {idx === 0 && <Trophy className="h-5 w-5 text-primary flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Daily Missions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Daily Missions</p>
            </CardHeader>
            <CardContent className="p-6 lg:p-6 space-y-4">
              {dailyMissions.length > 0 ? (
                dailyMissions.map((mission) => {
                  // Determine icon based on mission type
                  let MissionIcon = Target;
                  let iconBgColor = 'bg-slate-100';
                  let iconColor = 'text-muted-foreground';

                  if (mission.isStreakMission) {
                    MissionIcon = Flame;
                    iconBgColor = 'bg-orange-100';
                    iconColor = 'text-orange-600';
                  } else if (mission.priority === 1) {
                    MissionIcon = Trophy;
                    iconBgColor = 'bg-red-100';
                    iconColor = 'text-primary';
                  } else if (mission.priority === 2) {
                    MissionIcon = Zap;
                    iconBgColor = 'bg-yellow-100';
                    iconColor = 'text-yellow-600';
                  }

                  return (
                    <div key={mission.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b border-slate-100 last:border-b-0">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                        <MissionIcon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold text-[#1a1a1a]`}>{mission.title}</p>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase mt-1">{mission.proficiency}% Proficiency • +{mission.xp} XP</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground font-medium">No active missions yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Set your study targets to generate personalized missions.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-primary text-white p-6">
            <div className="space-y-4">
              <h4 className="font-headline font-bold">Quest Streak</h4>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black">{user?.streak || 0}</div>
                <div className="text-[10px] font-bold uppercase leading-tight opacity-80">Days Active<br/> Consistent Review</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
