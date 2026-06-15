'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Zap, ListChecks, Info } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/actions', label: 'Action Center', icon: <ListChecks className="w-5 h-5" /> },
    { href: '/calculator', label: 'Recalculate', icon: <Zap className="w-5 h-5" /> },
  ];

  if (pathname === '/' || pathname === '/calculator') return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-3xl border border-white/10 z-50 flex items-center space-x-12">
      <Link href="/" className="text-emerald hover:text-emerald-400 transition-colors">
        <Leaf className="w-6 h-6" />
      </Link>
      
      <div className="flex items-center space-x-8">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center space-y-1 transition-all ${
              pathname === item.href ? 'text-emerald' : 'text-sage/40 hover:text-sage'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
