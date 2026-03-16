
import Link from 'next/link';
import { 
  Trophy, 
  Flame, 
  Star, 
  Zap, 
  BookOpen, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { SubjectProgress } from '@/components/dashboard/SubjectProgress';
import { Progress } from '@/components/ui/progress';
import { 
  XP_PER_QUESTION, 
  calculateLevel, 
  progressToNextLevel, 
  xpForNextLevel,
  SUBJECT_AREAS 
} from '@/lib/game-logic';

// Mock user data representing a 4th-year MedTech student
const mockUser = {
  name: "Alex Rivera",
  xp: 12450,
  streak: 12,
  rank: 42,
  totalQuests: 158,
  subjects: {
    "Clinical Chemistry": 78,
    "Hematology": 85,
    "Microbiology": 62,
    "Immunohematology": 91,
    "Clinical Microscopy": 88,
    "Histopathology & MT Laws": 55
  }
};

const leaderboard = [
  { name: "Sofia M.", xp: 15200, level: 14 },
  { name: "John D.", xp: 14800, level: 13 },
  { name: "Elena K.", xp: 13900, level: 12 },
  { name: "Alex R.", xp: 12450, level: 12, isUser: true },
  { name: "Mark T.", xp: 11200, level: 11 },
];

export default function Dashboard() {
  const currentLevel = calculateLevel(mockUser.xp);
  const nextLevelXp = xpForNextLevel(currentLevel);
  const progressPercent = progressToNextLevel(mockUser.xp);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            BoardQuest
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Welcome back, {mockUser.name}! Your exam is in 45 days.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/quest">
            <Button size="lg" className="bg-accent hover:bg-accent/90 shadow-lg group">
              <Zap className="mr-2 h-5 w-5 fill-white group-hover:scale-110 transition-transform" />
              Daily Quest
            </Button>
          </Link>
          <Link href="/exam">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Mock Exam
            </Button>
          </Link>
        </div>
      </header>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-2 overflow-hidden border-none shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">Global Ranking</p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-4xl font-bold font-headline">Level {currentLevel}</h2>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    Master Class
                  </div>
                </div>
              </div>
              <Award className="w-10 h-10 text-primary opacity-20" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{mockUser.xp.toLocaleString()} XP</span>
                <span className="text-muted-foreground">{nextLevelXp.toLocaleString()} XP for Level {currentLevel + 1}</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <StatCard 
          label="Study Streak" 
          value={`${mockUser.streak} Days`} 
          icon={Flame} 
          colorClass="bg-orange-500" 
        />
        <StatCard 
          label="Peer Rank" 
          value={`#${mockUser.rank}`} 
          icon={Trophy} 
          colorClass="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Proficiency Area */}
        <Card className="lg:col-span-2 border-none shadow-md bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="font-headline text-xl">Subject Mastery</CardTitle>
            </div>
            <CardDescription>Performance across major laboratory science areas.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pb-8">
            {Object.entries(mockUser.subjects).map(([subject, proficiency]) => (
              <SubjectProgress key={subject} subject={subject} proficiency={proficiency} />
            ))}
          </CardContent>
          <CardFooter className="bg-muted/50 p-4 justify-center">
            <Link href="/quest" className="text-sm font-medium text-primary hover:underline flex items-center">
              Strengthen weak areas in Learning Quest <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        {/* Leaderboard Area */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <CardTitle className="font-headline text-xl">Top Aspirants</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {leaderboard.map((user, idx) => (
                <div key={user.name} className={`flex items-center justify-between p-4 ${user.isUser ? 'bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-muted-foreground w-6">#{idx + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary border-2 border-white shadow-sm">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className={`font-bold ${user.isUser ? 'text-primary' : ''}`}>
                        {user.name} {user.isUser && "(You)"}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">Level {user.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono">{user.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center p-4">
            <Button variant="ghost" size="sm" className="text-primary font-bold">
              View Full Leaderboard
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <Card className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer border-none shadow-md overflow-hidden">
          <Link href="/quest">
            <div className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold font-headline mb-1">Learning Quest</h3>
                <p className="text-sm text-muted-foreground">AI-assisted spaced repetition practice. Focus on retention and habit building.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform mt-1" />
            </div>
          </Link>
        </Card>
        
        <Card className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer border-none shadow-md overflow-hidden">
          <Link href="/exam">
            <div className="p-6 flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold font-headline mb-1">Mock Examination</h3>
                <p className="text-sm text-muted-foreground">High-stakes, timed simulation with adaptive questions. Real-time difficulty adjustment.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform mt-1" />
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
}
