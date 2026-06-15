'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, TrendingDown, Info } from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';

export default function CarbonSimulator() {
  const { user } = useEcoStore();
  const [simulation, setSimulation] = useState({
    transportReduction: 0,
    meatReduction: 0,
    energySaving: 0,
  });

  const baseScore = user.score;
  const savedTransport = (user.breakdown.transport * simulation.transportReduction) / 100;
  const savedDiet = (user.breakdown.diet * simulation.meatReduction) / 100;
  const savedEnergy = (user.breakdown.energy * simulation.energySaving) / 100;
  
  const totalSaved = savedTransport + savedDiet + savedEnergy;
  const simulatedScore = Math.max(0, baseScore - totalSaved);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Play className="w-5 h-5 text-emerald" />
        <h3 className="font-bold">Impact Simulator</h3>
      </div>

      <div className="space-y-6">
        <SimulationSlider 
          label="Reduce Driving" 
          value={simulation.transportReduction} 
          onChange={(v) => setSimulation({...simulation, transportReduction: v})} 
        />
        <SimulationSlider 
          label="Less Meat/Dairy" 
          value={simulation.meatReduction} 
          onChange={(v) => setSimulation({...simulation, meatReduction: v})} 
        />
        <SimulationSlider 
          label="Energy Efficiency" 
          value={simulation.energySaving} 
          onChange={(v) => setSimulation({...simulation, energySaving: v})} 
        />
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sage/60 text-sm">Simulated Footprint</span>
          <span className="text-2xl font-bold text-gradient">{simulatedScore.toFixed(2)} tons</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-emerald text-xs font-bold">Annual Saving: {totalSaved.toFixed(2)} tons CO₂</span>
          <button 
            onClick={() => setSimulation({ transportReduction: 0, meatReduction: 0, energySaving: 0 })}
            className="text-sage/40 hover:text-sage transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SimulationSlider({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-sage/80">{label}</span>
        <span className="font-bold text-emerald">{value}%</span>
      </div>
      <input 
        type="range" min="0" max="100" step="5"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-emerald-green"
      />
    </div>
  );
}
