'use client';

/**
 * Smart Sustainability Insights Component
 * AI-powered insights explaining why emissions are high, which habits contribute most,
 * and which actions create the biggest impact
 */

import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
} from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import type { ActionCategory, SustainabilityInsight, EmissionBreakdown, HistoryEntry } from '@/types';

interface InsightConfig {
  type: 'high_emission' | 'improvement_opportunity' | 'positive_change' | 'tip';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

/**
 * Get insight configuration based on type
 */
function getInsightConfig(type: SustainabilityInsight['type']): InsightConfig {
  const configs: Record<SustainabilityInsight['type'], InsightConfig> = {
    high_emission: {
      type: 'high_emission',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    improvement_opportunity: {
      type: 'improvement_opportunity',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    positive_change: {
      type: 'positive_change',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-emerald',
      bgColor: 'bg-emerald/10',
    },
    tip: {
      type: 'tip',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  };
  return configs[type];
}

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
 * Generate insights based on user's emission breakdown
 */
function generateInsights(
  score: number,
  breakdown: EmissionBreakdown,
  history: HistoryEntry[]
): SustainabilityInsight[] {
  const insights: SustainabilityInsight[] = [];
  const nationalAvg = 8.5;

  const categories: ActionCategory[] = ['transport', 'energy', 'diet', 'shopping'];
  const sortedCategories = categories.sort(
    (a, b) => breakdown[b] - breakdown[a]
  );

  const topCategory = sortedCategories[0];
  if (topCategory) {
    const topPercentage = (breakdown[topCategory] / score) * 100;
    if (topPercentage > 40) {
      insights.push({
        id: 'top-contributor',
        type: 'high_emission',
        title: `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} is Your Top Contributor`,
        description: `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} accounts for ${topPercentage.toFixed(0)}% of your total emissions. Reducing this category would have the biggest impact.`,
        category: topCategory,
        impact: topPercentage,
        actionable: true,
        actionItems: getActionItemsForCategory(topCategory),
      });
    }
  }

  if (score > nationalAvg) {
    insights.push({
      id: 'above-average',
      type: 'high_emission',
      title: 'Above National Average',
      description: `Your carbon footprint (${score.toFixed(1)} tons) is ${((score - nationalAvg) / nationalAvg * 100).toFixed(0)}% higher than the national average. Here's how you can improve.`,
      category: 'transport',
      impact: (score - nationalAvg) / nationalAvg * 100,
      actionable: true,
      actionItems: [
        'Calculate potential savings from switching to public transport',
        'Consider renewable energy options for your home',
        'Review your dietary choices for lower-impact alternatives',
      ],
    });
  }

  if (history.length > 1) {
    const oldest = history[0];
    const newest = history[history.length - 1];
    if (oldest && newest) {
      const improvement = oldest.score - newest.score;
      if (improvement > 0) {
        insights.push({
          id: 'improvement-trend',
          type: 'positive_change',
          title: 'Great Progress!',
          description: `You've reduced your emissions by ${improvement.toFixed(1)} tons since your first assessment. Keep up the excellent work!`,
          category: 'transport',
          impact: (improvement / oldest.score) * 100,
          actionable: false,
        });
      }
    }
  }

  sortedCategories.forEach((category) => {
    const categoryValue = breakdown[category];
    if (categoryValue > 2) {
      const suggestions = getCategorySuggestions(category);
      insights.push({
        id: `${category}-suggestion`,
        type: 'improvement_opportunity',
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Opportunity`,
        description: suggestions.description,
        category,
        impact: categoryValue,
        actionable: true,
        actionItems: suggestions.actions,
      });
    }
  });

  insights.push({
    id: 'general-tip',
    type: 'tip',
    title: 'Quick Win Tip',
    description: 'Start with small changes like using reusable bags, turning off lights, and choosing tap water over bottled water.',
    category: 'energy',
    impact: 0.1,
    actionable: true,
    actionItems: [
      'Keep reusable bags in your car',
      'Switch to LED bulbs',
      'Use a reusable water bottle',
    ],
  });

  return insights.slice(0, 5);
}

function getActionItemsForCategory(category: ActionCategory): string[] {
  const items: Record<ActionCategory, string[]> = {
    transport: [
      'Use public transportation 2+ times per week',
      'Consider carpooling for work commutes',
      'Walk or bike for short distances',
    ],
    energy: [
      'Switch to renewable energy provider',
      'Install a smart thermostat',
      'Unplug devices when not in use',
    ],
    diet: [
      'Try one meatless day per week',
      'Choose locally sourced produce',
      'Reduce food waste by meal planning',
    ],
    shopping: [
      'Buy less, choose well',
      'Look for recycled materials',
      'Support local businesses',
    ],
  };
  return items[category];
}

function getCategorySuggestions(category: ActionCategory): { description: string; actions: string[] } {
  const suggestions: Record<ActionCategory, { description: string; actions: string[] }> = {
    transport: {
      description: 'Transportation typically accounts for significant emissions. Consider alternatives.',
      actions: ['Use public transport', 'Work from home when possible', 'Combine errands into one trip'],
    },
    energy: {
      description: 'Home energy use contributes to your footprint. Small changes add up.',
      actions: ['Switch to LED bulbs', 'Use a smart power strip', 'Adjust thermostat by 2 degrees'],
    },
    diet: {
      description: 'Dietary choices have a significant impact on your carbon footprint.',
      actions: ['Try Meatless Mondays', 'Choose seasonal produce', 'Reduce food waste'],
    },
    shopping: {
      description: 'Consumer choices matter. Consider the lifecycle of products you buy.',
      actions: ['Buy less, choose well', 'Look for recycled materials', 'Support local businesses'],
    },
  };
  return suggestions[category];
}

export default function SustainabilityInsights() {
  const { user } = useEcoStore();
  const insights = generateInsights(user.score, user.breakdown, user.history);

  return (
    <div className="glass-card p-6" role="region" aria-labelledby="insights-title">
      <h3 
        id="insights-title" 
        className="text-xl font-bold mb-6 flex items-center space-x-2"
      >
        <Lightbulb className="w-6 h-6 text-gold" aria-hidden="true" />
        <span>Smart Insights</span>
      </h3>

      <div className="space-y-4" role="list" aria-label="Sustainability insights">
        {insights.map((insight, index) => {
          const config = getInsightConfig(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl ${config.bgColor} border border-transparent hover:border-current/20 transition-all`}
              role="listitem"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${config.bgColor} ${config.color} flex-shrink-0`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <span className="flex items-center space-x-1 text-xs text-sage/60">
                      {getCategoryIcon(insight.category)}
                      <span className="capitalize">{insight.category}</span>
                    </span>
                  </div>
                  <p className="text-xs text-sage/80 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && insight.actionItems && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-sage/60">Recommended actions:</p>
                      <ul className="space-y-1">
                        {insight.actionItems.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-center space-x-2 text-xs text-sage/70">
                            <ArrowRight className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
