import { Trophy, Flame, Zap, Star } from 'lucide-react';

export type BadgeId = 'bronze' | 'silver' | 'gold' | 'streak-7' | 'streak-14' | 'streak-30' | 'speed';
export type ConfidenceLevel = 'Shaky' | 'Steady' | 'Unyielding';

export interface Badge {
  id: BadgeId;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockCondition: string;
  xpReward: number;
  confidenceFactor: number;
}

export const BADGES: Record<BadgeId, Badge> = {
  bronze: {
    id: 'bronze',
    name: 'Bronze Badge',
    title: 'Aspirant',
    description: 'Earned by completing a quest with 40-59% accuracy. You tried hard and learned along the way!',
    icon: 'trophy',
    color: '#CD7F32',
    unlockCondition: '40-59% accuracy',
    xpReward: 50,
    confidenceFactor: 1,
  },
  silver: {
    id: 'silver',
    name: 'Silver Badge',
    title: 'Adept',
    description: 'Earned by completing a quest with 60-79% accuracy. You demonstrated solid competence!',
    icon: 'trophy',
    color: '#C0C0C0',
    unlockCondition: '60-79% accuracy',
    xpReward: 100,
    confidenceFactor: 1.15,
  },
  gold: {
    id: 'gold',
    name: 'Gold Badge',
    title: 'Master',
    description: 'Earned by completing a quest with 100% accuracy. Perfect execution!',
    icon: 'trophy',
    color: '#FFD700',
    unlockCondition: '100% accuracy',
    xpReward: 200,
    confidenceFactor: 1.25,
  },
  'streak-7': {
    id: 'streak-7',
    name: 'Consistent Champion (7 days)',
    title: 'Consistent',
    description: 'Maintained a 7-day streak of consistent daily learning.',
    icon: 'flame',
    color: '#FF6B6B',
    unlockCondition: '7-day streak',
    xpReward: 150,
    confidenceFactor: 1,
  },
  'streak-14': {
    id: 'streak-14',
    name: 'Unstoppable (14 days)',
    title: 'Unstoppable',
    description: 'Maintained a 14-day streak. Your dedication is inspiring!',
    icon: 'flame',
    color: '#FF8C42',
    unlockCondition: '14-day streak',
    xpReward: 200,
    confidenceFactor: 1,
  },
  'streak-30': {
    id: 'streak-30',
    name: 'Legendary (30 days)',
    title: 'Legendary',
    description: 'Maintained a 30-day streak. You are a true champion!',
    icon: 'flame',
    color: '#FFB84D',
    unlockCondition: '30-day streak',
    xpReward: 300,
    confidenceFactor: 1,
  },
  speed: {
    id: 'speed',
    name: 'Swift Solver',
    title: 'Speed Master',
    description: 'Completed a quest in under 2 minutes. Lightning fast!',
    icon: 'zap',
    color: '#FFD700',
    unlockCondition: 'Complete under 2 min',
    xpReward: 75,
    confidenceFactor: 1,
  },
};

export const CONFIDENCE_MULTIPLIERS: Record<ConfidenceLevel, number> = {
  'Shaky': 1.0,
  'Steady': 1.25,
  'Unyielding': 1.5,
};

export interface QuestResult {
  score: number;
  totalQuestions: number;
  confidenceLevel: ConfidenceLevel;
  completionTime: number;
  streak: number;
}

export function calculateEarnedBadges(result: QuestResult): Badge[] {
  const earnedBadges: Badge[] = [];
  const accuracy = (result.score / result.totalQuestions) * 100;

  // Performance badges
  if (accuracy >= 100) {
    earnedBadges.push(BADGES['gold' as BadgeId]);
  } else if (accuracy >= 60) {
    earnedBadges.push(BADGES['silver' as BadgeId]);
  } else if (accuracy >= 40) {
    earnedBadges.push(BADGES['bronze' as BadgeId]);
  }

  // Speed badge (under 2 minutes = 120 seconds)
  if (result.completionTime < 120) {
    earnedBadges.push(BADGES['speed' as BadgeId]);
  }

  // Streak badges
  if (result.streak >= 30) {
    earnedBadges.push(BADGES['streak-30' as BadgeId]);
  } else if (result.streak >= 14) {
    earnedBadges.push(BADGES['streak-14' as BadgeId]);
  } else if (result.streak >= 7) {
    earnedBadges.push(BADGES['streak-7' as BadgeId]);
  }

  return earnedBadges;
}

export function calculateTotalXp(
  baseXp: number,
  earnedBadges: Badge[],
  confidenceLevel: ConfidenceLevel,
  streak: number = 0
): number {
  let streakMultiplier = 1.0;
  if (streak >= 30) streakMultiplier = 2.0;
  else if (streak >= 14) streakMultiplier = 1.5;
  else if (streak >= 7) streakMultiplier = 1.25;
  else if (streak >= 3) streakMultiplier = 1.1;

  const badgeXpBonus = earnedBadges.reduce((sum, badge) => sum + badge.xpReward, 0);
  const confidenceMultiplier = CONFIDENCE_MULTIPLIERS[confidenceLevel];

  return Math.round(((baseXp * streakMultiplier) + badgeXpBonus) * confidenceMultiplier);
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getBadgeIcon(badgeId: BadgeId): typeof Trophy {
  const badge = BADGES[badgeId as BadgeId];
  if (!badge) return Trophy;

  const iconKey = badge.icon as string;
  switch (iconKey) {
    case 'trophy':
      return Trophy;
    case 'flame':
      return Flame;
    case 'zap':
      return Zap;
    case 'star':
      return Star;
    default:
      return Trophy;
  }
}
