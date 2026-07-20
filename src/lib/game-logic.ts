
export const XP_PER_QUESTION = 50;
export const XP_BONUS_STREAK = 100;

export function calculateLevel(xp: number) {
  // Simple level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number) {
  return Math.pow(currentLevel, 2) * 100;
}

export function progressToNextLevel(xp: number) {
  const level = calculateLevel(xp);
  const currentLevelXp = xpForNextLevel(level - 1);
  const nextLevelXp = xpForNextLevel(level);
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export const SUBJECT_AREAS = [
  "Clinical Chemistry",
  "Hematology",
  "Microbiology",
  "Immunology & Serology and Immunohematology",
  "Clinical Microscopy & Parasitology",
  "Histopathology and Medtech Laws"
];
