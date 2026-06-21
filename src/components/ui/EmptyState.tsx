'use client';

/**
 * Empty State Component
 * Displays when no data is available with helpful guidance
 */

import { motion } from 'framer-motion';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Empty State Component
 * Shows when there's no content to display
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="p-4 bg-emerald/10 rounded-full mb-6">
        <Icon className="w-12 h-12 text-emerald/40" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sage/60 text-sm max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-green text-white rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{actionLabel}</span>
        </button>
      )}
    </motion.div>
  );
}

/**
 * Pre-built empty states for common scenarios
 */
export const EmptyStates = {
  /**
   * Empty goals state
   */
  Goals: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="No Goals Yet"
      description="Set your first sustainability goal to start tracking your progress."
      {...props}
    />
  ),

  /**
   * Empty history state
   */
  History: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="No History Available"
      description="Complete your first carbon assessment to start building your history."
      {...props}
    />
  ),

  /**
   * Empty actions state
   */
  Actions: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="No Actions Available"
      description="Check back soon for new sustainability actions to complete."
      {...props}
    />
  ),

  /**
   * Empty badges state
   */
  Badges: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="No Badges Earned"
      description="Complete actions and maintain streaks to earn badges."
      {...props}
    />
  ),

  /**
   * Empty habits state
   */
  Habits: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="No Habits Tracked"
      description="Start tracking eco-friendly habits to see your progress."
      {...props}
    />
  ),

  /**
   * Empty journey state
   */
  Journey: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="Your Journey Awaits"
      description="Complete your first assessment to begin tracking your carbon journey."
      {...props}
    />
  ),

  /**
   * Empty search results
   */
  Search: (props: Omit<EmptyStateProps, 'icon' | 'title' | 'description'>) => (
    <EmptyState
      icon={Plus}
      title="No Results Found"
      description="Try adjusting your search criteria or filters."
      {...props}
    />
  ),
};

export default EmptyState;
