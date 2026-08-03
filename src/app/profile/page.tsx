"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, MapPin, Mail, Calendar as CalendarIcon, Zap, Trophy, Clock, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { logout } from '@/app/actions/auth';
import { getUserProfile } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';
import { BADGES, BadgeId, getLevelProgress, getRankTitle } from '@/lib/badge-system';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const BADGE_SPRITE_DEFINITIONS: Record<string, {
  title: string;
  sprite: string;
  bgGradient: string;
  borderColor: string;
}> = {
  speed: {
    title: 'Speed Master',
    sprite: '/ui/speedmaster-badge.png',
    bgGradient: 'from-[#FFB732] via-[#FFA000] to-[#F57C00]',
    borderColor: 'border-[#E67E22]',
  },
  'swift-solver': {
    title: 'Speed Master',
    sprite: '/ui/speedmaster-badge.png',
    bgGradient: 'from-[#FFB732] via-[#FFA000] to-[#F57C00]',
    borderColor: 'border-[#E67E22]',
  },
  master: {
    title: 'Master',
    sprite: '/ui/master-badge.png',
    bgGradient: 'from-[#FFB732] via-[#FFA000] to-[#F57C00]',
    borderColor: 'border-[#E67E22]',
  },
  adept: {
    title: 'Adept',
    sprite: '/ui/adept-badge.png',
    bgGradient: 'from-[#7986CB] via-[#5C6BC0] to-[#3F51B5]',
    borderColor: 'border-[#303F9F]',
  },
  bronze: {
    title: 'Bronze',
    sprite: '/ui/bronze-badge.png',
    bgGradient: 'from-[#9C7A68] via-[#5D4037] to-[#2E1C14]',
    borderColor: 'border-[#271B17]',
  },
  gold: {
    title: 'Gold',
    sprite: '/ui/gold-badge.png',
    bgGradient: 'from-[#FFB732] via-[#FFA000] to-[#F57C00]',
    borderColor: 'border-[#E67E22]',
  },
  silver: {
    title: 'Silver',
    sprite: '/ui/silver-badge.png',
    bgGradient: 'from-[#EEEEEE] via-[#757575] to-[#37474F]',
    borderColor: 'border-[#263238]',
  },
  'streak-7': {
    title: 'Adept',
    sprite: '/ui/adept-badge.png',
    bgGradient: 'from-[#7986CB] via-[#5C6BC0] to-[#3F51B5]',
    borderColor: 'border-[#303F9F]',
  },
  'streak-14': {
    title: 'Master',
    sprite: '/ui/master-badge.png',
    bgGradient: 'from-[#FFB732] via-[#FFA000] to-[#F57C00]',
    borderColor: 'border-[#E67E22]',
  },
  'streak-30': {
    title: 'Speed Master',
    sprite: '/ui/speedmaster-badge.png',
    bgGradient: 'from-[#FFB732] via-[#FFA000] to-[#F57C00]',
    borderColor: 'border-[#E67E22]',
  },
};

const DEFAULT_SHOWCASE_BADGES = [
  BADGE_SPRITE_DEFINITIONS.speed,
  BADGE_SPRITE_DEFINITIONS.master,
  BADGE_SPRITE_DEFINITIONS.adept,
  BADGE_SPRITE_DEFINITIONS.bronze,
  BADGE_SPRITE_DEFINITIONS.gold,
  BADGE_SPRITE_DEFINITIONS.silver,
];

interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  location: string;
  createdAt: Date;
  classString: string;
  userRank: number;
  rankingPercentage: number;
  achievements: Array<{
    id: string;
    task: string;
    type: string;
    xp: number;
    timestamp: Date;
    badge?: string;
    confidenceLevel?: string;
    accuracy?: number;
  }>;
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile() as UserProfile | null;

        if (!profile) {
          // User doesn't exist, redirect to login
          router.replace('/login');
          return;
        }

        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  async function handleLogout() {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "See you next time!",
      });
      // Use router.replace instead of window.location for better Next.js integration
      setTimeout(() => {
        router.replace('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  // Extract initials from name
  const initialsFromName = userProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card className="border border-border shadow-xl rounded-3xl bg-background overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                {/* Avatar and Info */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#8B0000] text-white text-2xl font-semibold">
                      {initialsFromName}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-3">
                    <div>
                      <h1 className="text-3xl font-semibold text-foreground">{userProfile.name}</h1>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" /> {userProfile.location}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-1">
                      <Badge className="bg-[#8B0000] text-white font-semibold text-xs px-3 py-1">
                        LVL {userProfile.level} {getRankTitle(userProfile.level).toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="border-[#8B0000] text-[#8B0000] font-semibold text-xs px-3 py-1">
                        {userProfile.classString}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#8B0000] text-[#8B0000] font-semibold"
                >
                  <Settings className="w-4 h-4 mr-2" /> Account Settings
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl bg-[#8B0000] hover:bg-[#660000] text-white font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </div>

            {/* XP Progress Bar */}
            {(() => {
                const progress = getLevelProgress(userProfile.xp);
                return (
                  <div className="flex flex-col gap-1 w-full mt-2">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">XP Progress</span>
                      <span className="text-[10px] font-bold text-[#8B0000]">
                        {progress.currentLevelXp} <span className="text-muted-foreground">/ {progress.xpForNextLevel}</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8B0000]/80 to-[#8B0000] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Stats and Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Aspirants Stats Card */}
            <Card className="border border-border shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Aspirants Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-sm text-foreground">{userProfile.streak} Days Streak</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 font-semibold text-[10px]">+20% XP</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-slate-600 font-medium">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-slate-600 font-medium">
                      Joined {format(new Date(userProfile.createdAt), 'MMMM yyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Ranking Card */}
            <Card className="border border-border shadow-lg rounded-2xl bg-[#8B0000] text-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold">Top {userProfile.rankingPercentage}%</p>
                  <p className="text-sm font-semibold uppercase tracking-widest text-white/80 mt-1">
                    Global Ranking
                  </p>
                </div>
                <Trophy className="w-16 h-16 text-white/30" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements/Badges Grid (Dynamic Earned Badges Only) */}
            <Card className="border border-border shadow-lg rounded-2xl overflow-hidden bg-background">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-[#8B0000]" />
                    <CardTitle className="text-xl font-bold text-foreground">
                      Achievements
                    </CardTitle>
                  </div>
                  <button className="text-sm font-semibold text-[#8B0000] underline underline-offset-4 hover:opacity-80 transition-opacity">
                    View ALL
                  </button>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Badges earned through your BoardQuest journey.
                </p>
              </CardHeader>
              <CardContent className="pt-2 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  {(() => {
                    const earnedBadgeMap = new Map<string, typeof BADGE_SPRITE_DEFINITIONS[string]>();
                    userProfile.achievements?.forEach(a => {
                      if (a.badge && BADGE_SPRITE_DEFINITIONS[a.badge]) {
                        const def = BADGE_SPRITE_DEFINITIONS[a.badge];
                        if (!earnedBadgeMap.has(def.title)) {
                          earnedBadgeMap.set(def.title, def);
                        }
                      }
                    });

                    const earnedBadgesList = Array.from(earnedBadgeMap.values());
                    const lockedCount = Math.max(0, 8 - earnedBadgesList.length);

                    return (
                      <>
                        {earnedBadgesList.map((badge, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "relative aspect-[0.95/1] rounded-[22px] p-3 flex flex-col items-center justify-between border-2 shadow-md hover:scale-105 transition-all duration-200 cursor-pointer overflow-hidden group bg-gradient-to-b animate-in fade-in zoom-in duration-300",
                              badge.bgGradient,
                              badge.borderColor
                            )}
                            title={badge.title}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20 pointer-events-none" />

                            <div className="flex-1 flex items-center justify-center w-full pt-1">
                              <img
                                src={badge.sprite}
                                alt={badge.title}
                                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 transition-transform duration-200"
                                style={{ imageRendering: 'pixelated' }}
                              />
                            </div>

                            <span
                              className="font-bytebounce text-white text-xs sm:text-sm md:text-base tracking-wide text-center leading-none mb-0.5"
                              style={{
                                textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 4px rgba(0,0,0,0.8)'
                              }}
                            >
                              {badge.title}
                            </span>
                          </div>
                        ))}

                        {[...Array(lockedCount)].map((_, i) => (
                          <div
                            key={`locked-${i}`}
                            className="aspect-[0.95/1] rounded-[22px] bg-[#EBEBEB] border-2 border-transparent flex items-center justify-center p-4"
                          >
                            <Shield className="w-10 h-10 md:w-12 md:h-12 text-[#8B0000] stroke-[2.2]" />
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-border shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#8B0000]" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProfile.achievements && userProfile.achievements.length > 0 ? (
                    userProfile.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-[#8B0000]" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{achievement.task}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(achievement.timestamp), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#8B0000] text-sm">+{achievement.xp} XP</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No activities yet. Start questing!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
