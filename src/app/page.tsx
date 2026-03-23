import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  return (
    <div className="min-h-full bg-[#f8f8f8] p-6 md:p-12 space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight leading-tight max-w-2xl">
          Master Your Boards, <br />
          <span className="text-primary">Level Up Your Knowledge</span>
        </h1>
        <Link href="/quest">
          <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            Start Quest <Zap className="ml-2 h-5 w-5 fill-current" />
          </Button>
        </Link>
      </section>

      {/* Your Study Dashboard Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-headline text-[#1a1a1a]">Your Study Dashboard</h2>
          <p className="text-muted-foreground text-sm font-medium">Real-time tracking of your journey to professional certification</p>
        </div>

        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="space-y-1">
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Current Course</p>
              <h3 className="text-2xl font-bold font-headline text-[#1a1a1a]">MedTech Board Mastery</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-6xl font-black font-headline text-primary">67%</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pb-2">20/30 Modules Completed</span>
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
      </section>

      {/* Weekly Leaderboard Section */}
      <section className="space-y-4">
         <Card className="border-none shadow-sm rounded-[1.5rem] bg-white p-6 flex items-center justify-center min-h-[80px]">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Weekly Leaderboard</p>
         </Card>
      </section>
    </div>
  );
}
