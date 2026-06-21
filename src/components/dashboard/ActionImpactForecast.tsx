'use client';

/**
 * Action Impact Forecast Component
 * Shows estimated CO₂ reduction, time required, difficulty, and annual impact for recommendations
 */

import { motion } from 'framer-motion';
import {
  TrendingDown,
  Clock,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import { ECO_ACTIONS, EcoAction } from '@/lib/actions';
import type { ImpactLevel, EmissionBreakdown } from '@/types';

interface ActionImpactData {
  action: EcoAction;
  estimatedCO2Reduction: number;
  annualImpact: number;
  monthlyImpact: number;
  tips: string[];
}

/**
 * Calculate impact based on user's emission breakdown
 */
function calculateActionImpact(
  action: EcoAction,
  userBreakdown: EmissionBreakdown
): ActionImpactData {
  const categoryMultiplier = {
    transport: userBreakdown.transport / 3,
    energy: userBreakdown.energy / 2,
    diet: userBreakdown.diet / 2.5,
    shopping: userBreakdown.shopping / 0.5,
  };

  const multiplier = categoryMultiplier[action.category] || 1;
  const adjustedImpact = action.co2Saving * Math.min(2, Math.max(0.5, multiplier));

  return {
    action,
    estimatedCO2Reduction: adjustedImpact,
    annualImpact: adjustedImpact,
    monthlyImpact: adjustedImpact / 12,
    tips: generateTips(action),
  };
}

/**
 * Generate contextual tips for the action
 */
function generateTips(action: EcoAction): string[] {
  const tips: Record<string, string[]> = {
    'led-bulbs': [
      'Replace one bulb at a time for gradual savings',
      'Look for Energy Star certified LEDs',
      'Choose warm white for living areas',
    ],
    'meatless-mondays': [
      'Try lentil soup or chickpea curry as alternatives',
      'Use meat substitutes like tofu or tempeh',
      'Experiment with international cuisines',
    ],
    'public-transport': [
      'Download transit apps for real-time schedules',
      'Combine errands to minimize trips',
      'Consider a monthly pass for savings',
    ],
    'cold-wash': [
      'Use cold-water detergent for best results',
      'Full loads are more energy efficient',
      'Air dry when possible',
    ],
    'second-hand': [
      'Check local thrift stores and online marketplaces',
      'Look for quality brands that last longer',
      'Organize a clothing swap with friends',
    ],
  };

  return tips[action.id] || [
    'Start small and build the habit gradually',
    'Track your progress to stay motivated',
    'Celebrate each completed action',
  ];
}

/**
 * Get difficulty color and label
 */
function getDifficultyInfo(difficulty: EcoAction['difficulty']) {
  const info: Record<EcoAction['difficulty'], { color: string; bgColor: string; label: string }> = {
    Easy: { color: 'text-emerald', bgColor: 'bg-emerald/10', label: 'Easy' },
    Medium: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', label: 'Medium' },
    Hard: { color: 'text-red-400', bgColor: 'bg-red-500/10', label: 'Hard' },
  };
  return info[difficulty];
}

/**
 * Get impact level info
 */
function getImpactInfo(impact: ImpactLevel) {
  const info: Record<ImpactLevel, { color: string; bgColor: string }> = {
    High: { color: 'text-emerald', bgColor: 'bg-emerald/10' },
    Medium: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    Low: { color: 'text-sage', bgColor: 'bg-sage/10' },
  };
  return info[impact];
}

export default function ActionImpactForecast() {
  const { user } = useEcoStore();

  // Calculate impact for all actions
  const actionImpacts = ECO_ACTIONS.map((action) =>
    calculateActionImpact(action, user.breakdown)
  ).sort((a, b) => b.estimatedCO2Reduction - a.estimatedCO2Reduction);

  // Top 3 actions
  const topActions = actionImpacts.slice(0, 3);

  return (
    <div className="glass-card p-6" role="region" aria-labelledby="impact-title">
      <h3
        id="impact-title"
        className="text-xl font-bold mb-6 flex items-center space-x-2"
      >
        <BarChart3 className="w-6 h-6 text-emerald" aria-hidden="true" />
        <span>Action Impact Forecast</span>
      </h3>

      {/* Top recommended actions */}
      <div className="space-y-4" role="list" aria-label="Recommended actions with impact forecast">
        {topActions.map((impact, index) => {
          const difficultyInfo = getDifficultyInfo(impact.action.difficulty);
          const impactInfo = getImpactInfo(impact.action.impact);
          const isCompleted = user.completedActions.includes(impact.action.id);

          return (
            <motion.div
              key={impact.action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald/5 border-emerald/20'
                  : 'bg-white/5 border-white/10 hover:border-emerald/30'
              }`}
              role="listitem"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {isCompleted ? (
                    <div className="p-2 rounded-lg bg-emerald/10">
                      <CheckCircle2 className="w-5 h-5 text-emerald" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald to-moss flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">
                      {impact.action.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyInfo.bgColor} ${difficultyInfo.color}`}>
                        {difficultyInfo.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${impactInfo.bgColor} ${impactInfo.color}`}>
                        {impact.action.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <TrendingDown className="w-4 h-4 mx-auto mb-1 text-emerald" aria-hidden="true" />
                  <p className="text-xs font-bold text-emerald">
                    {impact.estimatedCO2Reduction.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-sage/60">tons/year</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-sage" aria-hidden="true" />
                  <p className="text-xs font-bold text-sage">
                    {impact.action.timeRequired}
                  </p>
                  <p className="text-[10px] text-sage/60">time</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <Zap className="w-4 h-4 mx-auto mb-1 text-gold" aria-hidden="true" />
                  <p className="text-xs font-bold text-gold">
                    +{impact.action.xpReward}
                  </p>
                  <p className="text-[10px] text-sage/60">XP</p>
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-1">
                {impact.tips.slice(0, 2).map((tip, i) => (
                  <p key={i} className="text-xs text-sage/60 flex items-start space-x-2">
                    <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total potential reduction */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald/10 to-forest/10 border border-emerald/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm">Total Potential Reduction</h4>
            <p className="text-xs text-sage/60 mt-1">
              If you complete all recommended actions
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gradient">
              {topActions.reduce((sum, a) => sum + a.estimatedCO2Reduction, 0).toFixed(1)}
            </p>
            <p className="text-xs text-sage/60">tons CO₂/year</p>
          </div>
        </div>
      </div>
    </div>
  );
}
