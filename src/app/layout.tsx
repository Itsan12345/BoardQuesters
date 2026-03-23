import type {Metadata} from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { ShieldCheck } from 'lucide-react';

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
              <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 px-4 backdrop-blur-md md:px-6">
                <SidebarTrigger className="text-primary" />
                <div className="flex items-center gap-2 md:hidden">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="font-headline font-bold text-primary">BoardQuest</span>
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
