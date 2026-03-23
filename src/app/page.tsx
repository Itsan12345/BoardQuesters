import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const leaderboardUsers = [
  { name: "Cong Mercado Stefan", xp: "2,500 XP This Week", initial: "C" },
  { name: "Ryan Go", xp: "2,500 XP This Week", initial: "R" },
  { name: "Kevin Yap Gomez", xp: "2,500 XP This Week", initial: "K" },
];

export default function Dashboard() {
  return (
    <div className="min-h-full bg-[#f8f8f8] p-6 md:p-12 lg:px-24 space-y-10">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tight leading-tight max-w-2xl text-[#1a1a1a]">
          Master Your Boards, <br />
          <span className="text-primary">Level Up Your Knowledge</span>
        </h1>
        <Link href="/quest" className="inline-block">
          <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary">
            Start Quest <Zap className="ml-2 h-5 w-5 fill-current" />
          </Button>
        </Link>
      </section>

      {/* Your Study Dashboard Header */}
      <section className="space-y-1">
        <h2 className="text-2xl font-bold font-headline text-[#1a1a1a]">Your Study Dashboard</h2>
        <p className="text-muted-foreground text-sm font-medium">Real-time tracking of your journey to professional certification</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Current Course */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-8 md:p-10 space-y-8">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest font-headline">CURRENT COURSE</p>
                <h3 className="text-lg font-bold text-[#1a1a1a]">MedTech Board Mastery</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-5xl font-black font-headline text-primary">67<span className="text-3xl">%</span></span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-2">20/30 Modules Completed</span>
                </div>
                <Progress value={67} className="h-3 bg-muted rounded-full overflow-hidden" />
              </div>

              <Link href="/study" className="block">
                <Button className="w-full h-16 bg-accent hover:bg-accent/90 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98]">
                  Continue: Clinical Chemistry: Carbohydrates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Weekly Leaderboard */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
            <div className="p-6 text-center border-b border-muted">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Weekly Leaderboard</p>
            </div>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="px-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Seasonal Ranking - Top 67</p>
              </div>
              <div className="space-y-8">
                {leaderboardUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-5 group">
                    <Avatar className="h-16 w-16 bg-accent border-none ring-offset-2 group-hover:ring-2 ring-accent/20 transition-all">
                      <AvatarFallback className="bg-accent text-white text-xl font-black">{user.initial}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-lg font-bold text-[#1a1a1a]">{user.name}</p>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{user.xp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                 <div className="h-1 bg-accent/10 rounded-full w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}