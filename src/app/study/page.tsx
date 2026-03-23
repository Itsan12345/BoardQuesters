"use client";

import { useState } from 'react';
import { 
  ChevronRight, 
  BookMarked, 
  Clock, 
  PlayCircle,
  FlaskConical,
  Microscope,
  Database,
  Stethoscope,
  ShieldAlert,
  Search,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const MT_CURRICULUM = [
  {
    id: "clinical-chemistry",
    title: "Clinical Chemistry",
    icon: FlaskConical,
    lessons: [
      { id: "cc1", title: "Carbohydrate Metabolism & Disorders", duration: "45m", status: "completed" },
      { id: "cc2", title: "Lipid Profile & Lipoproteins", duration: "60m", status: "in-progress" },
      { id: "cc3", title: "Renal Function Tests & NPNs", duration: "40m", status: "not-started" },
      { id: "cc4", title: "Enzymology & Cardiac Markers", duration: "55m", status: "not-started" }
    ]
  },
  {
    id: "hematology",
    title: "Hematology & Coagulation",
    icon: Microscope,
    lessons: [
      { id: "hem1", title: "RBC Morphology & Anemias", duration: "50m", status: "completed" },
      { id: "hem2", title: "WBC Disorders & Leukemias", duration: "75m", status: "not-started" },
      { id: "hem3", title: "Hemostasis & Platelet Function", duration: "45m", status: "not-started" }
    ]
  },
  {
    id: "microbiology",
    title: "Clinical Microbiology",
    icon: Database,
    lessons: [
      { id: "mic1", title: "Bacteriology: Gram Positives", duration: "65m", status: "completed" },
      { id: "mic2", title: "Enterobacteriaceae & Non-fermenters", duration: "90m", status: "not-started" },
      { id: "mic3", title: "Mycology & Virology Overview", duration: "40m", status: "not-started" }
    ]
  },
  {
    id: "immunohematology",
    title: "Immunohematology (Blood Bank)",
    icon: Stethoscope,
    lessons: [
      { id: "ih1", title: "ABO & Rh Blood Group Systems", duration: "45m", status: "not-started" },
      { id: "ih2", title: "Pre-transfusion Testing Protocols", duration: "55m", status: "not-started" },
      { id: "ih3", title: "Transfusion Reactions & Safety", duration: "30m", status: "not-started" }
    ]
  },
  {
    id: "laws-ethics",
    title: "MT Laws & Bioethics",
    icon: ShieldAlert,
    lessons: [
      { id: "law1", title: "RA 5527: The MT Act of 1969", duration: "40m", status: "not-started" },
      { id: "law2", title: "Code of Ethics for Medical Technology", duration: "25m", status: "not-started" }
    ]
  }
];

export default function StudyPage() {
  const [selectedCategory, setSelectedCategory] = useState(MT_CURRICULUM[0]);

  return (
    <div className="min-h-full pb-12">
      {/* Header */}
      <header className="bg-white border-b px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black font-headline text-primary uppercase tracking-tight">BoardQuest Curriculum</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-bold border-primary text-primary">4th Year</Badge>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search lessons, laws, or protocols..." className="pl-10 h-12 bg-muted/50 border-none rounded-xl" />
        </div>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Category List */}
        <aside className="md:col-span-4 space-y-4">
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Laboratory Sciences</h2>
          <div className="space-y-2">
            {MT_CURRICULUM.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory.id === cat.id;
              const completedCount = cat.lessons.filter(l => l.status === 'completed').length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left",
                    isActive 
                      ? "bg-white shadow-md ring-1 ring-primary/10 translate-x-1" 
                      : "hover:bg-white/50"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-xl",
                    isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-bold text-sm", isActive ? "text-primary" : "text-foreground")}>
                      {cat.title}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {completedCount}/{cat.lessons.length} Completed
                    </p>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground", isActive && "text-primary")} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Lesson View */}
        <section className="md:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl">{selectedCategory.title}</CardTitle>
                  <CardDescription>Major laboratory subject area for MT board review.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">
                    {Math.round((selectedCategory.lessons.filter(l => l.status === 'completed').length / selectedCategory.lessons.length) * 100)}%
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proficiency</p>
                </div>
              </div>
              <Progress 
                value={(selectedCategory.lessons.filter(l => l.status === 'completed').length / selectedCategory.lessons.length) * 100} 
                className="h-1.5 mt-4" 
              />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {selectedCategory.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted font-bold text-muted-foreground text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{lesson.title}</h4>
                          {lesson.status === 'completed' && <Badge className="bg-accent h-4 text-[9px] uppercase">Done</Badge>}
                          {lesson.status === 'in-progress' && <Badge className="bg-orange-500 h-4 text-[9px] uppercase">Current</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.duration}</span>
                          <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] font-bold">
                            <BookMarked className="h-3 w-3" /> Review Material
                          </span>
                        </div>
                      </div>
                      <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                        <PlayCircle className="h-6 w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Activity Preview Card */}
          <Card className="border-none shadow-sm rounded-3xl bg-primary text-white p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-lg">Ready for a challenge?</h3>
                <p className="text-white/80 text-sm">Test your knowledge of {selectedCategory.title} in the Battle Quest.</p>
              </div>
              <Link href="/quest" className="ml-auto">
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                  Go to Quest
                </button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
