import { User, Settings, Award, Shield, History, MapPin, Calendar, Mail, Zap, Trophy, Swords, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 px-4 lg:px-6 space-y-8 lg:space-y-10">
      {/* Profile Header Card */}
      <header className="relative bg-white p-6 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl border overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 p-4 lg:p-8 opacity-[0.03] pointer-events-none">
          <Zap className="w-32 h-32 lg:w-64 lg:h-64 text-primary" />
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
          <div className="relative group">
            <Avatar className="h-32 w-32 lg:h-44 lg:w-44 border-4 lg:border-8 border-primary/5 shadow-2xl transition-transform group-hover:scale-105 duration-500">
              <AvatarImage src="https://picsum.photos/seed/alex-v2/300/300" />
              <AvatarFallback className="bg-primary text-white text-4xl lg:text-6xl font-black">AR</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 bg-accent text-white p-2 lg:p-3 rounded-xl lg:rounded-2xl shadow-lg border-2 lg:border-4 border-white">
              <Shield className="w-5 h-5 lg:w-7 lg:h-7" />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-4 lg:space-y-6">
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-3xl lg:text-5xl font-black font-headline tracking-tight text-slate-900">Alex Rivera</h1>
              <p className="text-muted-foreground font-bold flex items-center justify-center lg:justify-start gap-2 text-sm uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-primary" /> Manila, Philippines
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-3">
              <Badge className="bg-primary text-white px-3 lg:px-5 py-1 lg:py-2 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.1em] shadow-sm">
                Lvl 24 Aspirant
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 lg:px-5 py-1 lg:py-2 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-[0.1em]">
                MedTech Class of 2024
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <Button className="h-12 lg:h-14 px-6 lg:px-10 rounded-xl lg:rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto">
                <Settings className="w-4 h-4 mr-2" /> Account Settings
              </Button>
              <Button variant="outline" className="h-12 lg:h-14 px-6 lg:px-10 rounded-xl lg:rounded-2xl font-black text-sm uppercase tracking-wider border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto">
                Edit Persona
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Stats Sidebar */}
        <div className="space-y-6 lg:space-y-8">
          <Card className="border-none shadow-lg rounded-[1.5rem] lg:rounded-[2rem] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg uppercase tracking-tight font-black">Aspirant Vitals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-primary/5">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-600 fill-current" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">12 Day Streak</span>
                </div>
                <Badge className="bg-primary text-white border-none font-black text-[10px]">+20% XP</Badge>
              </div>
              <div className="space-y-4 px-1">
                <div className="flex items-center gap-4 text-xs lg:text-sm font-bold text-muted-foreground group">
                  <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> 
                  alex.rivera@medu.edu
                </div>
                <div className="flex items-center gap-4 text-xs lg:text-sm font-bold text-muted-foreground group">
                  <Calendar className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> 
                  Joined February 2024
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-[1.5rem] lg:rounded-[2rem] bg-primary text-white p-8 lg:p-10 overflow-hidden relative group">
            <div className="relative z-10 space-y-2">
               <h3 className="font-headline font-black text-2xl lg:text-3xl uppercase tracking-tighter">Top 12%</h3>
               <p className="text-white/80 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em]">Global Aspirant Rank</p>
            </div>
            <Trophy className="absolute bottom-0 right-0 w-32 h-32 lg:w-40 lg:h-40 -mb-8 -mr-8 opacity-20 text-white transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700" />
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Card className="border-none shadow-lg rounded-[1.5rem] lg:rounded-[2rem] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-xl lg:text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                    <Award className="w-6 h-6 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                    Badges of Clinical Excellence
                  </CardDescription>
                </div>
                <Button variant="link" className="text-[10px] font-black text-primary uppercase underline-offset-4 p-0 h-auto">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-5 gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="group relative">
                  <div className={cn(
                    "aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 cursor-help border-2",
                    i < 6 
                      ? "bg-primary/5 border-primary/10 group-hover:bg-primary/10 group-hover:-translate-y-1 shadow-sm" 
                      : "bg-muted/30 border-transparent grayscale opacity-40"
                  )}>
                    <Shield className={cn(
                      "w-8 h-8 transition-all duration-300",
                      i < 6 ? "text-primary scale-100" : "text-slate-400 scale-75"
                    )} />
                  </div>
                  {i < 6 && (
                    <div className="absolute -top-1 -right-1">
                      <Zap className="w-3 h-3 text-yellow-500 fill-current animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-[1.5rem] lg:rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-6 lg:p-8">
              <CardTitle className="font-headline text-lg lg:text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                <History className="w-5 h-5 text-primary" />
                Battle Expedition Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {[
                  { task: "Mastered Hematology Quest", time: "2 hours ago", xp: "+450 XP", type: "quest" },
                  { task: "Simulated Exam Completion", time: "Yesterday", xp: "+1200 XP", type: "exam" },
                  { task: "Daily Intel Streak Bonus", time: "2 days ago", xp: "+100 XP", type: "bonus" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-primary/[0.02] transition-colors cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl shadow-sm",
                        item.type === 'quest' ? "bg-maroon-50 text-primary border border-primary/10" : 
                        item.type === 'exam' ? "bg-accent/10 text-accent border border-accent/10" : 
                        "bg-yellow-50 text-yellow-600 border border-yellow-100"
                      )}>
                        {item.type === 'quest' ? <Swords className="w-4 h-4" /> : item.type === 'exam' ? <ClipboardCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-900 leading-tight">{item.task}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-70">{item.time}</p>
                      </div>
                    </div>
                    <span className="font-black text-primary text-sm tracking-tight">{item.xp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
