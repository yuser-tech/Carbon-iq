import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { calculateStreak } from '@/lib/streaks';
import { checkNewBadges } from '@/lib/badges';
import type { Goal, Habit, Milestone, Theme, EmissionBreakdown } from '@/types';

export interface HistoryEntry {
  date: string;
  score: number;
  breakdown: EmissionBreakdown;
}

export interface UserData {
  onboarded: boolean;
  score: number;
  breakdown: EmissionBreakdown;
  history: HistoryEntry[];
  goals: Goal[];
  completedActions: string[];
  badges: string[];
  xp: number;
  level: number;
  streak: number;
  lastUpdate: string;
  theme: Theme;
  habits: Habit[];
  milestones: Milestone[];
}

interface EcoState {
  user: UserData;
  setUserData: (data: Partial<UserData>) => void;
  addXP: (amount: number) => void;
  completeAction: (actionId: string, xpReward: number) => void;
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
  checkAchievements: () => void;
  resetData: () => void;
  setTheme: (theme: Theme) => void;
  addHabitCompletion: (habitId: string, date: string) => void;
  addMilestone: (milestone: Milestone) => void;
}

const CARBONIQ_STORAGE_KEY = 'carboniq-eco-storage';
const LEGACY_GREENPULSE_STORAGE_KEY = 'greenpulse-eco-storage';

const getCarbonIQStorage = () => ({
  getItem: (name: string) => {
    const value = localStorage.getItem(name);

    if (value !== null || name !== CARBONIQ_STORAGE_KEY) {
      return value;
    }

    const legacyValue = localStorage.getItem(LEGACY_GREENPULSE_STORAGE_KEY);

    if (legacyValue !== null) {
      localStorage.setItem(CARBONIQ_STORAGE_KEY, legacyValue);
      localStorage.removeItem(LEGACY_GREENPULSE_STORAGE_KEY);
    }

    return legacyValue;
  },
  setItem: (name: string, value: string) => localStorage.setItem(name, value),
  removeItem: (name: string) => localStorage.removeItem(name),
});

const initialUserData: UserData = {
  onboarded: false,
  score: 0,
  breakdown: {
    transport: 0,
    energy: 0,
    diet: 0,
    shopping: 0,
  },
  history: [],
  goals: [],
  completedActions: [],
  badges: [],
  xp: 0,
  level: 1,
  streak: 0,
  lastUpdate: new Date().toISOString(),
  theme: 'dark',
  habits: [],
  milestones: [],
};

export const useEcoStore = create<EcoState>()(
  persist(
    (set, get) => ({
      user: initialUserData,
      setUserData: (data) =>
        set((state) => ({
          user: { ...state.user, ...data, lastUpdate: new Date().toISOString() },
        })),
      addXP: (amount) =>
        set((state) => {
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return {
            user: { ...state.user, xp: newXP, level: newLevel },
          };
        }),
      completeAction: (actionId, xpReward) => {
        set((state) => {
          if (state.user.completedActions.includes(actionId)) return state;
          const newXP = state.user.xp + xpReward;
          const newLevel = Math.floor(newXP / 1000) + 1;
          const newStreak = calculateStreak(state.user.lastUpdate, state.user.streak);
          return {
            user: {
              ...state.user,
              completedActions: [...state.user.completedActions, actionId],
              xp: newXP,
              level: newLevel,
              streak: newStreak,
            },
          };
        });
        get().checkAchievements();
      },
      addGoal: (goal) => 
        set((state) => ({
          user: { ...state.user, goals: [...state.user.goals, goal] }
        })),
      updateGoalProgress: (goalId, amount) =>
        set((state) => ({
          user: {
            ...state.user,
            goals: state.user.goals.map(g => 
              g.id === goalId ? { ...g, current: Math.min(g.target, g.current + amount) } : g
            )
          }
        })),
      checkAchievements: () => {
        const { user } = get();
        const newBadges = checkNewBadges(user, user.badges);
        if (newBadges.length > 0) {
          set((state) => ({
            user: { ...state.user, badges: [...state.user.badges, ...newBadges] }
          }));
        }
      },
      resetData: () => set({ user: initialUserData }),
      setTheme: (theme) =>
        set((state) => ({
          user: { ...state.user, theme },
        })),
      addHabitCompletion: (habitId, date) =>
        set((state) => ({
          user: {
            ...state.user,
            habits: state.user.habits.map(h =>
              h.id === habitId && !h.completedDates.includes(date)
                ? { ...h, completedDates: [...h.completedDates, date] }
                : h
            ),
          },
        })),
      addMilestone: (milestone) =>
        set((state) => ({
          user: { ...state.user, milestones: [...state.user.milestones, milestone] },
        })),
    }),
    {
      name: CARBONIQ_STORAGE_KEY,
      storage: createJSONStorage(getCarbonIQStorage),
    }
  )
);
