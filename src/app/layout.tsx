import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BoardQuest | MedTech Gamified Review',
  description: 'AI-assisted gamified board review system for Medical Technology students.',
};

export default function RootLayer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              {/* Refined Top Navigation */}
              <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
                  <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="bg-primary/10 p-1.5 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline font-bold text-foreground leading-none text-lg">BoardQuest</span>
                      <div className="mt-0.5">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] h-3.5 font-bold uppercase tracking-wider border-none px-1">
                          Aspirant Mode
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-sm font-bold text-foreground leading-tight">Alex Rivera</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Lvl 24 Aspirant</span>
                  </div>
                  <Link href="/profile">
                    <Avatar className="h-9 w-9 border border-border shadow-sm hover:ring-2 ring-primary/20 transition-all">
                      <AvatarImage src="https://picsum.photos/seed/alex/100/100" />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">AR</AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
