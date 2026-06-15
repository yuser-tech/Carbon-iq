'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingDown, Users, Award } from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import ScoreCard from '@/components/dashboard/ScoreCard';
import BreakdownChart from '@/components/dashboard/BreakdownChart';
import AICoach from '@/components/dashboard/AICoach';
import EcoGoals from '@/components/dashboard/EcoGoals';
import CarbonSimulator from '@/components/dashboard/CarbonSimulator';

export default function DashboardPage() {
  const router = useRouter();
  const user = useEcoStore((state) => state.user);

  useEffect(() => {
    if (!user.onboarded) {
      router.push('/calculator');
    }
  }, [user.onboarded, router]);

  if (!user.onboarded) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Eco Explorer</h1>
            <p className="text-sage/60">Your environmental impact overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="glass px-6 py-3 rounded-2xl border border-emerald/20 flex items-center space-x-3">
              <Award className="text-gold w-6 h-6" />
              <div>
                <p className="text-xs text-sage/40 uppercase">Level {user.level}</p>
                <p className="font-bold">{user.xp} XP</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score & Charts */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScoreCard score={user.score} />
              <div className="glass-card p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-emerald/10 rounded-lg">
                    <TrendingDown className="text-emerald w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl">Reduction Target</h3>
                </div>
                <p className="text-3xl font-bold mb-2">15% Reduction</p>
                <p className="text-sage/60 text-sm">Goal: 4.2 tons by Dec 2026</p>
                <div className="mt-6 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald w-1/3 rounded-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <BreakdownChart breakdown={user.breakdown} />
              <div className="glass-card p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-6">National Comparison</h3>
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <ComparisonBar label="You" value={user.score} max={15} color="#4CAF50" />
                  <ComparisonBar label="National Avg" value={8.5} max={15} color="#A5D6A7" />
                  <ComparisonBar label="Global Avg" value={4.7} max={15} color="#1B5E20" />
                </div>
                <div className="mt-6 p-4 rounded-xl bg-emerald/10 text-emerald text-sm flex items-start space-x-3">
                  <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>You are performing <b>better</b> than 68% of users in your region.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / AI Coach */}
          <div className="space-y-8">
            <EcoGoals />
            <CarbonSimulator />
            <AICoach userData={user} />
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-emerald/10 hover:border-emerald/30 transition-all text-left text-sm">
                  Log daily green actions
                </button>
                <button className="w-full p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-emerald/10 hover:border-emerald/30 transition-all text-left text-sm">
                  Update home energy profile
                </button>
                <button className="w-full p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-emerald/10 hover:border-emerald/30 transition-all text-left text-sm">
                  View sustainability reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 px-1">
        <span className="text-sage/60 uppercase tracking-wider">{label}</span>
        <span className="font-bold">{value} tons</span>
      </div>
      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
