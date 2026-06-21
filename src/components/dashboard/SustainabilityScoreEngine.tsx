'use client';

/**
 * Sustainability Score Engine Component
 * Generates Environmental IQ Score with Carbon Score, Sustainability Grade,
 * Improvement Potential, and Progress Trend
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  BarChart3,
} from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import type { ActionCategory, SustainabilityScore, EmissionBreakdown, HistoryEntry } from '@/types';

interface CategoryScore {
  score: number;
  grade: string;
  maxScore: number;
  category: ActionCategory;
}

/**
 * Calculate grade based on score
 */
function calculateGrade(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

/**
 * Get grade color
 */
function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-emerald';
  if (grade.startsWith('B')) return 'text-moss';
  if (grade.startsWith('C')) return 'text-sage';
  if (grade.startsWith('D')) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Get trend icon and color
 */
function getTrendInfo(trend: SustainabilityScore['progressTrend']) {
  const info: Record<SustainabilityScore['progressTrend'], { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
    improving: {
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-emerald',
      bgColor: 'bg-emerald/10',
      label: 'Improving',
    },
    stable: {
      icon: <Minus className="w-5 h-5" />,
      color: 'text-sage',
      bgColor: 'bg-sage/10',
      label: 'Stable',
    },
    declining: {
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      label: 'Declining',
    },
  };
  return info[trend];
}

/**
 * Calculate overall sustainability score
 */
function calculateSustainabilityScore(
  score: number,
  breakdown: EmissionBreakdown,
  history: HistoryEntry[]
): SustainabilityScore {
  // Normalize score (lower is better, so invert)
  const maxScore = 20;
  const carbonScore = Math.max(0, Math.min(100, ((maxScore - score) / maxScore) * 100));
  
  // Calculate sustainability grade
  const sustainabilityGrade = calculateGrade(carbonScore, 100);
  
  // Calculate improvement potential
  const nationalAvg = 8.5;
  const globalBest = 2.0;
  const improvementPotential = Math.max(0, Math.min(100, ((nationalAvg - score) / (nationalAvg - globalBest)) * 100));
  
  // Calculate progress trend from history
  let progressTrend: SustainabilityScore['progressTrend'] = 'stable';
  if (history.length >= 2) {
    const recentScores = history.slice(-3).map((h: HistoryEntry) => h.score);
    const avgRecent = recentScores.reduce((a: number, b: number) => a + b, 0) / recentScores.length;
    const olderScores = history.slice(0, Math.min(3, history.length - 1)).map((h: HistoryEntry) => h.score);
    const avgOlder = olderScores.reduce((a: number, b: number) => a + b, 0) / olderScores.length;
    
    if (avgRecent < avgOlder * 0.95) {
      progressTrend = 'improving';
    } else if (avgRecent > avgOlder * 1.05) {
      progressTrend = 'declining';
    }
  }
  
  // Calculate category breakdown
  const categories: ActionCategory[] = ['transport', 'energy', 'diet', 'shopping'];
  const categoryScores: CategoryScore[] = categories.map((category) => {
    const value = breakdown[category];
    const maxValues: Record<ActionCategory, number> = {
      transport: 5,
      energy: 3,
      diet: 3.5,
      shopping: 1,
    };
    const maxCategoryScore = maxValues[category];
    const normalizedScore = Math.max(0, ((maxCategoryScore - value) / maxCategoryScore) * 100);
    
    return {
      score: normalizedScore,
      grade: calculateGrade(normalizedScore, 100),
      maxScore: 100,
      category,
    };
  });
  
  return {
    carbonScore,
    sustainabilityGrade,
    improvementPotential,
    progressTrend,
    breakdown: categoryScores,
  };
}

export default function SustainabilityScoreEngine() {
  const { user } = useEcoStore();
  
  const scoreData = useMemo(
    () => calculateSustainabilityScore(user.score, user.breakdown, user.history),
    [user.score, user.breakdown, user.history]
  );
  
  const trendInfo = getTrendInfo(scoreData.progressTrend);
  
  const categoryLabels: Record<ActionCategory, string> = {
    transport: 'Transport',
    energy: 'Energy',
    diet: 'Diet',
    shopping: 'Shopping',
  };

  return (
    <div className="glass-card p-6" role="region" aria-labelledby="score-engine-title">
      <h3
        id="score-engine-title"
        className="text-xl font-bold mb-6 flex items-center space-x-2"
      >
        <Award className="w-6 h-6 text-gold" aria-hidden="true" />
        <span>Environmental IQ Score</span>
      </h3>

      {/* Main score display */}
      <div className="flex items-center justify-center mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Background ring */}
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/5"
            />
            {/* Progress ring */}
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={440}
              initial={{ strokeDashoffset: 440 }}
              animate={{ strokeDashoffset: 440 - (scoreData.carbonScore / 100) * 440 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1B5E20" />
                <stop offset="100%" stopColor="#4CAF50" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black">{Math.round(scoreData.carbonScore)}</span>
            <span className="text-xs text-sage/60 uppercase tracking-widest">IQ Score</span>
          </div>
        </motion.div>
      </div>

      {/* Grade badge */}
      <div className="flex justify-center mb-6">
        <div className={`px-6 py-2 rounded-full ${getGradeColor(scoreData.sustainabilityGrade)} bg-current/10 flex items-center space-x-2`}>
          <Award className="w-5 h-5" aria-hidden="true" />
          <span className="font-bold text-lg">Grade: {scoreData.sustainabilityGrade}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Improvement Potential */}
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-emerald" aria-hidden="true" />
          <p className="text-2xl font-bold text-emerald">{Math.round(scoreData.improvementPotential)}%</p>
          <p className="text-xs text-sage/60 mt-1">Improvement Potential</p>
        </div>

        {/* Progress Trend */}
        <div className={`p-4 rounded-xl ${trendInfo.bgColor} text-center`}>
          <div className={`${trendInfo.color} flex justify-center mb-2`}>
            {trendInfo.icon}
          </div>
          <p className={`text-2xl font-bold ${trendInfo.color}`}>{trendInfo.label}</p>
          <p className="text-xs text-sage/60 mt-1">Progress Trend</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3" role="list" aria-label="Score breakdown by category">
        <h4 className="text-sm font-semibold text-sage/80 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" aria-hidden="true" />
          <span>Category Breakdown</span>
        </h4>
        
        {scoreData.breakdown.map((category) => (
          <div key={category.category} className="space-y-1" role="listitem">
            <div className="flex justify-between text-sm">
              <span className="text-sage/80">{categoryLabels[category.category]}</span>
              <span className={`font-bold ${getGradeColor(category.grade)}`}>
                {category.grade}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald to-moss"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
