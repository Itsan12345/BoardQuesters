import Link from 'next/link';
import { 
  Zap, 
  ChevronRight,
  User,
  BookOpen,
  Trophy,
  Send,
  Home,
  Users,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

const activityLog = [
  { id: 1, title: "Clinical Chemistry Quiz", type: "System Log", time: "2 hours ago", icon: FileText },
  { id: 2, title: "Hematology Mastery", type: "System Log", time: "5 hours ago", icon: Target },
  { id: 3, title: "Microbiology Quest", type: "System Log", time: "1 day ago", icon: Zap },
];

export default function Dashboard() {
  return (
    <div className="min-h-full pb-12 bg-background/50">
      {/* Hero Section */}
      <section className="px-8 pt-10 pb-6 space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black font-headline leading-tight tracking-tight text-[#1a1a1a]">
            Super Aspirant Dashboard
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Learning analytics and performance monitoring</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary/70">Dashboard</span>
          </div>
        </div>
      </section>

      {/* Analytics Cards Grid - Matching Reference Style */}
      <div className="px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total XP", val: "12.4k", icon: Users, detail: "Lvl 24 Aspirant" },
          { label: "Modules", val: "30", icon: Layers, detail: "Board Mastery" },
          { label: "Quests", val: "14", icon: Zap, detail: "Available now" },
          { label: "Stuck Areas", val: "2", icon: AlertCircle, detail: "Clinical Chem" },
          { label: "Accuracy", val: "67%", icon: Target, detail: "Units Mastered" },
          { label: "Streak", val: "12", icon: Trophy, detail: "Days active" },
        ].map((stat, i) => (
          <Card key={i} className="border border-border/50 shadow-sm rounded-xl bg-white overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-4 pt-5">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-[#1a1a1a]">{stat.val}</h3>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <section className="lg:col-span-8 space-y-8">
          <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-0 border-b border-border/40">
              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
                  <TabsTrigger value="progress" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none px-0 py-4 text-[10px] font-black uppercase tracking-widest">Learner Progress</TabsTrigger>
                  <TabsTrigger value="assessment" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none px-0 py-4 text-[10px] font-black uppercase tracking-widest">Assessment & Questions</TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none px-0 py-4 text-[10px] font-black uppercase tracking-widest">Resources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="progress" className="py-10 px-6">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Attempts Over Time</h4>
                          <p className="text-xs text-muted-foreground">Daily board preparation trends</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg h-8 text-[10px] font-bold uppercase tracking-widest">
                        View by Daily <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="h-64 flex items-end gap-2 px-2">
                       {/* Mock Chart Visualization */}
                       {[40, 70, 45, 90, 65, 80, 55, 75, 95, 40].map((h, i) => (
                         <div key={i} className="flex-1 bg-primary/5 hover:bg-primary/20 rounded-t-lg transition-all relative group" style={{ height: `${h}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {h}%
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </section>

        {/* Sidebar Analytics Area */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <div>
                <CardTitle className="text-sm font-bold font-headline">Recent Activity</CardTitle>
              </div>
              <Button variant="link" className="text-primary text-[10px] font-black uppercase p-0 h-auto">View All Activity →</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {activityLog.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-5 hover:bg-muted/10 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <log.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs leading-tight">{log.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{log.type} • {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-primary text-white p-8 space-y-4">
             <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6" />
             </div>
             <div className="space-y-1">
                <h4 className="font-bold text-lg font-headline">New Battle Available!</h4>
                <p className="text-white/80 text-xs">A new boss has appeared in the Microbiology region.</p>
             </div>
             <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl border-none shadow-lg transition-transform active:scale-95">
                Accept Challenge
             </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
