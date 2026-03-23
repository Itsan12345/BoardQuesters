import Link from 'next/link';
import { Zap, ChevronRight } from 'lucide-react';
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
    <div className="min-h-full bg-[#f8f8f8] p-6 md:p-8 space-y-8">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight leading-tight text-[#1a1a1a]">
          Master Your Boards, <br />
          <span className="text-primary">Level Up Your Knowledge</span>
        </h1>
        <Link href="/quest" className="inline-block">
          <Button size="lg" className="h-12 px-6 rounded-xl text-md font-bold shadow-lg bg-primary hover:bg-primary/90 transition-all flex items-center gap-2">
            Start Quest <Zap className="h-4 w-4 fill-current" />
          </Button>
        </Link>
      </section>

      {/* Section Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-headline text-[#1a1a1a]">Your Study Dashboard</h2>
        <p className="text-sm text-muted-foreground font-medium">Real-time tracking of your journey to professional certification</p>
      </div>

      {/* Main Dashboard Content */}
      <div className="space-y-6">
        {/* CURRENT COURSE Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-headline">CURRENT COURSE</p>
              <h3 className="text-xl font-bold text-[#1a1a1a]">MedTech Board Mastery</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-5xl font-black font-headline text-primary leading-none">67%</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pb-1">20/30 Modules Completed</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: '67%' }} />
              </div>
            </div>

            <Link href="/study" className="block">
              <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                Continue: Clinical Chemistry: Carbohydrates
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Weekly Leaderboard Header */}
        <div className="flex items-center justify-center pt-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Weekly Leaderboard</p>
        </div>
        
        {/* Leaderboard Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-6">
              {leaderboardUsers.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-6 text-center font-black text-muted-foreground text-sm italic">
                    #{idx + 1}
                  </div>
                  <Avatar className="h-12 w-12 bg-accent border-none ring-offset-2 group-hover:ring-2 ring-accent/20 transition-all">
                    <AvatarFallback className="bg-accent text-white text-md font-black">{user.initial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-md font-bold text-[#1a1a1a]">{user.name}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{user.xp}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
