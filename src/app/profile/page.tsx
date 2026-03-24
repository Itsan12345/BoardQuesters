import { User, Settings, Award, Shield, History, MapPin, Calendar, Mail, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10">
      {/* Profile Header */}
      <header className="relative bg-white p-10 rounded-[3rem] shadow-xl border overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap className="w-48 h-48 text-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative">
            <Avatar className="h-40 w-40 border-8 border-primary/5 shadow-2xl">
              <AvatarImage src="https://picsum.photos/seed/alex/200/200" />
              <AvatarFallback className="bg-primary text-white text-5xl font-black">AR</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-accent text-white p-2 rounded-2xl shadow-lg border-4 border-white">
              <Shield className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black font-headline tracking-tight">Alex Rivera</h1>
              <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4" /> Manila, Philippines
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge className="bg-primary text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md">Lvl 24 Aspirant</Badge>
              <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest">MedTech Class of 2024</Badge>
            </div>

            <div className="flex justify-center md:justify-start gap-3">
              <Button className="h-11 px-8 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">
                <Settings className="w-4 h-4 mr-2" /> Account Settings
              </Button>
              <Button variant="outline" className="h-11 px-8 rounded-2xl font-bold border-2">
                Edit Persona
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Stats Sidebar */}
        <div className="space-y-8">
           <Card className="border-none shadow-lg rounded-[2.5rem] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg">Aspirant Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold">12 Day Streak</span>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-600 border-none font-black">+20% XP</Badge>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <Mail className="w-4 h-4" /> alex.rivera@medu.edu
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Joined February 2024
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-[2.5rem] bg-accent text-white p-8 overflow-hidden relative">
            <div className="relative z-10 space-y-2">
               <h3 className="font-headline font-bold text-xl uppercase tracking-tighter">Top 12%</h3>
               <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Global Ranking</p>
            </div>
            <Trophy className="absolute bottom-0 right-0 w-32 h-32 -mb-8 -mr-8 opacity-20 text-white" />
          </Card>
        </div>

        {/* Achievements and History */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-lg rounded-[2.5rem] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Badges earned through your BoardQuest journey.</CardDescription>
                </div>
                <span className="text-xs font-bold text-primary uppercase underline cursor-pointer">View All</span>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-4 sm:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="group relative">
                  <div className="aspect-square bg-muted/50 rounded-2xl flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:-translate-y-1 cursor-help border-2 border-transparent group-hover:border-primary/20">
                    <Shield className={cn(
                      "w-8 h-8 transition-colors",
                      i < 5 ? "text-primary" : "text-muted-foreground/30"
                    )} />
                  </div>
                  {i >= 5 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Zap className="w-4 h-4 text-muted-foreground/20" />
                  </div>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { task: "Completed Hematology Quest", time: "2 hours ago", xp: "+450 XP", type: "quest" },
                  { task: "Mock Exam: Passed with 85%", time: "Yesterday", xp: "+1200 XP", type: "exam" },
                  { task: "Daily Streak Bonus", time: "2 days ago", xp: "+100 XP", type: "bonus" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-xl",
                        item.type === 'quest' ? "bg-blue-100 text-blue-600" : item.type === 'exam' ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-600"
                      )}>
                        {item.type === 'quest' ? <Sword className="w-4 h-4" /> : item.type === 'exam' ? <ClipboardCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">{item.task}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">{item.time}</p>
                      </div>
                    </div>
                    <span className="font-black text-primary text-sm">{item.xp}</span>
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
