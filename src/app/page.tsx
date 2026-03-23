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

      {/* Main Dashboard Content - Vertical Stack */}
      <div className="max-w-5xl space-y-8">
        {/* TOP: Current Course Floating Box */}
        <section>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-black text-primary uppercase tracking-[0.2em] font-headline">CURRENT COURSE</p>
                <h3 className="text-2xl font-bold text-[#1a1a1a]">MedTech Board Mastery</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-6xl font-black font-headline text-primary">67<span className="text-3xl">%</span></span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">20/30 Modules Completed</span>
                </div>
                <div className="relative pt-2">
                  <Progress value={67} className="h-4 bg-muted rounded-full overflow-hidden" />
                </div>
              </div>

              <Link href="/study" className="block pt-4">
                <Button className="w-full h-16 bg-accent hover:bg-accent/90 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98]">
                  Continue: Clinical Chemistry: Carbohydrates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* BELOW: Weekly Leaderboard */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-headline text-[#1a1a1a]">Weekly Leaderboard</h2>
            <Link href="/ranks" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              View All Rank
            </Link>
          </div>
          
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="px-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Seasonal Ranking - Top Aspirants</p>
              </div>
              <div className="space-y-8">
                {leaderboardUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-5 group">
                    <div className="flex-shrink-0 w-8 text-center font-black text-muted-foreground text-lg italic">
                      #{idx + 1}
                    </div>
                    <Avatar className="h-16 w-16 bg-accent border-none ring-offset-2 group-hover:ring-2 ring-accent/20 transition-all">
                      <AvatarFallback className="bg-accent text-white text-xl font-black">{user.initial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-lg font-bold text-[#1a1a1a]">{user.name}</p>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{user.xp}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              <div className="pt-6">
                 <div className="h-1.5 bg-accent/5 rounded-full w-full" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
