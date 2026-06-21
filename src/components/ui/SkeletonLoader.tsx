'use client';

/**
 * Skeleton Loader Components
 * Provides loading placeholders for various content types
 */

import { motion } from 'framer-motion';

/**
 * Base skeleton component with customizable dimensions
 */
export function Skeleton({
  className = '',
  height,
  width,
  variant = 'rectangular',
  ariaLabel = 'Loading content',
}: SkeletonProps) {
  const variantClasses = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded',
  };

  return (
    <motion.div
      className={`bg-white/5 animate-pulse ${variantClasses[variant]} ${className}`}
      style={{ height, width }}
      role="status"
      aria-label={ariaLabel}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span className="sr-only">{ariaLabel}</span>
    </motion.div>
  );
}

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
  ariaLabel?: string;
}

/**
 * Card skeleton for dashboard content
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="rectangular" height={40} width={40} className="rounded-lg" />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
      <Skeleton height={100} className="mb-4" />
      <div className="flex justify-between">
        <Skeleton height={32} width={80} />
        <Skeleton height={32} width={100} />
      </div>
    </div>
  );
}

/**
 * Chart skeleton for data visualizations
 */
export function ChartSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-6 ${className}`} role="status" aria-label="Loading chart data">
      <Skeleton height={24} width={150} className="mb-6" />
      <div className="flex items-end justify-around h-48 mb-4">
        {[65, 80, 45, 90, 70, 55, 85].map((height, index) => (
          <Skeleton
            key={index}
            height={`${height}%`}
            width={32}
            className="rounded-t-sm"
            ariaLabel={`Chart bar ${index + 1}`}
          />
        ))}
      </div>
      <div className="flex justify-around">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} height={12} width={32} />
        ))}
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
export function ListItemSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-4 p-4 ${className}`}>
      <Skeleton variant="circular" height={48} width={48} />
      <div className="flex-1">
        <Skeleton height={18} width="70%" className="mb-2" />
        <Skeleton height={14} width="40%" />
      </div>
      <Skeleton height={32} width={80} />
    </div>
  );
}

/**
 * Full page skeleton for route transitions
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12" role="status" aria-label="Loading page content">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <Skeleton height={36} width={300} className="mb-2" />
            <Skeleton height={20} width={200} />
          </div>
          <div className="flex space-x-4">
            <Skeleton height={48} width={120} className="rounded-xl" />
            <Skeleton height={48} width={80} className="rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
          <div className="space-y-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Content block skeleton
 */
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '75%' : '100%'}
          ariaLabel={`Content line ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default Skeleton;
