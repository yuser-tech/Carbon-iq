'use client';

/**
 * Reduction Roadmap Component
 * Generates 30-day, 90-day, and 1-year plans based on user's footprint
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Circle,
  Target,
  TrendingDown,
  Zap,
} from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';

type PlanPeriod = '30-days' | '90-days' | '1-year';

interface RoadmapMilestone {
  id: string;
  week: number;
  title: string;
  description: string;
  targetReduction: number;
  actions: string[];
  completed: boolean;
}

/**
 * Generate roadmap based on user's current footprint
 */
function generateRoadmap(
  score: number
): Record<PlanPeriod, { title: string; description: string; milestones: RoadmapMilestone[]; totalReduction: number }> {
  const reductionTargets = {
    '30-days': 0.1,
    '90-days': 0.2,
    '1-year': 0.35,
  };

  const plans: Record<PlanPeriod, { title: string; description: string; milestones: RoadmapMilestone[]; totalReduction: number }> = {
    '30-days': {
      title: '30-Day Sprint',
      description: 'Quick wins to start your reduction journey',
      milestones: [
        {
          id: 'week-1',
          week: 1,
          title: 'Assessment & Awareness',
          description: 'Understand your current footprint and identify quick wins',
          targetReduction: score * 0.02,
          actions: ['Complete carbon calculator', 'Identify top 3 emission sources', 'Set reduction goals'],
          completed: false,
        },
        {
          id: 'week-2',
          week: 2,
          title: 'Energy Efficiency',
          description: 'Optimize home energy consumption',
          targetReduction: score * 0.03,
          actions: ['Switch to LED bulbs', 'Unplug unused devices', 'Adjust thermostat'],
          completed: false,
        },
        {
          id: 'week-3',
          week: 3,
          title: 'Transportation Tweaks',
          description: 'Reduce transport emissions with simple changes',
          targetReduction: score * 0.03,
          actions: ['Use public transport once weekly', 'Combine errands', 'Walk for short trips'],
          completed: false,
        },
        {
          id: 'week-4',
          week: 4,
          title: 'Review & Adjust',
          description: 'Measure progress and plan next steps',
          targetReduction: score * 0.02,
          actions: ['Log all eco-actions', 'Calculate reduction', 'Celebrate milestones'],
          completed: false,
        },
      ],
      totalReduction: score * reductionTargets['30-days'],
    },
    '90-days': {
      title: '90-Day Transformation',
      description: 'Build lasting sustainable habits',
      milestones: [
        {
          id: 'month-1',
          week: 1,
          title: 'Foundation Month',
          description: 'Establish core sustainable practices',
          targetReduction: score * 0.06,
          actions: ['Complete 30-day plan', 'Start habit tracking', 'Join eco-community'],
          completed: false,
        },
        {
          id: 'month-2',
          week: 5,
          title: 'Deep Dive',
          description: 'Address major emission sources',
          targetReduction: score * 0.07,
          actions: ['Reduce meat consumption', 'Improve home energy', 'Optimize transport'],
          completed: false,
        },
        {
          id: 'month-3',
          week: 9,
          title: 'Sustain & Scale',
          description: 'Maintain progress and expand impact',
          targetReduction: score * 0.07,
          actions: ['Mentor others', 'Share progress', 'Plan long-term changes'],
          completed: false,
        },
      ],
      totalReduction: score * reductionTargets['90-days'],
    },
    '1-year': {
      title: '1-Year Journey',
      description: 'Complete lifestyle transformation',
      milestones: [
        {
          id: 'q1',
          week: 1,
          title: 'Quarter 1: Foundation',
          description: 'Build awareness and basic habits',
          targetReduction: score * 0.1,
          actions: ['Complete 90-day plan', 'Quarterly footprint review', 'Energy audit'],
          completed: false,
        },
        {
          id: 'q2',
          week: 14,
          title: 'Quarter 2: Expansion',
          description: 'Scale up successful strategies',
          targetReduction: score * 0.1,
          actions: ['Consider renewable energy', 'Expand sustainable transport', 'Diet optimization'],
          completed: false,
        },
        {
          id: 'q3',
          week: 27,
          title: 'Quarter 3: Optimization',
          description: 'Fine-tune for maximum impact',
          targetReduction: score * 0.08,
          actions: ['Carbon offset investments', 'Advocate for sustainability', 'Community involvement'],
          completed: false,
        },
        {
          id: 'q4',
          week: 40,
          title: 'Quarter 4: Mastery',
          description: 'Become a sustainability leader',
          targetReduction: score * 0.07,
          actions: ['Share knowledge', 'Inspire others', 'Plan next year'],
          completed: false,
        },
      ],
      totalReduction: score * reductionTargets['1-year'],
    },
  };

  return plans;
}

export default function ReductionRoadmap() {
  const { user } = useEcoStore();
  const [selectedPeriod, setSelectedPeriod] = useState<PlanPeriod>('30-days');
  
  const roadmap = generateRoadmap(user.score);
  const currentPlan = roadmap[selectedPeriod];

  const periodOptions: { value: PlanPeriod; label: string; icon: React.ReactNode }[] = [
    { value: '30-days', label: '30 Days', icon: <Zap className="w-4 h-4" /> },
    { value: '90-days', label: '90 Days', icon: <Target className="w-4 h-4" /> },
    { value: '1-year', label: '1 Year', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="glass-card p-6" role="region" aria-labelledby="roadmap-title">
      <h3
        id="roadmap-title"
        className="text-xl font-bold mb-6 flex items-center space-x-2"
      >
        <MapPin className="w-6 h-6 text-emerald" aria-hidden="true" />
        <span>Reduction Roadmap</span>
      </h3>

      {/* Period selector */}
      <div 
        className="flex space-x-2 mb-6 p-1 rounded-xl bg-white/5"
        role="tablist"
        aria-label="Select roadmap period"
      >
        {periodOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedPeriod(option.value)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              selectedPeriod === option.value
                ? 'bg-emerald-green text-white shadow-lg'
                : 'text-sage hover:text-foreground hover:bg-white/5'
            }`}
            role="tab"
            aria-selected={selectedPeriod === option.value}
            aria-controls={`panel-${option.value}`}
            id={`tab-${option.value}`}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Plan content */}
      <div
        role="tabpanel"
        id={`panel-${selectedPeriod}`}
        aria-labelledby={`tab-${selectedPeriod}`}
      >
        <div className="mb-6">
          <h4 className="font-bold text-lg">{currentPlan.title}</h4>
          <p className="text-sm text-sage/60 mt-1">{currentPlan.description}</p>
        </div>

        {/* Milestones */}
        <div className="space-y-4" role="list" aria-label="Roadmap milestones">
          {currentPlan.milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all ${
                milestone.completed
                  ? 'bg-emerald/5 border-emerald/20'
                  : 'bg-white/5 border-white/10 hover:border-emerald/30'
              }`}
              role="listitem"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-1.5 rounded-lg ${
                  milestone.completed ? 'bg-emerald text-white' : 'bg-white/10 text-sage'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Circle className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-semibold text-sm">{milestone.title}</h5>
                      <p className="text-xs text-sage/60 mt-1">{milestone.description}</p>
                    </div>
                    <span className="text-xs font-medium text-emerald flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3" aria-hidden="true" />
                      <span>-{milestone.targetReduction.toFixed(1)}t</span>
                    </span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {milestone.actions.map((action, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-white/5 text-sage/80"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total reduction */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald/10 to-forest/10 border border-emerald/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-emerald" aria-hidden="true" />
              <div>
                <h4 className="font-semibold">Target Reduction</h4>
                <p className="text-xs text-sage/60">After completing this plan</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gradient">
                {currentPlan.totalReduction.toFixed(1)}
              </p>
              <p className="text-xs text-sage/60">tons CO₂</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
