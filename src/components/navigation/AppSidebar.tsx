"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Send, 
  User,
  ShieldCheck,
  ClipboardCheck,
  LayoutDashboard,
  GraduationCap,
  Sword,
  Medal,
  Settings
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navGroups = [
  {
    label: "Overview",
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    ]
  },
  {
    label: "Learning Management",
    items: [
      { name: 'Study Curriculum', icon: GraduationCap, href: '/study' },
      { name: 'Quest Arena', icon: Sword, href: '/quest' },
    ]
  },
  {
    label: "Assessment",
    items: [
      { name: 'Mock Board Exam', icon: ClipboardCheck, href: '/exam' },
    ]
  },
  {
    label: "Analytics & Ranking",
    items: [
      { name: 'Leaderboard', icon: Trophy, href: '/ranks' },
      { name: 'Performance Mastery', icon: Medal, href: '/profile' },
    ]
  },
  {
    label: "User Settings",
    items: [
      { name: 'My Profile', icon: User, href: '/profile' },
    ]
  }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r shadow-xl bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-2xl shrink-0 shadow-lg shadow-primary/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-primary leading-none text-xl tracking-tight">BoardQuest</span>
            <div className="mt-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] h-4 font-black uppercase tracking-wider hover:bg-primary/20 border-none px-1.5">
                Aspirant Mode
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 gap-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-4">
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        tooltip={item.name}
                        className={cn(
                          "h-11 px-4 rounded-xl transition-all duration-200",
                          isActive 
                            ? "bg-primary/5 text-primary font-bold shadow-sm" 
                            : "text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="text-sm tracking-tight">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-6 border-t bg-muted/10">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarFallback className="bg-primary text-white text-xs font-black">AR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-foreground leading-tight">Alex Rivera</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Lvl 24 Aspirant</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
