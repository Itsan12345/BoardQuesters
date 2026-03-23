import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'BoardQuest | MedTech Gamified Review',
  description: 'AI-assisted gamified board review system for Medical Technology students.',
};

export default function RootLayout({
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
              <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/90 px-4 backdrop-blur-md md:px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-primary" />
                  <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline font-black text-primary leading-none text-xl tracking-tight">BoardQuest</span>
                      <div className="mt-1">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] h-4 font-black uppercase tracking-wider border-none px-1.5">
                          Aspirant Mode
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-black tracking-tight text-foreground leading-tight">Alex Rivera</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Lvl 24 Aspirant</span>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
                    <AvatarFallback className="bg-primary text-white text-xs font-black">AR</AvatarFallback>
                  </Avatar>
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
