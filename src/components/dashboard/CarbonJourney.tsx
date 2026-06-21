'use client';

/**
 * Personal Carbon Journey Component
 * Visual timeline showing starting footprint, improvements, milestones, and future targets
 */

import { motion } from 'framer-motion';
import { 
  TrendingDown, 
  Target, 
  Award, 
  Zap, 
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import { EmptyStates } from '@/components/ui/EmptyState';
import { celebrateWithBurst } from '@/components/ui/Confetti';
import { useEffect, useState } from 'react';

interface JourneyMilestone {
  id: string;
  type: 'assessment' | 'improvement' | 'milestone' | 'badge';
  title: string;
  description: string;
  date: string;
  value?: number;
  icon: React.ReactNode;
}

export default function CarbonJourney() {
  const { user } = useEcoStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate journey milestones from user data
  const milestones: JourneyMilestone[] = [];

  // Initial assessment
  if (user.history.length > 0) {
    const initialEntry = user.history[0];
    if (initialEntry) {
      milestones.push({
        id: 'initial',
        type: 'assessment',
        title: 'Carbon Assessment',
        description: `Started with ${initialEntry.score.toFixed(1)} tons CO₂/year`,
        date: initialEntry.date,
        value: initialEntry.score,
        icon: <Target className="w-5 h-5" />,
      });

      // Check for improvements
      if (user.history.length > 1) {
        const latestEntry = user.history[user.history.length - 1];
        if (latestEntry) {
          const improvement = initialEntry.score - latestEntry.score;
          
          if (improvement > 0) {
            milestones.push({
              id: 'improvement',
              type: 'improvement',
              title: 'Improvement Achieved',
              description: `Reduced by ${improvement.toFixed(1)} tons CO₂`,
              date: latestEntry.date,
              value: improvement,
              icon: <TrendingDown className="w-5 h-5" />,
            });
          }
        }
      }
    }
  }

  // Recent badges
  user.badges.slice(-2).forEach((badgeId) => {
    milestones.push({
      id: `badge-${badgeId}`,
      type: 'badge',
      title: 'Badge Earned',
      description: badgeId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      date: user.lastUpdate,
      icon: <Award className="w-5 h-5" />,
    });
  });

  // Streak milestone
  if (user.streak >= 7) {
    milestones.push({
      id: 'streak',
      type: 'milestone',
      title: 'Streak Master',
      description: `${user.streak}-day streak achieved`,
      date: user.lastUpdate,
      value: user.streak,
      icon: <Zap className="w-5 h-5" />,
    });
  }

  // Sort milestones by date (newest first)
  milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleMilestoneClick = (milestone: JourneyMilestone) => {
    if (milestone.type === 'milestone' || milestone.type === 'badge') {
      celebrateWithBurst();
    }
  };

  if (!mounted) {
    return null;
  }

  if (milestones.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-emerald" aria-hidden="true" />
          <span>Your Carbon Journey</span>
        </h3>
        <EmptyStates.Journey />
      </div>
    );
  }

  return (
    <div className="glass-card p-6" role="region" aria-labelledby="journey-title">
      <h3 
        id="journey-title" 
        className="text-xl font-bold mb-6 flex items-center space-x-2"
      >
        <Calendar className="w-6 h-6 text-emerald" aria-hidden="true" />
        <span>Your Carbon Journey</span>
      </h3>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div 
          className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald via-moss to-sage"
          aria-hidden="true"
        />

        {/* Timeline items */}
        <div className="space-y-6" role="list">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-14"
              role="listitem"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  milestone.type === 'improvement'
                    ? 'bg-emerald border-emerald'
                    : milestone.type === 'milestone' || milestone.type === 'badge'
                    ? 'bg-gold border-gold'
                    : 'bg-forest border-emerald'
                }`}
                onClick={() => handleMilestoneClick(milestone)}
                role="button"
                tabIndex={0}
                aria-label={`${milestone.title}: ${milestone.description}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMilestoneClick(milestone);
                  }
                }}
              >
                <span className="text-white" aria-hidden="true">
                  {milestone.icon}
                </span>
              </div>

              {/* Content */}
              <div 
                className="glass-card p-4 hover:border-emerald/30 transition-all cursor-pointer"
                onClick={() => handleMilestoneClick(milestone)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMilestoneClick(milestone);
                  }
                }}
                aria-label={`${milestone.title}: ${milestone.description}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{milestone.title}</h4>
                    <p className="text-xs text-sage/60 mt-1">{milestone.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sage/40 flex-shrink-0" aria-hidden="true" />
                </div>
                {milestone.value !== undefined && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald/10 text-emerald font-medium">
                      {milestone.type === 'improvement' ? '-' : ''}{milestone.value.toFixed(1)} tons
                    </span>
                    <span className="text-xs text-sage/40">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Future Target Preview */}
      <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-emerald/10 to-forest/10 border border-emerald/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm">Future Target</h4>
            <p className="text-xs text-sage/60 mt-1">
              Reduce to {Math.max(0, user.score * 0.85).toFixed(1)} tons by next year
            </p>
          </div>
          <Target className="w-8 h-8 text-emerald" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
