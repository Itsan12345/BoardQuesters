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
  ChevronRight,
  ClipboardCheck
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

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Study Curriculum', icon: BookOpen, href: '/study' },
  { name: 'Learning Quest', icon: Send, href: '/quest' },
  { name: 'Mock Exam', icon: ClipboardCheck, href: '/exam' },
  { name: 'Leaderboard', icon: Trophy, href: '/ranks' },
  { name: 'My Profile', icon: User, href: '/profile' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r shadow-xl">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-2xl shrink-0 shadow-lg shadow-primary/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-black text-primary leading-none text-xl tracking-tight">BoardQuest</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-80">MedTech Prep</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Navigations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "h-12 px-4 rounded-2xl transition-all duration-300",
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90" 
                          : "hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                        <span className="font-bold text-sm tracking-tight">{item.name}</span>
                        {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t bg-muted/30">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarFallback className="bg-primary text-white text-xs font-black">AR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-foreground">Alex Rivera</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Lvl 24 Aspirant</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
