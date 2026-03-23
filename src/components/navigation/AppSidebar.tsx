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
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-bold text-primary leading-none">BoardQuest</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">MedTech Prep</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
                        "h-12 px-4 rounded-xl transition-all",
                        isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-muted"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-bold text-sm">{item.name}</span>
                        {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50 group-data-[collapsible=icon]:hidden" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-white text-[10px] font-bold">AR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold">Alex Rivera</span>
            <span className="text-[10px] text-muted-foreground font-medium">Lvl 24 Aspirant</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
