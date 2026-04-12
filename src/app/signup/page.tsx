"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signUp } from '@/app/actions/auth';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result.success) {
      toast({
        title: "Account Created",
        description: "Welcome to BoardQuest. Expedition initialized.",
      });
      // Redirect directly to dashboard instead of onboarding
      router.push('/');
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: result.error || "An error occurred during registration.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="p-8 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center">
            <Image
              src="/images/boardquestlogo2.png"
              alt="BoardQuest Logo"
              width={56}
              height={56}
              className="w-20 h-20 -mb-3"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 -mt-1" style={{ fontFamily: "'Akira Expanded', sans-serif" }}>
            BOARDQUEST
          </h1>

          <CardTitle className="text-xl font-black uppercase tracking-widest text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            Aspirant <span className="text-primary tracking-tight" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Enroll</span>
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase align-center text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            JOIN AND DEPLOY YOUR BOARD REVIEW<br />STRATEGY
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  name="name"
                  placeholder="Aspirant Alex Rivera"
                  required
                  className="pl-10 h-12 bg-slate-50 border border-slate-300 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="alex@medtech.com"
                  required
                  className="pl-10 h-12 bg-slate-50 border border-slate-300 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 h-12 bg-slate-50 border border-slate-300 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 mt-4"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Already an Aspirant? <Link href="/login" className="text-primary hover:underline">Log In</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
