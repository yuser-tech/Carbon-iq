'use client';

/**
 * App Provider Component
 * Central provider that wraps the entire application
 */

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { SkipNavigation } from './SkipNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { LiveRegion } from './SkipNavigation';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider wraps the application with all necessary providers
 * - ThemeProvider: Dark/light mode support
 * - ToastProvider: Toast notifications
 * - ErrorBoundary: Error handling
 * - SkipNavigation: Accessibility features
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <SkipNavigation />
          <LiveRegion message="" />
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default AppProvider;
