import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const topUsers = [
  { name: "Cong Mercado Stefan", xp: 15400, rank: 1, level: 42 },
  { name: "Ryan Go", xp: 14200, rank: 2, level: 39 },
  { name: "Kevin Yap Gomez", xp: 12100, rank: 3, level: 35 },
  { name: "Alex Rivera", xp: 12450, rank: 4, level: 24, isUser: true },
  { name: "Maria Santos", xp: 11200, rank: 5, level: 31 },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <header className="text-center space-y-2">
        <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-headline">Global Hall of Fame</h1>
        <p className="text-muted-foreground">Top aspirants preparing for the MedTech Licensure Examination.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6 text-center space-y-2">
            <Medal className="w-8 h-8 text-yellow-500 mx-auto" />
            <p className="text-xs font-bold text-muted-foreground uppercase">Your Rank</p>
            <h3 className="text-3xl font-black">#87</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6 text-center space-y-2">
            <Star className="w-8 h-8 text-primary mx-auto" />
            <p className="text-xs font-bold text-muted-foreground uppercase">Percentile</p>
            <h3 className="text-3xl font-black">Top 12%</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6 text-center space-y-2">
            <TrendingUp className="w-8 h-8 text-accent mx-auto" />
            <p className="text-xs font-bold text-muted-foreground uppercase">Streak</p>
            <h3 className="text-3xl font-black">12 Days</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg font-headline">Regional Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {topUsers.map((user) => (
              <div key={user.name} className={`flex items-center gap-4 p-6 transition-colors ${user.isUser ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
                <div className="w-8 text-center font-bold font-headline text-lg text-muted-foreground">
                  {user.rank}
                </div>
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className={user.isUser ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}>
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{user.name}</p>
                    {user.isUser && <Badge className="bg-primary text-[10px] h-4">You</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    Level {user.level} Aspirant
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary text-xl">{user.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Total XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
