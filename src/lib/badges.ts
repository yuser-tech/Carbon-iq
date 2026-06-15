export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: (stats: any) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'green-starter',
    title: 'Green Starter',
    description: 'Complete your first carbon assessment.',
    icon: '🌱',
    requirement: (stats) => stats.onboarded === true,
  },
  {
    id: 'carbon-warrior',
    title: 'Carbon Warrior',
    description: 'Achieve a Carbon Grade of A or higher.',
    icon: '⚔️',
    requirement: (stats) => stats.score < 4 && stats.onboarded,
  },
  {
    id: 'action-taker',
    title: 'Action Taker',
    description: 'Complete 5 sustainability actions.',
    icon: '✅',
    requirement: (stats) => stats.completedActions.length >= 5,
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak.',
    icon: '🔥',
    requirement: (stats) => stats.streak >= 7,
  },
];

export const checkNewBadges = (userData: any, currentBadges: string[]) => {
  const newlyEarned = BADGES
    .filter(badge => !currentBadges.includes(badge.id))
    .filter(badge => badge.requirement(userData))
    .map(badge => badge.id);
  
  return newlyEarned;
};
