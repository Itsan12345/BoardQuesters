
"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function LayoutContent({ 
  children, 
  isLoggedIn 
}: { 
  children: React.ReactNode; 
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  
  // Hide navigation on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  if (isAuthPage) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full pb-20 lg:pb-0">
      {/* Professional Overlapping Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white/95 backdrop-blur-md px-4 lg:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors hidden lg:flex" />
          <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <div className="p-1.5 rounded-lg">
              <img
                src="/images/boardquestlogo2.png"
                alt="BoardQuest Logo"
                className="h-6 w-6"
              />
            </div>
            <span className="font-black text-foreground leading-none text-base lg:text-lg" style={{ fontFamily: "'Akira Expanded', sans-serif" }}>BoardQuest</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex flex-col items-end text-right hidden xs:flex">
            <span className="text-xs lg:text-sm font-bold text-foreground leading-tight">Alex Rivera</span>
            <span className="text-[9px] lg:text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Lvl 24 Aspirant</span>
          </div>
          <Link href="/profile">
            <Avatar className="h-8 w-8 lg:h-9 lg:w-9 border border-border shadow-sm hover:ring-2 ring-primary/20 transition-all">
              <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">AR</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar visible only on desktop */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Bottom Nav visible only on mobile/tablet */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
