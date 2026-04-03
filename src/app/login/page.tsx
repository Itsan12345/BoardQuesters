"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { login } from '@/app/actions/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      toast({
        title: "Verification Successful",
        description: "Welcome back, Aspirant. Re-establishing mission parameters.",
      });
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: result.error || "Invalid credentials.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="p-8 pb-4 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black font-headline uppercase tracking-tight text-slate-900">
            Aspirant <span className="text-primary">Log In</span>
          </CardTitle>
          <CardDescription className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Enter your credentials to continue the review
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="alex@medtech.com" 
                  required 
                  className="pl-10 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="pl-10 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-primary/20"
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
                  Verify Credentials
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              New to the expedition? <Link href="/signup" className="text-primary hover:underline">Enroll Now</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
