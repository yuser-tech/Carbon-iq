'use client';

/**
 * Theme Provider Component
 * Manages dark/light mode with persistence
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Sun, Moon } from 'lucide-react';
import type { Theme } from '@/types';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'carboniq-theme';

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Theme Provider Component
 * Wraps the app with theme context
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Default theme context value for SSR/safety
 */
const defaultContextValue: ThemeContextValue = {
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
};

/**
 * Hook to access theme context
 * Returns default value if used outside provider (SSR safety)
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultContextValue;
  }
  return context;
}

/**
 * Theme Toggle Button Component
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-white/5 hover:bg-white/10 text-sage hover:text-foreground'
          : 'bg-black/5 hover:bg-black/10 text-gray-600 hover:text-gray-900'
      } ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}

export { ThemeContext };
export default ThemeProvider;
