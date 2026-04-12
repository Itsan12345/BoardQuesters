
"use client";

import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { getUserStats, getLeaderboard } from '@/app/actions/user';

function LeaderboardContent() {
  const [user, setUser] = useState<any>(null);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [stats, leaders] = await Promise.all([
        getUserStats(),
        getLeaderboard()
      ]);
      setUser(stats);
      setTopUsers(leaders);
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
        <Card className="border-none shadow-md bg-white p-6 text-center space-y-2">
          <Medal className="w-8 h-8 text-yellow-500 mx-auto" />
          <p className="text-xs font-bold text-muted-foreground uppercase">Expedition Level</p>
          <h3 className="text-3xl font-semibold">Lvl {user?.level || 1}</h3>
        </Card>
        <Card className="border-none shadow-md bg-white p-6 text-center space-y-2">
          <Star className="w-8 h-8 text-primary mx-auto" />
          <p className="text-xs font-bold text-muted-foreground uppercase">Total XP</p>
          <h3 className="text-3xl font-semibold">{user?.xp?.toLocaleString() || 0}</h3>
        </Card>
        <Card className="border-none shadow-md bg-white p-6 text-center space-y-2">
          <TrendingUp className="w-8 h-8 text-accent mx-auto" />
          <p className="text-xs font-bold text-muted-foreground uppercase">Streak</p>
          <h3 className="text-3xl font-semibold">{user?.streak || 0} Days</h3>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg font-headline">Regional Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {topUsers.map((u, idx) => (
              <div key={u.id} className={`flex items-center gap-4 p-6 transition-colors ${u.id === user?.id ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
                <div className="w-8 text-center font-bold font-headline text-lg text-muted-foreground">{idx + 1}</div>
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className={u.id === user?.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}>{u.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{u.name}</p>
                    {u.id === user?.id && <Badge className="bg-primary text-[10px] h-4">You</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Level {u.level} Aspirant</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary text-xl">{u.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Total XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardContent />
    </ProtectedRoute>
  );
}
