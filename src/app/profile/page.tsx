"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, MapPin, Mail, Calendar as CalendarIcon, Zap, Trophy, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { logout } from '@/app/actions/auth';
import { getUserProfile } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';
import { BADGES, BadgeId } from '@/lib/badge-system';
import { format } from 'date-fns';

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
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-8">
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
                    <h1 className="text-3xl font-semibold text-slate-900">{userProfile.name}</h1>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" /> {userProfile.location}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-[#8B0000] text-white font-semibold text-xs px-3 py-1">
                      LVL {userProfile.level} ASPIRANT
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
          </CardContent>
        </Card>

        {/* Stats and Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Aspirants Stats Card */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Aspirants Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-sm text-slate-900">{userProfile.streak} Days Streak</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 font-semibold text-[10px]">+20% XP</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 font-medium">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 font-medium">
                      Joined {format(new Date(userProfile.createdAt), 'MMMM yyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Ranking Card */}
            <Card className="border-none shadow-lg rounded-2xl bg-[#8B0000] text-white">
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
            {/* Achievements/Badges Grid */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#8B0000]" /> Achievements
                  </CardTitle>
                  <span className="text-sm font-bold text-slate-500">
                    {userProfile.achievements?.filter(a => a.badge).length || 0} badges
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  Badges earned through your BoardQuest journey.
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {userProfile.achievements && userProfile.achievements.filter(a => a.badge).length > 0 ? (
                    userProfile.achievements
                      .filter(a => a.badge)
                      .map((achievement) => {
                        const badgeData = BADGES[achievement.badge as BadgeId];
                        return (
                          <div
                            key={achievement.id}
                            className="aspect-square bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg flex flex-col items-center justify-center border-2 border-yellow-300 p-2 group cursor-pointer hover:shadow-lg transition-all"
                            title={badgeData?.name}
                          >
                            <div className="text-2xl">✨</div>
                            <div className="text-center text-[9px] font-bold text-slate-900 mt-1 line-clamp-2">
                              {badgeData?.title || 'Unknown'}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border-2 border-[#8B0000]/10 opacity-50"
                        >
                          <Award className="w-6 h-6 text-[#8B0000]" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#8B0000]" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProfile.achievements && userProfile.achievements.length > 0 ? (
                    userProfile.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-[#8B0000]" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{achievement.task}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {format(new Date(achievement.timestamp), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#8B0000] text-sm">+{achievement.xp} XP</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No activities yet. Start questing!</p>
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
