import { User, Settings, Award, Shield, Book, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-3xl shadow-md border">
        <Avatar className="h-32 w-32 border-4 border-primary/10">
          <AvatarFallback className="bg-primary text-white text-4xl font-black">AR</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-black font-headline">Alex Rivera</h1>
            <p className="text-muted-foreground font-medium">4th Year Medical Technology Student</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-muted px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Lvl 24</div>
            <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Board Ready: 67%</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm">Edit Profile</Button>
            <Button size="sm" variant="outline"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Mastery Progress
            </CardTitle>
            <CardDescription>Subject area proficiency overview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Clinical Chemistry", val: 78 },
              { label: "Hematology", val: 65 },
              { label: "Microbiology", val: 45 },
              { label: "Blood Bank", val: 82 }
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>{item.label}</span>
                  <span className="text-primary">{item.val}%</span>
                </div>
                <Progress value={item.val} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription>Badges earned through questing.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-muted/50 rounded-2xl flex items-center justify-center group hover:bg-primary/10 transition-colors cursor-help">
                <Shield className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              { task: "Completed Hematology Quest", time: "2 hours ago", xp: "+450 XP" },
              { task: "Mock Exam: Passed with 85%", time: "Yesterday", xp: "+1200 XP" },
              { task: "Daily Streak Bonus", time: "2 days ago", xp: "+100 XP" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6">
                <div>
                  <p className="font-bold text-sm">{item.task}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <span className="font-black text-primary">{item.xp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
