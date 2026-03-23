"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User,
  Trophy, 
  ClipboardCheck,
  LayoutDashboard,
  GraduationCap,
  Sword,
  Medal
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    ]
  },
  {
    label: "LEARNING MANAGEMENT",
    items: [
      { name: 'Study Curriculum', icon: GraduationCap, href: '/study' },
      { name: 'Quest Arena', icon: Sword, href: '/quest' },
    ]
  },
  {
    label: "ASSESSMENT",
    items: [
      { name: 'Mock Board Exam', icon: ClipboardCheck, href: '/exam' },
    ]
  },
  {
    label: "ANALYTICS & RANKING",
    items: [
      { name: 'Leaderboard', icon: Trophy, href: '/ranks' },
      { name: 'Performance Mastery', icon: Medal, href: '/profile' },
    ]
  },
  {
    label: "USER MANAGEMENT",
    items: [
      { name: 'My Profile', icon: User, href: '/profile' },
    ]
  }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="border-r bg-white shadow-none">
      <SidebarContent className="px-3 gap-0 pt-4">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
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
                          "h-10 px-4 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-primary/5 text-primary font-bold" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="text-sm">{item.name}</span>
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
    </Sidebar>
  );
}
