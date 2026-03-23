import Link from 'next/link';
import { 
  Zap, 
  ChevronRight,
  User,
  BookOpen,
  Trophy,
  Send,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock user data representing a 4th-year MedTech student
const mockUser = {
  name: "Alex Rivera",
  xp: 12450,
  streak: 12,
  course: "MedTech Board Mastery",
  currentTopic: "Clinical Chemistry: Carbohydrates",
  progress: 67,
  completedModules: 20,
  totalModules: 30
};

const leaderboard = [
  { name: "Cong Mercado Stefan", xp: "3,500 XP This Week", initial: "C" },
  { name: "Ryan Go", xp: "2,500 XP This Week", initial: "R" },
  { name: "Kevin Yap Gomez", xp: "2,100 XP This Week", initial: "K" },
];

export default function Dashboard() {
  return (
    <div className="min-h-full pb-12">
      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-headline leading-tight tracking-tight">
            Master Your Boards,<br />
            <span className="text-primary">Level Up Your Knowledge</span>
          </h1>
        </div>

        <Link href="/quest" className="block">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            Start Quest <Zap className="h-5 w-5 fill-white" />
          </Button>
        </Link>

        <div className="pt-4">
          <h2 className="text-2xl font-bold font-headline">Your Study Dashboard</h2>
          <p className="text-sm text-muted-foreground font-medium">Real-time tracking of your journey to professional certification</p>
        </div>
      </section>

      {/* Course Card */}
      <section className="px-4 mb-6">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <p className="text-xs font-black text-primary uppercase tracking-widest">Current Course</p>
            <CardTitle className="text-xl font-bold">{mockUser.course}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-black text-primary">{mockUser.progress}%</span>
                <span className="text-xs font-bold text-muted-foreground">{mockUser.completedModules}/{mockUser.totalModules} Modules Completed</span>
              </div>
              <Progress value={mockUser.progress} className="h-2.5 bg-secondary" />
            </div>

            <Link href="/study" className="block">
              <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold">
                Continue: {mockUser.currentTopic}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Leaderboard Section */}
      <section className="px-4">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <div className="bg-white border-b py-3 text-center">
            <span className="text-xs font-bold text-muted-foreground">Weekly Leaderboard</span>
          </div>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Seasonal Ranking - Top 87</p>
            </div>
            <div className="divide-y">
              {leaderboard.map((user, idx) => (
                <div key={user.name} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-primary text-white text-xl font-bold">{user.initial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-sm text-muted-foreground font-medium">{user.xp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
