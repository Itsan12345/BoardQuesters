"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signUp } from '@/app/actions/auth';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasNoSpacesEmail = email.length > 0 && !/\s/.test(email);

  const isPasswordLongEnough = password.length >= 8;
  const hasPasswordNumber = /\d/.test(password);
  const hasPasswordSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

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
      <Card className="max-w-md w-full border border-border shadow-2xl rounded-[2.5rem] overflow-hidden bg-background overflow-visible">
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

          <h1 className="text-2xl font-bold tracking-tight text-foreground -mt-1" style={{ fontFamily: "'Akira Expanded', sans-serif" }}>
            BOARDQUEST
          </h1>

          <CardTitle className="text-xl font-black uppercase tracking-widest text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Aspirant <span className="text-primary tracking-tight" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Enroll</span>
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase align-center text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            JOIN AND DEPLOY YOUR BOARD REVIEW<br />STRATEGY
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-1" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Full Name*</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="name"
                  placeholder="Aspirant Alex Rivera"
                  required
                  className="pl-10 h-12 bg-muted border border-slate-300 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-1" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Email Address*</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder="alex@medtech.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className={`pl-10 h-12 bg-muted border ${!isEmailValid && email.length > 0 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} rounded-xl focus-visible:ring-primary/20`}
                />
                
                {/* Email Validation Popover */}
                {isEmailFocused && (
                  <div className="absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 w-64 bg-background rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 border border-border z-50 hidden lg:block">
                    {/* Triangle pointer */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-l border-b border-border rotate-45 rounded-tl-sm" />
                    
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 flex-shrink-0 transition-colors ${isEmailValid ? 'bg-[#d32f2f] text-white' : 'bg-slate-200 text-muted-foreground'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-foreground">Must contain valid email address.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 flex-shrink-0 transition-colors ${hasNoSpacesEmail ? 'bg-[#d32f2f] text-white' : 'bg-slate-200 text-muted-foreground'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-foreground">No spaces allowed.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-1" style={{ fontFamily: "'Inter-bold', sans-serif"}}>Password*</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="pl-10 pr-10 h-12 bg-muted border border-slate-300 rounded-xl focus-visible:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                {/* Password Validation Popover */}
                {isPasswordFocused && (
                  <div className="absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 w-64 bg-background rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 border border-border z-50 hidden lg:block">
                    {/* Triangle pointer */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-l border-b border-border rotate-45 rounded-tl-sm" />
                    
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 flex-shrink-0 transition-colors ${isPasswordLongEnough ? 'bg-[#d32f2f] text-white' : 'bg-slate-200 text-muted-foreground'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-foreground">At least 8 characters.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 flex-shrink-0 transition-colors ${hasPasswordNumber ? 'bg-[#d32f2f] text-white' : 'bg-slate-200 text-muted-foreground'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-foreground">Contains a number.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 flex-shrink-0 transition-colors ${hasPasswordSpecial ? 'bg-[#d32f2f] text-white' : 'bg-slate-200 text-muted-foreground'}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-foreground">Contains a special character.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 mt-4"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  Sign up
                </>
              )}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Already an Aspirant? <Link href="/login" className="text-primary hover:underline">Log In</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

