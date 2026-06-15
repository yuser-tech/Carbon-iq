export const calculateStreak = (lastUpdate: string, currentStreak: number) => {
  const last = new Date(lastUpdate);
  const now = new Date();
  
  // Reset time to midnight for comparison
  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return currentStreak; // Same day, no change
  } else if (diffDays === 1) {
    return currentStreak + 1; // Consecutive day
  } else {
    return 1; // Streak broken, reset to 1
  }
};
