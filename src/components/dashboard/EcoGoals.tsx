'use client';

import { motion } from 'framer-motion';
import { Target, TrendingDown, Plus } from 'lucide-react';

const MOCK_GOALS = [
  { id: '1', title: 'Reduce meat consumption', current: 70, target: 100, color: '#4CAF50' },
  { id: '2', title: 'Walk 5km weekly', current: 40, target: 100, color: '#1B5E20' },
];

export default function EcoGoals() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-emerald" />
          <h3 className="font-bold">Active Goals</h3>
        </div>
        <button className="p-1.5 rounded-lg bg-emerald/10 text-emerald hover:bg-emerald/20 transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {MOCK_GOALS.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-sage/80">{goal.title}</span>
              <span className="font-bold text-emerald">{goal.current}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.current}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: goal.color }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
        <TrendingDown className="w-8 h-8 text-sage/20 mb-2" />
        <p className="text-xs text-sage/40">Set a new goal to accelerate your reduction path.</p>
      </div>
    </div>
  );
}
