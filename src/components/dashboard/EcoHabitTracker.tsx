'use client';

/**
 * Eco Habit Tracker Component
 * Track daily, weekly, and monthly eco-friendly actions with completion rates and impact
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Flame,
  Target,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
} from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import type { ActionCategory, Habit } from '@/types';

type HabitFrequency = 'daily' | 'weekly' | 'monthly';

/**
 * Default eco habits with categories
 */
const DEFAULT_HABITS: Omit<Habit, 'completedDates' | 'streak'>[] = [
  {
    id: 'use-reusable-bags',
    title: 'Use Reusable Bags',
    description: 'Bring reusable bags when shopping',
    category: 'shopping',
    frequency: 'daily',
    targetDays: 7,
    impactScore: 0.1,
  },
  {
    id: 'take-shorter-showers',
    title: 'Take Shorter Showers',
    description: 'Reduce shower time to 5 minutes or less',
    category: 'energy',
    frequency: 'daily',
    targetDays: 7,
    impactScore: 0.2,
  },
  {
    id: 'meatless-day',
    title: 'Meatless Day',
    description: 'Have one day without meat this week',
    category: 'diet',
    frequency: 'weekly',
    targetDays: 1,
    impactScore: 0.5,
  },
  {
    id: 'use-public-transport',
    title: 'Public Transport',
    description: 'Use bus or train instead of driving',
    category: 'transport',
    frequency: 'weekly',
    targetDays: 2,
    impactScore: 1.2,
  },
];

/**
 * Get category icon
 */
function getCategoryIcon(category: ActionCategory) {
  const icons: Record<ActionCategory, React.ReactNode> = {
    transport: <Car className="w-4 h-4" />,
    energy: <Zap className="w-4 h-4" />,
    diet: <Utensils className="w-4 h-4" />,
    shopping: <ShoppingBag className="w-4 h-4" />,
  };
  return icons[category];
}

/**
 * Get today's date string
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

/**
 * Check if habit is completed today
 */
function isCompletedToday(habit: Habit): boolean {
  const today = getTodayString();
  return habit.completedDates.includes(today);
}

/**
 * Calculate completion rate
 */
function getCompletionRate(habit: Habit): number {
  const recentDates = habit.completedDates.slice(-habit.targetDays * 2);
  return (recentDates.length / (habit.targetDays * 2)) * 100;
}

export default function EcoHabitTracker() {
  const { user } = useEcoStore();
  const [selectedFrequency, setSelectedFrequency] = useState<HabitFrequency>('daily');

  const habits = useMemo(() => {
    if (user.habits.length === 0) {
      return DEFAULT_HABITS.map((h) => ({
        ...h,
        completedDates: [] as string[],
        streak: 0,
      }));
    }
    return user.habits;
  }, [user.habits]);

  const filteredHabits = habits.filter((h) => h.frequency === selectedFrequency);

  const stats = useMemo(() => {
    const today = getTodayString();
    const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;
    const totalToday = habits.filter((h) => h.frequency === 'daily').length;
    const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
    const totalImpact = habits.reduce((sum, h) => sum + (h.impactScore * h.completedDates.length), 0);
    const longestStreak = Math.max(...habits.map((h) => h.streak), 0);

    return {
      completedToday,
      totalToday,
      completionRate,
      totalImpact,
      longestStreak,
    };
  }, [habits]);

  const frequencyOptions: { value: HabitFrequency; label: string; icon: React.ReactNode }[] = [
    { value: 'daily', label: 'Daily', icon: <Target className="w-4 h-4" /> },
    { value: 'weekly', label: 'Weekly', icon: <Target className="w-4 h-4" /> },
    { value: 'monthly', label: 'Monthly', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="glass-card p-6" role="region" aria-labelledby="habit-tracker-title">
      <h3
        id="habit-tracker-title"
        className="text-xl font-bold mb-6 flex items-center space-x-2"
      >
        <Flame className="w-6 h-6 text-orange-500" aria-hidden="true" />
        <span>Eco Habit Tracker</span>
      </h3>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-emerald" aria-hidden="true" />
          <p className="text-lg font-bold">{stats.completedToday}/{stats.totalToday}</p>
          <p className="text-[10px] text-sage/60">Today</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-moss" aria-hidden="true" />
          <p className="text-lg font-bold">{Math.round(stats.completionRate)}%</p>
          <p className="text-[10px] text-sage/60">Rate</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" aria-hidden="true" />
          <p className="text-lg font-bold">{stats.longestStreak}</p>
          <p className="text-[10px] text-sage/60">Streak</p>
        </div>
      </div>

      {/* Frequency selector */}
      <div
        className="flex space-x-2 mb-4 p-1 rounded-xl bg-white/5"
        role="tablist"
        aria-label="Filter habits by frequency"
      >
        {frequencyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFrequency(option.value)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all text-sm ${
              selectedFrequency === option.value
                ? 'bg-emerald-green text-white'
                : 'text-sage hover:text-foreground hover:bg-white/5'
            }`}
            role="tab"
            aria-selected={selectedFrequency === option.value}
            aria-controls={`panel-${option.value}`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Habits list */}
      <div
        role="tabpanel"
        id={`panel-${selectedFrequency}`}
        aria-labelledby={`tab-${selectedFrequency}`}
        className="space-y-3"
      >
        {filteredHabits.length === 0 ? (
          <div className="p-6 text-center text-sage/60">
            <p>No habits for this period</p>
          </div>
        ) : (
          filteredHabits.map((habit, index) => {
            const isCompleted = isCompletedToday(habit);
            const completionRate = getCompletionRate(habit);

            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald/5 border-emerald/20'
                    : 'bg-white/5 border-white/10 hover:border-emerald/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    className={`flex-shrink-0 mt-1 transition-all ${
                      isCompleted ? 'text-emerald' : 'text-sage/40 hover:text-emerald'
                    }`}
                    aria-label={`Mark "${habit.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                    aria-pressed={isCompleted}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Circle className="w-6 h-6" aria-hidden="true" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-sage/60' : ''}`}>
                        {habit.title}
                      </h4>
                      <span className="flex items-center space-x-1 text-xs text-sage/60">
                        {getCategoryIcon(habit.category)}
                        <span className="capitalize">{habit.category}</span>
                      </span>
                    </div>
                    <p className="text-xs text-sage/60 mb-2">{habit.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                            role="progressbar"
                            aria-valuenow={Math.round(completionRate)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${Math.round(completionRate)}% completion rate`}
                          />
                        </div>
                        <span className="text-[10px] text-sage/60">
                          {habit.completedDates.length}/{habit.targetDays * 2}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-emerald">
                        +{habit.impactScore.toFixed(1)} tons
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Total impact summary */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald/10 to-forest/10 border border-emerald/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm">Your Impact</h4>
            <p className="text-xs text-sage/60 mt-1">From completed habits</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gradient">
              {stats.totalImpact.toFixed(1)}
            </p>
            <p className="text-xs text-sage/60">tons CO₂ saved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
