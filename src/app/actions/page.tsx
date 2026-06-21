'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Zap, Utensils, ShoppingBag, Car } from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import { ECO_ACTIONS, EcoAction } from '@/lib/actions';

export default function ActionCenterPage() {
  const { user, completeAction } = useEcoStore();
  const [filter, setFilter] = useState<string>('all');

  const filteredActions = ECO_ACTIONS.filter(a => filter === 'all' || a.category === filter);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Sustainability Action Center</h1>
          <p className="text-sage/60">Take simple steps to reduce your carbon footprint and earn XP.</p>
        </header>

        <div className="flex flex-wrap gap-4 mb-12">
          {['all', 'transport', 'energy', 'diet', 'shopping'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full border transition-all capitalize ${
                filter === cat ? 'bg-emerald border-emerald text-white' : 'border-white/10 text-sage hover:border-emerald/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action) => (
            <ActionCard 
              key={action.id} 
              action={action} 
              isCompleted={user.completedActions.includes(action.id)}
              onComplete={() => completeAction(action.id, action.xpReward)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ action, isCompleted, onComplete }: { action: EcoAction, isCompleted: boolean, onComplete: () => void }) {
  const icons = {
    transport: <Car className="w-5 h-5" />,
    energy: <Zap className="w-5 h-5" />,
    diet: <Utensils className="w-5 h-5" />,
    shopping: <ShoppingBag className="w-5 h-5" />,
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`glass-card p-6 flex flex-col justify-between border-2 transition-all ${
        isCompleted ? 'border-emerald/40 bg-emerald/5' : 'border-transparent'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-emerald/10 rounded-lg text-emerald">
            {icons[action.category]}
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
            action.impact === 'High' ? 'bg-emerald text-white' : 'bg-white/10 text-sage'
          }`}>
            {action.impact} Impact
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2">{action.title}</h3>
        <p className="text-sage/60 text-sm leading-relaxed mb-6">{action.description}</p>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-sage/40 uppercase">Reward</span>
          <span className="text-emerald font-bold">+{action.xpReward} XP</span>
        </div>
        <button 
          onClick={onComplete}
          disabled={isCompleted}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            isCompleted ? 'text-emerald font-bold' : 'bg-white/5 hover:bg-emerald hover:text-white'
          }`}
        >
          {isCompleted ? (
            <><CheckCircle2 className="w-5 h-5" /> <span>Completed</span></>
          ) : (
            <><Circle className="w-5 h-5" /> <span>Mark Done</span></>
          )}
        </button>
      </div>
    </motion.div>
  );
}
