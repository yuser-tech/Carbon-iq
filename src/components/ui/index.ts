/**
 * UI Components Index
 * Exports all reusable UI components
 */

export { ErrorBoundary, default as ErrorBoundaryDefault } from './ErrorBoundary';
export { Skeleton, CardSkeleton, ChartSkeleton, ListItemSkeleton, PageSkeleton, ContentSkeleton } from './SkeletonLoader';
export { ToastProvider, toast } from './ToastProvider';
export { EmptyState, EmptyStates } from './EmptyState';
export { ThemeProvider, useTheme, ThemeToggle } from './ThemeProvider';
export { SkipNavigation, useFocusTrap, useAnnounce, LiveRegion } from './SkipNavigation';
export { 
  celebrateWithConfetti, 
  celebrateWithBurst, 
  celebrateWithSideBurst, 
  useConfetti, 
  ConfettiTrigger 
} from './Confetti';
export { AppProvider } from './AppProvider';
