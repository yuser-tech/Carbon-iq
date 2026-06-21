'use client';

/**
 * Navigation Bar Component
 * Provides main site navigation with accessibility features
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Zap, ListChecks, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" aria-hidden="true" /> },
    { href: '/actions', label: 'Action Center', icon: <ListChecks className="w-5 h-5" aria-hidden="true" /> },
    { href: '/calculator', label: 'Calculator', icon: <Zap className="w-5 h-5" aria-hidden="true" /> },
  ];

  if (pathname === '/' || pathname === '/calculator') return null;

  return (
    <nav 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-3xl border border-white/10 z-50 flex items-center space-x-6 md:space-x-8"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link 
        href="/" 
        className="text-emerald hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded-lg p-1"
        aria-label="CarbonIQ Home"
      >
        <Leaf className="w-6 h-6" />
      </Link>
      
      <div className="flex items-center space-x-4 md:space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center space-y-1 transition-all p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                isActive ? 'text-emerald' : 'text-sage/40 hover:text-sage'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-sage/40 hover:text-sage hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Moon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </nav>
  );
}
